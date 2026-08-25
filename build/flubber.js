"use strict";
var flubber = (() => {
  var __create = Object.create;
  var __defProp = Object.defineProperty;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __getProtoOf = Object.getPrototypeOf;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __commonJS = (cb, mod) => function __require() {
    return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
  };
  var __export = (target, all) => {
    for (var name in all)
      __defProp(target, name, { get: all[name], enumerable: true });
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
    // If the importer is in node compatibility mode or this is not an ESM
    // file that has been converted to a CommonJS file using a Babel-
    // compatible transform (i.e. "__esModule" has not been set), then set
    // "default" to the CommonJS "module.exports" for node compatibility.
    isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
    mod
  ));
  var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

  // node_modules/.pnpm/svgpath@2.6.0/node_modules/svgpath/lib/path_parse.js
  var require_path_parse = __commonJS({
    "node_modules/.pnpm/svgpath@2.6.0/node_modules/svgpath/lib/path_parse.js"(exports, module) {
      "use strict";
      var paramCounts = { a: 7, c: 6, h: 1, l: 2, m: 2, r: 4, q: 4, s: 4, t: 2, v: 1, z: 0 };
      var SPECIAL_SPACES = [
        5760,
        6158,
        8192,
        8193,
        8194,
        8195,
        8196,
        8197,
        8198,
        8199,
        8200,
        8201,
        8202,
        8239,
        8287,
        12288,
        65279
      ];
      function isSpace(ch) {
        return ch === 10 || ch === 13 || ch === 8232 || ch === 8233 || // Line terminators
        // White spaces
        ch === 32 || ch === 9 || ch === 11 || ch === 12 || ch === 160 || ch >= 5760 && SPECIAL_SPACES.indexOf(ch) >= 0;
      }
      function isCommand(code) {
        switch (code | 32) {
          case 109:
          case 122:
          case 108:
          case 104:
          case 118:
          case 99:
          case 115:
          case 113:
          case 116:
          case 97:
          case 114:
            return true;
        }
        return false;
      }
      function isArc(code) {
        return (code | 32) === 97;
      }
      function isDigit(code) {
        return code >= 48 && code <= 57;
      }
      function isDigitStart(code) {
        return code >= 48 && code <= 57 || /* 0..9 */
        code === 43 || /* + */
        code === 45 || /* - */
        code === 46;
      }
      function State(path) {
        this.index = 0;
        this.path = path;
        this.max = path.length;
        this.result = [];
        this.param = 0;
        this.err = "";
        this.segmentStart = 0;
        this.data = [];
      }
      function skipSpaces(state) {
        while (state.index < state.max && isSpace(state.path.charCodeAt(state.index))) {
          state.index++;
        }
      }
      function scanFlag(state) {
        var ch = state.path.charCodeAt(state.index);
        if (ch === 48) {
          state.param = 0;
          state.index++;
          return;
        }
        if (ch === 49) {
          state.param = 1;
          state.index++;
          return;
        }
        state.err = "SvgPath: arc flag can be 0 or 1 only (at pos " + state.index + ")";
      }
      function scanParam(state) {
        var start = state.index, index = start, max = state.max, zeroFirst = false, hasCeiling = false, hasDecimal = false, hasDot = false, ch;
        if (index >= max) {
          state.err = "SvgPath: missed param (at pos " + index + ")";
          return;
        }
        ch = state.path.charCodeAt(index);
        if (ch === 43 || ch === 45) {
          index++;
          ch = index < max ? state.path.charCodeAt(index) : 0;
        }
        if (!isDigit(ch) && ch !== 46) {
          state.err = "SvgPath: param should start with 0..9 or `.` (at pos " + index + ")";
          return;
        }
        if (ch !== 46) {
          zeroFirst = ch === 48;
          index++;
          ch = index < max ? state.path.charCodeAt(index) : 0;
          if (zeroFirst && index < max) {
            if (ch && isDigit(ch)) {
              state.err = "SvgPath: numbers started with `0` such as `09` are illegal (at pos " + start + ")";
              return;
            }
          }
          while (index < max && isDigit(state.path.charCodeAt(index))) {
            index++;
            hasCeiling = true;
          }
          ch = index < max ? state.path.charCodeAt(index) : 0;
        }
        if (ch === 46) {
          hasDot = true;
          index++;
          while (isDigit(state.path.charCodeAt(index))) {
            index++;
            hasDecimal = true;
          }
          ch = index < max ? state.path.charCodeAt(index) : 0;
        }
        if (ch === 101 || ch === 69) {
          if (hasDot && !hasCeiling && !hasDecimal) {
            state.err = "SvgPath: invalid float exponent (at pos " + index + ")";
            return;
          }
          index++;
          ch = index < max ? state.path.charCodeAt(index) : 0;
          if (ch === 43 || ch === 45) {
            index++;
          }
          if (index < max && isDigit(state.path.charCodeAt(index))) {
            while (index < max && isDigit(state.path.charCodeAt(index))) {
              index++;
            }
          } else {
            state.err = "SvgPath: invalid float exponent (at pos " + index + ")";
            return;
          }
        }
        state.index = index;
        state.param = parseFloat(state.path.slice(start, index)) + 0;
      }
      function finalizeSegment(state) {
        var cmd, cmdLC;
        cmd = state.path[state.segmentStart];
        cmdLC = cmd.toLowerCase();
        var params = state.data;
        if (cmdLC === "m" && params.length > 2) {
          state.result.push([cmd, params[0], params[1]]);
          params = params.slice(2);
          cmdLC = "l";
          cmd = cmd === "m" ? "l" : "L";
        }
        if (cmdLC === "r") {
          state.result.push([cmd].concat(params));
        } else {
          while (params.length >= paramCounts[cmdLC]) {
            state.result.push([cmd].concat(params.splice(0, paramCounts[cmdLC])));
            if (!paramCounts[cmdLC]) {
              break;
            }
          }
        }
      }
      function scanSegment(state) {
        var max = state.max, cmdCode, is_arc, comma_found, need_params, i2;
        state.segmentStart = state.index;
        cmdCode = state.path.charCodeAt(state.index);
        is_arc = isArc(cmdCode);
        if (!isCommand(cmdCode)) {
          state.err = "SvgPath: bad command " + state.path[state.index] + " (at pos " + state.index + ")";
          return;
        }
        need_params = paramCounts[state.path[state.index].toLowerCase()];
        state.index++;
        skipSpaces(state);
        state.data = [];
        if (!need_params) {
          finalizeSegment(state);
          return;
        }
        comma_found = false;
        for (; ; ) {
          for (i2 = need_params; i2 > 0; i2--) {
            if (is_arc && (i2 === 3 || i2 === 4)) scanFlag(state);
            else scanParam(state);
            if (state.err.length) {
              finalizeSegment(state);
              return;
            }
            state.data.push(state.param);
            skipSpaces(state);
            comma_found = false;
            if (state.index < max && state.path.charCodeAt(state.index) === 44) {
              state.index++;
              skipSpaces(state);
              comma_found = true;
            }
          }
          if (comma_found) {
            continue;
          }
          if (state.index >= state.max) {
            break;
          }
          if (!isDigitStart(state.path.charCodeAt(state.index))) {
            break;
          }
        }
        finalizeSegment(state);
      }
      module.exports = function pathParse(svgPath) {
        var state = new State(svgPath);
        var max = state.max;
        skipSpaces(state);
        while (state.index < max && !state.err.length) {
          scanSegment(state);
        }
        if (state.result.length) {
          if ("mM".indexOf(state.result[0][0]) < 0) {
            state.err = "SvgPath: string should start with `M` or `m`";
            state.result = [];
          } else {
            state.result[0][0] = "M";
          }
        }
        return {
          err: state.err,
          segments: state.result
        };
      };
    }
  });

  // node_modules/.pnpm/svgpath@2.6.0/node_modules/svgpath/lib/matrix.js
  var require_matrix = __commonJS({
    "node_modules/.pnpm/svgpath@2.6.0/node_modules/svgpath/lib/matrix.js"(exports, module) {
      "use strict";
      function combine2(m1, m2) {
        return [
          m1[0] * m2[0] + m1[2] * m2[1],
          m1[1] * m2[0] + m1[3] * m2[1],
          m1[0] * m2[2] + m1[2] * m2[3],
          m1[1] * m2[2] + m1[3] * m2[3],
          m1[0] * m2[4] + m1[2] * m2[5] + m1[4],
          m1[1] * m2[4] + m1[3] * m2[5] + m1[5]
        ];
      }
      function Matrix() {
        if (!(this instanceof Matrix)) {
          return new Matrix();
        }
        this.queue = [];
        this.cache = null;
      }
      Matrix.prototype.matrix = function(m2) {
        if (m2[0] === 1 && m2[1] === 0 && m2[2] === 0 && m2[3] === 1 && m2[4] === 0 && m2[5] === 0) {
          return this;
        }
        this.cache = null;
        this.queue.push(m2);
        return this;
      };
      Matrix.prototype.translate = function(tx, ty) {
        if (tx !== 0 || ty !== 0) {
          this.cache = null;
          this.queue.push([1, 0, 0, 1, tx, ty]);
        }
        return this;
      };
      Matrix.prototype.scale = function(sx, sy) {
        if (sx !== 1 || sy !== 1) {
          this.cache = null;
          this.queue.push([sx, 0, 0, sy, 0, 0]);
        }
        return this;
      };
      Matrix.prototype.rotate = function(angle, rx, ry) {
        var rad, cos, sin;
        if (angle !== 0) {
          this.translate(rx, ry);
          rad = angle * Math.PI / 180;
          cos = Math.cos(rad);
          sin = Math.sin(rad);
          this.queue.push([cos, sin, -sin, cos, 0, 0]);
          this.cache = null;
          this.translate(-rx, -ry);
        }
        return this;
      };
      Matrix.prototype.skewX = function(angle) {
        if (angle !== 0) {
          this.cache = null;
          this.queue.push([1, 0, Math.tan(angle * Math.PI / 180), 1, 0, 0]);
        }
        return this;
      };
      Matrix.prototype.skewY = function(angle) {
        if (angle !== 0) {
          this.cache = null;
          this.queue.push([1, Math.tan(angle * Math.PI / 180), 0, 1, 0, 0]);
        }
        return this;
      };
      Matrix.prototype.toArray = function() {
        if (this.cache) {
          return this.cache;
        }
        if (!this.queue.length) {
          this.cache = [1, 0, 0, 1, 0, 0];
          return this.cache;
        }
        this.cache = this.queue[0];
        if (this.queue.length === 1) {
          return this.cache;
        }
        for (var i2 = 1; i2 < this.queue.length; i2++) {
          this.cache = combine2(this.cache, this.queue[i2]);
        }
        return this.cache;
      };
      Matrix.prototype.calc = function(x2, y2, isRelative) {
        var m2;
        if (!this.queue.length) {
          return [x2, y2];
        }
        if (!this.cache) {
          this.cache = this.toArray();
        }
        m2 = this.cache;
        return [
          x2 * m2[0] + y2 * m2[2] + (isRelative ? 0 : m2[4]),
          x2 * m2[1] + y2 * m2[3] + (isRelative ? 0 : m2[5])
        ];
      };
      module.exports = Matrix;
    }
  });

  // node_modules/.pnpm/svgpath@2.6.0/node_modules/svgpath/lib/transform_parse.js
  var require_transform_parse = __commonJS({
    "node_modules/.pnpm/svgpath@2.6.0/node_modules/svgpath/lib/transform_parse.js"(exports, module) {
      "use strict";
      var Matrix = require_matrix();
      var operations = {
        matrix: true,
        scale: true,
        rotate: true,
        translate: true,
        skewX: true,
        skewY: true
      };
      var CMD_SPLIT_RE = /\s*(matrix|translate|scale|rotate|skewX|skewY)\s*\(\s*(.+?)\s*\)[\s,]*/;
      var PARAMS_SPLIT_RE = /[\s,]+/;
      module.exports = function transformParse(transformString) {
        var matrix = new Matrix();
        var cmd, params;
        transformString.split(CMD_SPLIT_RE).forEach(function(item) {
          if (!item.length) {
            return;
          }
          if (typeof operations[item] !== "undefined") {
            cmd = item;
            return;
          }
          params = item.split(PARAMS_SPLIT_RE).map(function(i2) {
            return +i2 || 0;
          });
          switch (cmd) {
            case "matrix":
              if (params.length === 6) {
                matrix.matrix(params);
              }
              return;
            case "scale":
              if (params.length === 1) {
                matrix.scale(params[0], params[0]);
              } else if (params.length === 2) {
                matrix.scale(params[0], params[1]);
              }
              return;
            case "rotate":
              if (params.length === 1) {
                matrix.rotate(params[0], 0, 0);
              } else if (params.length === 3) {
                matrix.rotate(params[0], params[1], params[2]);
              }
              return;
            case "translate":
              if (params.length === 1) {
                matrix.translate(params[0], 0);
              } else if (params.length === 2) {
                matrix.translate(params[0], params[1]);
              }
              return;
            case "skewX":
              if (params.length === 1) {
                matrix.skewX(params[0]);
              }
              return;
            case "skewY":
              if (params.length === 1) {
                matrix.skewY(params[0]);
              }
              return;
          }
        });
        return matrix;
      };
    }
  });

  // node_modules/.pnpm/svgpath@2.6.0/node_modules/svgpath/lib/a2c.js
  var require_a2c = __commonJS({
    "node_modules/.pnpm/svgpath@2.6.0/node_modules/svgpath/lib/a2c.js"(exports, module) {
      "use strict";
      var TAU = Math.PI * 2;
      function unit_vector_angle(ux, uy, vx, vy) {
        var sign = ux * vy - uy * vx < 0 ? -1 : 1;
        var dot = ux * vx + uy * vy;
        if (dot > 1) {
          dot = 1;
        }
        if (dot < -1) {
          dot = -1;
        }
        return sign * Math.acos(dot);
      }
      function get_arc_center(x1, y1, x2, y2, fa, fs, rx, ry, sin_phi, cos_phi) {
        var x1p = cos_phi * (x1 - x2) / 2 + sin_phi * (y1 - y2) / 2;
        var y1p = -sin_phi * (x1 - x2) / 2 + cos_phi * (y1 - y2) / 2;
        var rx_sq = rx * rx;
        var ry_sq = ry * ry;
        var x1p_sq = x1p * x1p;
        var y1p_sq = y1p * y1p;
        var radicant = rx_sq * ry_sq - rx_sq * y1p_sq - ry_sq * x1p_sq;
        if (radicant < 0) {
          radicant = 0;
        }
        radicant /= rx_sq * y1p_sq + ry_sq * x1p_sq;
        radicant = Math.sqrt(radicant) * (fa === fs ? -1 : 1);
        var cxp = radicant * rx / ry * y1p;
        var cyp = radicant * -ry / rx * x1p;
        var cx = cos_phi * cxp - sin_phi * cyp + (x1 + x2) / 2;
        var cy = sin_phi * cxp + cos_phi * cyp + (y1 + y2) / 2;
        var v1x = (x1p - cxp) / rx;
        var v1y = (y1p - cyp) / ry;
        var v2x = (-x1p - cxp) / rx;
        var v2y = (-y1p - cyp) / ry;
        var theta1 = unit_vector_angle(1, 0, v1x, v1y);
        var delta_theta = unit_vector_angle(v1x, v1y, v2x, v2y);
        if (fs === 0 && delta_theta > 0) {
          delta_theta -= TAU;
        }
        if (fs === 1 && delta_theta < 0) {
          delta_theta += TAU;
        }
        return [cx, cy, theta1, delta_theta];
      }
      function approximate_unit_arc(theta1, delta_theta) {
        var alpha = 4 / 3 * Math.tan(delta_theta / 4);
        var x1 = Math.cos(theta1);
        var y1 = Math.sin(theta1);
        var x2 = Math.cos(theta1 + delta_theta);
        var y2 = Math.sin(theta1 + delta_theta);
        return [x1, y1, x1 - y1 * alpha, y1 + x1 * alpha, x2 + y2 * alpha, y2 - x2 * alpha, x2, y2];
      }
      module.exports = function a2c(x1, y1, x2, y2, fa, fs, rx, ry, phi) {
        var sin_phi = Math.sin(phi * TAU / 360);
        var cos_phi = Math.cos(phi * TAU / 360);
        var x1p = cos_phi * (x1 - x2) / 2 + sin_phi * (y1 - y2) / 2;
        var y1p = -sin_phi * (x1 - x2) / 2 + cos_phi * (y1 - y2) / 2;
        if (x1p === 0 && y1p === 0) {
          return [];
        }
        if (rx === 0 || ry === 0) {
          return [];
        }
        rx = Math.abs(rx);
        ry = Math.abs(ry);
        var lambda = x1p * x1p / (rx * rx) + y1p * y1p / (ry * ry);
        if (lambda > 1) {
          rx *= Math.sqrt(lambda);
          ry *= Math.sqrt(lambda);
        }
        var cc = get_arc_center(x1, y1, x2, y2, fa, fs, rx, ry, sin_phi, cos_phi);
        var result = [];
        var theta1 = cc[2];
        var delta_theta = cc[3];
        var segments = Math.max(Math.ceil(Math.abs(delta_theta) / (TAU / 4)), 1);
        delta_theta /= segments;
        for (var i2 = 0; i2 < segments; i2++) {
          result.push(approximate_unit_arc(theta1, delta_theta));
          theta1 += delta_theta;
        }
        return result.map(function(curve) {
          for (var i3 = 0; i3 < curve.length; i3 += 2) {
            var x3 = curve[i3 + 0];
            var y3 = curve[i3 + 1];
            x3 *= rx;
            y3 *= ry;
            var xp = cos_phi * x3 - sin_phi * y3;
            var yp = sin_phi * x3 + cos_phi * y3;
            curve[i3 + 0] = xp + cc[0];
            curve[i3 + 1] = yp + cc[1];
          }
          return curve;
        });
      };
    }
  });

  // node_modules/.pnpm/svgpath@2.6.0/node_modules/svgpath/lib/ellipse.js
  var require_ellipse = __commonJS({
    "node_modules/.pnpm/svgpath@2.6.0/node_modules/svgpath/lib/ellipse.js"(exports, module) {
      "use strict";
      var epsilon = 1e-10;
      var torad = Math.PI / 180;
      function Ellipse(rx, ry, ax) {
        if (!(this instanceof Ellipse)) {
          return new Ellipse(rx, ry, ax);
        }
        this.rx = rx;
        this.ry = ry;
        this.ax = ax;
      }
      Ellipse.prototype.transform = function(m2) {
        var c2 = Math.cos(this.ax * torad), s2 = Math.sin(this.ax * torad);
        var ma = [
          this.rx * (m2[0] * c2 + m2[2] * s2),
          this.rx * (m2[1] * c2 + m2[3] * s2),
          this.ry * (-m2[0] * s2 + m2[2] * c2),
          this.ry * (-m2[1] * s2 + m2[3] * c2)
        ];
        var J = ma[0] * ma[0] + ma[2] * ma[2], K2 = ma[1] * ma[1] + ma[3] * ma[3];
        var D2 = ((ma[0] - ma[3]) * (ma[0] - ma[3]) + (ma[2] + ma[1]) * (ma[2] + ma[1])) * ((ma[0] + ma[3]) * (ma[0] + ma[3]) + (ma[2] - ma[1]) * (ma[2] - ma[1]));
        var JK = (J + K2) / 2;
        if (D2 < epsilon * JK) {
          this.rx = this.ry = Math.sqrt(JK);
          this.ax = 0;
          return this;
        }
        var L2 = ma[0] * ma[1] + ma[2] * ma[3];
        D2 = Math.sqrt(D2);
        var l1 = JK + D2 / 2, l2 = JK - D2 / 2;
        this.ax = Math.abs(L2) < epsilon && Math.abs(l1 - K2) < epsilon ? 90 : Math.atan(
          Math.abs(L2) > Math.abs(l1 - K2) ? (l1 - J) / L2 : L2 / (l1 - K2)
        ) * 180 / Math.PI;
        if (this.ax >= 0) {
          this.rx = Math.sqrt(l1);
          this.ry = Math.sqrt(l2);
        } else {
          this.ax += 90;
          this.rx = Math.sqrt(l2);
          this.ry = Math.sqrt(l1);
        }
        return this;
      };
      Ellipse.prototype.isDegenerate = function() {
        return this.rx < epsilon * this.ry || this.ry < epsilon * this.rx;
      };
      module.exports = Ellipse;
    }
  });

  // node_modules/.pnpm/svgpath@2.6.0/node_modules/svgpath/lib/svgpath.js
  var require_svgpath = __commonJS({
    "node_modules/.pnpm/svgpath@2.6.0/node_modules/svgpath/lib/svgpath.js"(exports, module) {
      "use strict";
      var pathParse = require_path_parse();
      var transformParse = require_transform_parse();
      var matrix = require_matrix();
      var a2c = require_a2c();
      var ellipse = require_ellipse();
      function SvgPath2(path) {
        if (!(this instanceof SvgPath2)) {
          return new SvgPath2(path);
        }
        var pstate = pathParse(path);
        this.segments = pstate.segments;
        this.err = pstate.err;
        this.__stack = [];
      }
      SvgPath2.from = function(src) {
        if (typeof src === "string") return new SvgPath2(src);
        if (src instanceof SvgPath2) {
          var s2 = new SvgPath2("");
          s2.err = src.err;
          s2.segments = src.segments.map(function(sgm) {
            return sgm.slice();
          });
          s2.__stack = src.__stack.map(function(m2) {
            return matrix().matrix(m2.toArray());
          });
          return s2;
        }
        throw new Error("SvgPath.from: invalid param type " + src);
      };
      SvgPath2.prototype.__matrix = function(m2) {
        var self = this, i2;
        if (!m2.queue.length) {
          return;
        }
        this.iterate(function(s2, index, x2, y2) {
          var p2, result, name, isRelative;
          switch (s2[0]) {
            // Process 'assymetric' commands separately
            case "v":
              p2 = m2.calc(0, s2[1], true);
              result = p2[0] === 0 ? ["v", p2[1]] : ["l", p2[0], p2[1]];
              break;
            case "V":
              p2 = m2.calc(x2, s2[1], false);
              result = p2[0] === m2.calc(x2, y2, false)[0] ? ["V", p2[1]] : ["L", p2[0], p2[1]];
              break;
            case "h":
              p2 = m2.calc(s2[1], 0, true);
              result = p2[1] === 0 ? ["h", p2[0]] : ["l", p2[0], p2[1]];
              break;
            case "H":
              p2 = m2.calc(s2[1], y2, false);
              result = p2[1] === m2.calc(x2, y2, false)[1] ? ["H", p2[0]] : ["L", p2[0], p2[1]];
              break;
            case "a":
            case "A":
              var ma = m2.toArray();
              var e2 = ellipse(s2[1], s2[2], s2[3]).transform(ma);
              if (ma[0] * ma[3] - ma[1] * ma[2] < 0) {
                s2[5] = s2[5] ? "0" : "1";
              }
              p2 = m2.calc(s2[6], s2[7], s2[0] === "a");
              if (s2[0] === "A" && s2[6] === x2 && s2[7] === y2 || s2[0] === "a" && s2[6] === 0 && s2[7] === 0) {
                result = [s2[0] === "a" ? "l" : "L", p2[0], p2[1]];
                break;
              }
              if (e2.isDegenerate()) {
                result = [s2[0] === "a" ? "l" : "L", p2[0], p2[1]];
              } else {
                result = [s2[0], e2.rx, e2.ry, e2.ax, s2[4], s2[5], p2[0], p2[1]];
              }
              break;
            case "m":
              isRelative = index > 0;
              p2 = m2.calc(s2[1], s2[2], isRelative);
              result = ["m", p2[0], p2[1]];
              break;
            default:
              name = s2[0];
              result = [name];
              isRelative = name.toLowerCase() === name;
              for (i2 = 1; i2 < s2.length; i2 += 2) {
                p2 = m2.calc(s2[i2], s2[i2 + 1], isRelative);
                result.push(p2[0], p2[1]);
              }
          }
          self.segments[index] = result;
        }, true);
      };
      SvgPath2.prototype.__evaluateStack = function() {
        var m2, i2;
        if (!this.__stack.length) {
          return;
        }
        if (this.__stack.length === 1) {
          this.__matrix(this.__stack[0]);
          this.__stack = [];
          return;
        }
        m2 = matrix();
        i2 = this.__stack.length;
        while (--i2 >= 0) {
          m2.matrix(this.__stack[i2].toArray());
        }
        this.__matrix(m2);
        this.__stack = [];
      };
      SvgPath2.prototype.toString = function() {
        var result = "", prevCmd = "", cmdSkipped = false;
        this.__evaluateStack();
        for (var i2 = 0, len = this.segments.length; i2 < len; i2++) {
          var segment = this.segments[i2];
          var cmd = segment[0];
          if (cmd !== prevCmd || cmd === "m" || cmd === "M") {
            if (cmd === "m" && prevCmd === "z") result += " ";
            result += cmd;
            cmdSkipped = false;
          } else {
            cmdSkipped = true;
          }
          for (var pos = 1; pos < segment.length; pos++) {
            var val = segment[pos];
            if (pos === 1) {
              if (cmdSkipped && val >= 0) result += " ";
            } else if (val >= 0) result += " ";
            result += val;
          }
          prevCmd = cmd;
        }
        return result;
      };
      SvgPath2.prototype.translate = function(x2, y2) {
        this.__stack.push(matrix().translate(x2, y2 || 0));
        return this;
      };
      SvgPath2.prototype.scale = function(sx, sy) {
        this.__stack.push(matrix().scale(sx, !sy && sy !== 0 ? sx : sy));
        return this;
      };
      SvgPath2.prototype.rotate = function(angle, rx, ry) {
        this.__stack.push(matrix().rotate(angle, rx || 0, ry || 0));
        return this;
      };
      SvgPath2.prototype.skewX = function(degrees) {
        this.__stack.push(matrix().skewX(degrees));
        return this;
      };
      SvgPath2.prototype.skewY = function(degrees) {
        this.__stack.push(matrix().skewY(degrees));
        return this;
      };
      SvgPath2.prototype.matrix = function(m2) {
        this.__stack.push(matrix().matrix(m2));
        return this;
      };
      SvgPath2.prototype.transform = function(transformString) {
        if (!transformString.trim()) {
          return this;
        }
        this.__stack.push(transformParse(transformString));
        return this;
      };
      SvgPath2.prototype.round = function(d2) {
        var contourStartDeltaX = 0, contourStartDeltaY = 0, deltaX = 0, deltaY = 0, l2;
        d2 = d2 || 0;
        this.__evaluateStack();
        this.segments.forEach(function(s2) {
          var isRelative = s2[0].toLowerCase() === s2[0];
          switch (s2[0]) {
            case "H":
            case "h":
              if (isRelative) {
                s2[1] += deltaX;
              }
              deltaX = s2[1] - s2[1].toFixed(d2);
              s2[1] = +s2[1].toFixed(d2);
              return;
            case "V":
            case "v":
              if (isRelative) {
                s2[1] += deltaY;
              }
              deltaY = s2[1] - s2[1].toFixed(d2);
              s2[1] = +s2[1].toFixed(d2);
              return;
            case "Z":
            case "z":
              deltaX = contourStartDeltaX;
              deltaY = contourStartDeltaY;
              return;
            case "M":
            case "m":
              if (isRelative) {
                s2[1] += deltaX;
                s2[2] += deltaY;
              }
              deltaX = s2[1] - s2[1].toFixed(d2);
              deltaY = s2[2] - s2[2].toFixed(d2);
              contourStartDeltaX = deltaX;
              contourStartDeltaY = deltaY;
              s2[1] = +s2[1].toFixed(d2);
              s2[2] = +s2[2].toFixed(d2);
              return;
            case "A":
            case "a":
              if (isRelative) {
                s2[6] += deltaX;
                s2[7] += deltaY;
              }
              deltaX = s2[6] - s2[6].toFixed(d2);
              deltaY = s2[7] - s2[7].toFixed(d2);
              s2[1] = +s2[1].toFixed(d2);
              s2[2] = +s2[2].toFixed(d2);
              s2[3] = +s2[3].toFixed(d2 + 2);
              s2[6] = +s2[6].toFixed(d2);
              s2[7] = +s2[7].toFixed(d2);
              return;
            default:
              l2 = s2.length;
              if (isRelative) {
                s2[l2 - 2] += deltaX;
                s2[l2 - 1] += deltaY;
              }
              deltaX = s2[l2 - 2] - s2[l2 - 2].toFixed(d2);
              deltaY = s2[l2 - 1] - s2[l2 - 1].toFixed(d2);
              s2.forEach(function(val, i2) {
                if (!i2) {
                  return;
                }
                s2[i2] = +s2[i2].toFixed(d2);
              });
              return;
          }
        });
        return this;
      };
      SvgPath2.prototype.iterate = function(iterator, keepLazyStack) {
        var segments = this.segments, replacements = {}, needReplace = false, lastX = 0, lastY = 0, countourStartX = 0, countourStartY = 0;
        var i2, j, newSegments;
        if (!keepLazyStack) {
          this.__evaluateStack();
        }
        segments.forEach(function(s2, index) {
          var res = iterator(s2, index, lastX, lastY);
          if (Array.isArray(res)) {
            replacements[index] = res;
            needReplace = true;
          }
          var isRelative = s2[0] === s2[0].toLowerCase();
          switch (s2[0]) {
            case "m":
            case "M":
              lastX = s2[1] + (isRelative ? lastX : 0);
              lastY = s2[2] + (isRelative ? lastY : 0);
              countourStartX = lastX;
              countourStartY = lastY;
              return;
            case "h":
            case "H":
              lastX = s2[1] + (isRelative ? lastX : 0);
              return;
            case "v":
            case "V":
              lastY = s2[1] + (isRelative ? lastY : 0);
              return;
            case "z":
            case "Z":
              lastX = countourStartX;
              lastY = countourStartY;
              return;
            default:
              lastX = s2[s2.length - 2] + (isRelative ? lastX : 0);
              lastY = s2[s2.length - 1] + (isRelative ? lastY : 0);
          }
        });
        if (!needReplace) {
          return this;
        }
        newSegments = [];
        for (i2 = 0; i2 < segments.length; i2++) {
          if (typeof replacements[i2] !== "undefined") {
            for (j = 0; j < replacements[i2].length; j++) {
              newSegments.push(replacements[i2][j]);
            }
          } else {
            newSegments.push(segments[i2]);
          }
        }
        this.segments = newSegments;
        return this;
      };
      SvgPath2.prototype.abs = function() {
        this.iterate(function(s2, index, x2, y2) {
          var name = s2[0], nameUC = name.toUpperCase(), i2;
          if (name === nameUC) {
            return;
          }
          s2[0] = nameUC;
          switch (name) {
            case "v":
              s2[1] += y2;
              return;
            case "a":
              s2[6] += x2;
              s2[7] += y2;
              return;
            default:
              for (i2 = 1; i2 < s2.length; i2++) {
                s2[i2] += i2 % 2 ? x2 : y2;
              }
          }
        }, true);
        return this;
      };
      SvgPath2.prototype.rel = function() {
        this.iterate(function(s2, index, x2, y2) {
          var name = s2[0], nameLC = name.toLowerCase(), i2;
          if (name === nameLC) {
            return;
          }
          if (index === 0 && name === "M") {
            return;
          }
          s2[0] = nameLC;
          switch (name) {
            case "V":
              s2[1] -= y2;
              return;
            case "A":
              s2[6] -= x2;
              s2[7] -= y2;
              return;
            default:
              for (i2 = 1; i2 < s2.length; i2++) {
                s2[i2] -= i2 % 2 ? x2 : y2;
              }
          }
        }, true);
        return this;
      };
      SvgPath2.prototype.unarc = function() {
        this.iterate(function(s2, index, x2, y2) {
          var new_segments, nextX, nextY, result = [], name = s2[0];
          if (name !== "A" && name !== "a") {
            return null;
          }
          if (name === "a") {
            nextX = x2 + s2[6];
            nextY = y2 + s2[7];
          } else {
            nextX = s2[6];
            nextY = s2[7];
          }
          new_segments = a2c(x2, y2, nextX, nextY, s2[4], s2[5], s2[1], s2[2], s2[3]);
          if (new_segments.length === 0) {
            return [[s2[0] === "a" ? "l" : "L", s2[6], s2[7]]];
          }
          new_segments.forEach(function(s3) {
            result.push(["C", s3[2], s3[3], s3[4], s3[5], s3[6], s3[7]]);
          });
          return result;
        });
        return this;
      };
      SvgPath2.prototype.unshort = function() {
        var segments = this.segments;
        var prevControlX, prevControlY, prevSegment;
        var curControlX, curControlY;
        this.iterate(function(s2, idx, x2, y2) {
          var name = s2[0], nameUC = name.toUpperCase(), isRelative;
          if (!idx) {
            return;
          }
          if (nameUC === "T") {
            isRelative = name === "t";
            prevSegment = segments[idx - 1];
            if (prevSegment[0] === "Q") {
              prevControlX = prevSegment[1] - x2;
              prevControlY = prevSegment[2] - y2;
            } else if (prevSegment[0] === "q") {
              prevControlX = prevSegment[1] - prevSegment[3];
              prevControlY = prevSegment[2] - prevSegment[4];
            } else {
              prevControlX = 0;
              prevControlY = 0;
            }
            curControlX = -prevControlX;
            curControlY = -prevControlY;
            if (!isRelative) {
              curControlX += x2;
              curControlY += y2;
            }
            segments[idx] = [
              isRelative ? "q" : "Q",
              curControlX,
              curControlY,
              s2[1],
              s2[2]
            ];
          } else if (nameUC === "S") {
            isRelative = name === "s";
            prevSegment = segments[idx - 1];
            if (prevSegment[0] === "C") {
              prevControlX = prevSegment[3] - x2;
              prevControlY = prevSegment[4] - y2;
            } else if (prevSegment[0] === "c") {
              prevControlX = prevSegment[3] - prevSegment[5];
              prevControlY = prevSegment[4] - prevSegment[6];
            } else {
              prevControlX = 0;
              prevControlY = 0;
            }
            curControlX = -prevControlX;
            curControlY = -prevControlY;
            if (!isRelative) {
              curControlX += x2;
              curControlY += y2;
            }
            segments[idx] = [
              isRelative ? "c" : "C",
              curControlX,
              curControlY,
              s2[1],
              s2[2],
              s2[3],
              s2[4]
            ];
          }
        });
        return this;
      };
      module.exports = SvgPath2;
    }
  });

  // node_modules/.pnpm/svgpath@2.6.0/node_modules/svgpath/index.js
  var require_svgpath2 = __commonJS({
    "node_modules/.pnpm/svgpath@2.6.0/node_modules/svgpath/index.js"(exports, module) {
      "use strict";
      module.exports = require_svgpath();
    }
  });

  // src/index.ts
  var src_exports = {};
  __export(src_exports, {
    INVALID_INPUT: () => INVALID_INPUT,
    INVALID_INPUT_ALL: () => INVALID_INPUT_ALL,
    INVALID_PATH_STRING: () => INVALID_PATH_STRING,
    addPoints: () => addPoints,
    align: () => align,
    bestOrder: () => bestOrder,
    bisect: () => bisect,
    circlePath: () => circlePath,
    circlePoints: () => circlePoints,
    combine: () => combine,
    cut: () => cut,
    default: () => src_default,
    distance: () => distance,
    fromCircle: () => fromCircle,
    fromRect: () => fromRect,
    interpolate: () => interpolate,
    interpolateAll: () => interpolateAll,
    interpolatePoint: () => interpolatePoint,
    interpolatePoints: () => interpolatePoints,
    interpolateRing: () => interpolateRing,
    isFiniteNumber: () => isFiniteNumber,
    normalizeRing: () => normalizeRing,
    pathStringToRing: () => pathStringToRing,
    pieceOrder: () => pieceOrder,
    pointAlong: () => pointAlong,
    polygonCentroid: () => polygonCentroid,
    rectPath: () => rectPath,
    rectPoints: () => rectPoints,
    rotate: () => rotate,
    samePoint: () => samePoint,
    separate: () => separate,
    splitPathString: () => splitPathString,
    toCircle: () => toCircle,
    toPathString: () => toPathString,
    toRect: () => toRect,
    triangulate: () => triangulate
  });

  // node_modules/.pnpm/d3-polygon@3.0.1/node_modules/d3-polygon/src/area.js
  function area_default(polygon) {
    var i2 = -1, n2 = polygon.length, a2, b2 = polygon[n2 - 1], area2 = 0;
    while (++i2 < n2) {
      a2 = b2;
      b2 = polygon[i2];
      area2 += a2[1] * b2[0] - a2[0] * b2[1];
    }
    return area2 / 2;
  }

  // node_modules/.pnpm/d3-polygon@3.0.1/node_modules/d3-polygon/src/centroid.js
  function centroid_default(polygon) {
    var i2 = -1, n2 = polygon.length, x2 = 0, y2 = 0, a2, b2 = polygon[n2 - 1], c2, k = 0;
    while (++i2 < n2) {
      a2 = b2;
      b2 = polygon[i2];
      k += c2 = a2[0] * b2[1] - b2[0] * a2[1];
      x2 += (a2[0] + b2[0]) * c2;
      y2 += (a2[1] + b2[1]) * c2;
    }
    return k *= 3, [x2 / k, y2 / k];
  }

  // node_modules/.pnpm/d3-polygon@3.0.1/node_modules/d3-polygon/src/length.js
  function length_default(polygon) {
    var i2 = -1, n2 = polygon.length, b2 = polygon[n2 - 1], xa, ya, xb = b2[0], yb = b2[1], perimeter = 0;
    while (++i2 < n2) {
      xa = xb;
      ya = yb;
      b2 = polygon[i2];
      xb = b2[0];
      yb = b2[1];
      xa -= xb;
      ya -= yb;
      perimeter += Math.hypot(xa, ya);
    }
    return perimeter;
  }

  // node_modules/.pnpm/svg-path-properties@2.1.0/node_modules/svg-path-properties/dist/main.mjs
  var main_exports = {};
  __export(main_exports, {
    svgPathProperties: () => q
  });
  var t = Object.defineProperty;
  var e = (e2, i2) => t(e2, "name", { value: i2, configurable: true });
  var i = { a: 7, c: 6, h: 1, l: 2, m: 2, q: 4, s: 4, t: 2, v: 1, z: 0 };
  var n = /([astvzqmhlc])([^astvzqmhlc]*)/gi;
  var h = /-?[0-9]*\.?[0-9]+(?:e[-+]?\d+)?/gi;
  var s = e((t2) => {
    const e2 = (t2 && t2.length > 0 ? t2 : "M0,0").match(n);
    if (!e2) throw new Error(`No path elements found in string ${t2}`);
    return e2.reduce((t3, e3) => {
      let n2 = e3.charAt(0), h2 = n2.toLowerCase(), s2 = g(e3.substring(1));
      if ("m" === h2 && s2.length > 2 && (t3.push([n2, ...s2.splice(0, 2)]), h2 = "l", n2 = "m" === n2 ? "l" : "L"), "a" === h2.toLowerCase() && (5 === s2.length || 6 === s2.length)) {
        const t4 = e3.substring(1).trim().split(" ");
        s2 = [Number(t4[0]), Number(t4[1]), Number(t4[2]), Number(t4[3].charAt(0)), Number(t4[3].charAt(1)), Number(t4[3].substring(2)), Number(t4[4])];
      }
      for (; s2.length >= 0; ) {
        if (s2.length === i[h2]) {
          t3.push([n2, ...s2.splice(0, i[h2])]);
          break;
        }
        if (s2.length < i[h2]) throw new Error(`Malformed path data: "${n2}" must have ${i[h2]} elements and has ${s2.length}: ${e3}`);
        t3.push([n2, ...s2.splice(0, i[h2])]);
      }
      return t3;
    }, []);
  }, "default");
  var g = e((t2) => {
    const e2 = t2.match(h);
    return e2 ? e2.map(Number) : [];
  }, "parseValues");
  var a = class {
    static {
      e(this, "LinearPosition");
    }
    x0;
    x1;
    y0;
    y1;
    command;
    constructor(t2, e2, i2, n2, h2 = "L") {
      this.x0 = t2, this.x1 = e2, this.y0 = i2, this.y1 = n2, this.command = h2;
    }
    getTotalLength = e(() => Math.hypot(this.x1 - this.x0, this.y1 - this.y0), "getTotalLength");
    getPointAtLength = e((t2) => {
      let e2 = t2 / Math.hypot(this.x1 - this.x0, this.y1 - this.y0);
      e2 = Number.isNaN(e2) ? 1 : e2;
      const i2 = (this.x1 - this.x0) * e2, n2 = (this.y1 - this.y0) * e2;
      return { x: this.x0 + i2, y: this.y0 + n2 };
    }, "getPointAtLength");
    getTangentAtLength = e((t2) => {
      const e2 = Math.hypot(this.x1 - this.x0, this.y1 - this.y0);
      return { x: (this.x1 - this.x0) / e2, y: (this.y1 - this.y0) / e2 };
    }, "getTangentAtLength");
    getPropertiesAtLength = e((t2) => {
      const e2 = this.getPointAtLength(t2), i2 = this.getTangentAtLength(t2);
      return { x: e2.x, y: e2.y, tangentX: i2.x, tangentY: i2.y };
    }, "getPropertiesAtLength");
    getDetails = e(() => {
      switch (this.command) {
        case "H":
          return ["H", this.x1];
        case "V":
          return ["V", this.y1];
        case "Z":
          return ["Z"];
        default:
          return ["L", this.x1, this.y1];
      }
    }, "getDetails");
  };
  var r = class {
    static {
      e(this, "Arc");
    }
    x0;
    y0;
    rx;
    ry;
    xAxisRotate;
    LargeArcFlag;
    SweepFlag;
    x1;
    y1;
    length;
    constructor(t2, e2, i2, n2, h2, s2, g2, a2, r2) {
      this.x0 = t2, this.y0 = e2, this.rx = i2, this.ry = n2, this.xAxisRotate = h2, this.LargeArcFlag = s2, this.SweepFlag = g2, this.x1 = a2, this.y1 = r2;
      const c2 = l(300, function(l2) {
        return o({ x: t2, y: e2 }, i2, n2, h2, s2, g2, { x: a2, y: r2 }, l2);
      });
      this.length = c2.arcLength;
    }
    getTotalLength = e(() => this.length, "getTotalLength");
    getPointAtLength = e((t2) => {
      t2 < 0 ? t2 = 0 : t2 > this.length && (t2 = this.length);
      const e2 = o({ x: this.x0, y: this.y0 }, this.rx, this.ry, this.xAxisRotate, this.LargeArcFlag, this.SweepFlag, { x: this.x1, y: this.y1 }, t2 / this.length);
      return { x: e2.x, y: e2.y };
    }, "getPointAtLength");
    getTangentAtLength = e((t2) => {
      t2 < 0 ? t2 = 0 : t2 > this.length && (t2 = this.length);
      const e2 = 0.05, i2 = this.getPointAtLength(t2);
      let n2;
      n2 = t2 < this.length - e2 ? this.getPointAtLength(t2 + e2) : this.getPointAtLength(t2 - e2);
      const h2 = n2.x - i2.x, s2 = n2.y - i2.y, g2 = Math.hypot(h2, s2);
      return t2 < this.length - e2 ? { x: -h2 / g2, y: -s2 / g2 } : { x: h2 / g2, y: s2 / g2 };
    }, "getTangentAtLength");
    getPropertiesAtLength = e((t2) => {
      const e2 = this.getTangentAtLength(t2), i2 = this.getPointAtLength(t2);
      return { x: i2.x, y: i2.y, tangentX: e2.x, tangentY: e2.y };
    }, "getPropertiesAtLength");
    getDetails = e(() => ["A", this.rx, this.ry, this.xAxisRotate, this.LargeArcFlag ? 1 : 0, this.SweepFlag ? 1 : 0, this.x1, this.y1], "getDetails");
  };
  var o = e((t2, e2, i2, n2, h2, s2, g2, a2) => {
    e2 = Math.abs(e2), i2 = Math.abs(i2), n2 = c(n2, 360);
    const r2 = u(n2);
    if (t2.x === g2.x && t2.y === g2.y) return { x: t2.x, y: t2.y, ellipticalArcAngle: 0 };
    if (0 === e2 || 0 === i2) return { x: 0, y: 0, ellipticalArcAngle: 0 };
    const o2 = (t2.x - g2.x) / 2, l2 = (t2.y - g2.y) / 2, x2 = { x: Math.cos(r2) * o2 + Math.sin(r2) * l2, y: -Math.sin(r2) * o2 + Math.cos(r2) * l2 }, y2 = Math.pow(x2.x, 2) / Math.pow(e2, 2) + Math.pow(x2.y, 2) / Math.pow(i2, 2);
    y2 > 1 && (e2 = Math.sqrt(y2) * e2, i2 = Math.sqrt(y2) * i2);
    let L2 = (Math.pow(e2, 2) * Math.pow(i2, 2) - Math.pow(e2, 2) * Math.pow(x2.y, 2) - Math.pow(i2, 2) * Math.pow(x2.x, 2)) / (Math.pow(e2, 2) * Math.pow(x2.y, 2) + Math.pow(i2, 2) * Math.pow(x2.x, 2));
    L2 = L2 < 0 ? 0 : L2;
    const f2 = (h2 !== s2 ? 1 : -1) * Math.sqrt(L2), A2 = f2 * (e2 * x2.y / i2), M2 = f2 * (-i2 * x2.x / e2), P2 = { x: Math.cos(r2) * A2 - Math.sin(r2) * M2 + (t2.x + g2.x) / 2, y: Math.sin(r2) * A2 + Math.cos(r2) * M2 + (t2.y + g2.y) / 2 }, w2 = { x: (x2.x - A2) / e2, y: (x2.y - M2) / i2 }, d2 = p({ x: 1, y: 0 }, w2);
    let T2 = p(w2, { x: (-x2.x - A2) / e2, y: (-x2.y - M2) / i2 });
    !s2 && T2 > 0 ? T2 -= 2 * Math.PI : s2 && T2 < 0 && (T2 += 2 * Math.PI), T2 %= 2 * Math.PI;
    const b2 = d2 + T2 * a2, m2 = e2 * Math.cos(b2), v2 = i2 * Math.sin(b2);
    return { x: Math.cos(r2) * m2 - Math.sin(r2) * v2 + P2.x, y: Math.sin(r2) * m2 + Math.cos(r2) * v2 + P2.y, ellipticalArcStartAngle: d2, ellipticalArcEndAngle: d2 + T2, ellipticalArcAngle: b2, ellipticalArcCenter: P2, resultantRx: e2, resultantRy: i2 };
  }, "pointOnEllipticalArc");
  var l = e((t2, e2) => {
    t2 = t2 ?? 500;
    let i2 = 0;
    const n2 = [], h2 = [];
    let s2, g2 = e2(0);
    for (let a2 = 0; a2 < t2; a2++) {
      const r2 = y(a2 * (1 / t2), 0, 1);
      s2 = e2(r2), i2 += x(g2, s2), h2.push([g2, s2]), n2.push({ t: r2, arcLength: i2 }), g2 = s2;
    }
    return s2 = e2(1), h2.push([g2, s2]), i2 += x(g2, s2), n2.push({ t: 1, arcLength: i2 }), { arcLength: i2, arcLengthMap: n2, approximationLines: h2 };
  }, "approximateArcLengthOfCurve");
  var c = e((t2, e2) => (t2 % e2 + e2) % e2, "mod");
  var u = e((t2) => t2 * (Math.PI / 180), "toRadians");
  var x = e((t2, e2) => Math.hypot(e2.x - t2.x, e2.y - t2.y), "distance");
  var y = e((t2, e2, i2) => Math.min(Math.max(t2, e2), i2), "clamp");
  var p = e((t2, e2) => {
    const i2 = t2.x * e2.x + t2.y * e2.y, n2 = Math.hypot(t2.x, t2.y) * Math.hypot(e2.x, e2.y);
    return (t2.x * e2.y - t2.y * e2.x < 0 ? -1 : 1) * Math.acos(i2 / n2);
  }, "angleBetween");
  var L = [[], [], [-0.5773502691896257, 0.5773502691896258], [0, -0.7745966692414833, 0.7745966692414833], [-0.33998104358485626, 0.33998104358485626, -0.8611363115940526, 0.8611363115940526], [0, -0.5384693101056831, 0.5384693101056831, -0.906179845938664, 0.906179845938664], [0.6612093864662645, -0.6612093864662645, -0.2386191860831969, 0.2386191860831969, -0.932469514203152, 0.932469514203152], [0, 0.4058451513773972, -0.4058451513773972, -0.7415311855993945, 0.7415311855993945, -0.9491079123427585, 0.9491079123427585], [-0.1834346424956498, 0.1834346424956498, -0.525532409916329, 0.525532409916329, -0.7966664774136267, 0.7966664774136267, -0.9602898564975363, 0.9602898564975363], [0, -0.8360311073266358, 0.8360311073266358, -0.9681602395076261, 0.9681602395076261, -0.3242534234038089, 0.3242534234038089, -0.6133714327005904, 0.6133714327005904], [-0.14887433898163122, 0.14887433898163122, -0.4333953941292472, 0.4333953941292472, -0.6794095682990244, 0.6794095682990244, -0.8650633666889845, 0.8650633666889845, -0.9739065285171717, 0.9739065285171717], [0, -0.26954315595234496, 0.26954315595234496, -0.5190961292068118, 0.5190961292068118, -0.7301520055740494, 0.7301520055740494, -0.8870625997680953, 0.8870625997680953, -0.978228658146057, 0.978228658146057], [-0.1252334085114689, 0.1252334085114689, -0.3678314989981802, 0.3678314989981802, -0.5873179542866175, 0.5873179542866175, -0.7699026741943047, 0.7699026741943047, -0.9041172563704749, 0.9041172563704749, -0.9815606342467192, 0.9815606342467192], [0, -0.2304583159551348, 0.2304583159551348, -0.44849275103644687, 0.44849275103644687, -0.6423493394403402, 0.6423493394403402, -0.8015780907333099, 0.8015780907333099, -0.9175983992229779, 0.9175983992229779, -0.9841830547185881, 0.9841830547185881], [-0.10805494870734367, 0.10805494870734367, -0.31911236892788974, 0.31911236892788974, -0.5152486363581541, 0.5152486363581541, -0.6872929048116855, 0.6872929048116855, -0.827201315069765, 0.827201315069765, -0.9284348836635735, 0.9284348836635735, -0.9862838086968123, 0.9862838086968123], [0, -0.20119409399743451, 0.20119409399743451, -0.3941513470775634, 0.3941513470775634, -0.5709721726085388, 0.5709721726085388, -0.7244177313601701, 0.7244177313601701, -0.8482065834104272, 0.8482065834104272, -0.937273392400706, 0.937273392400706, -0.9879925180204854, 0.9879925180204854], [-0.09501250983763744, 0.09501250983763744, -0.2816035507792589, 0.2816035507792589, -0.45801677765722737, 0.45801677765722737, -0.6178762444026438, 0.6178762444026438, -0.755404408355003, 0.755404408355003, -0.8656312023878318, 0.8656312023878318, -0.9445750230732326, 0.9445750230732326, -0.9894009349916499, 0.9894009349916499], [0, -0.17848418149584785, 0.17848418149584785, -0.3512317634538763, 0.3512317634538763, -0.5126905370864769, 0.5126905370864769, -0.6576711592166907, 0.6576711592166907, -0.7815140038968014, 0.7815140038968014, -0.8802391537269859, 0.8802391537269859, -0.9506755217687678, 0.9506755217687678, -0.9905754753144174, 0.9905754753144174], [-0.0847750130417353, 0.0847750130417353, -0.2518862256915055, 0.2518862256915055, -0.41175116146284263, 0.41175116146284263, -0.5597708310739475, 0.5597708310739475, -0.6916870430603532, 0.6916870430603532, -0.8037049589725231, 0.8037049589725231, -0.8926024664975557, 0.8926024664975557, -0.9558239495713977, 0.9558239495713977, -0.9915651684209309, 0.9915651684209309], [0, -0.16035864564022537, 0.16035864564022537, -0.31656409996362983, 0.31656409996362983, -0.46457074137596094, 0.46457074137596094, -0.600545304661681, 0.600545304661681, -0.7209661773352294, 0.7209661773352294, -0.8227146565371428, 0.8227146565371428, -0.9031559036148179, 0.9031559036148179, -0.96020815213483, 0.96020815213483, -0.9924068438435844, 0.9924068438435844], [-0.07652652113349734, 0.07652652113349734, -0.22778585114164507, 0.22778585114164507, -0.37370608871541955, 0.37370608871541955, -0.5108670019508271, 0.5108670019508271, -0.636053680726515, 0.636053680726515, -0.7463319064601508, 0.7463319064601508, -0.8391169718222188, 0.8391169718222188, -0.912234428251326, 0.912234428251326, -0.9639719272779138, 0.9639719272779138, -0.9931285991850949, 0.9931285991850949], [0, -0.1455618541608951, 0.1455618541608951, -0.2880213168024011, 0.2880213168024011, -0.4243421202074388, 0.4243421202074388, -0.5516188358872198, 0.5516188358872198, -0.6671388041974123, 0.6671388041974123, -0.7684399634756779, 0.7684399634756779, -0.8533633645833173, 0.8533633645833173, -0.9200993341504008, 0.9200993341504008, -0.9672268385663063, 0.9672268385663063, -0.9937521706203895, 0.9937521706203895], [-0.06973927331972223, 0.06973927331972223, -0.20786042668822127, 0.20786042668822127, -0.34193582089208424, 0.34193582089208424, -0.469355837986757, 0.469355837986757, -0.5876404035069116, 0.5876404035069116, -0.6944872631866827, 0.6944872631866827, -0.7878168059792081, 0.7878168059792081, -0.8658125777203002, 0.8658125777203002, -0.926956772187174, 0.926956772187174, -0.9700604978354287, 0.9700604978354287, -0.9942945854823992, 0.9942945854823992], [0, -0.1332568242984661, 0.1332568242984661, -0.26413568097034495, 0.26413568097034495, -0.3903010380302908, 0.3903010380302908, -0.5095014778460075, 0.5095014778460075, -0.6196098757636461, 0.6196098757636461, -0.7186613631319502, 0.7186613631319502, -0.8048884016188399, 0.8048884016188399, -0.8767523582704416, 0.8767523582704416, -0.9329710868260161, 0.9329710868260161, -0.9725424712181152, 0.9725424712181152, -0.9947693349975522, 0.9947693349975522], [-0.06405689286260563, 0.06405689286260563, -0.1911188674736163, 0.1911188674736163, -0.3150426796961634, 0.3150426796961634, -0.4337935076260451, 0.4337935076260451, -0.5454214713888396, 0.5454214713888396, -0.6480936519369755, 0.6480936519369755, -0.7401241915785544, 0.7401241915785544, -0.820001985973903, 0.820001985973903, -0.8864155270044011, 0.8864155270044011, -0.9382745520027328, 0.9382745520027328, -0.9747285559713095, 0.9747285559713095, -0.9951872199970213, 0.9951872199970213]];
  var f = [[], [], [1, 1], [0.8888888888888888, 0.5555555555555556, 0.5555555555555556], [0.6521451548625461, 0.6521451548625461, 0.34785484513745385, 0.34785484513745385], [0.5688888888888889, 0.47862867049936647, 0.47862867049936647, 0.23692688505618908, 0.23692688505618908], [0.3607615730481386, 0.3607615730481386, 0.46791393457269104, 0.46791393457269104, 0.17132449237917036, 0.17132449237917036], [0.4179591836734694, 0.3818300505051189, 0.3818300505051189, 0.27970539148927664, 0.27970539148927664, 0.1294849661688697, 0.1294849661688697], [0.362683783378362, 0.362683783378362, 0.31370664587788727, 0.31370664587788727, 0.22238103445337448, 0.22238103445337448, 0.10122853629037626, 0.10122853629037626], [0.3302393550012598, 0.1806481606948574, 0.1806481606948574, 0.08127438836157441, 0.08127438836157441, 0.31234707704000286, 0.31234707704000286, 0.26061069640293544, 0.26061069640293544], [0.29552422471475287, 0.29552422471475287, 0.26926671930999635, 0.26926671930999635, 0.21908636251598204, 0.21908636251598204, 0.1494513491505806, 0.1494513491505806, 0.06667134430868814, 0.06667134430868814], [0.2729250867779006, 0.26280454451024665, 0.26280454451024665, 0.23319376459199048, 0.23319376459199048, 0.18629021092773426, 0.18629021092773426, 0.1255803694649046, 0.1255803694649046, 0.05566856711617366, 0.05566856711617366], [0.24914704581340277, 0.24914704581340277, 0.2334925365383548, 0.2334925365383548, 0.20316742672306592, 0.20316742672306592, 0.16007832854334622, 0.16007832854334622, 0.10693932599531843, 0.10693932599531843, 0.04717533638651183, 0.04717533638651183], [0.2325515532308739, 0.22628318026289723, 0.22628318026289723, 0.2078160475368885, 0.2078160475368885, 0.17814598076194574, 0.17814598076194574, 0.13887351021978725, 0.13887351021978725, 0.09212149983772845, 0.09212149983772845, 0.04048400476531588, 0.04048400476531588], [0.2152638534631578, 0.2152638534631578, 0.2051984637212956, 0.2051984637212956, 0.18553839747793782, 0.18553839747793782, 0.15720316715819355, 0.15720316715819355, 0.12151857068790319, 0.12151857068790319, 0.08015808715976021, 0.08015808715976021, 0.03511946033175186, 0.03511946033175186], [0.2025782419255613, 0.19843148532711158, 0.19843148532711158, 0.1861610000155622, 0.1861610000155622, 0.16626920581699392, 0.16626920581699392, 0.13957067792615432, 0.13957067792615432, 0.10715922046717194, 0.10715922046717194, 0.07036604748810812, 0.07036604748810812, 0.03075324199611727, 0.03075324199611727], [0.1894506104550685, 0.1894506104550685, 0.18260341504492358, 0.18260341504492358, 0.16915651939500254, 0.16915651939500254, 0.14959598881657674, 0.14959598881657674, 0.12462897125553388, 0.12462897125553388, 0.09515851168249279, 0.09515851168249279, 0.062253523938647894, 0.062253523938647894, 0.027152459411754096, 0.027152459411754096], [0.17944647035620653, 0.17656270536699264, 0.17656270536699264, 0.16800410215645004, 0.16800410215645004, 0.15404576107681028, 0.15404576107681028, 0.13513636846852548, 0.13513636846852548, 0.11188384719340397, 0.11188384719340397, 0.08503614831717918, 0.08503614831717918, 0.0554595293739872, 0.0554595293739872, 0.02414830286854793, 0.02414830286854793], [0.1691423829631436, 0.1691423829631436, 0.16427648374583273, 0.16427648374583273, 0.15468467512626524, 0.15468467512626524, 0.14064291467065065, 0.14064291467065065, 0.12255520671147846, 0.12255520671147846, 0.10094204410628717, 0.10094204410628717, 0.07642573025488905, 0.07642573025488905, 0.0497145488949698, 0.0497145488949698, 0.02161601352648331, 0.02161601352648331], [0.1610544498487837, 0.15896884339395434, 0.15896884339395434, 0.15276604206585967, 0.15276604206585967, 0.1426067021736066, 0.1426067021736066, 0.12875396253933621, 0.12875396253933621, 0.11156664554733399, 0.11156664554733399, 0.09149002162245, 0.09149002162245, 0.06904454273764123, 0.06904454273764123, 0.0448142267656996, 0.0448142267656996, 0.019461788229726478, 0.019461788229726478], [0.15275338713072584, 0.15275338713072584, 0.14917298647260374, 0.14917298647260374, 0.14209610931838204, 0.14209610931838204, 0.13168863844917664, 0.13168863844917664, 0.11819453196151841, 0.11819453196151841, 0.10193011981724044, 0.10193011981724044, 0.08327674157670475, 0.08327674157670475, 0.06267204833410907, 0.06267204833410907, 0.04060142980038694, 0.04060142980038694, 0.017614007139152118, 0.017614007139152118], [0.14608113364969041, 0.14452440398997005, 0.14452440398997005, 0.13988739479107315, 0.13988739479107315, 0.13226893863333747, 0.13226893863333747, 0.12183141605372853, 0.12183141605372853, 0.10879729916714838, 0.10879729916714838, 0.09344442345603386, 0.09344442345603386, 0.0761001136283793, 0.0761001136283793, 0.057134425426857205, 0.057134425426857205, 0.036953789770852494, 0.036953789770852494, 0.016017228257774335, 0.016017228257774335], [0.13925187285563198, 0.13925187285563198, 0.13654149834601517, 0.13654149834601517, 0.13117350478706238, 0.13117350478706238, 0.12325237681051242, 0.12325237681051242, 0.11293229608053922, 0.11293229608053922, 0.10041414444288096, 0.10041414444288096, 0.08594160621706773, 0.08594160621706773, 0.06979646842452049, 0.06979646842452049, 0.052293335152683286, 0.052293335152683286, 0.03377490158481415, 0.03377490158481415, 0.0146279952982722, 0.0146279952982722], [0.13365457218610619, 0.1324620394046966, 0.1324620394046966, 0.12890572218808216, 0.12890572218808216, 0.12304908430672953, 0.12304908430672953, 0.11499664022241136, 0.11499664022241136, 0.10489209146454141, 0.10489209146454141, 0.09291576606003515, 0.09291576606003515, 0.07928141177671895, 0.07928141177671895, 0.06423242140852585, 0.06423242140852585, 0.04803767173108467, 0.04803767173108467, 0.030988005856979445, 0.030988005856979445, 0.013411859487141771, 0.013411859487141771], [0.12793819534675216, 0.12793819534675216, 0.1258374563468283, 0.1258374563468283, 0.12167047292780339, 0.12167047292780339, 0.1155056680537256, 0.1155056680537256, 0.10744427011596563, 0.10744427011596563, 0.09761865210411388, 0.09761865210411388, 0.08619016153195327, 0.08619016153195327, 0.0733464814110803, 0.0733464814110803, 0.05929858491543678, 0.05929858491543678, 0.04427743881741981, 0.04427743881741981, 0.028531388628933663, 0.028531388628933663, 0.0123412297999872, 0.0123412297999872]];
  var A = [[1], [1, 1], [1, 2, 1], [1, 3, 3, 1]];
  var M = e((t2, e2, i2) => ({ x: (1 - i2) * (1 - i2) * (1 - i2) * t2[0] + 3 * (1 - i2) * (1 - i2) * i2 * t2[1] + 3 * (1 - i2) * i2 * i2 * t2[2] + i2 * i2 * i2 * t2[3], y: (1 - i2) * (1 - i2) * (1 - i2) * e2[0] + 3 * (1 - i2) * (1 - i2) * i2 * e2[1] + 3 * (1 - i2) * i2 * i2 * e2[2] + i2 * i2 * i2 * e2[3] }), "cubicPoint");
  var P = e((t2, e2, i2) => d([3 * (t2[1] - t2[0]), 3 * (t2[2] - t2[1]), 3 * (t2[3] - t2[2])], [3 * (e2[1] - e2[0]), 3 * (e2[2] - e2[1]), 3 * (e2[3] - e2[2])], i2), "cubicDerivative");
  var w = e((t2, e2, i2) => {
    let n2, h2;
    const s2 = i2 / 2;
    n2 = 0;
    for (let i3 = 0; i3 < 20; i3++) h2 = s2 * L[20][i3] + s2, n2 += f[20][i3] * m(t2, e2, h2);
    return s2 * n2;
  }, "getCubicArcLength");
  var d = e((t2, e2, i2) => ({ x: (1 - i2) * (1 - i2) * t2[0] + 2 * (1 - i2) * i2 * t2[1] + i2 * i2 * t2[2], y: (1 - i2) * (1 - i2) * e2[0] + 2 * (1 - i2) * i2 * e2[1] + i2 * i2 * e2[2] }), "quadraticPoint");
  var T = e((t2, e2, i2) => {
    const n2 = t2[0] - 2 * t2[1] + t2[2], h2 = e2[0] - 2 * e2[1] + e2[2], s2 = 2 * t2[1] - 2 * t2[0], g2 = 2 * e2[1] - 2 * e2[0], a2 = 4 * (n2 * n2 + h2 * h2), r2 = 4 * (n2 * s2 + h2 * g2), o2 = s2 * s2 + g2 * g2;
    if (0 === a2) return i2 * Math.hypot(t2[2] - t2[0], e2[2] - e2[0]);
    const l2 = r2 / (2 * a2), c2 = i2 + l2, u2 = o2 / a2 - l2 * l2, x2 = c2 * c2 + u2 > 0 ? Math.sqrt(c2 * c2 + u2) : 0, y2 = l2 * l2 + u2 > 0 ? Math.sqrt(l2 * l2 + u2) : 0, p2 = l2 + Math.sqrt(l2 * l2 + u2) !== 0 && (c2 + x2) / (l2 + y2) !== 0 ? u2 * Math.log(Math.abs((c2 + x2) / (l2 + y2))) : 0;
    return Math.sqrt(a2) / 2 * (c2 * x2 - l2 * y2 + p2);
  }, "getQuadraticArcLength");
  var b = e((t2, e2, i2) => ({ x: 2 * (1 - i2) * (t2[1] - t2[0]) + 2 * i2 * (t2[2] - t2[1]), y: 2 * (1 - i2) * (e2[1] - e2[0]) + 2 * i2 * (e2[2] - e2[1]) }), "quadraticDerivative");
  function m(t2, e2, i2) {
    const n2 = v(1, i2, t2), h2 = v(1, i2, e2), s2 = n2 * n2 + h2 * h2;
    return Math.sqrt(s2);
  }
  e(m, "BFunc");
  var v = e((t2, e2, i2) => {
    const n2 = i2.length - 1;
    let h2, s2;
    if (0 === n2) return 0;
    if (0 === t2) {
      s2 = 0;
      for (let t3 = 0; t3 <= n2; t3++) s2 += A[n2][t3] * Math.pow(1 - e2, n2 - t3) * Math.pow(e2, t3) * i2[t3];
      return s2;
    }
    h2 = new Array(n2);
    for (let t3 = 0; t3 < n2; t3++) h2[t3] = n2 * (i2[t3 + 1] - i2[t3]);
    return v(t2 - 1, e2, h2);
  }, "getDerivative");
  var D = e((t2, e2, i2) => {
    let n2 = 1, h2 = t2 / e2, s2 = (t2 - i2(h2)) / e2, g2 = 0;
    for (; n2 > 1e-3; ) {
      const a2 = i2(h2 + s2), r2 = Math.abs(t2 - a2) / e2;
      if (r2 < n2) n2 = r2, h2 += s2;
      else {
        const g3 = i2(h2 - s2), a3 = Math.abs(t2 - g3) / e2;
        a3 < n2 ? (n2 = a3, h2 -= s2) : s2 /= 2;
      }
      if (g2++, g2 > 500) break;
    }
    return h2;
  }, "t2length");
  var _ = class {
    static {
      e(this, "Bezier");
    }
    a;
    b;
    c;
    d;
    length;
    isCubic;
    getArcLength;
    getPoint;
    getDerivative;
    constructor(t2, e2, i2, n2, h2, s2, g2, a2) {
      this.a = { x: t2, y: e2 }, this.b = { x: i2, y: n2 }, this.c = { x: h2, y: s2 }, void 0 !== g2 && void 0 !== a2 ? (this.isCubic = true, this.getArcLength = w, this.getPoint = M, this.getDerivative = P, this.d = { x: g2, y: a2 }) : (this.isCubic = false, this.getArcLength = T, this.getPoint = d, this.getDerivative = b, this.d = { x: 0, y: 0 }), this.length = this.getArcLength([this.a.x, this.b.x, this.c.x, this.d.x], [this.a.y, this.b.y, this.c.y, this.d.y], 1);
    }
    normalizeTangent = e((t2) => {
      const e2 = Math.hypot(t2.x, t2.y);
      return e2 > 0 ? { x: t2.x / e2, y: t2.y / e2 } : { x: 0, y: 0 };
    }, "normalizeTangent");
    getTotalLength = e(() => this.length, "getTotalLength");
    getPointAtLength = e((t2) => {
      const e2 = [this.a.x, this.b.x, this.c.x, this.d.x], i2 = [this.a.y, this.b.y, this.c.y, this.d.y], n2 = D(t2, this.length, (t3) => this.getArcLength(e2, i2, t3));
      return this.getPoint(e2, i2, n2);
    }, "getPointAtLength");
    getTangentAtLength = e((t2) => {
      const e2 = [this.a.x, this.b.x, this.c.x, this.d.x], i2 = [this.a.y, this.b.y, this.c.y, this.d.y], n2 = D(t2, this.length, (t3) => this.getArcLength(e2, i2, t3)), h2 = this.getDerivative(e2, i2, n2);
      return this.normalizeTangent(h2);
    }, "getTangentAtLength");
    getPropertiesAtLength = e((t2) => {
      const e2 = [this.a.x, this.b.x, this.c.x, this.d.x], i2 = [this.a.y, this.b.y, this.c.y, this.d.y], n2 = D(t2, this.length, (t3) => this.getArcLength(e2, i2, t3)), h2 = this.getDerivative(e2, i2, n2), s2 = this.normalizeTangent(h2), g2 = this.getPoint(e2, i2, n2);
      return { x: g2.x, y: g2.y, tangentX: s2.x, tangentY: s2.y };
    }, "getPropertiesAtLength");
    getC = e(() => this.c, "getC");
    getD = e(() => this.d, "getD");
    getDetails = e(() => this.isCubic ? ["C", this.b.x, this.b.y, this.c.x, this.c.y, this.d.x, this.d.y] : ["Q", this.b.x, this.b.y, this.c.x, this.c.y], "getDetails");
  };
  var C = class {
    static {
      e(this, "SVGPathProperties");
    }
    length = 0;
    partial_lengths = [];
    functions = [];
    initial_point = null;
    constructor(t2) {
      const e2 = Array.isArray(t2) ? t2 : s(t2);
      let i2, n2 = [0, 0], h2 = [0, 0], g2 = [0, 0];
      for (let t3 = 0; t3 < e2.length; t3++) {
        if ("M" === e2[t3][0]) n2 = [e2[t3][1], e2[t3][2]], g2 = [n2[0], n2[1]], this.functions.push(null), 0 === t3 && (this.initial_point = { x: e2[t3][1], y: e2[t3][2] });
        else if ("m" === e2[t3][0]) n2 = [e2[t3][1] + n2[0], e2[t3][2] + n2[1]], g2 = [n2[0], n2[1]], this.functions.push(null);
        else if ("L" === e2[t3][0]) this.length += Math.hypot(n2[0] - e2[t3][1], n2[1] - e2[t3][2]), this.functions.push(new a(n2[0], e2[t3][1], n2[1], e2[t3][2], "L")), n2 = [e2[t3][1], e2[t3][2]];
        else if ("l" === e2[t3][0]) this.length += Math.hypot(e2[t3][1], e2[t3][2]), this.functions.push(new a(n2[0], e2[t3][1] + n2[0], n2[1], e2[t3][2] + n2[1], "L")), n2 = [e2[t3][1] + n2[0], e2[t3][2] + n2[1]];
        else if ("H" === e2[t3][0]) this.length += Math.abs(n2[0] - e2[t3][1]), this.functions.push(new a(n2[0], e2[t3][1], n2[1], n2[1], "H")), n2[0] = e2[t3][1];
        else if ("h" === e2[t3][0]) this.length += Math.abs(e2[t3][1]), this.functions.push(new a(n2[0], n2[0] + e2[t3][1], n2[1], n2[1], "H")), n2[0] = e2[t3][1] + n2[0];
        else if ("V" === e2[t3][0]) this.length += Math.abs(n2[1] - e2[t3][1]), this.functions.push(new a(n2[0], n2[0], n2[1], e2[t3][1], "V")), n2[1] = e2[t3][1];
        else if ("v" === e2[t3][0]) this.length += Math.abs(e2[t3][1]), this.functions.push(new a(n2[0], n2[0], n2[1], n2[1] + e2[t3][1], "V")), n2[1] = e2[t3][1] + n2[1];
        else if ("z" === e2[t3][0] || "Z" === e2[t3][0]) this.length += Math.hypot(g2[0] - n2[0], g2[1] - n2[1]), this.functions.push(new a(n2[0], g2[0], n2[1], g2[1], "Z")), n2 = [g2[0], g2[1]];
        else if ("C" === e2[t3][0]) i2 = new _(n2[0], n2[1], e2[t3][1], e2[t3][2], e2[t3][3], e2[t3][4], e2[t3][5], e2[t3][6]), this.length += i2.getTotalLength(), n2 = [e2[t3][5], e2[t3][6]], this.functions.push(i2);
        else if ("c" === e2[t3][0]) i2 = new _(n2[0], n2[1], n2[0] + e2[t3][1], n2[1] + e2[t3][2], n2[0] + e2[t3][3], n2[1] + e2[t3][4], n2[0] + e2[t3][5], n2[1] + e2[t3][6]), i2.getTotalLength() > 0 ? (this.length += i2.getTotalLength(), this.functions.push(i2), n2 = [e2[t3][5] + n2[0], e2[t3][6] + n2[1]]) : this.functions.push(new a(n2[0], n2[0], n2[1], n2[1]));
        else if ("S" === e2[t3][0]) {
          if (t3 > 0 && ["C", "c", "S", "s"].indexOf(e2[t3 - 1][0]) > -1) {
            if (i2) {
              const h3 = i2.getC();
              i2 = new _(n2[0], n2[1], 2 * n2[0] - h3.x, 2 * n2[1] - h3.y, e2[t3][1], e2[t3][2], e2[t3][3], e2[t3][4]);
            }
          } else i2 = new _(n2[0], n2[1], n2[0], n2[1], e2[t3][1], e2[t3][2], e2[t3][3], e2[t3][4]);
          i2 && (this.length += i2.getTotalLength(), n2 = [e2[t3][3], e2[t3][4]], this.functions.push(i2));
        } else if ("s" === e2[t3][0]) {
          if (t3 > 0 && ["C", "c", "S", "s"].indexOf(e2[t3 - 1][0]) > -1) {
            if (i2) {
              const h3 = i2.getC(), s2 = i2.getD();
              i2 = new _(n2[0], n2[1], n2[0] + s2.x - h3.x, n2[1] + s2.y - h3.y, n2[0] + e2[t3][1], n2[1] + e2[t3][2], n2[0] + e2[t3][3], n2[1] + e2[t3][4]);
            }
          } else i2 = new _(n2[0], n2[1], n2[0], n2[1], n2[0] + e2[t3][1], n2[1] + e2[t3][2], n2[0] + e2[t3][3], n2[1] + e2[t3][4]);
          i2 && (this.length += i2.getTotalLength(), n2 = [e2[t3][3] + n2[0], e2[t3][4] + n2[1]], this.functions.push(i2));
        } else if ("Q" === e2[t3][0]) {
          if (n2[0] === e2[t3][1] && n2[1] === e2[t3][2]) {
            const i3 = new a(e2[t3][1], e2[t3][3], e2[t3][2], e2[t3][4], "L");
            this.length += i3.getTotalLength(), this.functions.push(i3);
          } else i2 = new _(n2[0], n2[1], e2[t3][1], e2[t3][2], e2[t3][3], e2[t3][4], void 0, void 0), this.length += i2.getTotalLength(), this.functions.push(i2);
          n2 = [e2[t3][3], e2[t3][4]], h2 = [e2[t3][1], e2[t3][2]];
        } else if ("q" === e2[t3][0]) {
          if (0 !== e2[t3][1] || 0 !== e2[t3][2]) i2 = new _(n2[0], n2[1], n2[0] + e2[t3][1], n2[1] + e2[t3][2], n2[0] + e2[t3][3], n2[1] + e2[t3][4], void 0, void 0), this.length += i2.getTotalLength(), this.functions.push(i2);
          else {
            const i3 = new a(n2[0] + e2[t3][1], n2[0] + e2[t3][3], n2[1] + e2[t3][2], n2[1] + e2[t3][4], "L");
            this.length += i3.getTotalLength(), this.functions.push(i3);
          }
          h2 = [n2[0] + e2[t3][1], n2[1] + e2[t3][2]], n2 = [e2[t3][3] + n2[0], e2[t3][4] + n2[1]];
        } else if ("T" === e2[t3][0]) {
          if (t3 > 0 && ["Q", "q", "T", "t"].indexOf(e2[t3 - 1][0]) > -1) i2 = new _(n2[0], n2[1], 2 * n2[0] - h2[0], 2 * n2[1] - h2[1], e2[t3][1], e2[t3][2], void 0, void 0), this.functions.push(i2), this.length += i2.getTotalLength();
          else {
            const i3 = new a(n2[0], e2[t3][1], n2[1], e2[t3][2], "L");
            this.functions.push(i3), this.length += i3.getTotalLength();
          }
          h2 = [2 * n2[0] - h2[0], 2 * n2[1] - h2[1]], n2 = [e2[t3][1], e2[t3][2]];
        } else if ("t" === e2[t3][0]) {
          if (t3 > 0 && ["Q", "q", "T", "t"].indexOf(e2[t3 - 1][0]) > -1) i2 = new _(n2[0], n2[1], 2 * n2[0] - h2[0], 2 * n2[1] - h2[1], n2[0] + e2[t3][1], n2[1] + e2[t3][2], void 0, void 0), this.length += i2.getTotalLength(), this.functions.push(i2);
          else {
            const i3 = new a(n2[0], n2[0] + e2[t3][1], n2[1], n2[1] + e2[t3][2], "L");
            this.length += i3.getTotalLength(), this.functions.push(i3);
          }
          h2 = [2 * n2[0] - h2[0], 2 * n2[1] - h2[1]], n2 = [e2[t3][1] + n2[0], e2[t3][2] + n2[1]];
        } else if ("A" === e2[t3][0]) {
          const i3 = new r(n2[0], n2[1], e2[t3][1], e2[t3][2], e2[t3][3], 1 === e2[t3][4], 1 === e2[t3][5], e2[t3][6], e2[t3][7]);
          this.length += i3.getTotalLength(), n2 = [e2[t3][6], e2[t3][7]], this.functions.push(i3);
        } else if ("a" === e2[t3][0]) {
          const i3 = new r(n2[0], n2[1], e2[t3][1], e2[t3][2], e2[t3][3], 1 === e2[t3][4], 1 === e2[t3][5], n2[0] + e2[t3][6], n2[1] + e2[t3][7]);
          this.length += i3.getTotalLength(), n2 = [n2[0] + e2[t3][6], n2[1] + e2[t3][7]], this.functions.push(i3);
        }
        this.partial_lengths.push(this.length);
      }
    }
    getPartAtLength = e((t2) => {
      t2 < 0 ? t2 = 0 : t2 > this.length && (t2 = this.length);
      let e2 = this.partial_lengths.length - 1;
      for (; this.partial_lengths[e2] >= t2 && e2 > 0; ) e2--;
      return e2++, { fraction: t2 - this.partial_lengths[e2 - 1], i: e2 };
    }, "getPartAtLength");
    getTotalLength = e(() => this.length, "getTotalLength");
    getPointAtLength = e((t2) => {
      const e2 = this.getPartAtLength(t2), i2 = this.functions[e2.i];
      if (i2) return i2.getPointAtLength(e2.fraction);
      if (this.initial_point) return this.initial_point;
      throw new Error("Wrong function at this part.");
    }, "getPointAtLength");
    getTangentAtLength = e((t2) => {
      const e2 = this.getPartAtLength(t2), i2 = this.functions[e2.i];
      if (i2) return i2.getTangentAtLength(e2.fraction);
      if (this.initial_point) return { x: 0, y: 0 };
      throw new Error("Wrong function at this part.");
    }, "getTangentAtLength");
    getPropertiesAtLength = e((t2) => {
      const e2 = this.getPartAtLength(t2), i2 = this.functions[e2.i];
      if (i2) return i2.getPropertiesAtLength(e2.fraction);
      if (this.initial_point) return { x: this.initial_point.x, y: this.initial_point.y, tangentX: 0, tangentY: 0 };
      throw new Error("Wrong function at this part.");
    }, "getPropertiesAtLength");
    getParts = e(() => {
      const t2 = [];
      for (let e2 = 0; e2 < this.functions.length; e2++) if (null !== this.functions[e2]) {
        this.functions[e2] = this.functions[e2];
        const i2 = { start: this.functions[e2].getPointAtLength(0), end: this.functions[e2].getPointAtLength(this.partial_lengths[e2] - this.partial_lengths[e2 - 1]), length: this.partial_lengths[e2] - this.partial_lengths[e2 - 1], getPointAtLength: this.functions[e2].getPointAtLength, getTangentAtLength: this.functions[e2].getTangentAtLength, getPropertiesAtLength: this.functions[e2].getPropertiesAtLength, details: this.functions[e2].getDetails() };
        t2.push(i2);
      }
      return t2;
    }, "getParts");
  };
  var q = class {
    static {
      e(this, "_svgPathProperties");
    }
    inst;
    constructor(t2) {
      if (this.inst = new C(t2), !(this instanceof q)) return new q(t2);
    }
    getTotalLength = e(() => this.inst.getTotalLength(), "getTotalLength");
    getPointAtLength = e((t2) => this.inst.getPointAtLength(t2), "getPointAtLength");
    getTangentAtLength = e((t2) => this.inst.getTangentAtLength(t2), "getTangentAtLength");
    getPropertiesAtLength = e((t2) => this.inst.getPropertiesAtLength(t2), "getPropertiesAtLength");
    getParts = e(() => this.inst.getParts(), "getParts");
  };

  // src/svg.ts
  var import_svgpath = __toESM(require_svgpath2(), 1);

  // src/errors.ts
  var INVALID_INPUT = `All shapes must be supplied as arrays of [x, y] points or an SVG path string (https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute/d).
Example valid ways of supplying a shape would be:
[[0, 0], [10, 0], [10, 10]]
"M0,0 L10,0 L10,10Z"
`;
  var INVALID_INPUT_ALL = `flubber.all() expects two arrays of equal length as arguments. Each element in both arrays should be an array of [x, y] points or an SVG path string (https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute/d).`;
  var INVALID_PATH_STRING = `Invalid SVG path string supplied.
Path string reference: https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute/d
`;

  // src/svg.ts
  var svgPathFactory = import_svgpath.default.default ?? import_svgpath.default;
  var SvgPathProperties = (() => {
    const mod = main_exports;
    const candidate = mod.svgPathProperties ?? (typeof mod.default === "function" ? mod.default : void 0) ?? (mod.default && typeof mod.default === "object" ? mod.default.svgPathProperties : void 0) ?? (typeof main_exports === "function" ? main_exports : void 0);
    if (typeof candidate !== "function") {
      throw new Error("Unable to resolve svg-path-properties module");
    }
    return candidate;
  })();
  function parse(str) {
    return svgPathFactory(str).abs();
  }
  function split(parsed) {
    return parsed.toString().split("M").map((d2, i2) => {
      d2 = d2.trim();
      return i2 && d2 ? `M${d2}` : d2;
    }).filter((d2) => Boolean(d2));
  }
  function toPathString(ring, precision, closed = true) {
    if (!ring?.length) return "";
    if (precision !== void 0 && precision !== null && isFiniteNumber(precision)) {
      const p2 = Math.max(0, Math.min(16, Math.floor(precision)));
      const factor = 10 ** p2;
      let out = "M";
      for (let i2 = 0; i2 < ring.length; i2++) {
        const pt = ring[i2];
        const x2 = p2 === 0 ? Math.round(pt[0]) : Math.round(pt[0] * factor) / factor;
        const y2 = p2 === 0 ? Math.round(pt[1]) : Math.round(pt[1] * factor) / factor;
        out += `${x2},${y2}`;
        if (i2 < ring.length - 1) out += "L";
      }
      if (closed) out += "Z";
      return out;
    }
    return `M${ring.join("L")}${closed ? "Z" : ""}`;
  }
  function splitPathString(str) {
    return split(parse(str));
  }
  function pathStringToRing(str, maxSegmentLength) {
    const parsed = parse(str);
    const result = exactRing(parsed) || approximateRing(parsed, maxSegmentLength);
    if (!result) {
      throw new TypeError(INVALID_INPUT);
    }
    return result;
  }
  function exactRing(parsed) {
    const segments = parsed.segments || [];
    const ring = [];
    if (!segments.length || segments[0][0] !== "M") {
      return false;
    }
    for (let i2 = 0; i2 < segments.length; i2++) {
      const [command, x2, y2] = segments[i2];
      if (command === "M" && i2 || command === "Z") {
        break;
      } else if (command === "M" || command === "L") {
        ring.push([x2, y2]);
      } else if (command === "H") {
        ring.push([x2, ring[ring.length - 1][1]]);
      } else if (command === "V") {
        ring.push([ring[ring.length - 1][0], x2]);
      } else {
        return false;
      }
    }
    return ring.length ? { ring } : false;
  }
  function approximateRing(parsed, maxSegmentLength) {
    const ringPath = split(parsed)[0];
    const ring = [];
    let numPoints = 3;
    if (!ringPath) {
      throw new TypeError(INVALID_INPUT);
    }
    const m2 = measure(ringPath);
    const len = m2.getTotalLength();
    if (maxSegmentLength && isFiniteNumber(maxSegmentLength) && maxSegmentLength > 0) {
      numPoints = Math.max(numPoints, Math.ceil(len / maxSegmentLength));
      if (numPoints > 1e5) {
        numPoints = 1e5;
      }
    }
    for (let i2 = 0; i2 < numPoints; i2++) {
      const p2 = m2.getPointAtLength(len * i2 / numPoints);
      if (Array.isArray(p2)) {
        ring.push([p2[0], p2[1]]);
      } else {
        ring.push([p2.x, p2.y]);
      }
    }
    return {
      ring,
      skipBisect: true
    };
  }
  function measure(d2) {
    if (typeof window !== "undefined" && window && window.document && typeof window.document.createElementNS === "function") {
      try {
        const path = window.document.createElementNS(
          "http://www.w3.org/2000/svg",
          "path"
        );
        path.setAttributeNS(null, "d", d2);
        if (typeof path.getTotalLength === "function") {
          const testLen = path.getTotalLength();
          if (isFiniteNumber(testLen)) {
            return path;
          }
        }
      } catch {
      }
    }
    return new SvgPathProperties(d2);
  }

  // src/math.ts
  function distance(a2, b2) {
    const dx = a2[0] - b2[0];
    const dy = a2[1] - b2[1];
    return Math.sqrt(dx * dx + dy * dy);
  }
  function pointAlong(a2, b2, pct) {
    return [a2[0] + (b2[0] - a2[0]) * pct, a2[1] + (b2[1] - a2[1]) * pct];
  }
  function samePoint(a2, b2) {
    return distance(a2, b2) < 1e-9;
  }
  function interpolatePoints(a2, b2, string, precision) {
    const len = a2.length;
    const fromX = new Float64Array(len);
    const fromY = new Float64Array(len);
    const dx = new Float64Array(len);
    const dy = new Float64Array(len);
    for (let i2 = 0; i2 < len; i2++) {
      const start = a2[i2];
      const end = b2[i2];
      fromX[i2] = start[0];
      fromY[i2] = start[1];
      dx[i2] = end[0] - start[0];
      dy[i2] = end[1] - start[1];
    }
    return (t2) => {
      const values = new Array(len);
      for (let i2 = 0; i2 < len; i2++) {
        values[i2] = [fromX[i2] + t2 * dx[i2], fromY[i2] + t2 * dy[i2]];
      }
      return string ? toPathString(values, precision) : values;
    };
  }
  function interpolatePoint(a2, b2) {
    return (t2) => [
      a2[0] + t2 * (b2[0] - a2[0]),
      a2[1] + t2 * (b2[1] - a2[1])
    ];
  }
  function isFiniteNumber(number) {
    return typeof number === "number" && Number.isFinite(number);
  }
  function polygonCentroid(polygon) {
    if (!polygon?.length) return [0, 0];
    return nonZeroArea(polygon) ? centroid_default(polygon) : [
      (polygon[0][0] + polygon[polygon.length - 1][0]) / 2,
      (polygon[0][1] + polygon[polygon.length - 1][1]) / 2
    ];
  }
  function nonZeroArea(polygon) {
    for (let i2 = 0; i2 < polygon.length - 2; i2++) {
      const a2 = polygon[i2];
      const b2 = polygon[i2 + 1];
      const c2 = polygon[i2 + 2];
      if (a2[0] * (b2[1] - c2[1]) + b2[0] * (c2[1] - a2[1]) + c2[0] * (a2[1] - b2[1]) !== 0) {
        return true;
      }
    }
    return false;
  }

  // src/add.ts
  function addPoints(ring, numPoints) {
    if (!ring || ring.length === 0 || !numPoints || numPoints <= 0 || !isFiniteNumber(numPoints)) {
      return;
    }
    const desiredLength = ring.length + Math.floor(numPoints);
    const polyLen = length_default(ring);
    if (!polyLen || polyLen <= 0 || !isFiniteNumber(polyLen)) {
      const padPoint = ring[0] ? [ring[0][0], ring[0][1]] : [0, 0];
      while (ring.length < desiredLength) {
        ring.push([padPoint[0], padPoint[1]]);
      }
      return;
    }
    const step = polyLen / numPoints;
    let i2 = 0;
    let cursor = 0;
    let insertAt = step / 2;
    while (ring.length < desiredLength && i2 < ring.length) {
      const a2 = ring[i2];
      const b2 = ring[(i2 + 1) % ring.length];
      const segment = distance(a2, b2);
      if (insertAt <= cursor + segment) {
        ring.splice(
          i2 + 1,
          0,
          segment ? pointAlong(a2, b2, (insertAt - cursor) / segment) : [a2[0], a2[1]]
        );
        insertAt += step;
        continue;
      }
      cursor += segment;
      i2++;
    }
  }
  function bisect(ring, maxSegmentLength = Infinity) {
    if (!ring || ring.length === 0 || !maxSegmentLength || maxSegmentLength <= 0 || !isFiniteNumber(maxSegmentLength) || maxSegmentLength === Infinity) {
      return;
    }
    for (let i2 = 0; i2 < ring.length; i2++) {
      const a2 = ring[i2];
      let b2 = i2 === ring.length - 1 ? ring[0] : ring[i2 + 1];
      let safetyCount = 0;
      while (distance(a2, b2) > maxSegmentLength && safetyCount < 1e3) {
        b2 = pointAlong(a2, b2, 0.5);
        ring.splice(i2 + 1, 0, b2);
        safetyCount++;
      }
    }
  }

  // src/normalize.ts
  function normalizeRing(ring, maxSegmentLength) {
    let points;
    let skipBisect = false;
    if (typeof ring === "string") {
      const converted = pathStringToRing(ring, maxSegmentLength);
      points = converted.ring.slice(0);
      skipBisect = Boolean(converted.skipBisect);
    } else if (Array.isArray(ring)) {
      points = ring.slice(0);
    } else {
      throw new TypeError(INVALID_INPUT);
    }
    if (!validRing(points)) {
      throw new TypeError(INVALID_INPUT);
    }
    if (points.length > 1 && samePoint(points[0], points[points.length - 1])) {
      points.pop();
    }
    const area2 = area_default(points);
    if (area2 > 0) {
      points.reverse();
    }
    if (!skipBisect && maxSegmentLength !== void 0 && isFiniteNumber(maxSegmentLength) && maxSegmentLength > 0) {
      bisect(points, maxSegmentLength);
    }
    return points;
  }
  function validRing(ring) {
    if (!Array.isArray(ring) || !ring.length) return false;
    return ring.every(
      (point) => Array.isArray(point) && point.length >= 2 && isFiniteNumber(point[0]) && isFiniteNumber(point[1])
    );
  }

  // src/rotate.ts
  function rotate(ring, vs) {
    if (!ring || !vs) return;
    const len = ring.length;
    if (len === 0 || vs.length === 0) return;
    let min = Infinity;
    let bestOffset = 0;
    for (let offset = 0; offset < len; offset++) {
      let sumOfSquares = 0;
      for (let i2 = 0; i2 < vs.length; i2++) {
        const p2 = vs[i2];
        const d2 = distance(ring[(offset + i2) % len], p2);
        sumOfSquares += d2 * d2;
      }
      if (sumOfSquares < min) {
        min = sumOfSquares;
        bestOffset = offset;
      }
    }
    if (bestOffset) {
      const spliced = ring.splice(0, bestOffset);
      ring.splice(ring.length, 0, ...spliced);
    }
  }

  // src/align.ts
  function align(fromShape2, toShape, {
    maxSegmentLength = 10,
    string = true,
    precision = null,
    closed = true
  } = {}) {
    const fromRing = normalizeRing(fromShape2, maxSegmentLength);
    const toRing = normalizeRing(toShape, maxSegmentLength);
    const diff = fromRing.length - toRing.length;
    addPoints(fromRing, diff < 0 ? diff * -1 : 0);
    addPoints(toRing, diff > 0 ? diff : 0);
    rotate(fromRing, toRing);
    if (string) {
      return [
        toPathString(fromRing, precision, closed),
        toPathString(toRing, precision, closed)
      ];
    }
    return [fromRing, toRing];
  }

  // node_modules/.pnpm/earcut@3.2.3/node_modules/earcut/src/earcut.js
  var steiners = /* @__PURE__ */ new Set();
  var filteredOut = false;
  function earcut(data, holeIndices, dim = 2) {
    const hasHoles = holeIndices && holeIndices.length;
    const outerLen = hasHoles ? holeIndices[0] * dim : data.length;
    if (steiners.size) steiners.clear();
    let outerNode = linkedList(data, 0, outerLen, dim, true);
    const triangles = [];
    if (!outerNode || outerNode.next === outerNode.prev) return triangles;
    let minX = 0, minY = 0, invSize = 0;
    if (hasHoles) outerNode = eliminateHoles(data, holeIndices, outerNode, dim);
    if (data.length > 80 * dim) {
      minX = data[0];
      minY = data[1];
      let maxX = minX;
      let maxY = minY;
      for (let i2 = dim; i2 < outerLen; i2 += dim) {
        const x2 = data[i2];
        const y2 = data[i2 + 1];
        if (x2 < minX) minX = x2;
        if (y2 < minY) minY = y2;
        if (x2 > maxX) maxX = x2;
        if (y2 > maxY) maxY = y2;
      }
      invSize = Math.max(maxX - minX, maxY - minY);
      invSize = invSize !== 0 ? 32767 / invSize : 0;
    }
    earcutLinked(outerNode, triangles, minX, minY, invSize);
    return triangles;
  }
  function linkedList(data, start, end, dim, clockwise) {
    let last = null;
    if (clockwise === signedArea(data, start, end, dim) > 0) {
      for (let i2 = start; i2 < end; i2 += dim) last = insertNode(i2 / dim | 0, data[i2], data[i2 + 1], last);
    } else {
      for (let i2 = end - dim; i2 >= start; i2 -= dim) last = insertNode(i2 / dim | 0, data[i2], data[i2 + 1], last);
    }
    if (last && equals(last, last.next)) {
      removeNode(last);
      last = last.next;
    }
    return last;
  }
  function filterPoints(start, end = start) {
    const full = end === start;
    let p2 = start, again;
    do {
      again = false;
      if (p2 !== p2.next && (steiners.size === 0 || !steiners.has(p2)) && (equals(p2, p2.next) || area(p2.prev, p2, p2.next) === 0)) {
        if (full || p2 === end) end = p2.prev;
        filteredOut = true;
        removeNode(p2);
        p2 = p2.prev;
        again = true;
      } else if (full || p2 !== end) {
        p2 = p2.next;
        again = !full;
      }
    } while (again || p2 !== end);
    return end;
  }
  function earcutLinked(ear, triangles, minX, minY, invSize) {
    if (invSize) indexCurve(ear, minX, minY, invSize);
    let stop = ear, cured = false;
    while (ear.prev !== ear.next) {
      const prev = ear.prev;
      const next = ear.next;
      if (area(prev, ear, next) < 0 && (invSize ? isEarHashed(ear, minX, minY, invSize) : isEar(ear))) {
        triangles.push(prev.i, ear.i, next.i);
        removeNode(ear);
        ear = next;
        stop = next;
        continue;
      }
      ear = next;
      if (ear === stop) {
        filteredOut = false;
        ear = filterPoints(ear);
        if (filteredOut) {
          stop = ear;
          continue;
        }
        if (!cured) {
          ear = cureLocalIntersections(ear, triangles);
          stop = ear;
          cured = true;
          continue;
        }
        splitEarcut(ear, triangles, minX, minY, invSize);
        break;
      }
    }
  }
  function isEar(ear) {
    const a2 = ear.prev, b2 = ear, c2 = ear.next, ax = a2.x, bx = b2.x, cx = c2.x, ay = a2.y, by = b2.y, cy = c2.y, x0 = Math.min(ax, bx, cx), y0 = Math.min(ay, by, cy), x1 = Math.max(ax, bx, cx), y1 = Math.max(ay, by, cy);
    let p2 = c2.next;
    while (p2 !== a2) {
      if (p2.x >= x0 && p2.x <= x1 && p2.y >= y0 && p2.y <= y1 && !(ax === p2.x && ay === p2.y) && pointInTriangle(ax, ay, bx, by, cx, cy, p2.x, p2.y) && area(p2.prev, p2, p2.next) >= 0) return false;
      p2 = p2.next;
    }
    return true;
  }
  function isEarHashed(ear, minX, minY, invSize) {
    const a2 = ear.prev, b2 = ear, c2 = ear.next, ax = a2.x, bx = b2.x, cx = c2.x, ay = a2.y, by = b2.y, cy = c2.y, x0 = Math.min(ax, bx, cx), y0 = Math.min(ay, by, cy), x1 = Math.max(ax, bx, cx), y1 = Math.max(ay, by, cy), minZ = zOrder(x0, y0, minX, minY, invSize), maxZ = zOrder(x1, y1, minX, minY, invSize);
    let p2 = ear.prevZ;
    while (p2 && p2.z >= minZ) {
      if (p2.x >= x0 && p2.x <= x1 && p2.y >= y0 && p2.y <= y1 && p2 !== c2 && !(ax === p2.x && ay === p2.y) && pointInTriangle(ax, ay, bx, by, cx, cy, p2.x, p2.y) && area(p2.prev, p2, p2.next) >= 0) return false;
      p2 = p2.prevZ;
    }
    let n2 = ear.nextZ;
    while (n2 && n2.z <= maxZ) {
      if (n2.x >= x0 && n2.x <= x1 && n2.y >= y0 && n2.y <= y1 && n2 !== c2 && !(ax === n2.x && ay === n2.y) && pointInTriangle(ax, ay, bx, by, cx, cy, n2.x, n2.y) && area(n2.prev, n2, n2.next) >= 0) return false;
      n2 = n2.nextZ;
    }
    return true;
  }
  function cureLocalIntersections(start, triangles) {
    let p2 = start;
    let cured = false;
    do {
      const a2 = p2.prev, b2 = p2.next.next;
      if (intersects(a2, p2, p2.next, b2, false) && locallyInside(a2, b2) && locallyInside(b2, a2)) {
        triangles.push(a2.i, p2.i, b2.i);
        removeNode(p2);
        removeNode(p2.next);
        p2 = start = b2;
        cured = true;
      }
      p2 = p2.next;
    } while (p2 !== start);
    return cured ? filterPoints(p2) : p2;
  }
  function splitEarcut(start, triangles, minX, minY, invSize) {
    let a2 = start;
    do {
      let b2 = a2.next.next;
      while (b2 !== a2.prev) {
        if (a2.i !== b2.i && isValidDiagonal(a2, b2)) {
          let c2 = splitPolygon(a2, b2);
          a2 = filterPoints(a2, a2.next);
          c2 = filterPoints(c2, c2.next);
          earcutLinked(a2, triangles, minX, minY, invSize);
          earcutLinked(c2, triangles, minX, minY, invSize);
          return;
        }
        b2 = b2.next;
      }
      a2 = a2.next;
    } while (a2 !== start);
  }
  var indexActive = false;
  function eliminateHoles(data, holeIndices, outerNode, dim) {
    const queue = [];
    for (let i2 = 0, len = holeIndices.length; i2 < len; i2++) {
      const start = holeIndices[i2] * dim;
      const end = i2 < len - 1 ? holeIndices[i2 + 1] * dim : data.length;
      const list = (
        /** @type {Node} */
        linkedList(data, start, end, dim, false)
      );
      if (list === list.next) steiners.add(list);
      queue.push(getLeftmost(list));
    }
    queue.sort(compareXYSlope);
    buildBlockIndex(data.length / dim, holeIndices.length);
    indexSegment(outerNode, outerNode);
    indexActive = true;
    for (let i2 = 0; i2 < queue.length; i2++) {
      outerNode = eliminateHole(queue[i2], outerNode);
    }
    indexActive = false;
    return filterPoints(outerNode);
  }
  function compareXYSlope(a2, b2) {
    return a2.x - b2.x || a2.y - b2.y || (a2.next.y - a2.y) / (a2.next.x - a2.x) - (b2.next.y - b2.y) / (b2.next.x - b2.x);
  }
  function eliminateHole(hole, outerNode) {
    const bridge = findHoleBridge(hole, outerNode);
    if (!bridge) {
      return outerNode;
    }
    const bridgeReverse = splitPolygon(bridge, hole);
    const bridge2 = bridgeReverse.next;
    indexSegment(bridge, bridge2.next);
    filterPoints(bridgeReverse, bridgeReverse.next);
    return filterPoints(bridge, bridge.next);
  }
  var K = 16;
  var blockBBox = new Float64Array(0);
  var numBlocks = 0;
  var blockHead = [];
  var blockStop = [];
  function buildBlockIndex(maxNodes, numHoles) {
    const maxBlocks = Math.ceil((maxNodes + 2 * numHoles) / K) + numHoles + 2;
    if (blockBBox.length < maxBlocks * 4) blockBBox = new Float64Array(maxBlocks * 4);
    numBlocks = 0;
  }
  function indexSegment(head, stop) {
    let p2 = head;
    do {
      const b2 = numBlocks++;
      blockHead[b2] = p2;
      let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
      let k = 0;
      do {
        const c2 = p2.next;
        p2.z = b2;
        if (p2.x < minX) minX = p2.x;
        if (p2.x > maxX) maxX = p2.x;
        if (p2.y < minY) minY = p2.y;
        if (p2.y > maxY) maxY = p2.y;
        if (c2.x < minX) minX = c2.x;
        if (c2.x > maxX) maxX = c2.x;
        if (c2.y < minY) minY = c2.y;
        if (c2.y > maxY) maxY = c2.y;
        p2 = c2;
      } while (++k < K && p2 !== stop);
      blockStop[b2] = p2;
      const g2 = b2 * 4;
      blockBBox[g2] = minX;
      blockBBox[g2 + 1] = minY;
      blockBBox[g2 + 2] = maxX;
      blockBBox[g2 + 3] = maxY;
    } while (p2 !== stop);
  }
  function growBlock(head, tail) {
    const g2 = head.z * 4;
    if (tail.x < blockBBox[g2]) blockBBox[g2] = tail.x;
    if (tail.y < blockBBox[g2 + 1]) blockBBox[g2 + 1] = tail.y;
    if (tail.x > blockBBox[g2 + 2]) blockBBox[g2 + 2] = tail.x;
    if (tail.y > blockBBox[g2 + 3]) blockBBox[g2 + 3] = tail.y;
  }
  function liveBlockStop(b2) {
    let stop = blockStop[b2];
    while (stop.prev.next !== stop) stop = stop.next;
    blockStop[b2] = stop;
    return stop;
  }
  function liveBlockHead(b2) {
    let head = blockHead[b2];
    while (head.prev.next !== head) head = head.next;
    blockHead[b2] = head;
    return head;
  }
  function findHoleBridge(hole, outerNode) {
    let p2 = outerNode;
    const hx = hole.x;
    const hy = hole.y;
    let qx = -Infinity;
    let m2;
    if (equals(hole, p2)) return p2;
    for (let b2 = 0, g2 = 0; b2 < numBlocks; b2++, g2 += 4) {
      if (hy < blockBBox[g2 + 1] || hy > blockBBox[g2 + 3] || blockBBox[g2] > hx || blockBBox[g2 + 2] <= qx) continue;
      const stop = liveBlockStop(b2);
      p2 = liveBlockHead(b2);
      do {
        if (p2.prev.next === p2) {
          if (equals(hole, p2.next)) return p2.next;
          else if (hy <= p2.y && hy >= p2.next.y && p2.next.y !== p2.y) {
            const x2 = p2.x + (hy - p2.y) * (p2.next.x - p2.x) / (p2.next.y - p2.y);
            if (x2 <= hx && x2 > qx) {
              qx = x2;
              m2 = p2.x < p2.next.x ? p2 : p2.next;
              if (x2 === hx) return m2;
            }
          }
        }
        p2 = p2.next;
      } while (p2 !== stop);
    }
    if (!m2) return null;
    const mx = m2.x;
    const my = m2.y;
    const tminY = Math.min(hy, my);
    const tmaxY = Math.max(hy, my);
    let tanMin = Infinity;
    for (let b2 = 0, g2 = 0; b2 < numBlocks; b2++, g2 += 4) {
      if (blockBBox[g2 + 2] < mx || blockBBox[g2] > hx || blockBBox[g2 + 3] < tminY || blockBBox[g2 + 1] > tmaxY) continue;
      const stop = liveBlockStop(b2);
      p2 = liveBlockHead(b2);
      do {
        if (p2.prev.next === p2 && hx >= p2.x && p2.x >= mx && hx !== p2.x && // skip dead nodes
        pointInTriangle(hy < my ? hx : qx, hy, mx, my, hy < my ? qx : hx, hy, p2.x, p2.y)) {
          const tan = Math.abs(hy - p2.y) / (hx - p2.x);
          if ((locallyInside(p2, hole) || p2.y === hy && p2.next.y === hy && p2.next.x > hx) && (tan < tanMin || tan === tanMin && (p2.x > m2.x || p2.x === m2.x && sectorContainsSector(m2, p2)))) {
            m2 = p2;
            tanMin = tan;
          }
        }
        p2 = p2.next;
      } while (p2 !== stop);
    }
    return m2;
  }
  function sectorContainsSector(m2, p2) {
    return area(m2.prev, m2, p2.prev) < 0 && area(p2.next, m2, m2.next) < 0;
  }
  var sortArr = [];
  var sortBuf = [];
  var zArr = new Uint32Array(0);
  var zBuf = new Uint32Array(0);
  var counts = new Uint32Array(256);
  function indexCurve(start, minX, minY, invSize) {
    let p2 = start;
    let n2 = 0;
    do {
      p2.z = zOrder(p2.x, p2.y, minX, minY, invSize);
      sortArr[n2++] = p2;
      p2 = p2.next;
    } while (p2 !== start);
    sortNodes(n2);
    let prev = null;
    for (let i2 = 0; i2 < n2; i2++) {
      const node = sortArr[i2];
      node.prevZ = prev;
      if (prev) prev.nextZ = node;
      prev = node;
    }
    prev.nextZ = null;
  }
  function sortNodes(n2) {
    if (n2 <= 32) {
      for (let i2 = 1; i2 < n2; i2++) {
        const node = sortArr[i2], z = node.z;
        let j = i2 - 1;
        while (j >= 0 && sortArr[j].z > z) {
          sortArr[j + 1] = sortArr[j];
          j--;
        }
        sortArr[j + 1] = node;
      }
      return;
    }
    if (zArr.length < n2) {
      zArr = new Uint32Array(n2);
      zBuf = new Uint32Array(n2);
      sortBuf = new Array(n2);
    }
    for (let i2 = 0; i2 < n2; i2++) zArr[i2] = sortArr[i2].z;
    radixPass(n2, sortArr, zArr, sortBuf, zBuf, 0);
    radixPass(n2, sortBuf, zBuf, sortArr, zArr, 8);
    radixPass(n2, sortArr, zArr, sortBuf, zBuf, 16);
    radixPass(n2, sortBuf, zBuf, sortArr, zArr, 24);
  }
  function radixPass(n2, src, srcZ, dst, dstZ, shift) {
    counts.fill(0);
    for (let i2 = 0; i2 < n2; i2++) counts[srcZ[i2] >>> shift & 255]++;
    let sum = 0;
    for (let b2 = 0; b2 < 256; b2++) {
      const c2 = counts[b2];
      counts[b2] = sum;
      sum += c2;
    }
    for (let i2 = 0; i2 < n2; i2++) {
      const z = srcZ[i2];
      const pos = counts[z >>> shift & 255]++;
      dst[pos] = src[i2];
      dstZ[pos] = z;
    }
  }
  function zOrder(x2, y2, minX, minY, invSize) {
    x2 = (x2 - minX) * invSize | 0;
    y2 = (y2 - minY) * invSize | 0;
    x2 = (x2 | x2 << 8) & 16711935;
    x2 = (x2 | x2 << 4) & 252645135;
    x2 = (x2 | x2 << 2) & 858993459;
    x2 = (x2 | x2 << 1) & 1431655765;
    y2 = (y2 | y2 << 8) & 16711935;
    y2 = (y2 | y2 << 4) & 252645135;
    y2 = (y2 | y2 << 2) & 858993459;
    y2 = (y2 | y2 << 1) & 1431655765;
    return x2 | y2 << 1;
  }
  function getLeftmost(start) {
    let p2 = start, leftmost = start;
    do {
      if (p2.x < leftmost.x || p2.x === leftmost.x && p2.y < leftmost.y) leftmost = p2;
      p2 = p2.next;
    } while (p2 !== start);
    return leftmost;
  }
  function pointInTriangle(ax, ay, bx, by, cx, cy, px, py) {
    return (cx - px) * (ay - py) >= (ax - px) * (cy - py) && (ax - px) * (by - py) >= (bx - px) * (ay - py) && (bx - px) * (cy - py) >= (cx - px) * (by - py);
  }
  function isValidDiagonal(a2, b2) {
    const zeroLength = equals(a2, b2) && area(a2.prev, a2, a2.next) > 0 && area(b2.prev, b2, b2.next) > 0;
    return a2.next.i !== b2.i && (zeroLength || locallyInside(a2, b2) && locallyInside(b2, a2) && // // locally visible
    (area(a2.prev, a2, b2.prev) !== 0 || area(a2, b2.prev, b2) !== 0)) && // no opposite-facing sectors
    !intersectsPolygon(a2, b2) && (zeroLength || middleInside(a2, b2));
  }
  function area(p2, q2, r2) {
    return (q2.y - p2.y) * (r2.x - q2.x) - (q2.x - p2.x) * (r2.y - q2.y);
  }
  function equals(p1, p2) {
    return p1.x === p2.x && p1.y === p2.y;
  }
  function intersects(p1, q1, p2, q2, includeBoundary = true) {
    const o1 = area(p1, q1, p2);
    const o2 = area(p1, q1, q2);
    const o3 = area(p2, q2, p1);
    const o4 = area(p2, q2, q1);
    if ((o1 > 0 && o2 < 0 || o1 < 0 && o2 > 0) && (o3 > 0 && o4 < 0 || o3 < 0 && o4 > 0)) return true;
    if (!includeBoundary) return false;
    if (o1 === 0 && onSegment(p1, p2, q1)) return true;
    if (o2 === 0 && onSegment(p1, q2, q1)) return true;
    if (o3 === 0 && onSegment(p2, p1, q2)) return true;
    if (o4 === 0 && onSegment(p2, q1, q2)) return true;
    return false;
  }
  function onSegment(p2, q2, r2) {
    return q2.x <= Math.max(p2.x, r2.x) && q2.x >= Math.min(p2.x, r2.x) && q2.y <= Math.max(p2.y, r2.y) && q2.y >= Math.min(p2.y, r2.y);
  }
  function intersectsPolygon(a2, b2) {
    const minX = Math.min(a2.x, b2.x);
    const maxX = Math.max(a2.x, b2.x);
    const minY = Math.min(a2.y, b2.y);
    const maxY = Math.max(a2.y, b2.y);
    let p2 = a2;
    do {
      const n2 = p2.next;
      if (p2.x > maxX && n2.x > maxX || p2.x < minX && n2.x < minX || p2.y > maxY && n2.y > maxY || p2.y < minY && n2.y < minY) {
        p2 = n2;
        continue;
      }
      if (p2.i !== a2.i && n2.i !== a2.i && p2.i !== b2.i && n2.i !== b2.i && intersects(p2, n2, a2, b2)) return true;
      p2 = n2;
    } while (p2 !== a2);
    return false;
  }
  function locallyInside(a2, b2) {
    return area(a2.prev, a2, a2.next) < 0 ? area(a2, b2, a2.next) >= 0 && area(a2, a2.prev, b2) >= 0 : area(a2, b2, a2.prev) < 0 || area(a2, a2.next, b2) < 0;
  }
  function middleInside(a2, b2) {
    let p2 = a2;
    let inside = false;
    const px = (a2.x + b2.x) / 2;
    const py = (a2.y + b2.y) / 2;
    do {
      const n2 = p2.next;
      if (p2.y > py !== n2.y > py && px < (n2.x - p2.x) * (py - p2.y) / (n2.y - p2.y) + p2.x)
        inside = !inside;
      p2 = n2;
    } while (p2 !== a2);
    return inside;
  }
  function splitPolygon(a2, b2) {
    const a22 = createNode(a2.i, a2.x, a2.y), b22 = createNode(b2.i, b2.x, b2.y), an = a2.next, bp = b2.prev;
    a2.next = b2;
    b2.prev = a2;
    a22.next = an;
    an.prev = a22;
    b22.next = a22;
    a22.prev = b22;
    bp.next = b22;
    b22.prev = bp;
    return b22;
  }
  function insertNode(i2, x2, y2, last) {
    const p2 = createNode(i2, x2, y2);
    if (!last) {
      p2.prev = p2;
      p2.next = p2;
    } else {
      p2.next = last.next;
      p2.prev = last;
      last.next.prev = p2;
      last.next = p2;
    }
    return p2;
  }
  function removeNode(p2) {
    p2.next.prev = p2.prev;
    p2.prev.next = p2.next;
    if (p2.prevZ) p2.prevZ.nextZ = p2.nextZ;
    if (p2.nextZ) p2.nextZ.prevZ = p2.prevZ;
    if (indexActive) growBlock(p2.prev, p2.next);
  }
  function createNode(i2, x2, y2) {
    return (
      /** @type {Node} */
      /** @type {unknown} */
      {
        i: i2,
        // vertex index in coordinates array
        x: x2,
        y: y2,
        // vertex coordinates
        prev: null,
        // previous and next vertex nodes in a polygon ring
        next: null,
        z: 0,
        // z-order curve value; doubles as owning block in the hole-bridge index during eliminateHoles
        prevZ: null,
        // previous and next nodes in z-order
        nextZ: null
      }
    );
  }
  function signedArea(data, start, end, dim) {
    let sum = 0;
    for (let i2 = start, j = end - dim; i2 < end; i2 += dim) {
      sum += (data[j] - data[i2]) * (data[i2 + 1] + data[j + 1]);
      j = i2;
    }
    return sum;
  }

  // src/arap.ts
  var earcutFn = earcut.default ?? earcut;
  function interpolateRingsRigid(from, to, string, precision) {
    const len = from.length;
    if (len < 3 || to.length !== len) {
      return interpolatePoints(from, to, string, precision);
    }
    const faces = triangleFaces(from);
    const blends = [];
    const soft = [];
    for (const face of faces) {
      const blend = prepareTriangle(from, to, face);
      if (blend) blends.push(blend);
      else soft.push(face);
    }
    if (!blends.length) {
      return interpolatePoints(from, to, string, precision);
    }
    return (t2) => {
      if (t2 === 0) {
        const ring2 = from.map((p2) => [p2[0], p2[1]]);
        return string ? toPathString(ring2, precision) : ring2;
      }
      if (t2 === 1) {
        const ring2 = to.map((p2) => [p2[0], p2[1]]);
        return string ? toPathString(ring2, precision) : ring2;
      }
      const sumX = new Float64Array(len);
      const sumY = new Float64Array(len);
      const count = new Uint16Array(len);
      for (const face of soft) {
        accumulateLerp(sumX, sumY, count, from, to, face[0], t2);
        accumulateLerp(sumX, sumY, count, from, to, face[1], t2);
        accumulateLerp(sumX, sumY, count, from, to, face[2], t2);
      }
      for (const tri of blends) {
        const ct = Math.cos(t2 * tri.theta);
        const st = Math.sin(t2 * tri.theta);
        const st00 = 1 - t2 + t2 * tri.s00;
        const st01 = t2 * tri.s01;
        const st10 = t2 * tri.s10;
        const st11 = 1 - t2 + t2 * tri.s11;
        const a00 = ct * st00 - st * st10;
        const a01 = ct * st01 - st * st11;
        const a10 = st * st00 + ct * st10;
        const a11 = st * st01 + ct * st11;
        const ox = (1 - t2) * tri.p0x + t2 * tri.q0x;
        const oy = (1 - t2) * tri.p0y + t2 * tri.q0y;
        accumulate(sumX, sumY, count, tri.i0, ox, oy);
        accumulate(
          sumX,
          sumY,
          count,
          tri.i1,
          ox + a00 * tri.e1x + a01 * tri.e1y,
          oy + a10 * tri.e1x + a11 * tri.e1y
        );
        accumulate(
          sumX,
          sumY,
          count,
          tri.i2,
          ox + a00 * tri.e2x + a01 * tri.e2y,
          oy + a10 * tri.e2x + a11 * tri.e2y
        );
      }
      const ring = new Array(len);
      for (let i2 = 0; i2 < len; i2++) {
        const n2 = count[i2];
        if (!n2) {
          ring[i2] = [
            from[i2][0] + t2 * (to[i2][0] - from[i2][0]),
            from[i2][1] + t2 * (to[i2][1] - from[i2][1])
          ];
          continue;
        }
        const x2 = sumX[i2] / n2;
        const y2 = sumY[i2] / n2;
        ring[i2] = [
          Number.isFinite(x2) ? x2 : from[i2][0] + t2 * (to[i2][0] - from[i2][0]),
          Number.isFinite(y2) ? y2 : from[i2][1] + t2 * (to[i2][1] - from[i2][1])
        ];
      }
      return string ? toPathString(ring, precision) : ring;
    };
  }
  function triangleFaces(ring) {
    const coords = new Array(ring.length * 2);
    for (let i2 = 0; i2 < ring.length; i2++) {
      coords[i2 * 2] = ring[i2][0];
      coords[i2 * 2 + 1] = ring[i2][1];
    }
    const cuts = earcutFn(coords);
    const faces = [];
    for (let i2 = 0; i2 + 2 < cuts.length; i2 += 3) {
      faces.push([cuts[i2], cuts[i2 + 1], cuts[i2 + 2]]);
    }
    return faces;
  }
  function prepareTriangle(from, to, face) {
    const [i0, i1, i2] = face;
    const p0 = from[i0];
    const p1 = from[i1];
    const p2 = from[i2];
    const q0 = to[i0];
    const q1 = to[i1];
    const q2 = to[i2];
    const e1x = p1[0] - p0[0];
    const e1y = p1[1] - p0[1];
    const e2x = p2[0] - p0[0];
    const e2y = p2[1] - p0[1];
    const det = e1x * e2y - e1y * e2x;
    const e1 = Math.hypot(e1x, e1y);
    const e2 = Math.hypot(e2x, e2y);
    const e3 = Math.hypot(e1x - e2x, e1y - e2y);
    const longest = Math.max(e1, e2, e3);
    if (longest < 1e-12) return null;
    if (Math.abs(det) < longest * longest * 1e-6) return null;
    const f1x = q1[0] - q0[0];
    const f1y = q1[1] - q0[1];
    const f2x = q2[0] - q0[0];
    const f2y = q2[1] - q0[1];
    const fdet = f1x * f2y - f1y * f2x;
    const flongest = Math.max(
      Math.hypot(f1x, f1y),
      Math.hypot(f2x, f2y),
      Math.hypot(f1x - f2x, f1y - f2y)
    );
    if (flongest < 1e-12 || Math.abs(fdet) < flongest * flongest * 1e-6) {
      return null;
    }
    const inv = 1 / det;
    const v00 = e2y * inv;
    const v01 = -e2x * inv;
    const v10 = -e1y * inv;
    const v11 = e1x * inv;
    const a00 = f1x * v00 + f2x * v10;
    const a01 = f1x * v01 + f2x * v11;
    const a10 = f1y * v00 + f2y * v10;
    const a11 = f1y * v01 + f2y * v11;
    if (!Number.isFinite(a00 + a01 + a10 + a11) || Math.hypot(a00, a01, a10, a11) > 1e4) {
      return null;
    }
    const rx = a00 + a11;
    const ry = a10 - a01;
    const rn = Math.hypot(rx, ry);
    const cos = rn < 1e-12 ? 1 : rx / rn;
    const sin = rn < 1e-12 ? 0 : ry / rn;
    const theta = Math.atan2(sin, cos);
    const s00 = cos * a00 + sin * a10;
    const s01 = cos * a01 + sin * a11;
    const s10 = -sin * a00 + cos * a10;
    const s11 = -sin * a01 + cos * a11;
    return {
      i0,
      i1,
      i2,
      p0x: p0[0],
      p0y: p0[1],
      q0x: q0[0],
      q0y: q0[1],
      e1x,
      e1y,
      e2x,
      e2y,
      theta,
      s00,
      s01,
      s10,
      s11
    };
  }
  function accumulate(sumX, sumY, count, index, x2, y2) {
    sumX[index] += x2;
    sumY[index] += y2;
    count[index] += 1;
  }
  function accumulateLerp(sumX, sumY, count, from, to, index, t2) {
    const p2 = from[index];
    const q2 = to[index];
    accumulate(
      sumX,
      sumY,
      count,
      index,
      p2[0] + t2 * (q2[0] - p2[0]),
      p2[1] + t2 * (q2[1] - p2[1])
    );
  }

  // src/interpolate.ts
  function interpolate(fromShape2, toShape, {
    maxSegmentLength = 10,
    string = true,
    optimizeEndpoints = true,
    endpointEpsilon = 1e-4,
    clamp = false,
    precision = null
  } = {}) {
    const fromRing = normalizeRing(fromShape2, maxSegmentLength);
    const toRing = normalizeRing(toShape, maxSegmentLength);
    const interpolator = interpolateRing(fromRing, toRing, {
      string,
      precision
    });
    if (!optimizeEndpoints || !string || typeof fromShape2 !== "string" && typeof toShape !== "string") {
      if (clamp) {
        return (t2) => interpolator(Math.max(0, Math.min(1, t2)));
      }
      return interpolator;
    }
    return (t2) => {
      const tt = clamp ? Math.max(0, Math.min(1, t2)) : t2;
      if (tt < endpointEpsilon && typeof fromShape2 === "string") {
        return fromShape2;
      }
      if (1 - tt < endpointEpsilon && typeof toShape === "string") {
        return toShape;
      }
      return interpolator(tt);
    };
  }
  function interpolateRing(fromRingInput, toRingInput, stringOrOptions) {
    let string = false;
    let precision = null;
    if (typeof stringOrOptions === "boolean") {
      string = stringOrOptions;
    } else if (typeof stringOrOptions === "object" && stringOrOptions !== null) {
      if (stringOrOptions.string !== void 0) {
        string = Boolean(stringOrOptions.string);
      }
      if (stringOrOptions.precision !== void 0) {
        precision = stringOrOptions.precision;
      }
    }
    const fromRing = fromRingInput.slice(0);
    const toRing = toRingInput.slice(0);
    const diff = fromRing.length - toRing.length;
    addPoints(fromRing, diff < 0 ? diff * -1 : 0);
    addPoints(toRing, diff > 0 ? diff : 0);
    rotate(fromRing, toRing);
    return interpolateRingsRigid(fromRing, toRing, string, precision);
  }

  // src/order.ts
  function pieceOrder(start, end) {
    if (!start?.length) return [];
    if (!end?.length || start.length !== end.length || start.length > 8) {
      return start.map((_2, i2) => i2);
    }
    const distances = start.map((p1) => end.map((p2) => squaredDistance(p1, p2)));
    return bestOrder(start, end, distances);
  }
  function bestOrder(start, _end, distances) {
    let min = Infinity;
    let best = start.map((_2, i2) => i2);
    function permute(arr, order = [], sum = 0) {
      for (let i2 = 0; i2 < arr.length; i2++) {
        const cur = arr.splice(i2, 1);
        const dist = distances[cur[0]][order.length];
        if (sum + dist < min) {
          if (arr.length) {
            permute(arr.slice(), order.concat(cur), sum + dist);
          } else {
            min = sum + dist;
            best = order.concat(cur);
          }
        }
        if (arr.length) {
          arr.splice(i2, 0, cur[0]);
        }
      }
    }
    permute(best);
    return best;
  }
  function squaredDistance(p1, p2) {
    const d2 = distance(polygonCentroid(p1), polygonCentroid(p2));
    return d2 * d2;
  }

  // node_modules/.pnpm/d3-array@3.2.4/node_modules/d3-array/src/ascending.js
  function ascending(a2, b2) {
    return a2 == null || b2 == null ? NaN : a2 < b2 ? -1 : a2 > b2 ? 1 : a2 >= b2 ? 0 : NaN;
  }

  // node_modules/.pnpm/d3-array@3.2.4/node_modules/d3-array/src/descending.js
  function descending(a2, b2) {
    return a2 == null || b2 == null ? NaN : b2 < a2 ? -1 : b2 > a2 ? 1 : b2 >= a2 ? 0 : NaN;
  }

  // node_modules/.pnpm/d3-array@3.2.4/node_modules/d3-array/src/bisector.js
  function bisector(f2) {
    let compare1, compare2, delta;
    if (f2.length !== 2) {
      compare1 = ascending;
      compare2 = (d2, x2) => ascending(f2(d2), x2);
      delta = (d2, x2) => f2(d2) - x2;
    } else {
      compare1 = f2 === ascending || f2 === descending ? f2 : zero;
      compare2 = f2;
      delta = f2;
    }
    function left(a2, x2, lo = 0, hi = a2.length) {
      if (lo < hi) {
        if (compare1(x2, x2) !== 0) return hi;
        do {
          const mid = lo + hi >>> 1;
          if (compare2(a2[mid], x2) < 0) lo = mid + 1;
          else hi = mid;
        } while (lo < hi);
      }
      return lo;
    }
    function right(a2, x2, lo = 0, hi = a2.length) {
      if (lo < hi) {
        if (compare1(x2, x2) !== 0) return hi;
        do {
          const mid = lo + hi >>> 1;
          if (compare2(a2[mid], x2) <= 0) lo = mid + 1;
          else hi = mid;
        } while (lo < hi);
      }
      return lo;
    }
    function center(a2, x2, lo = 0, hi = a2.length) {
      const i2 = left(a2, x2, lo, hi - 1);
      return i2 > lo && delta(a2[i2 - 1], x2) > -delta(a2[i2], x2) ? i2 - 1 : i2;
    }
    return { left, center, right };
  }
  function zero() {
    return 0;
  }

  // node_modules/.pnpm/topojson-client@3.1.0/node_modules/topojson-client/src/identity.js
  function identity_default(x2) {
    return x2;
  }

  // node_modules/.pnpm/topojson-client@3.1.0/node_modules/topojson-client/src/transform.js
  function transform_default(transform) {
    if (transform == null) return identity_default;
    var x0, y0, kx = transform.scale[0], ky = transform.scale[1], dx = transform.translate[0], dy = transform.translate[1];
    return function(input, i2) {
      if (!i2) x0 = y0 = 0;
      var j = 2, n2 = input.length, output = new Array(n2);
      output[0] = (x0 += input[0]) * kx + dx;
      output[1] = (y0 += input[1]) * ky + dy;
      while (j < n2) output[j] = input[j], ++j;
      return output;
    };
  }

  // node_modules/.pnpm/topojson-client@3.1.0/node_modules/topojson-client/src/reverse.js
  function reverse_default(array, n2) {
    var t2, j = array.length, i2 = j - n2;
    while (i2 < --j) t2 = array[i2], array[i2++] = array[j], array[j] = t2;
  }

  // node_modules/.pnpm/topojson-client@3.1.0/node_modules/topojson-client/src/feature.js
  function feature_default(topology, o2) {
    if (typeof o2 === "string") o2 = topology.objects[o2];
    return o2.type === "GeometryCollection" ? { type: "FeatureCollection", features: o2.geometries.map(function(o3) {
      return feature(topology, o3);
    }) } : feature(topology, o2);
  }
  function feature(topology, o2) {
    var id = o2.id, bbox = o2.bbox, properties = o2.properties == null ? {} : o2.properties, geometry = object(topology, o2);
    return id == null && bbox == null ? { type: "Feature", properties, geometry } : bbox == null ? { type: "Feature", id, properties, geometry } : { type: "Feature", id, bbox, properties, geometry };
  }
  function object(topology, o2) {
    var transformPoint = transform_default(topology.transform), arcs = topology.arcs;
    function arc(i2, points) {
      if (points.length) points.pop();
      for (var a2 = arcs[i2 < 0 ? ~i2 : i2], k = 0, n2 = a2.length; k < n2; ++k) {
        points.push(transformPoint(a2[k], k));
      }
      if (i2 < 0) reverse_default(points, n2);
    }
    function point(p2) {
      return transformPoint(p2);
    }
    function line(arcs2) {
      var points = [];
      for (var i2 = 0, n2 = arcs2.length; i2 < n2; ++i2) arc(arcs2[i2], points);
      if (points.length < 2) points.push(points[0]);
      return points;
    }
    function ring(arcs2) {
      var points = line(arcs2);
      while (points.length < 4) points.push(points[0]);
      return points;
    }
    function polygon(arcs2) {
      return arcs2.map(ring);
    }
    function geometry(o3) {
      var type = o3.type, coordinates;
      switch (type) {
        case "GeometryCollection":
          return { type, geometries: o3.geometries.map(geometry) };
        case "Point":
          coordinates = point(o3.coordinates);
          break;
        case "MultiPoint":
          coordinates = o3.coordinates.map(point);
          break;
        case "LineString":
          coordinates = line(o3.arcs);
          break;
        case "MultiLineString":
          coordinates = o3.arcs.map(line);
          break;
        case "Polygon":
          coordinates = polygon(o3.arcs);
          break;
        case "MultiPolygon":
          coordinates = o3.arcs.map(polygon);
          break;
        default:
          return null;
      }
      return { type, coordinates };
    }
    return geometry(o2);
  }

  // node_modules/.pnpm/topojson-client@3.1.0/node_modules/topojson-client/src/stitch.js
  function stitch_default(topology, arcs) {
    var stitchedArcs = {}, fragmentByStart = {}, fragmentByEnd = {}, fragments = [], emptyIndex = -1;
    arcs.forEach(function(i2, j) {
      var arc = topology.arcs[i2 < 0 ? ~i2 : i2], t2;
      if (arc.length < 3 && !arc[1][0] && !arc[1][1]) {
        t2 = arcs[++emptyIndex], arcs[emptyIndex] = i2, arcs[j] = t2;
      }
    });
    arcs.forEach(function(i2) {
      var e2 = ends(i2), start = e2[0], end = e2[1], f2, g2;
      if (f2 = fragmentByEnd[start]) {
        delete fragmentByEnd[f2.end];
        f2.push(i2);
        f2.end = end;
        if (g2 = fragmentByStart[end]) {
          delete fragmentByStart[g2.start];
          var fg = g2 === f2 ? f2 : f2.concat(g2);
          fragmentByStart[fg.start = f2.start] = fragmentByEnd[fg.end = g2.end] = fg;
        } else {
          fragmentByStart[f2.start] = fragmentByEnd[f2.end] = f2;
        }
      } else if (f2 = fragmentByStart[end]) {
        delete fragmentByStart[f2.start];
        f2.unshift(i2);
        f2.start = start;
        if (g2 = fragmentByEnd[start]) {
          delete fragmentByEnd[g2.end];
          var gf = g2 === f2 ? f2 : g2.concat(f2);
          fragmentByStart[gf.start = g2.start] = fragmentByEnd[gf.end = f2.end] = gf;
        } else {
          fragmentByStart[f2.start] = fragmentByEnd[f2.end] = f2;
        }
      } else {
        f2 = [i2];
        fragmentByStart[f2.start = start] = fragmentByEnd[f2.end = end] = f2;
      }
    });
    function ends(i2) {
      var arc = topology.arcs[i2 < 0 ? ~i2 : i2], p0 = arc[0], p1;
      if (topology.transform) p1 = [0, 0], arc.forEach(function(dp) {
        p1[0] += dp[0], p1[1] += dp[1];
      });
      else p1 = arc[arc.length - 1];
      return i2 < 0 ? [p1, p0] : [p0, p1];
    }
    function flush(fragmentByEnd2, fragmentByStart2) {
      for (var k in fragmentByEnd2) {
        var f2 = fragmentByEnd2[k];
        delete fragmentByStart2[f2.start];
        delete f2.start;
        delete f2.end;
        f2.forEach(function(i2) {
          stitchedArcs[i2 < 0 ? ~i2 : i2] = 1;
        });
        fragments.push(f2);
      }
    }
    flush(fragmentByEnd, fragmentByStart);
    flush(fragmentByStart, fragmentByEnd);
    arcs.forEach(function(i2) {
      if (!stitchedArcs[i2 < 0 ? ~i2 : i2]) fragments.push([i2]);
    });
    return fragments;
  }

  // node_modules/.pnpm/topojson-client@3.1.0/node_modules/topojson-client/src/merge.js
  function planarRingArea(ring) {
    var i2 = -1, n2 = ring.length, a2, b2 = ring[n2 - 1], area2 = 0;
    while (++i2 < n2) a2 = b2, b2 = ring[i2], area2 += a2[0] * b2[1] - a2[1] * b2[0];
    return Math.abs(area2);
  }
  function mergeArcs(topology, objects) {
    var polygonsByArc = {}, polygons = [], groups = [];
    objects.forEach(geometry);
    function geometry(o2) {
      switch (o2.type) {
        case "GeometryCollection":
          o2.geometries.forEach(geometry);
          break;
        case "Polygon":
          extract(o2.arcs);
          break;
        case "MultiPolygon":
          o2.arcs.forEach(extract);
          break;
      }
    }
    function extract(polygon) {
      polygon.forEach(function(ring) {
        ring.forEach(function(arc) {
          (polygonsByArc[arc = arc < 0 ? ~arc : arc] || (polygonsByArc[arc] = [])).push(polygon);
        });
      });
      polygons.push(polygon);
    }
    function area2(ring) {
      return planarRingArea(object(topology, { type: "Polygon", arcs: [ring] }).coordinates[0]);
    }
    polygons.forEach(function(polygon) {
      if (!polygon._) {
        var group = [], neighbors = [polygon];
        polygon._ = 1;
        groups.push(group);
        while (polygon = neighbors.pop()) {
          group.push(polygon);
          polygon.forEach(function(ring) {
            ring.forEach(function(arc) {
              polygonsByArc[arc < 0 ? ~arc : arc].forEach(function(polygon2) {
                if (!polygon2._) {
                  polygon2._ = 1;
                  neighbors.push(polygon2);
                }
              });
            });
          });
        }
      }
    });
    polygons.forEach(function(polygon) {
      delete polygon._;
    });
    return {
      type: "MultiPolygon",
      arcs: groups.map(function(polygons2) {
        var arcs = [], n2;
        polygons2.forEach(function(polygon) {
          polygon.forEach(function(ring) {
            ring.forEach(function(arc) {
              if (polygonsByArc[arc < 0 ? ~arc : arc].length < 2) {
                arcs.push(arc);
              }
            });
          });
        });
        arcs = stitch_default(topology, arcs);
        if ((n2 = arcs.length) > 1) {
          for (var i2 = 1, k = area2(arcs[0]), ki, t2; i2 < n2; ++i2) {
            if ((ki = area2(arcs[i2])) > k) {
              t2 = arcs[0], arcs[0] = arcs[i2], arcs[i2] = t2, k = ki;
            }
          }
        }
        return arcs;
      }).filter(function(arcs) {
        return arcs.length > 0;
      })
    };
  }

  // node_modules/.pnpm/topojson-client@3.1.0/node_modules/topojson-client/src/bisect.js
  function bisect_default(a2, x2) {
    var lo = 0, hi = a2.length;
    while (lo < hi) {
      var mid = lo + hi >>> 1;
      if (a2[mid] < x2) lo = mid + 1;
      else hi = mid;
    }
    return lo;
  }

  // node_modules/.pnpm/topojson-client@3.1.0/node_modules/topojson-client/src/neighbors.js
  function neighbors_default(objects) {
    var indexesByArc = {}, neighbors = objects.map(function() {
      return [];
    });
    function line(arcs, i3) {
      arcs.forEach(function(a2) {
        if (a2 < 0) a2 = ~a2;
        var o2 = indexesByArc[a2];
        if (o2) o2.push(i3);
        else indexesByArc[a2] = [i3];
      });
    }
    function polygon(arcs, i3) {
      arcs.forEach(function(arc) {
        line(arc, i3);
      });
    }
    function geometry(o2, i3) {
      if (o2.type === "GeometryCollection") o2.geometries.forEach(function(o3) {
        geometry(o3, i3);
      });
      else if (o2.type in geometryType) geometryType[o2.type](o2.arcs, i3);
    }
    var geometryType = {
      LineString: line,
      MultiLineString: polygon,
      Polygon: polygon,
      MultiPolygon: function(arcs, i3) {
        arcs.forEach(function(arc) {
          polygon(arc, i3);
        });
      }
    };
    objects.forEach(geometry);
    for (var i2 in indexesByArc) {
      for (var indexes = indexesByArc[i2], m2 = indexes.length, j = 0; j < m2; ++j) {
        for (var k = j + 1; k < m2; ++k) {
          var ij = indexes[j], ik = indexes[k], n2;
          if ((n2 = neighbors[ij])[i2 = bisect_default(n2, ik)] !== ik) n2.splice(i2, 0, ik);
          if ((n2 = neighbors[ik])[i2 = bisect_default(n2, ij)] !== ij) n2.splice(i2, 0, ij);
        }
      }
    }
    return neighbors;
  }

  // src/topology.ts
  function createTopology(triangles, ring) {
    const arcIndices = {};
    const topology = {
      type: "Topology",
      objects: {
        triangles: {
          type: "GeometryCollection",
          geometries: []
        }
      },
      arcs: []
    };
    triangles.forEach((triangle) => {
      const geometry = [];
      triangle.forEach((arc) => {
        const slug = arc[0] < arc[1] ? arc.join(",") : `${arc[1]},${arc[0]}`;
        const coordinates = arc.map((pointIndex) => ring[pointIndex]);
        if (slug in arcIndices) {
          geometry.push(~arcIndices[slug]);
        } else {
          const arcIndex = topology.arcs.length;
          arcIndices[slug] = arcIndex;
          geometry.push(arcIndex);
          topology.arcs.push(coordinates);
        }
      });
      topology.objects.triangles.geometries.push({
        type: "Polygon",
        area: Math.abs(area_default(triangle.map((d2) => ring[d2[0]]))),
        arcs: [geometry]
      });
    });
    topology.objects.triangles.geometries.sort((a2, b2) => a2.area - b2.area);
    return topology;
  }
  function collapseTopology(topology, numPieces) {
    const geometries = topology.objects.triangles.geometries;
    const bisect2 = bisector((d2) => d2.area).left;
    while (geometries.length > numPieces && geometries.length > 1) {
      mergeSmallestFeature();
    }
    if (numPieces > geometries.length) {
      throw new RangeError(`Can't collapse topology into ${numPieces} pieces.`);
    }
    const features = feature_default(topology, topology.objects.triangles).features;
    return features.map((f2) => {
      f2.geometry.coordinates[0].pop();
      return f2.geometry.coordinates[0];
    });
    function mergeSmallestFeature() {
      const smallest = geometries[0];
      const neighborList = neighbors_default(geometries);
      const neighborIndex = neighborList[0]?.[0] ?? 1;
      const neighbor = geometries[neighborIndex];
      const merged = mergeArcs(topology, [smallest, neighbor]);
      merged.area = smallest.area + (neighbor ? neighbor.area : 0);
      merged.type = "Polygon";
      merged.arcs = merged.arcs[0];
      if (neighborIndex > 0) {
        geometries.splice(neighborIndex, 1);
        geometries.shift();
      } else {
        geometries.shift();
      }
      geometries.splice(bisect2(geometries, merged.area), 0, merged);
    }
  }

  // src/triangulate.ts
  var earcutFn2 = earcut.default ?? earcut;
  function triangulate(ring, numPieces) {
    return collapseTopology(createTopology(cut(ring), ring), numPieces);
  }
  function cut(ring) {
    const flatCoords = new Array(ring.length * 2);
    for (let i2 = 0; i2 < ring.length; i2++) {
      flatCoords[i2 * 2] = ring[i2][0];
      flatCoords[i2 * 2 + 1] = ring[i2][1];
    }
    const cuts = earcutFn2(flatCoords);
    const triangles = [];
    for (let i2 = 0, l2 = cuts.length; i2 < l2; i2 += 3) {
      triangles.push([
        [cuts[i2], cuts[i2 + 1]],
        [cuts[i2 + 1], cuts[i2 + 2]],
        [cuts[i2 + 2], cuts[i2]]
      ]);
    }
    return triangles;
  }

  // src/multiple.ts
  function separate(fromShape2, toShapes, {
    maxSegmentLength = 10,
    string = true,
    single = false,
    precision = null
  } = {}) {
    const fromRing = normalizeRing(fromShape2, maxSegmentLength);
    if (fromRing.length < toShapes.length + 2) {
      addPoints(fromRing, toShapes.length + 2 - fromRing.length);
    }
    const fromRings = triangulate(fromRing, toShapes.length);
    const toRings = toShapes.map((d2) => normalizeRing(d2, maxSegmentLength));
    const t0 = typeof fromShape2 === "string" && fromShape2;
    let t1;
    if (!single || toShapes.every((s2) => typeof s2 === "string")) {
      t1 = toShapes.slice(0);
    }
    return interpolateSets(fromRings, toRings, {
      match: true,
      string,
      single,
      t0,
      t1,
      precision
    });
  }
  function combine(fromShapes, toShape, {
    maxSegmentLength = 10,
    string = true,
    single = false,
    precision = null
  } = {}) {
    const interpolators = separate(toShape, fromShapes, {
      maxSegmentLength,
      string,
      single,
      precision
    });
    return single ? (t2) => interpolators(1 - t2) : interpolators.map((fn) => (t2) => fn(1 - t2));
  }
  function interpolateAll(fromShapes, toShapes, {
    maxSegmentLength = 10,
    string = true,
    single = false,
    precision = null
  } = {}) {
    if (!Array.isArray(fromShapes) || !Array.isArray(toShapes) || fromShapes.length !== toShapes.length || !fromShapes.length) {
      throw new TypeError(INVALID_INPUT_ALL);
    }
    const normalize = (s2) => normalizeRing(s2, maxSegmentLength);
    const fromRings = fromShapes.map(normalize);
    const toRings = toShapes.map(normalize);
    let t0;
    let t1;
    if (single) {
      if (fromShapes.every((s2) => typeof s2 === "string")) {
        t0 = fromShapes.slice(0);
      }
      if (toShapes.every((s2) => typeof s2 === "string")) {
        t1 = toShapes.slice(0);
      }
    } else {
      t0 = fromShapes.slice(0);
      t1 = toShapes.slice(0);
    }
    return interpolateSets(fromRings, toRings, {
      string,
      single,
      t0,
      t1,
      match: false,
      precision
    });
  }
  function interpolateSets(fromRings, toRings, {
    string = true,
    single = false,
    t0,
    t1,
    match = false,
    precision = null
  } = {}) {
    const order = match ? pieceOrder(fromRings, toRings) : fromRings.map((_2, i2) => i2);
    const interpolators = order.map(
      (d2, i2) => interpolateRing(fromRings[d2], toRings[i2], { string, precision })
    );
    let snap0 = t0;
    let snap1 = t1;
    if (match && Array.isArray(snap0)) {
      const pieces = snap0;
      snap0 = order.map((d2) => pieces[d2]);
    }
    if (single && string) {
      if (Array.isArray(snap0)) {
        snap0 = snap0.join(" ");
      }
      if (Array.isArray(snap1)) {
        snap1 = snap1.join(" ");
      }
    }
    if (single) {
      const multiInterpolator = string ? (t2) => interpolators.map((fn) => fn(t2)).join(" ") : (t2) => interpolators.map((fn) => fn(t2));
      if (string && (snap0 || snap1)) {
        const start = typeof snap0 === "string" ? snap0 : "";
        const end = typeof snap1 === "string" ? snap1 : "";
        return (t2) => {
          if (t2 < 1e-4 && start) return start;
          if (1 - t2 < 1e-4 && end) return end;
          return multiInterpolator(t2);
        };
      }
      return multiInterpolator;
    }
    if (string) {
      const starts = Array.isArray(snap0) ? snap0.map((d2) => typeof d2 === "string" ? d2 : "") : [];
      const ends = Array.isArray(snap1) ? snap1.map((d2) => typeof d2 === "string" ? d2 : "") : [];
      return interpolators.map((fn, i2) => {
        if (starts[i2] || ends[i2]) {
          return (t2) => {
            if (t2 < 1e-4 && starts[i2]) return starts[i2];
            if (1 - t2 < 1e-4 && ends[i2]) return ends[i2];
            return fn(t2);
          };
        }
        return fn;
      });
    }
    return interpolators;
  }

  // src/shape.ts
  function fromCircle(x2, y2, radius, toShape, options) {
    return fromShape(
      circlePoints(x2, y2, radius),
      toShape,
      circlePath(x2, y2, radius),
      2 * Math.PI * radius,
      options
    );
  }
  function toCircle(fromShape2, x2, y2, radius, options) {
    const interpolator = fromCircle(x2, y2, radius, fromShape2, options);
    return (t2) => interpolator(1 - t2);
  }
  function fromRect(x2, y2, width, height, toShape, options) {
    return fromShape(
      rectPoints(x2, y2, width, height),
      toShape,
      rectPath(x2, y2, width, height),
      2 * width + 2 * height,
      options
    );
  }
  function toRect(fromShape2, x2, y2, width, height, options) {
    const interpolator = fromRect(x2, y2, width, height, fromShape2, options);
    return (t2) => interpolator(1 - t2);
  }
  function fromShape(fromFn, toShape, original, perimeter, {
    maxSegmentLength = 10,
    string = true,
    precision = null
  } = {}) {
    const toRing = normalizeRing(toShape, maxSegmentLength);
    if (isFiniteNumber(perimeter) && isFiniteNumber(maxSegmentLength) && maxSegmentLength > 0 && toRing.length < perimeter / maxSegmentLength) {
      addPoints(toRing, Math.ceil(perimeter / maxSegmentLength - toRing.length));
    }
    const fromRing = fromFn(toRing);
    const interpolator = interpolateRingsRigid(
      fromRing,
      toRing,
      string,
      precision
    );
    if (string) {
      return (t2) => t2 < 1e-4 ? original : interpolator(t2);
    }
    return interpolator;
  }
  function circlePoints(x2, y2, radius) {
    return (ring) => {
      const centroid = polygonCentroid(ring);
      const perimeter = length_default([...ring, ring[0]]);
      const startingAngle = Math.atan2(
        ring[0][1] - centroid[1],
        ring[0][0] - centroid[0]
      );
      let along = 0;
      return ring.map((point, i2) => {
        if (i2) {
          along += distance(point, ring[i2 - 1]);
        }
        const angle = startingAngle + 2 * Math.PI * (perimeter ? along / perimeter : i2 / ring.length);
        return [Math.cos(angle) * radius + x2, Math.sin(angle) * radius + y2];
      });
    };
  }
  function rectPoints(x2, y2, width, height) {
    return (ring) => {
      const centroid = polygonCentroid(ring);
      const perimeter = length_default([...ring, ring[0]]);
      let startingAngle = Math.atan2(
        ring[0][1] - centroid[1],
        ring[0][0] - centroid[0]
      );
      let along = 0;
      if (startingAngle < 0) {
        startingAngle = 2 * Math.PI + startingAngle;
      }
      const startingProgress = startingAngle / (2 * Math.PI);
      return ring.map((point, i2) => {
        if (i2) {
          along += distance(point, ring[i2 - 1]);
        }
        const relative = rectPoint(
          (startingProgress + (perimeter ? along / perimeter : i2 / ring.length)) % 1
        );
        return [x2 + relative[0] * width, y2 + relative[1] * height];
      });
    };
  }
  function rectPoint(progress) {
    if (progress <= 1 / 8) {
      return [1, 0.5 + progress * 4];
    }
    if (progress <= 3 / 8) {
      return [1.5 - 4 * progress, 1];
    }
    if (progress <= 5 / 8) {
      return [0, 2.5 - 4 * progress];
    }
    if (progress <= 7 / 8) {
      return [4 * progress - 2.5, 0];
    }
    return [1, 4 * progress - 3.5];
  }
  function circlePath(x2, y2, radius) {
    const l2 = `${x2 - radius},${y2}`;
    const r2 = `${x2 + radius},${y2}`;
    const pre = `A${radius},${radius},0,1,1,`;
    return `M${l2}${pre}${r2}${pre}${l2}Z`;
  }
  function rectPath(x2, y2, width, height) {
    const r2 = x2 + width;
    const b2 = y2 + height;
    return "M" + x2 + "," + y2 + "L" + r2 + "," + y2 + "L" + r2 + "," + b2 + "L" + x2 + "," + b2 + "Z";
  }

  // src/index.ts
  var src_default = interpolate;
  return __toCommonJS(src_exports);
})();
//# sourceMappingURL=flubber.js.map