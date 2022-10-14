interface IEventRecord {
  eventType: string; // 事件类型 click | focus | blur | contextmenu | textInput
  eventTime: number; // 事件时间
  eventValue?: string; // 事件值
  xPath?: string; // 元素路径
  querySelector?: string; // 元素类名
}

class UIRecord {
  _eventRecordList: IEventRecord[] = [];
  _hoverEventTempRecord?: IEventRecord; // 鼠标悬浮事件临时记录
  _hoverEventXPathRecordList: string[] = []; // 需要记录的hover事件元素的xPath
  _recordBtn: HTMLElement;
  _recordMarkStyle: HTMLElement;
  _mutationObserver: MutationObserver;
  _addClassElementRecordList: {
    element: HTMLElement;
    className: string;
  }[] = []; // 记录class增加的元素

  _globalEnv: any = {};

  _eventHandler = {
    mouseover: (event: MouseEvent): void => {
      if (event.target instanceof HTMLElement) {
        // 忽略录制按钮点击事件
        if (event.target.className.includes('UIRecord-action-btn')) return;
        event.target.classList.add('UIRecord-mark');
        // 暂存鼠标悬浮事件
        const xPath = this._getXPath(event.target);
        const { querySelector, needRecord } =
          this._getQuerySelectorByAddClassElementRecord(event.target);
        // 如果当前元素hover事件已经被记录，则直接记录，且不压入临时记录
        if (this._hoverEventXPathRecordList.includes(xPath) || needRecord) {
          // 最后次hover事件重复，就不做记录
          const lastRecord =
            this._eventRecordList[this._eventRecordList.length - 1];
          const isLastRecordEqual =
            lastRecord?.xPath === xPath && lastRecord?.eventType === 'hover';
          // 时间阈值，当上次时间不为hover，触发间隔 < 300ms，不做记录
          const isTimeThreshold =
            lastRecord?.eventType !== 'hover' &&
            Date.now() - lastRecord?.eventTime < 300;
          if (isLastRecordEqual || isTimeThreshold) return;
          this._eventRecordList.push({
            eventType: 'hover',
            eventTime: Date.now(),
            xPath,
            querySelector,
          });
        } else {
          this._hoverEventTempRecord = {
            eventType: 'hover',
            eventTime: Date.now(),
            xPath,
            querySelector,
          };
        }
      }
    },
    mouseout: (event: MouseEvent): void => {
      // 将临时记录的hover事件重置
      this._hoverEventTempRecord = undefined;
      if (event.target instanceof HTMLElement) {
        // 忽略录制按钮点击事件
        if (event.target.className.includes('UIRecord-action-btn')) return;
        event.target.classList.remove('UIRecord-mark');
      }
    },
    click: (event: MouseEvent): void => {
      // 将临时记录的hover事件重置
      this._hoverEventTempRecord = undefined;
      let target = event.target;
      while (target instanceof SVGElement) {
        target = target.parentElement;
      }

      if (target instanceof HTMLElement) {
        // 忽略录制按钮点击事件
        if (target.className.includes('UIRecord-action-btn')) return;
        const xPath = this._getXPath(target);
        const querySelector = this._getQuerySelector(target);
        this._eventRecordList.push({
          eventType: 'click',
          eventTime: Date.now(),
          xPath,
          querySelector,
        });
      }
    },
    contextmenu: (event: MouseEvent): void => {
      // 将临时记录的hover事件重置
      this._hoverEventTempRecord = undefined;
      if (event.target instanceof HTMLElement) {
        // 忽略录制按钮点击事件
        if (event.target.className.includes('UIRecord-action-btn')) return;
        const xPath = this._getXPath(event.target);
        const querySelector = this._getQuerySelector(event.target);
        this._eventRecordList.push({
          eventType: 'contextmenu',
          eventTime: Date.now(),
          xPath,
          querySelector,
        });
      }
    },
    focus: (event: FocusEvent): void => {
      // 将临时记录的hover事件重置
      this._hoverEventTempRecord = undefined;
      if (event.target instanceof HTMLInputElement) {
        const xPath = this._getXPath(event.target);
        const querySelector = this._getQuerySelector(event.target);
        this._eventRecordList.push({
          eventType: 'focus',
          eventTime: Date.now(),
          xPath,
          querySelector,
        });
      }
    },
    blur: (event: FocusEvent): void => {
      // 将临时记录的hover事件重置
      this._hoverEventTempRecord = undefined;
      if (
        event.target instanceof HTMLInputElement ||
        event.target instanceof HTMLTextAreaElement
      ) {
        this._eventRecordList.push({
          eventType: 'textInput',
          eventTime: Date.now(),
          eventValue: event.target.value,
        });
      }
    },
    keydown: (event: KeyboardEvent): void => {
      // 将临时记录的hover事件重置
      this._hoverEventTempRecord = undefined;
      // 暂时只记录输入框Enter事件
      if (
        event.key === 'Enter' &&
        (event.target instanceof HTMLInputElement ||
          event.target instanceof HTMLTextAreaElement)
      ) {
        this._eventRecordList.push({
          eventType: 'textInput',
          eventTime: Date.now(),
          eventValue: event.target.value,
        });
        this._eventRecordList.push({
          eventType: 'keydown',
          eventTime: Date.now(),
          eventValue: event.key,
        });
      }
    },
  };

