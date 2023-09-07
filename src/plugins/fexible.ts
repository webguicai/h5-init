// @ts-ignore
/* eslint-disable */
(function (win, lib) {
  var doc = win.document;
  var docEl = doc.documentElement;
  var metaEl = doc.querySelector('meta[name="viewport"]');
  var flexibleEl = doc.querySelector('meta[name="flexible"]');
  var dpr: any = 0;
  var scale: any = 0;
  var tid: string | number | NodeJS.Timeout | undefined;
  var flexible = lib.flexible || (lib.flexible = {});
  var isAndroid = win.navigator.appVersion.match(/android/gi);
  var isIPhone = win.navigator.appVersion.match(/iphone/gi);

  if (metaEl) {
    // 如果原来就有meta[name="viewport"]，根据viewport设置scale和dpr
    console.warn('将根据已有的meta标签来设置缩放比例');
    var match = metaEl
      .getAttribute('content')
      .match(/initial\-scale=([\d\.]+)/);
    if (match) {
      scale = parseFloat(match[1]);
      dpr = parseInt(1 / scale);
    }
  } else if (flexibleEl) {
    var content = flexibleEl.getAttribute('content');
    // 如果原来就有meta[name="flexible"],根据flexible设置scale和dpr
    if (content) {
      var initialDpr = content.match(/initial\-dpr=([\d\.]+)/);
      var maximumDpr = content.match(/maximum\-dpr=([\d\.]+)/);
      if (initialDpr) {
        dpr = parseFloat(initialDpr[1]);
        scale = parseFloat((1 / dpr).toFixed(2));
      }
      if (maximumDpr) {
        dpr = parseFloat(maximumDpr[1]);
        scale = parseFloat((1 / dpr).toFixed(2));
      }
    }
  }

  if (!dpr && !scale) {
    // 上面两个判断没有走
    var devicePixelRatio = win.devicePixelRatio; // 取系统默认的设备像素比dpr
    if (isIPhone) {
      // dpr取整数操作
      // iOS下，对于2和3的屏，用2倍的方案，其余的用1倍方案
      if (devicePixelRatio >= 3 && (!dpr || dpr >= 3)) {
        dpr = 3;
      } else if (devicePixelRatio >= 2 && (!dpr || dpr >= 2)) {
        dpr = 2;
      } else {
        dpr = 1;
      }
    } else {
      // 其他设备下，仍旧使用1倍的方案
      // 在安卓部分机型的原生浏览器上 设置initial-scale不等于1的情况下是无效的
      dpr = 1;
    }
    scale = 1 / dpr;
  }
  // 在html元素上添加data-dpr属性
  docEl.setAttribute('data-dpr', dpr);
  if (!metaEl) {
    metaEl = doc.createElement('meta');
    metaEl.setAttribute('name', 'viewport');
    metaEl.setAttribute(
      'content',
      'initial-scale=' +
        scale +
        ', maximum-scale=' +
        scale +
        ', minimum-scale=' +
        scale +
        ', user-scalable=no, viewport-fit=cover',
    );
    if (docEl.firstElementChild) {
      docEl.firstElementChild.appendChild(metaEl);
    } else {
      var wrap = doc.createElement('div');
      wrap.appendChild(metaEl);
      doc.write(wrap.innerHTML);
    }
  }

  // 在body元素上添加font-size属性
  if (doc.readyState === 'complete') {
    doc.body.style.fontSize = 12 * dpr + 'px';
  } else {
    doc.addEventListener(
      'DOMContentLoaded',
      function (e) {
        doc.body.style.fontSize = 12 * dpr + 'px';
        //处理大字体问题，此时执行会有“闪”的问题
        //最好在body标签下增加lib.flexible.refreshRem();
        refreshRem();
      },
      false,
    );
  }

  // 计算rem的函数
  function refreshRem() {
    // 获取html元素的宽度
    var rect = docEl.getBoundingClientRect();
    var width = rect.width;
    var height = rect.height;
    if (width / dpr > 980) {
      width = 980 * dpr;
    }
    if (!isAndroid && !isIPhone && width / dpr > 600) {
      // pc 设置最大宽度 (考虑wphone等其他系统手机)
      width = 600 * dpr;
    }

    var rem = width / 10;

    // 设置html元素的字体大小
    docEl.style.fontSize = rem + 'px';
    flexible.rem = win.rem = rem;

    //处理系统字体放大情况,目前只处理横屏，否则某些手机横竖屏切换会有问题
    if (doc.body && window.orientation == 0) {
      var _rem = rem,
        html_width = width,
        body_width = doc.body.getBoundingClientRect().width;

      // 针对不同宽度的设备计算
      // 我们按照宽度为750px的设计稿计算在其它屏幕宽度下的rem大小
      if (html_width != body_width) {
        //系统字体放大
        _rem = rem * (html_width / body_width);
        // 重新设置html元素的字体大小
        docEl.style.fontSize = _rem + 'px';
        flexible.rem = win.rem = rem;
      }
    }
  }

  flexible.dpr = win.dpr = dpr;
  flexible.refreshRem = refreshRem;
  // 转换函数
  flexible.rem2px = function (d) {
    var val = parseFloat(d) * this.rem;
    if (typeof d === 'string' && d.match(/rem$/)) {
      val += 'px';
    }
    return val;
  };
  flexible.px2rem = function (d) {
    var val = parseFloat(d) / this.rem;
    if (typeof d === 'string' && d.match(/px$/)) {
      val += 'rem';
    }
    return val;
  };

  // 函数防抖
  win.addEventListener(
    'resize',
    function () {
      clearTimeout(tid);
      tid = setTimeout(refreshRem, 300);
    },
    false,
  );
  win.addEventListener(
    'pageshow',
    function (e) {
      if (e.persisted) {
        clearTimeout(tid);
        tid = setTimeout(refreshRem, 300);
      }
    },
    false,
  );

  refreshRem();
})(window, window['remLib'] || (window['remLib'] = {}));