  constructor() {
    // 初始化录音按钮，并添加到页面
    this._recordBtn = document.createElement('button');
    this._recordBtn.innerText = 'UI操作录制';
    this._recordBtn.className = 'UIRecord-action-btn';
    this._recordBtn.style.position = 'fixed';
    this._recordBtn.style.zIndex = '999999';
    this._recordBtn.style.right = '60px';
    this._recordBtn.style.bottom = '60px';
    this._recordBtn.addEventListener('click', this._startRecord);
    document.body.appendChild(this._recordBtn);
    // 初始化录制标记样式
    this._recordMarkStyle = document.createElement('style');
    this._recordMarkStyle.innerHTML =
      '.UIRecord-mark { border: 1.5px solid #ff0000 !important; }';

    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const self = this;
    this._mutationObserver = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (
          mutation.attributeName === 'class' &&
          mutation.target instanceof HTMLElement &&
          mutation.target.className !== mutation.oldValue &&
          !(
            mutation.target.className?.endsWith('UIRecord-mark') ||
            mutation.oldValue?.endsWith('UIRecord-mark')
          )
        ) {
          // 添加
          if (
            mutation.target instanceof HTMLElement &&
            mutation.oldValue &&
            mutation.target.className?.includes(mutation.oldValue)
          ) {
            self._addClassElementRecordList.push({
              element: mutation.target,
              className: mutation.oldValue,
            });
          }
          // 删除
          if (
            mutation.target instanceof HTMLElement &&
            mutation.oldValue &&
            mutation.oldValue?.includes(mutation.target.className)
          ) {
            self._addClassElementRecordList =
              self._addClassElementRecordList.filter(
                (item) => item.element === mutation.target,
              );
          }
        }
      });
    });
  }

  _startRecord = (): void => {
    console.log('----UI自动化脚本开始录制----');
    this._recordBtn.innerText = '录制中，点击结束';
    this._recordBtn.removeEventListener('click', this._startRecord);
    this._recordBtn.addEventListener('click', this._stopRecord);

    document.body.appendChild(this._recordMarkStyle);

    document.addEventListener('mouseover', this._eventHandler.mouseover, true);
    document.addEventListener('mouseout', this._eventHandler.mouseout, true);
    document.addEventListener('click', this._eventHandler.click, true);
    // prettier-ignore
    document.addEventListener('contextmenu', this._eventHandler.contextmenu, true)
    document.addEventListener('focus', this._eventHandler.focus, true);
    document.addEventListener('blur', this._eventHandler.blur, true);
    document.addEventListener('keydown', this._eventHandler.keydown, true);

    this._mutationObserver.observe(document.body, {
      attributes: true,
      subtree: true,
      attributeOldValue: true,
    });

    this._patchElementPrototypeMethods();
  };

  _stopRecord = (): void => {
    console.log('----UI自动化脚本开始结束----');
    this._recordBtn.innerText = 'UI操作录制';
    this._recordBtn.removeEventListener('click', this._stopRecord);
    this._recordBtn.addEventListener('click', this._startRecord);

    this._recordMarkStyle.parentNode?.removeChild(this._recordMarkStyle);

    // prettier-ignore
    document.removeEventListener('mouseover', this._eventHandler.mouseover, true)
    document.removeEventListener('mouseout', this._eventHandler.mouseout, true);
    document.removeEventListener('click', this._eventHandler.click, true);
    // prettier-ignore
    document.removeEventListener('contextmenu', this._eventHandler.contextmenu, true)
    document.removeEventListener('focus', this._eventHandler.focus, true);
    document.removeEventListener('blur', this._eventHandler.blur, true);
    document.removeEventListener('keydown', this._eventHandler.keydown, true);

    this._mutationObserver.disconnect();

    this._releasePatches();

    // prettier-ignore
    console.log('UI操作录制', this._eventRecordList, JSON.stringify(this._eventRecordList))
    if (navigator.clipboard) {
      navigator.clipboard.writeText(JSON.stringify(this._eventRecordList));
    }
    this._eventRecordList = [];
  };

  _patchElementPrototypeMethods = (): void => {
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const self = this;
    this._globalEnv.appendChild = Element.prototype.appendChild;
    Element.prototype.appendChild = function appendChild<T extends Node>(
      newChild: T,
    ): T {
      // hover事件记录逻辑，当hover的元素后，添加了新的元素，就记录当次hover事件
      if (self._hoverEventTempRecord && self._hoverEventTempRecord.xPath) {
        self._eventRecordList.push(self._hoverEventTempRecord);
        self._hoverEventXPathRecordList.push(self._hoverEventTempRecord.xPath);
        self._hoverEventTempRecord = undefined;
      }
      return self._globalEnv.appendChild.call(this, newChild);
    };
  };

  _releasePatches = (): void => {
    Element.prototype.appendChild = this._globalEnv.appendChild;
  };

  _getXPath(element: HTMLElement | SVGElement | null): string {
    let xPath = '';
    for (; element && element.nodeType == 1; element = element.parentElement) {
      const id =
        Array.prototype.slice
          .call(element.parentElement?.children ?? [])
          .filter((item) => item.tagName === element?.tagName)
          .findIndex((item) => item === element) + 1;
      if (id > 1) {
        xPath = '/' + element.tagName.toLowerCase() + '[' + id + ']' + xPath;
      } else {
        xPath = '/' + element.tagName.toLowerCase() + xPath;
      }
    }
    return xPath;
  }

  _getQuerySelector(element: Element): string {
    let temElement: Element | null = element;
    let querySelector = '';
    while (temElement && temElement.nodeType === 1) {
      let classQuerySelector = temElement?.className
        .split(' ')
        .filter((item: string) => item !== '' && item !== 'UIRecord-mark')
        .join('.');
      classQuerySelector = classQuerySelector
        ? `${temElement?.tagName.toLowerCase()}.${classQuerySelector}`
        : temElement?.tagName.toLowerCase();
      const childIndex =
        Array.prototype.slice
          .call(temElement.parentElement?.children ?? [])
          .findIndex((item) => item === temElement) + 1;
      classQuerySelector += `:nth-child(${childIndex})`;
      querySelector = querySelector
        ? `${classQuerySelector}>${querySelector}`
        : classQuerySelector;
      const doms = document.querySelectorAll(querySelector);
      if (doms.length === 1 && doms[0] === element) {
        return querySelector;
      }
      while (temElement.previousElementSibling) {
        temElement = temElement.previousElementSibling;
        let classQuerySelector =
          typeof temElement.className === 'string'
            ? temElement.className
                .split(' ')
                .filter(
                  (item: string) => item !== '' && item !== 'UIRecord-mark',
                )
                .join('.')
            : undefined;
        classQuerySelector = classQuerySelector
          ? `${temElement?.tagName.toLowerCase()}.${classQuerySelector}`
          : temElement?.tagName.toLowerCase();
        querySelector = `${classQuerySelector} + ${querySelector}`;
        const doms = document.querySelectorAll(querySelector);
        if (doms.length === 1 && doms[0] === element) {
          return querySelector;
        }
      }
      temElement = temElement.parentElement;
    }
    return querySelector;
  }

  _getQuerySelectorByAddClassElementRecord(element: Element): {
    needRecord: boolean;
    querySelector: string;
  } {
    let temElement: Element | null = element;
    let needRecord = false;
    let querySelector = '';
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const self = this;
    function getElementClassQuerySelector(element: Element): string {
      let className = element.className;
      const addClassElementRecord = self._addClassElementRecordList.find(
        (item) => item.element === temElement,
      );
      if (addClassElementRecord) {
        needRecord = true;
        className = addClassElementRecord.className;
      }
      let classQuerySelector =
        typeof className === 'string'
          ? className
              .split(' ')
              .filter((item: string) => item !== '' && item !== 'UIRecord-mark')
              .join('.')
          : undefined;
      classQuerySelector = classQuerySelector
        ? `${temElement?.tagName.toLowerCase()}.${classQuerySelector}`
        : temElement?.tagName.toLowerCase();
      const childIndex =
        Array.prototype.slice
          .call(temElement?.parentElement?.children ?? [])
          .findIndex((item) => item === temElement) + 1;
      classQuerySelector += `:nth-child(${childIndex})`;
      return classQuerySelector ?? '';
    }
    while (temElement && temElement.nodeType === 1) {
      querySelector = querySelector
        ? `${getElementClassQuerySelector(temElement)}>${querySelector}`
        : getElementClassQuerySelector(temElement);
      const doms = document.querySelectorAll(querySelector);
      if (doms.length === 1 && doms[0] === element) {
        return {
          querySelector,
          needRecord,
        };
      }
      while (temElement.previousElementSibling) {
        temElement = temElement.previousElementSibling;
        querySelector = `${getElementClassQuerySelector(
          temElement,
        )} + ${querySelector}`;
        const doms = document.querySelectorAll(querySelector);
        if (doms.length === 1 && doms[0] === element) {
          return {
            querySelector,
            needRecord,
          };
        }
      }
      temElement = temElement.parentElement;
    }
    return {
      needRecord,
      querySelector,
    };
  }
}

export default UIRecord;
