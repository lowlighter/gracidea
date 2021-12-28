const global1 = globalThis;
var t377 = setTimeout;
function e(t1) {
    return Boolean(t1 && void 0 !== t1.length);
}
function r() {
}
function i(t2) {
    if (!(this instanceof i)) throw new TypeError("Promises must be constructed via new");
    if ("function" != typeof t2) throw new TypeError("not a function");
    this._state = 0, this._handled = !1, this._value = void 0, this._deferreds = [], u(t2, this);
}
function n(t3, e1) {
    for(; 3 === t3._state;)t3 = t3._value;
    0 !== t3._state ? (t3._handled = !0, i._immediateFn(function() {
        var r1 = 1 === t3._state ? e1.onFulfilled : e1.onRejected;
        if (null !== r1) {
            var i1;
            try {
                i1 = r1(t3._value);
            } catch (t4) {
                return void s(e1.promise, t4);
            }
            o(e1.promise, i1);
        } else (1 === t3._state ? o : s)(e1.promise, t3._value);
    })) : t3._deferreds.push(e1);
}
function o(t5, e2) {
    try {
        if (e2 === t5) throw new TypeError("A promise cannot be resolved with itself.");
        if (e2 && ("object" == typeof e2 || "function" == typeof e2)) {
            var r2 = e2.then;
            if (e2 instanceof i) return t5._state = 3, t5._value = e2, void a(t5);
            if ("function" == typeof r2) return void u((n1 = r2, o1 = e2, function() {
                n1.apply(o1, arguments);
            }), t5);
        }
        t5._state = 1, t5._value = e2, a(t5);
    } catch (e3) {
        s(t5, e3);
    }
    var n1, o1;
}
function s(t6, e4) {
    t6._state = 2, t6._value = e4, a(t6);
}
function a(t7) {
    2 === t7._state && 0 === t7._deferreds.length && i._immediateFn(function() {
        t7._handled || i._unhandledRejectionFn(t7._value);
    });
    for(var e5 = 0, r3 = t7._deferreds.length; e5 < r3; e5++)n(t7, t7._deferreds[e5]);
    t7._deferreds = null;
}
function h(t8, e6, r4) {
    this.onFulfilled = "function" == typeof t8 ? t8 : null, this.onRejected = "function" == typeof e6 ? e6 : null, this.promise = r4;
}
function u(t9, e7) {
    var r5 = !1;
    try {
        t9(function(t10) {
            r5 || (r5 = !0, o(e7, t10));
        }, function(t11) {
            r5 || (r5 = !0, s(e7, t11));
        });
    } catch (t12) {
        if (r5) return;
        r5 = !0, s(e7, t12);
    }
}
i.prototype.catch = function(t13) {
    return this.then(null, t13);
}, i.prototype.then = function(t14, e8) {
    var i2 = new this.constructor(r);
    return n(this, new h(t14, e8, i2)), i2;
}, i.prototype.finally = function(t15) {
    var e9 = this.constructor;
    return this.then(function(r6) {
        return e9.resolve(t15()).then(function() {
            return r6;
        });
    }, function(r7) {
        return e9.resolve(t15()).then(function() {
            return e9.reject(r7);
        });
    });
}, i.all = function(t16) {
    return new i(function(r8, i3) {
        if (!e(t16)) return i3(new TypeError("Promise.all accepts an array"));
        var n2 = Array.prototype.slice.call(t16);
        if (0 === n2.length) return r8([]);
        var o2 = n2.length;
        function s1(t17, e10) {
            try {
                if (e10 && ("object" == typeof e10 || "function" == typeof e10)) {
                    var a2 = e10.then;
                    if ("function" == typeof a2) return void a2.call(e10, function(e11) {
                        s1(t17, e11);
                    }, i3);
                }
                n2[t17] = e10, 0 == --o2 && r8(n2);
            } catch (t18) {
                i3(t18);
            }
        }
        for(var a1 = 0; a1 < n2.length; a1++)s1(a1, n2[a1]);
    });
}, i.allSettled = function(t19) {
    return new this(function(e12, r9) {
        if (!t19 || void 0 === t19.length) return r9(new TypeError(typeof t19 + " " + t19 + " is not iterable(cannot read property Symbol(Symbol.iterator))"));
        var i4 = Array.prototype.slice.call(t19);
        if (0 === i4.length) return e12([]);
        var n3 = i4.length;
        function o3(t20, r10) {
            if (r10 && ("object" == typeof r10 || "function" == typeof r10)) {
                var s3 = r10.then;
                if ("function" == typeof s3) return void s3.call(r10, function(e13) {
                    o3(t20, e13);
                }, function(r11) {
                    i4[t20] = {
                        status: "rejected",
                        reason: r11
                    }, 0 == --n3 && e12(i4);
                });
            }
            i4[t20] = {
                status: "fulfilled",
                value: r10
            }, 0 == --n3 && e12(i4);
        }
        for(var s2 = 0; s2 < i4.length; s2++)o3(s2, i4[s2]);
    });
}, i.resolve = function(t21) {
    return t21 && "object" == typeof t21 && t21.constructor === i ? t21 : new i(function(e14) {
        e14(t21);
    });
}, i.reject = function(t22) {
    return new i(function(e, r12) {
        r12(t22);
    });
}, i.race = function(t23) {
    return new i(function(r13, n4) {
        if (!e(t23)) return n4(new TypeError("Promise.race accepts an array"));
        for(var o4 = 0, s4 = t23.length; o4 < s4; o4++)i.resolve(t23[o4]).then(r13, n4);
    });
}, i._immediateFn = "function" == typeof setImmediate && function(t24) {
    setImmediate(t24);
} || function(e15) {
    t377(e15, 0);
}, i._unhandledRejectionFn = function(t25) {
    "undefined" != typeof console && console && console.warn("Possible Unhandled Promise Rejection:", t25);
};
var l = Object.getOwnPropertySymbols, c79 = Object.prototype.hasOwnProperty, d = Object.prototype.propertyIsEnumerable;
var f55 = function() {
    try {
        if (!Object.assign) return !1;
        var t26 = new String("abc");
        if (t26[5] = "de", "5" === Object.getOwnPropertyNames(t26)[0]) return !1;
        for(var e16 = {
        }, r14 = 0; r14 < 10; r14++)e16["_" + String.fromCharCode(r14)] = r14;
        if ("0123456789" !== Object.getOwnPropertyNames(e16).map(function(t) {
            return e16[t];
        }).join("")) return !1;
        var i5 = {
        };
        return "abcdefghijklmnopqrst".split("").forEach(function(t27) {
            i5[t27] = t27;
        }), "abcdefghijklmnopqrst" === Object.keys(Object.assign({
        }, i5)).join("");
    } catch (t) {
        return !1;
    }
}() ? Object.assign : function(t28, e) {
    for(var r15, i6, n5 = arguments, o5 = function(t29) {
        if (null == t29) throw new TypeError("Object.assign cannot be called with null or undefined");
        return Object(t29);
    }(t28), s5 = 1; s5 < arguments.length; s5++){
        for(var a3 in r15 = Object(n5[s5]))c79.call(r15, a3) && (o5[a3] = r15[a3]);
        if (l) {
            i6 = l(r15);
            for(var h1 = 0; h1 < i6.length; h1++)d.call(r15, i6[h1]) && (o5[i6[h1]] = r15[i6[h1]]);
        }
    }
    return o5;
};
if (self.Promise || (self.Promise = i), Object.assign || (Object.assign = f55), Date.now && Date.prototype.getTime || (Date.now = function() {
    return (new Date).getTime();
}), !self.performance || !self.performance.now) {
    var p = Date.now();
    self.performance || (self.performance = {
    }), self.performance.now = function() {
        return Date.now() - p;
    };
}
for(var _ = Date.now(), m = [
    "ms",
    "moz",
    "webkit",
    "o"
], v = 0; v < m.length && !self.requestAnimationFrame; ++v){
    var y = m[v];
    self.requestAnimationFrame = self[y + "RequestAnimationFrame"], self.cancelAnimationFrame = self[y + "CancelAnimationFrame"] || self[y + "CancelRequestAnimationFrame"];
}
self.requestAnimationFrame || (self.requestAnimationFrame = function(t30) {
    if ("function" != typeof t30) throw new TypeError(t30 + "is not a function");
    var e17 = Date.now(), r16 = 16 + _ - e17;
    return r16 < 0 && (r16 = 0), _ = e17, self.setTimeout(function() {
        _ = Date.now(), t30(performance.now());
    }, r16);
}), self.cancelAnimationFrame || (self.cancelAnimationFrame = function(t31) {
    return clearTimeout(t31);
}), Math.sign || (Math.sign = function(t32) {
    return 0 === (t32 = Number(t32)) || isNaN(t32) ? t32 : t32 > 0 ? 1 : -1;
}), Number.isInteger || (Number.isInteger = function(t33) {
    return "number" == typeof t33 && isFinite(t33) && Math.floor(t33) === t33;
}), self.ArrayBuffer || (self.ArrayBuffer = Array), self.Float32Array || (self.Float32Array = Array), self.Uint32Array || (self.Uint32Array = Array), self.Uint16Array || (self.Uint16Array = Array), self.Uint8Array || (self.Uint8Array = Array), self.Int32Array || (self.Int32Array = Array);
var g = /iPhone/i, E = /iPod/i, T = /iPad/i, b = /\biOS-universal(?:.+)Mac\b/i, x = /\bAndroid(?:.+)Mobile\b/i, R = /Android/i, A = /(?:SD4930UR|\bSilk(?:.+)Mobile\b)/i, O = /Silk/i, S = /Windows Phone/i, I = /\bWindows(?:.+)ARM\b/i, P = /BlackBerry/i, N = /BB10/i, M = /Opera Mini/i, D = /\b(CriOS|Chrome)(?:.+)Mobile/i, C = /Mobile(?:.+)Firefox\b/i, w = function(t34) {
    return void 0 !== t34 && "MacIntel" === t34.platform && "number" == typeof t34.maxTouchPoints && t34.maxTouchPoints > 1 && "undefined" == typeof MSStream;
};
var L, F, U, G, B, X, k, H, j, Y, V, W, z, q, K, Z, J, Q, $, tt = function(t35) {
    var e18 = {
        userAgent: "",
        platform: "",
        maxTouchPoints: 0
    };
    t35 || "undefined" == typeof navigator ? "string" == typeof t35 ? e18.userAgent = t35 : t35 && t35.userAgent && (e18 = {
        userAgent: t35.userAgent,
        platform: t35.platform,
        maxTouchPoints: t35.maxTouchPoints || 0
    }) : e18 = {
        userAgent: navigator.userAgent,
        platform: navigator.platform,
        maxTouchPoints: navigator.maxTouchPoints || 0
    };
    var r17 = e18.userAgent, i7 = r17.split("[FBAN");
    void 0 !== i7[1] && (r17 = i7[0]), void 0 !== (i7 = r17.split("Twitter"))[1] && (r17 = i7[0]);
    var n6 = function(t36) {
        return function(e19) {
            return e19.test(t36);
        };
    }(r17), o6 = {
        apple: {
            phone: n6(g) && !n6(S),
            ipod: n6(E),
            tablet: !n6(g) && (n6(T) || w(e18)) && !n6(S),
            universal: n6(b),
            device: (n6(g) || n6(E) || n6(T) || n6(b) || w(e18)) && !n6(S)
        },
        amazon: {
            phone: n6(A),
            tablet: !n6(A) && n6(O),
            device: n6(A) || n6(O)
        },
        android: {
            phone: !n6(S) && n6(A) || !n6(S) && n6(x),
            tablet: !n6(S) && !n6(A) && !n6(x) && (n6(O) || n6(R)),
            device: !n6(S) && (n6(A) || n6(O) || n6(x) || n6(R)) || n6(/\bokhttp\b/i)
        },
        windows: {
            phone: n6(S),
            tablet: n6(I),
            device: n6(S) || n6(I)
        },
        other: {
            blackberry: n6(P),
            blackberry10: n6(N),
            opera: n6(M),
            firefox: n6(C),
            chrome: n6(D),
            device: n6(P) || n6(N) || n6(M) || n6(C) || n6(D)
        },
        any: !1,
        phone: !1,
        tablet: !1
    };
    return o6.any = o6.apple.device || o6.android.device || o6.windows.device || o6.other.device, o6.phone = o6.apple.phone || o6.android.phone || o6.windows.phone, o6.tablet = o6.apple.tablet || o6.android.tablet || o6.windows.tablet, o6;
}(self.navigator);
!function(t37) {
    t37[t37.WEBGL_LEGACY = 0] = "WEBGL_LEGACY", t37[t37.WEBGL = 1] = "WEBGL", t37[t37.WEBGL2 = 2] = "WEBGL2";
}(L || (L = {
})), (function(t38) {
    t38[t38.UNKNOWN = 0] = "UNKNOWN", t38[t38.WEBGL = 1] = "WEBGL", t38[t38.CANVAS = 2] = "CANVAS";
})(F || (F = {
})), (function(t39) {
    t39[t39.COLOR = 16384] = "COLOR", t39[t39.DEPTH = 256] = "DEPTH", t39[t39.STENCIL = 1024] = "STENCIL";
})(U || (U = {
})), (function(t40) {
    t40[t40.NORMAL = 0] = "NORMAL", t40[t40.ADD = 1] = "ADD", t40[t40.MULTIPLY = 2] = "MULTIPLY", t40[t40.SCREEN = 3] = "SCREEN", t40[t40.OVERLAY = 4] = "OVERLAY", t40[t40.DARKEN = 5] = "DARKEN", t40[t40.LIGHTEN = 6] = "LIGHTEN", t40[t40.COLOR_DODGE = 7] = "COLOR_DODGE", t40[t40.COLOR_BURN = 8] = "COLOR_BURN", t40[t40.HARD_LIGHT = 9] = "HARD_LIGHT", t40[t40.SOFT_LIGHT = 10] = "SOFT_LIGHT", t40[t40.DIFFERENCE = 11] = "DIFFERENCE", t40[t40.EXCLUSION = 12] = "EXCLUSION", t40[t40.HUE = 13] = "HUE", t40[t40.SATURATION = 14] = "SATURATION", t40[t40.COLOR = 15] = "COLOR", t40[t40.LUMINOSITY = 16] = "LUMINOSITY", t40[t40.NORMAL_NPM = 17] = "NORMAL_NPM", t40[t40.ADD_NPM = 18] = "ADD_NPM", t40[t40.SCREEN_NPM = 19] = "SCREEN_NPM", t40[t40.NONE = 20] = "NONE", t40[t40.SRC_OVER = 0] = "SRC_OVER", t40[t40.SRC_IN = 21] = "SRC_IN", t40[t40.SRC_OUT = 22] = "SRC_OUT", t40[t40.SRC_ATOP = 23] = "SRC_ATOP", t40[t40.DST_OVER = 24] = "DST_OVER", t40[t40.DST_IN = 25] = "DST_IN", t40[t40.DST_OUT = 26] = "DST_OUT", t40[t40.DST_ATOP = 27] = "DST_ATOP", t40[t40.ERASE = 26] = "ERASE", t40[t40.SUBTRACT = 28] = "SUBTRACT", t40[t40.XOR = 29] = "XOR";
})(G || (G = {
})), (function(t41) {
    t41[t41.POINTS = 0] = "POINTS", t41[t41.LINES = 1] = "LINES", t41[t41.LINE_LOOP = 2] = "LINE_LOOP", t41[t41.LINE_STRIP = 3] = "LINE_STRIP", t41[t41.TRIANGLES = 4] = "TRIANGLES", t41[t41.TRIANGLE_STRIP = 5] = "TRIANGLE_STRIP", t41[t41.TRIANGLE_FAN = 6] = "TRIANGLE_FAN";
})(B || (B = {
})), (function(t42) {
    t42[t42.RGBA = 6408] = "RGBA", t42[t42.RGB = 6407] = "RGB", t42[t42.RG = 33319] = "RG", t42[t42.RED = 6403] = "RED", t42[t42.RGBA_INTEGER = 36249] = "RGBA_INTEGER", t42[t42.RGB_INTEGER = 36248] = "RGB_INTEGER", t42[t42.RG_INTEGER = 33320] = "RG_INTEGER", t42[t42.RED_INTEGER = 36244] = "RED_INTEGER", t42[t42.ALPHA = 6406] = "ALPHA", t42[t42.LUMINANCE = 6409] = "LUMINANCE", t42[t42.LUMINANCE_ALPHA = 6410] = "LUMINANCE_ALPHA", t42[t42.DEPTH_COMPONENT = 6402] = "DEPTH_COMPONENT", t42[t42.DEPTH_STENCIL = 34041] = "DEPTH_STENCIL";
})(X || (X = {
})), (function(t43) {
    t43[t43.TEXTURE_2D = 3553] = "TEXTURE_2D", t43[t43.TEXTURE_CUBE_MAP = 34067] = "TEXTURE_CUBE_MAP", t43[t43.TEXTURE_2D_ARRAY = 35866] = "TEXTURE_2D_ARRAY", t43[t43.TEXTURE_CUBE_MAP_POSITIVE_X = 34069] = "TEXTURE_CUBE_MAP_POSITIVE_X", t43[t43.TEXTURE_CUBE_MAP_NEGATIVE_X = 34070] = "TEXTURE_CUBE_MAP_NEGATIVE_X", t43[t43.TEXTURE_CUBE_MAP_POSITIVE_Y = 34071] = "TEXTURE_CUBE_MAP_POSITIVE_Y", t43[t43.TEXTURE_CUBE_MAP_NEGATIVE_Y = 34072] = "TEXTURE_CUBE_MAP_NEGATIVE_Y", t43[t43.TEXTURE_CUBE_MAP_POSITIVE_Z = 34073] = "TEXTURE_CUBE_MAP_POSITIVE_Z", t43[t43.TEXTURE_CUBE_MAP_NEGATIVE_Z = 34074] = "TEXTURE_CUBE_MAP_NEGATIVE_Z";
})(k || (k = {
})), (function(t44) {
    t44[t44.UNSIGNED_BYTE = 5121] = "UNSIGNED_BYTE", t44[t44.UNSIGNED_SHORT = 5123] = "UNSIGNED_SHORT", t44[t44.UNSIGNED_SHORT_5_6_5 = 33635] = "UNSIGNED_SHORT_5_6_5", t44[t44.UNSIGNED_SHORT_4_4_4_4 = 32819] = "UNSIGNED_SHORT_4_4_4_4", t44[t44.UNSIGNED_SHORT_5_5_5_1 = 32820] = "UNSIGNED_SHORT_5_5_5_1", t44[t44.UNSIGNED_INT = 5125] = "UNSIGNED_INT", t44[t44.UNSIGNED_INT_10F_11F_11F_REV = 35899] = "UNSIGNED_INT_10F_11F_11F_REV", t44[t44.UNSIGNED_INT_2_10_10_10_REV = 33640] = "UNSIGNED_INT_2_10_10_10_REV", t44[t44.UNSIGNED_INT_24_8 = 34042] = "UNSIGNED_INT_24_8", t44[t44.UNSIGNED_INT_5_9_9_9_REV = 35902] = "UNSIGNED_INT_5_9_9_9_REV", t44[t44.BYTE = 5120] = "BYTE", t44[t44.SHORT = 5122] = "SHORT", t44[t44.INT = 5124] = "INT", t44[t44.FLOAT = 5126] = "FLOAT", t44[t44.FLOAT_32_UNSIGNED_INT_24_8_REV = 36269] = "FLOAT_32_UNSIGNED_INT_24_8_REV", t44[t44.HALF_FLOAT = 36193] = "HALF_FLOAT";
})(H || (H = {
})), (function(t45) {
    t45[t45.FLOAT = 0] = "FLOAT", t45[t45.INT = 1] = "INT", t45[t45.UINT = 2] = "UINT";
})(j || (j = {
})), (function(t46) {
    t46[t46.NEAREST = 0] = "NEAREST", t46[t46.LINEAR = 1] = "LINEAR";
})(Y || (Y = {
})), (function(t47) {
    t47[t47.CLAMP = 33071] = "CLAMP", t47[t47.REPEAT = 10497] = "REPEAT", t47[t47.MIRRORED_REPEAT = 33648] = "MIRRORED_REPEAT";
})(V || (V = {
})), (function(t48) {
    t48[t48.OFF = 0] = "OFF", t48[t48.POW2 = 1] = "POW2", t48[t48.ON = 2] = "ON", t48[t48.ON_MANUAL = 3] = "ON_MANUAL";
})(W || (W = {
})), (function(t49) {
    t49[t49.NPM = 0] = "NPM", t49[t49.UNPACK = 1] = "UNPACK", t49[t49.PMA = 2] = "PMA", t49[t49.NO_PREMULTIPLIED_ALPHA = 0] = "NO_PREMULTIPLIED_ALPHA", t49[t49.PREMULTIPLY_ON_UPLOAD = 1] = "PREMULTIPLY_ON_UPLOAD", t49[t49.PREMULTIPLY_ALPHA = 2] = "PREMULTIPLY_ALPHA", t49[t49.PREMULTIPLIED_ALPHA = 2] = "PREMULTIPLIED_ALPHA";
})(z || (z = {
})), (function(t50) {
    t50[t50.NO = 0] = "NO", t50[t50.YES = 1] = "YES", t50[t50.AUTO = 2] = "AUTO", t50[t50.BLEND = 0] = "BLEND", t50[t50.CLEAR = 1] = "CLEAR", t50[t50.BLIT = 2] = "BLIT";
})(q || (q = {
})), (function(t51) {
    t51[t51.AUTO = 0] = "AUTO", t51[t51.MANUAL = 1] = "MANUAL";
})(K || (K = {
})), (function(t52) {
    t52.LOW = "lowp", t52.MEDIUM = "mediump", t52.HIGH = "highp";
})(Z || (Z = {
})), (function(t53) {
    t53[t53.NONE = 0] = "NONE", t53[t53.SCISSOR = 1] = "SCISSOR", t53[t53.STENCIL = 2] = "STENCIL", t53[t53.SPRITE = 3] = "SPRITE";
})(J || (J = {
})), (function(t54) {
    t54[t54.NONE = 0] = "NONE", t54[t54.LOW = 2] = "LOW", t54[t54.MEDIUM = 4] = "MEDIUM", t54[t54.HIGH = 8] = "HIGH";
})(Q || (Q = {
})), (function(t55) {
    t55[t55.ELEMENT_ARRAY_BUFFER = 34963] = "ELEMENT_ARRAY_BUFFER", t55[t55.ARRAY_BUFFER = 34962] = "ARRAY_BUFFER", t55[t55.UNIFORM_BUFFER = 35345] = "UNIFORM_BUFFER";
})($ || ($ = {
}));
var et = {
    MIPMAP_TEXTURES: W.POW2,
    ANISOTROPIC_LEVEL: 0,
    RESOLUTION: 1,
    FILTER_RESOLUTION: 1,
    FILTER_MULTISAMPLE: Q.NONE,
    SPRITE_MAX_TEXTURES: function(t) {
        var e20, r18 = !0;
        (tt.tablet || tt.phone) && (tt.apple.device && (e20 = navigator.userAgent.match(/OS (\d+)_(\d+)?/)) && parseInt(e20[1], 10) < 11 && (r18 = !1), tt.android.device && (e20 = navigator.userAgent.match(/Android\s([0-9.]*)/)) && parseInt(e20[1], 10) < 7 && (r18 = !1));
        return r18 ? 32 : 4;
    }(),
    SPRITE_BATCH_SIZE: 4096,
    RENDER_OPTIONS: {
        view: null,
        antialias: !1,
        autoDensity: !1,
        backgroundColor: 0,
        backgroundAlpha: 1,
        useContextAlpha: !0,
        clearBeforeRender: !0,
        preserveDrawingBuffer: !1,
        width: 800,
        height: 600,
        legacy: !1
    },
    GC_MODE: K.AUTO,
    GC_MAX_IDLE: 3600,
    GC_MAX_CHECK_COUNT: 600,
    WRAP_MODE: V.CLAMP,
    SCALE_MODE: Y.LINEAR,
    PRECISION_VERTEX: Z.HIGH,
    PRECISION_FRAGMENT: tt.apple.device ? Z.HIGH : Z.MEDIUM,
    CAN_UPLOAD_SAME_BUFFER: !tt.apple.device,
    CREATE_IMAGE_BITMAP: !1,
    ROUND_PIXELS: !1
}, rt = "undefined" != typeof globalThis ? globalThis : "undefined" != typeof window ? window : "undefined" != typeof global ? global : "undefined" != typeof self ? self : {
};
function it(t56, e21, r19) {
    return t56(r19 = {
        path: e21,
        exports: {
        },
        require: function(t, e22) {
            return (function() {
                throw new Error("Dynamic requires are not currently supported by @rollup/plugin-commonjs");
            })(null == e22 && r19.path);
        }
    }, r19.exports), r19.exports;
}
var nt = it(function(t57) {
    var e23 = Object.prototype.hasOwnProperty, r20 = "~";
    function i8() {
    }
    function n7(t58, e24, r21) {
        this.fn = t58, this.context = e24, this.once = r21 || !1;
    }
    function o7(t59, e25, i9, o8, s7) {
        if ("function" != typeof i9) throw new TypeError("The listener must be a function");
        var a5 = new n7(i9, o8 || t59, s7), h = r20 ? r20 + e25 : e25;
        return t59._events[h] ? t59._events[h].fn ? t59._events[h] = [
            t59._events[h],
            a5
        ] : t59._events[h].push(a5) : (t59._events[h] = a5, t59._eventsCount++), t59;
    }
    function s6(t60, e) {
        0 == --t60._eventsCount ? t60._events = new i8 : delete t60._events[e];
    }
    function a4() {
        this._events = new i8, this._eventsCount = 0;
    }
    Object.create && (i8.prototype = Object.create(null), (new i8).__proto__ || (r20 = !1)), a4.prototype.eventNames = function() {
        var t61, i10, n8 = [];
        if (0 === this._eventsCount) return n8;
        for(i10 in t61 = this._events)e23.call(t61, i10) && n8.push(r20 ? i10.slice(1) : i10);
        return Object.getOwnPropertySymbols ? n8.concat(Object.getOwnPropertySymbols(t61)) : n8;
    }, a4.prototype.listeners = function(t62) {
        var e = r20 ? r20 + t62 : t62, i11 = this._events[e];
        if (!i11) return [];
        if (i11.fn) return [
            i11.fn
        ];
        for(var n9 = 0, o9 = i11.length, s8 = new Array(o9); n9 < o9; n9++)s8[n9] = i11[n9].fn;
        return s8;
    }, a4.prototype.listenerCount = function(t63) {
        var e = r20 ? r20 + t63 : t63, i12 = this._events[e];
        return i12 ? i12.fn ? 1 : i12.length : 0;
    }, a4.prototype.emit = function(t64, e26, i13, n10, o10, s9) {
        var a6 = arguments, h = r20 ? r20 + t64 : t64;
        if (!this._events[h]) return !1;
        var u1, l1, c1 = this._events[h], d1 = arguments.length;
        if (c1.fn) {
            switch(c1.once && this.removeListener(t64, c1.fn, void 0, !0), d1){
                case 1:
                    return c1.fn.call(c1.context), !0;
                case 2:
                    return c1.fn.call(c1.context, e26), !0;
                case 3:
                    return c1.fn.call(c1.context, e26, i13), !0;
                case 4:
                    return c1.fn.call(c1.context, e26, i13, n10), !0;
                case 5:
                    return c1.fn.call(c1.context, e26, i13, n10, o10), !0;
                case 6:
                    return c1.fn.call(c1.context, e26, i13, n10, o10, s9), !0;
            }
            for(l1 = 1, u1 = new Array(d1 - 1); l1 < d1; l1++)u1[l1 - 1] = a6[l1];
            c1.fn.apply(c1.context, u1);
        } else {
            var f1, p = c1.length;
            for(l1 = 0; l1 < p; l1++)switch(c1[l1].once && this.removeListener(t64, c1[l1].fn, void 0, !0), d1){
                case 1:
                    c1[l1].fn.call(c1[l1].context);
                    break;
                case 2:
                    c1[l1].fn.call(c1[l1].context, e26);
                    break;
                case 3:
                    c1[l1].fn.call(c1[l1].context, e26, i13);
                    break;
                case 4:
                    c1[l1].fn.call(c1[l1].context, e26, i13, n10);
                    break;
                default:
                    if (!u1) for(f1 = 1, u1 = new Array(d1 - 1); f1 < d1; f1++)u1[f1 - 1] = a6[f1];
                    c1[l1].fn.apply(c1[l1].context, u1);
            }
        }
        return !0;
    }, a4.prototype.on = function(t65, e27, r22) {
        return o7(this, t65, e27, r22, !1);
    }, a4.prototype.once = function(t66, e28, r23) {
        return o7(this, t66, e28, r23, !0);
    }, a4.prototype.removeListener = function(t67, e29, i14, n11) {
        var o11 = r20 ? r20 + t67 : t67;
        if (!this._events[o11]) return this;
        if (!e29) return s6(this, o11), this;
        var a7 = this._events[o11];
        if (a7.fn) a7.fn !== e29 || n11 && !a7.once || i14 && a7.context !== i14 || s6(this, o11);
        else {
            for(var h2 = 0, u2 = [], l2 = a7.length; h2 < l2; h2++)(a7[h2].fn !== e29 || n11 && !a7[h2].once || i14 && a7[h2].context !== i14) && u2.push(a7[h2]);
            u2.length ? this._events[o11] = 1 === u2.length ? u2[0] : u2 : s6(this, o11);
        }
        return this;
    }, a4.prototype.removeAllListeners = function(t68) {
        var e30;
        return t68 ? (e30 = r20 ? r20 + t68 : t68, this._events[e30] && s6(this, e30)) : (this._events = new i8, this._eventsCount = 0), this;
    }, a4.prototype.off = a4.prototype.removeListener, a4.prototype.addListener = a4.prototype.on, a4.prefixed = r20, a4.EventEmitter = a4, t57.exports = a4;
}), ot = at, st = at;
function at(t69, e31, r24) {
    r24 = r24 || 2;
    var i15, n12, o12, s10, a8, h3, u3, l3 = e31 && e31.length, c2 = l3 ? e31[0] * r24 : t69.length, d2 = ht(t69, 0, c2, r24, !0), f2 = [];
    if (!d2 || d2.next === d2.prev) return f2;
    if (l3 && (d2 = (function(t70, e32, r25, i16) {
        var n13, o13, s11, a9, h4, u4 = [];
        for(n13 = 0, o13 = e32.length; n13 < o13; n13++)s11 = e32[n13] * i16, a9 = n13 < o13 - 1 ? e32[n13 + 1] * i16 : t70.length, (h4 = ht(t70, s11, a9, i16, !1)) === h4.next && (h4.steiner = !0), u4.push(gt(h4));
        for(u4.sort(_t), n13 = 0; n13 < u4.length; n13++)mt(u4[n13], r25), r25 = ut(r25, r25.next);
        return r25;
    })(t69, e31, d2, r24)), t69.length > 80 * r24) {
        i15 = o12 = t69[0], n12 = s10 = t69[1];
        for(var p = r24; p < c2; p += r24)(a8 = t69[p]) < i15 && (i15 = a8), (h3 = t69[p + 1]) < n12 && (n12 = h3), a8 > o12 && (o12 = a8), h3 > s10 && (s10 = h3);
        u3 = 0 !== (u3 = Math.max(o12 - i15, s10 - n12)) ? 1 / u3 : 0;
    }
    return lt(d2, f2, r24, i15, n12, u3), f2;
}
function ht(t71, e33, r26, i17, n14) {
    var o14, s12;
    if (n14 === Dt(t71, e33, r26, i17) > 0) for(o14 = e33; o14 < r26; o14 += i17)s12 = Pt(o14, t71[o14], t71[o14 + 1], s12);
    else for(o14 = r26 - i17; o14 >= e33; o14 -= i17)s12 = Pt(o14, t71[o14], t71[o14 + 1], s12);
    return s12 && xt(s12, s12.next) && (Nt(s12), s12 = s12.next), s12;
}
function ut(t72, e34) {
    if (!t72) return t72;
    e34 || (e34 = t72);
    var r27, i18 = t72;
    do {
        if (r27 = !1, i18.steiner || !xt(i18, i18.next) && 0 !== bt(i18.prev, i18, i18.next)) i18 = i18.next;
        else {
            if (Nt(i18), (i18 = e34 = i18.prev) === i18.next) break;
            r27 = !0;
        }
    }while (r27 || i18 !== e34)
    return e34;
}
function lt(t73, e35, r28, i19, n15, o15, s13) {
    if (t73) {
        !s13 && o15 && (function(t74, e36, r29, i20) {
            var n16 = t74;
            do {
                null === n16.z && (n16.z = yt(n16.x, n16.y, e36, r29, i20)), n16.prevZ = n16.prev, n16.nextZ = n16.next, n16 = n16.next;
            }while (n16 !== t74)
            n16.prevZ.nextZ = null, n16.prevZ = null, (function(t75) {
                var e37, r30, i21, n17, o16, s14, a11, h6, u6 = 1;
                do {
                    for(r30 = t75, t75 = null, o16 = null, s14 = 0; r30;){
                        for(s14++, i21 = r30, a11 = 0, e37 = 0; e37 < u6 && (a11++, i21 = i21.nextZ); e37++);
                        for(h6 = u6; a11 > 0 || h6 > 0 && i21;)0 !== a11 && (0 === h6 || !i21 || r30.z <= i21.z) ? (n17 = r30, r30 = r30.nextZ, a11--) : (n17 = i21, i21 = i21.nextZ, h6--), o16 ? o16.nextZ = n17 : t75 = n17, n17.prevZ = o16, o16 = n17;
                        r30 = i21;
                    }
                    o16.nextZ = null, u6 *= 2;
                }while (s14 > 1)
            })(n16);
        })(t73, i19, n15, o15);
        for(var a10, h5, u5 = t73; t73.prev !== t73.next;)if (a10 = t73.prev, h5 = t73.next, o15 ? dt(t73, i19, n15, o15) : ct(t73)) e35.push(a10.i / r28), e35.push(t73.i / r28), e35.push(h5.i / r28), Nt(t73), t73 = h5.next, u5 = h5.next;
        else if ((t73 = h5) === u5) {
            s13 ? 1 === s13 ? lt(t73 = ft(ut(t73), e35, r28), e35, r28, i19, n15, o15, 2) : 2 === s13 && pt(t73, e35, r28, i19, n15, o15) : lt(ut(t73), e35, r28, i19, n15, o15, 1);
            break;
        }
    }
}
function ct(t76) {
    var e38 = t76.prev, r31 = t76, i22 = t76.next;
    if (bt(e38, r31, i22) >= 0) return !1;
    for(var n18 = t76.next.next; n18 !== t76.prev;){
        if (Et(e38.x, e38.y, r31.x, r31.y, i22.x, i22.y, n18.x, n18.y) && bt(n18.prev, n18, n18.next) >= 0) return !1;
        n18 = n18.next;
    }
    return !0;
}
function dt(t77, e39, r32, i23) {
    var n19 = t77.prev, o17 = t77, s15 = t77.next;
    if (bt(n19, o17, s15) >= 0) return !1;
    for(var a12 = n19.x < o17.x ? n19.x < s15.x ? n19.x : s15.x : o17.x < s15.x ? o17.x : s15.x, h7 = n19.y < o17.y ? n19.y < s15.y ? n19.y : s15.y : o17.y < s15.y ? o17.y : s15.y, u7 = n19.x > o17.x ? n19.x > s15.x ? n19.x : s15.x : o17.x > s15.x ? o17.x : s15.x, l4 = n19.y > o17.y ? n19.y > s15.y ? n19.y : s15.y : o17.y > s15.y ? o17.y : s15.y, c3 = yt(a12, h7, e39, r32, i23), d3 = yt(u7, l4, e39, r32, i23), f3 = t77.prevZ, p = t77.nextZ; f3 && f3.z >= c3 && p && p.z <= d3;){
        if (f3 !== t77.prev && f3 !== t77.next && Et(n19.x, n19.y, o17.x, o17.y, s15.x, s15.y, f3.x, f3.y) && bt(f3.prev, f3, f3.next) >= 0) return !1;
        if (f3 = f3.prevZ, p !== t77.prev && p !== t77.next && Et(n19.x, n19.y, o17.x, o17.y, s15.x, s15.y, p.x, p.y) && bt(p.prev, p, p.next) >= 0) return !1;
        p = p.nextZ;
    }
    for(; f3 && f3.z >= c3;){
        if (f3 !== t77.prev && f3 !== t77.next && Et(n19.x, n19.y, o17.x, o17.y, s15.x, s15.y, f3.x, f3.y) && bt(f3.prev, f3, f3.next) >= 0) return !1;
        f3 = f3.prevZ;
    }
    for(; p && p.z <= d3;){
        if (p !== t77.prev && p !== t77.next && Et(n19.x, n19.y, o17.x, o17.y, s15.x, s15.y, p.x, p.y) && bt(p.prev, p, p.next) >= 0) return !1;
        p = p.nextZ;
    }
    return !0;
}
function ft(t78, e40, r33) {
    var i24 = t78;
    do {
        var n20 = i24.prev, o18 = i24.next.next;
        !xt(n20, o18) && Rt(n20, i24, i24.next, o18) && St(n20, o18) && St(o18, n20) && (e40.push(n20.i / r33), e40.push(i24.i / r33), e40.push(o18.i / r33), Nt(i24), Nt(i24.next), i24 = t78 = o18), i24 = i24.next;
    }while (i24 !== t78)
    return ut(i24);
}
function pt(t79, e41, r34, i25, n21, o19) {
    var s16 = t79;
    do {
        for(var a13 = s16.next.next; a13 !== s16.prev;){
            if (s16.i !== a13.i && Tt(s16, a13)) {
                var h8 = It(s16, a13);
                return s16 = ut(s16, s16.next), h8 = ut(h8, h8.next), lt(s16, e41, r34, i25, n21, o19), void lt(h8, e41, r34, i25, n21, o19);
            }
            a13 = a13.next;
        }
        s16 = s16.next;
    }while (s16 !== t79)
}
function _t(t80, e42) {
    return t80.x - e42.x;
}
function mt(t81, e43) {
    if (e43 = (function(t82, e44) {
        var r36, i26 = e44, n22 = t82.x, o20 = t82.y, s17 = -1 / 0;
        do {
            if (o20 <= i26.y && o20 >= i26.next.y && i26.next.y !== i26.y) {
                var a14 = i26.x + (o20 - i26.y) * (i26.next.x - i26.x) / (i26.next.y - i26.y);
                if (a14 <= n22 && a14 > s17) {
                    if (s17 = a14, a14 === n22) {
                        if (o20 === i26.y) return i26;
                        if (o20 === i26.next.y) return i26.next;
                    }
                    r36 = i26.x < i26.next.x ? i26 : i26.next;
                }
            }
            i26 = i26.next;
        }while (i26 !== e44)
        if (!r36) return null;
        if (n22 === s17) return r36;
        var h9, u8 = r36, l5 = r36.x, c4 = r36.y, d4 = 1 / 0;
        i26 = r36;
        do {
            n22 >= i26.x && i26.x >= l5 && n22 !== i26.x && Et(o20 < c4 ? n22 : s17, o20, l5, c4, o20 < c4 ? s17 : n22, o20, i26.x, i26.y) && (h9 = Math.abs(o20 - i26.y) / (n22 - i26.x), St(i26, t82) && (h9 < d4 || h9 === d4 && (i26.x > r36.x || i26.x === r36.x && vt(r36, i26))) && (r36 = i26, d4 = h9)), i26 = i26.next;
        }while (i26 !== u8)
        return r36;
    })(t81, e43)) {
        var r35 = It(e43, t81);
        ut(e43, e43.next), ut(r35, r35.next);
    }
}
function vt(t83, e45) {
    return bt(t83.prev, t83, e45.prev) < 0 && bt(e45.next, t83, t83.next) < 0;
}
function yt(t84, e46, r37, i27, n23) {
    return (t84 = 1431655765 & ((t84 = 858993459 & ((t84 = 252645135 & ((t84 = 16711935 & ((t84 = 32767 * (t84 - r37) * n23) | t84 << 8)) | t84 << 4)) | t84 << 2)) | t84 << 1)) | (e46 = 1431655765 & ((e46 = 858993459 & ((e46 = 252645135 & ((e46 = 16711935 & ((e46 = 32767 * (e46 - i27) * n23) | e46 << 8)) | e46 << 4)) | e46 << 2)) | e46 << 1)) << 1;
}
function gt(t85) {
    var e47 = t85, r38 = t85;
    do {
        (e47.x < r38.x || e47.x === r38.x && e47.y < r38.y) && (r38 = e47), e47 = e47.next;
    }while (e47 !== t85)
    return r38;
}
function Et(t86, e48, r39, i28, n24, o21, s18, a15) {
    return (n24 - s18) * (e48 - a15) - (t86 - s18) * (o21 - a15) >= 0 && (t86 - s18) * (i28 - a15) - (r39 - s18) * (e48 - a15) >= 0 && (r39 - s18) * (o21 - a15) - (n24 - s18) * (i28 - a15) >= 0;
}
function Tt(t87, e49) {
    return t87.next.i !== e49.i && t87.prev.i !== e49.i && !function(t88, e50) {
        var r40 = t88;
        do {
            if (r40.i !== t88.i && r40.next.i !== t88.i && r40.i !== e50.i && r40.next.i !== e50.i && Rt(r40, r40.next, t88, e50)) return !0;
            r40 = r40.next;
        }while (r40 !== t88)
        return !1;
    }(t87, e49) && (St(t87, e49) && St(e49, t87) && (function(t89, e51) {
        var r41 = t89, i29 = !1, n25 = (t89.x + e51.x) / 2, o22 = (t89.y + e51.y) / 2;
        do {
            r41.y > o22 != r41.next.y > o22 && r41.next.y !== r41.y && n25 < (r41.next.x - r41.x) * (o22 - r41.y) / (r41.next.y - r41.y) + r41.x && (i29 = !i29), r41 = r41.next;
        }while (r41 !== t89)
        return i29;
    })(t87, e49) && (bt(t87.prev, t87, e49.prev) || bt(t87, e49.prev, e49)) || xt(t87, e49) && bt(t87.prev, t87, t87.next) > 0 && bt(e49.prev, e49, e49.next) > 0);
}
function bt(t90, e52, r42) {
    return (e52.y - t90.y) * (r42.x - e52.x) - (e52.x - t90.x) * (r42.y - e52.y);
}
function xt(t91, e53) {
    return t91.x === e53.x && t91.y === e53.y;
}
function Rt(t92, e54, r43, i30) {
    var n26 = Ot(bt(t92, e54, r43)), o23 = Ot(bt(t92, e54, i30)), s19 = Ot(bt(r43, i30, t92)), a16 = Ot(bt(r43, i30, e54));
    return n26 !== o23 && s19 !== a16 || !(0 !== n26 || !At(t92, r43, e54)) || !(0 !== o23 || !At(t92, i30, e54)) || !(0 !== s19 || !At(r43, t92, i30)) || !(0 !== a16 || !At(r43, e54, i30));
}
function At(t93, e55, r44) {
    return e55.x <= Math.max(t93.x, r44.x) && e55.x >= Math.min(t93.x, r44.x) && e55.y <= Math.max(t93.y, r44.y) && e55.y >= Math.min(t93.y, r44.y);
}
function Ot(t94) {
    return t94 > 0 ? 1 : t94 < 0 ? -1 : 0;
}
function St(t95, e56) {
    return bt(t95.prev, t95, t95.next) < 0 ? bt(t95, e56, t95.next) >= 0 && bt(t95, t95.prev, e56) >= 0 : bt(t95, e56, t95.prev) < 0 || bt(t95, t95.next, e56) < 0;
}
function It(t96, e57) {
    var r45 = new Mt(t96.i, t96.x, t96.y), i31 = new Mt(e57.i, e57.x, e57.y), n27 = t96.next, o24 = e57.prev;
    return t96.next = e57, e57.prev = t96, r45.next = n27, n27.prev = r45, i31.next = r45, r45.prev = i31, o24.next = i31, i31.prev = o24, i31;
}
function Pt(t97, e58, r46, i32) {
    var n28 = new Mt(t97, e58, r46);
    return i32 ? (n28.next = i32.next, n28.prev = i32, i32.next.prev = n28, i32.next = n28) : (n28.prev = n28, n28.next = n28), n28;
}
function Nt(t98) {
    t98.next.prev = t98.prev, t98.prev.next = t98.next, t98.prevZ && (t98.prevZ.nextZ = t98.nextZ), t98.nextZ && (t98.nextZ.prevZ = t98.prevZ);
}
function Mt(t99, e59, r47) {
    this.i = t99, this.x = e59, this.y = r47, this.prev = null, this.next = null, this.z = null, this.prevZ = null, this.nextZ = null, this.steiner = !1;
}
function Dt(t100, e60, r48, i33) {
    for(var n29 = 0, o25 = e60, s20 = r48 - i33; o25 < r48; o25 += i33)n29 += (t100[s20] - t100[o25]) * (t100[o25 + 1] + t100[s20 + 1]), s20 = o25;
    return n29;
}
at.deviation = function(t101, e61, r49, i34) {
    var n30 = e61 && e61.length, o26 = n30 ? e61[0] * r49 : t101.length, s21 = Math.abs(Dt(t101, 0, o26, r49));
    if (n30) for(var a17 = 0, h10 = e61.length; a17 < h10; a17++){
        var u9 = e61[a17] * r49, l6 = a17 < h10 - 1 ? e61[a17 + 1] * r49 : t101.length;
        s21 -= Math.abs(Dt(t101, u9, l6, r49));
    }
    var c5 = 0;
    for(a17 = 0; a17 < i34.length; a17 += 3){
        var d = i34[a17] * r49, f = i34[a17 + 1] * r49, p = i34[a17 + 2] * r49;
        c5 += Math.abs((t101[d] - t101[p]) * (t101[f + 1] - t101[d + 1]) - (t101[d] - t101[f]) * (t101[p + 1] - t101[d + 1]));
    }
    return 0 === s21 && 0 === c5 ? 0 : Math.abs((c5 - s21) / s21);
}, at.flatten = function(t102) {
    for(var e62 = t102[0][0].length, r50 = {
        vertices: [],
        holes: [],
        dimensions: e62
    }, i35 = 0, n31 = 0; n31 < t102.length; n31++){
        for(var o27 = 0; o27 < t102[n31].length; o27++)for(var s22 = 0; s22 < e62; s22++)r50.vertices.push(t102[n31][o27][s22]);
        n31 > 0 && (i35 += t102[n31 - 1].length, r50.holes.push(i35));
    }
    return r50;
}, ot.default = st;
var Ct = it(function(t103, e63) {
    !function(r51) {
        var i36 = e63 && !e63.nodeType && e63, n32 = t103 && !t103.nodeType && t103, o28 = "object" == typeof rt && rt;
        o28.global !== o28 && o28.window !== o28 && o28.self !== o28 || (r51 = o28);
        var s23, a18, h11 = 2147483647, u10 = 36, l7 = 1, c6 = 26, d5 = 38, f4 = 700, p = 72, _1 = 128, m1 = "-", v1 = /^xn--/, y1 = /[^\x20-\x7E]/, g1 = /[\x2E\u3002\uFF0E\uFF61]/g, E1 = {
            overflow: "Overflow: input needs wider integers to process",
            "not-basic": "Illegal input >= 0x80 (not a basic code point)",
            "invalid-input": "Invalid input"
        }, T1 = u10 - l7, b1 = Math.floor, x1 = String.fromCharCode;
        function R1(t) {
            throw RangeError(E1[t]);
        }
        function A1(t104, e64) {
            for(var r52 = t104.length, i37 = []; r52--;)i37[r52] = e64(t104[r52]);
            return i37;
        }
        function O1(t105, e65) {
            var r53 = t105.split("@"), i38 = "";
            return r53.length > 1 && (i38 = r53[0] + "@", t105 = r53[1]), i38 + A1((t105 = t105.replace(g1, ".")).split("."), e65).join(".");
        }
        function S1(t106) {
            for(var e66, r54, i39 = [], n33 = 0, o29 = t106.length; n33 < o29;)(e66 = t106.charCodeAt(n33++)) >= 55296 && e66 <= 56319 && n33 < o29 ? 56320 == (64512 & (r54 = t106.charCodeAt(n33++))) ? i39.push(((1023 & e66) << 10) + (1023 & r54) + 65536) : (i39.push(e66), n33--) : i39.push(e66);
            return i39;
        }
        function I1(t107) {
            return A1(t107, function(t108) {
                var e67 = "";
                return t108 > 65535 && (e67 += x1((t108 -= 65536) >>> 10 & 1023 | 55296), t108 = 56320 | 1023 & t108), e67 += x1(t108);
            }).join("");
        }
        function P1(t109, e68) {
            return t109 + 22 + 75 * (t109 < 26) - ((0 != e68) << 5);
        }
        function N1(t110, e69, r55) {
            var i40 = 0;
            for(t110 = r55 ? b1(t110 / f4) : t110 >> 1, t110 += b1(t110 / e69); t110 > T1 * c6 >> 1; i40 += u10)t110 = b1(t110 / T1);
            return b1(i40 + (T1 + 1) * t110 / (t110 + d5));
        }
        function M1(t111) {
            var e70, r56, i41, n34, o30, s24, a19, d6, f5, v2, y, g2 = [], E2 = t111.length, T2 = 0, x2 = _1, A2 = p;
            for((r56 = t111.lastIndexOf(m1)) < 0 && (r56 = 0), i41 = 0; i41 < r56; ++i41)t111.charCodeAt(i41) >= 128 && R1("not-basic"), g2.push(t111.charCodeAt(i41));
            for(n34 = r56 > 0 ? r56 + 1 : 0; n34 < E2;){
                for(o30 = T2, s24 = 1, a19 = u10; n34 >= E2 && R1("invalid-input"), ((d6 = (y = t111.charCodeAt(n34++)) - 48 < 10 ? y - 22 : y - 65 < 26 ? y - 65 : y - 97 < 26 ? y - 97 : u10) >= u10 || d6 > b1((h11 - T2) / s24)) && R1("overflow"), T2 += d6 * s24, !(d6 < (f5 = a19 <= A2 ? l7 : a19 >= A2 + c6 ? c6 : a19 - A2)); a19 += u10)s24 > b1(h11 / (v2 = u10 - f5)) && R1("overflow"), s24 *= v2;
                A2 = N1(T2 - o30, e70 = g2.length + 1, 0 == o30), b1(T2 / e70) > h11 - x2 && R1("overflow"), x2 += b1(T2 / e70), T2 %= e70, g2.splice(T2++, 0, x2);
            }
            return I1(g2);
        }
        function D1(t112) {
            var e71, r57, i42, n35, o31, s25, a20, d7, f6, v3, y, g3, E3, T3, A3, O2 = [];
            for(g3 = (t112 = S1(t112)).length, e71 = _1, r57 = 0, o31 = p, s25 = 0; s25 < g3; ++s25)(y = t112[s25]) < 128 && O2.push(x1(y));
            for(i42 = n35 = O2.length, n35 && O2.push(m1); i42 < g3;){
                for(a20 = h11, s25 = 0; s25 < g3; ++s25)(y = t112[s25]) >= e71 && y < a20 && (a20 = y);
                for(a20 - e71 > b1((h11 - r57) / (E3 = i42 + 1)) && R1("overflow"), r57 += (a20 - e71) * E3, e71 = a20, s25 = 0; s25 < g3; ++s25)if ((y = t112[s25]) < e71 && ++r57 > h11 && R1("overflow"), y == e71) {
                    for(d7 = r57, f6 = u10; !(d7 < (v3 = f6 <= o31 ? l7 : f6 >= o31 + c6 ? c6 : f6 - o31)); f6 += u10)A3 = d7 - v3, T3 = u10 - v3, O2.push(x1(P1(v3 + A3 % T3, 0))), d7 = b1(A3 / T3);
                    O2.push(x1(P1(d7, 0))), o31 = N1(r57, E3, i42 == n35), r57 = 0, ++i42;
                }
                ++r57, ++e71;
            }
            return O2.join("");
        }
        if (s23 = {
            version: "1.3.2",
            ucs2: {
                decode: S1,
                encode: I1
            },
            decode: M1,
            encode: D1,
            toASCII: function(t113) {
                return O1(t113, function(t114) {
                    return y1.test(t114) ? "xn--" + D1(t114) : t114;
                });
            },
            toUnicode: function(t115) {
                return O1(t115, function(t116) {
                    return v1.test(t116) ? M1(t116.slice(4).toLowerCase()) : t116;
                });
            }
        }, i36 && n32) if (t103.exports == i36) n32.exports = s23;
        else for(a18 in s23)s23.hasOwnProperty(a18) && (i36[a18] = s23[a18]);
        else r51.punycode = s23;
    }(rt);
}), wt = {
    isString: function(t117) {
        return "string" == typeof t117;
    },
    isObject: function(t118) {
        return "object" == typeof t118 && null !== t118;
    },
    isNull: function(t119) {
        return null === t119;
    },
    isNullOrUndefined: function(t120) {
        return null == t120;
    }
};
function Lt(t121, e72) {
    return Object.prototype.hasOwnProperty.call(t121, e72);
}
var Ft = function(t122, e73, r58, i43) {
    e73 = e73 || "&", r58 = r58 || "=";
    var n36 = {
    };
    if ("string" != typeof t122 || 0 === t122.length) return n36;
    var o32 = /\+/g;
    t122 = t122.split(e73);
    var s26 = 1000;
    i43 && "number" == typeof i43.maxKeys && (s26 = i43.maxKeys);
    var a21 = t122.length;
    s26 > 0 && a21 > s26 && (a21 = s26);
    for(var h12 = 0; h12 < a21; ++h12){
        var u11, l8, c7, d8, f7 = t122[h12].replace(o32, "%20"), p = f7.indexOf(r58);
        p >= 0 ? (u11 = f7.substr(0, p), l8 = f7.substr(p + 1)) : (u11 = f7, l8 = ""), c7 = decodeURIComponent(u11), d8 = decodeURIComponent(l8), Lt(n36, c7) ? Array.isArray(n36[c7]) ? n36[c7].push(d8) : n36[c7] = [
            n36[c7],
            d8
        ] : n36[c7] = d8;
    }
    return n36;
}, Ut = function(t123) {
    switch(typeof t123){
        case "string":
            return t123;
        case "boolean":
            return t123 ? "true" : "false";
        case "number":
            return isFinite(t123) ? t123 : "";
        default:
            return "";
    }
}, Gt = function(t124, e74, r59, i44) {
    return e74 = e74 || "&", r59 = r59 || "=", null === t124 && (t124 = void 0), "object" == typeof t124 ? Object.keys(t124).map(function(i45) {
        var n37 = encodeURIComponent(Ut(i45)) + r59;
        return Array.isArray(t124[i45]) ? t124[i45].map(function(t125) {
            return n37 + encodeURIComponent(Ut(t125));
        }).join(e74) : n37 + encodeURIComponent(Ut(t124[i45]));
    }).join(e74) : i44 ? encodeURIComponent(Ut(i44)) + r59 + encodeURIComponent(Ut(t124)) : "";
}, Bt = it(function(t, e75) {
    e75.decode = e75.parse = Ft, e75.encode = e75.stringify = Gt;
}), Xt = re, kt = function(t126, e76) {
    return re(t126, !1, !0).resolve(e76);
}, Ht = function(t127) {
    wt.isString(t127) && (t127 = re(t127));
    if (!(t127 instanceof jt)) return jt.prototype.format.call(t127);
    return t127.format();
};
function jt() {
    this.protocol = null, this.slashes = null, this.auth = null, this.host = null, this.port = null, this.hostname = null, this.hash = null, this.search = null, this.query = null, this.pathname = null, this.path = null, this.href = null;
}
var Yt = /^([a-z0-9.+-]+:)/i, Vt = /:[0-9]*$/, Wt = /^(\/\/?(?!\/)[^\?\s]*)(\?[^\s]*)?$/, zt = [
    "{",
    "}",
    "|",
    "\\",
    "^",
    "`"
].concat([
    "<",
    ">",
    '"',
    "`",
    " ",
    "\r",
    "\n",
    "\t"
]), qt = [
    "'"
].concat(zt), Kt = [
    "%",
    "/",
    "?",
    ";",
    "#"
].concat(qt), Zt = [
    "/",
    "?",
    "#"
], Jt = /^[+a-z0-9A-Z_-]{0,63}$/, Qt = /^([+a-z0-9A-Z_-]{0,63})(.*)$/, $t = {
    javascript: !0,
    "javascript:": !0
}, te = {
    javascript: !0,
    "javascript:": !0
}, ee = {
    http: !0,
    https: !0,
    ftp: !0,
    gopher: !0,
    file: !0,
    "http:": !0,
    "https:": !0,
    "ftp:": !0,
    "gopher:": !0,
    "file:": !0
};
function re(t128, e77, r60) {
    if (t128 && wt.isObject(t128) && t128 instanceof jt) return t128;
    var i46 = new jt;
    return i46.parse(t128, e77, r60), i46;
}
jt.prototype.parse = function(t129, e78, r61) {
    if (!wt.isString(t129)) throw new TypeError("Parameter 'url' must be a string, not " + typeof t129);
    var i47 = t129.indexOf("?"), n38 = -1 !== i47 && i47 < t129.indexOf("#") ? "?" : "#", o33 = t129.split(n38);
    o33[0] = o33[0].replace(/\\/g, "/");
    var s27 = t129 = o33.join(n38);
    if (s27 = s27.trim(), !r61 && 1 === t129.split("#").length) {
        var a22 = Wt.exec(s27);
        if (a22) return this.path = s27, this.href = s27, this.pathname = a22[1], a22[2] ? (this.search = a22[2], this.query = e78 ? Bt.parse(this.search.substr(1)) : this.search.substr(1)) : e78 && (this.search = "", this.query = {
        }), this;
    }
    var h13 = Yt.exec(s27);
    if (h13) {
        var u12 = (h13 = h13[0]).toLowerCase();
        this.protocol = u12, s27 = s27.substr(h13.length);
    }
    if (r61 || h13 || s27.match(/^\/\/[^@\/]+@[^@\/]+/)) {
        var l9 = "//" === s27.substr(0, 2);
        !l9 || h13 && te[h13] || (s27 = s27.substr(2), this.slashes = !0);
    }
    if (!te[h13] && (l9 || h13 && !ee[h13])) {
        for(var c8, d9, f8 = -1, p = 0; p < Zt.length; p++){
            -1 !== (_2 = s27.indexOf(Zt[p])) && (-1 === f8 || _2 < f8) && (f8 = _2);
        }
        -1 !== (d9 = -1 === f8 ? s27.lastIndexOf("@") : s27.lastIndexOf("@", f8)) && (c8 = s27.slice(0, d9), s27 = s27.slice(d9 + 1), this.auth = decodeURIComponent(c8)), f8 = -1;
        for(p = 0; p < Kt.length; p++){
            var _2;
            -1 !== (_2 = s27.indexOf(Kt[p])) && (-1 === f8 || _2 < f8) && (f8 = _2);
        }
        -1 === f8 && (f8 = s27.length), this.host = s27.slice(0, f8), s27 = s27.slice(f8), this.parseHost(), this.hostname = this.hostname || "";
        var m2 = "[" === this.hostname[0] && "]" === this.hostname[this.hostname.length - 1];
        if (!m2) for(var v4 = this.hostname.split(/\./), y = (p = 0, v4.length); p < y; p++){
            var g4 = v4[p];
            if (g4 && !g4.match(Jt)) {
                for(var E4 = "", T4 = 0, b2 = g4.length; T4 < b2; T4++)g4.charCodeAt(T4) > 127 ? E4 += "x" : E4 += g4[T4];
                if (!E4.match(Jt)) {
                    var x3 = v4.slice(0, p), R2 = v4.slice(p + 1), A4 = g4.match(Qt);
                    A4 && (x3.push(A4[1]), R2.unshift(A4[2])), R2.length && (s27 = "/" + R2.join(".") + s27), this.hostname = x3.join(".");
                    break;
                }
            }
        }
        this.hostname.length > 255 ? this.hostname = "" : this.hostname = this.hostname.toLowerCase(), m2 || (this.hostname = Ct.toASCII(this.hostname));
        var O3 = this.port ? ":" + this.port : "", S2 = this.hostname || "";
        this.host = S2 + O3, this.href += this.host, m2 && (this.hostname = this.hostname.substr(1, this.hostname.length - 2), "/" !== s27[0] && (s27 = "/" + s27));
    }
    if (!$t[u12]) for(p = 0, y = qt.length; p < y; p++){
        var I2 = qt[p];
        if (-1 !== s27.indexOf(I2)) {
            var P2 = encodeURIComponent(I2);
            P2 === I2 && (P2 = escape(I2)), s27 = s27.split(I2).join(P2);
        }
    }
    var N2 = s27.indexOf("#");
    -1 !== N2 && (this.hash = s27.substr(N2), s27 = s27.slice(0, N2));
    var M2 = s27.indexOf("?");
    if (-1 !== M2 ? (this.search = s27.substr(M2), this.query = s27.substr(M2 + 1), e78 && (this.query = Bt.parse(this.query)), s27 = s27.slice(0, M2)) : e78 && (this.search = "", this.query = {
    }), s27 && (this.pathname = s27), ee[u12] && this.hostname && !this.pathname && (this.pathname = "/"), this.pathname || this.search) {
        O3 = this.pathname || "";
        var D2 = this.search || "";
        this.path = O3 + D2;
    }
    return this.href = this.format(), this;
}, jt.prototype.format = function() {
    var t130 = this.auth || "";
    t130 && (t130 = (t130 = encodeURIComponent(t130)).replace(/%3A/i, ":"), t130 += "@");
    var e79 = this.protocol || "", r62 = this.pathname || "", i48 = this.hash || "", n39 = !1, o34 = "";
    this.host ? n39 = t130 + this.host : this.hostname && (n39 = t130 + (-1 === this.hostname.indexOf(":") ? this.hostname : "[" + this.hostname + "]"), this.port && (n39 += ":" + this.port)), this.query && wt.isObject(this.query) && Object.keys(this.query).length && (o34 = Bt.stringify(this.query));
    var s28 = this.search || o34 && "?" + o34 || "";
    return e79 && ":" !== e79.substr(-1) && (e79 += ":"), this.slashes || (!e79 || ee[e79]) && !1 !== n39 ? (n39 = "//" + (n39 || ""), r62 && "/" !== r62.charAt(0) && (r62 = "/" + r62)) : n39 || (n39 = ""), i48 && "#" !== i48.charAt(0) && (i48 = "#" + i48), s28 && "?" !== s28.charAt(0) && (s28 = "?" + s28), e79 + n39 + (r62 = r62.replace(/[?#]/g, function(t131) {
        return encodeURIComponent(t131);
    })) + (s28 = s28.replace("#", "%23")) + i48;
}, jt.prototype.resolve = function(t132) {
    return this.resolveObject(re(t132, !1, !0)).format();
}, jt.prototype.resolveObject = function(t133) {
    if (wt.isString(t133)) {
        var e80 = new jt;
        e80.parse(t133, !1, !0), t133 = e80;
    }
    for(var r63 = new jt, i49 = Object.keys(this), n40 = 0; n40 < i49.length; n40++){
        var o = i49[n40];
        r63[o] = this[o];
    }
    if (r63.hash = t133.hash, "" === t133.href) return r63.href = r63.format(), r63;
    if (t133.slashes && !t133.protocol) {
        for(var s29 = Object.keys(t133), a23 = 0; a23 < s29.length; a23++){
            var h14 = s29[a23];
            "protocol" !== h14 && (r63[h14] = t133[h14]);
        }
        return ee[r63.protocol] && r63.hostname && !r63.pathname && (r63.path = r63.pathname = "/"), r63.href = r63.format(), r63;
    }
    if (t133.protocol && t133.protocol !== r63.protocol) {
        if (!ee[t133.protocol]) {
            for(var u13 = Object.keys(t133), l10 = 0; l10 < u13.length; l10++){
                var c = u13[l10];
                r63[c] = t133[c];
            }
            return r63.href = r63.format(), r63;
        }
        if (r63.protocol = t133.protocol, t133.host || te[t133.protocol]) r63.pathname = t133.pathname;
        else {
            for(var d10 = (t133.pathname || "").split("/"); d10.length && !(t133.host = d10.shift()););
            t133.host || (t133.host = ""), t133.hostname || (t133.hostname = ""), "" !== d10[0] && d10.unshift(""), d10.length < 2 && d10.unshift(""), r63.pathname = d10.join("/");
        }
        if (r63.search = t133.search, r63.query = t133.query, r63.host = t133.host || "", r63.auth = t133.auth, r63.hostname = t133.hostname || t133.host, r63.port = t133.port, r63.pathname || r63.search) {
            var f9 = r63.pathname || "", p = r63.search || "";
            r63.path = f9 + p;
        }
        return r63.slashes = r63.slashes || t133.slashes, r63.href = r63.format(), r63;
    }
    var _3 = r63.pathname && "/" === r63.pathname.charAt(0), m3 = t133.host || t133.pathname && "/" === t133.pathname.charAt(0), v5 = m3 || _3 || r63.host && t133.pathname, y = v5, g5 = r63.pathname && r63.pathname.split("/") || [], E5 = (d10 = t133.pathname && t133.pathname.split("/") || [], r63.protocol && !ee[r63.protocol]);
    if (E5 && (r63.hostname = "", r63.port = null, r63.host && ("" === g5[0] ? g5[0] = r63.host : g5.unshift(r63.host)), r63.host = "", t133.protocol && (t133.hostname = null, t133.port = null, t133.host && ("" === d10[0] ? d10[0] = t133.host : d10.unshift(t133.host)), t133.host = null), v5 = v5 && ("" === d10[0] || "" === g5[0])), m3) r63.host = t133.host || "" === t133.host ? t133.host : r63.host, r63.hostname = t133.hostname || "" === t133.hostname ? t133.hostname : r63.hostname, r63.search = t133.search, r63.query = t133.query, g5 = d10;
    else if (d10.length) g5 || (g5 = []), g5.pop(), g5 = g5.concat(d10), r63.search = t133.search, r63.query = t133.query;
    else if (!wt.isNullOrUndefined(t133.search)) {
        if (E5) r63.hostname = r63.host = g5.shift(), (A5 = !!(r63.host && r63.host.indexOf("@") > 0) && r63.host.split("@")) && (r63.auth = A5.shift(), r63.host = r63.hostname = A5.shift());
        return r63.search = t133.search, r63.query = t133.query, wt.isNull(r63.pathname) && wt.isNull(r63.search) || (r63.path = (r63.pathname ? r63.pathname : "") + (r63.search ? r63.search : "")), r63.href = r63.format(), r63;
    }
    if (!g5.length) return r63.pathname = null, r63.search ? r63.path = "/" + r63.search : r63.path = null, r63.href = r63.format(), r63;
    for(var T5 = g5.slice(-1)[0], b3 = (r63.host || t133.host || g5.length > 1) && ("." === T5 || ".." === T5) || "" === T5, x4 = 0, R3 = g5.length; R3 >= 0; R3--)"." === (T5 = g5[R3]) ? g5.splice(R3, 1) : ".." === T5 ? (g5.splice(R3, 1), x4++) : x4 && (g5.splice(R3, 1), x4--);
    if (!v5 && !y) for(; x4--; x4)g5.unshift("..");
    !v5 || "" === g5[0] || g5[0] && "/" === g5[0].charAt(0) || g5.unshift(""), b3 && "/" !== g5.join("/").substr(-1) && g5.push("");
    var A5, O4 = "" === g5[0] || g5[0] && "/" === g5[0].charAt(0);
    E5 && (r63.hostname = r63.host = O4 ? "" : g5.length ? g5.shift() : "", (A5 = !!(r63.host && r63.host.indexOf("@") > 0) && r63.host.split("@")) && (r63.auth = A5.shift(), r63.host = r63.hostname = A5.shift()));
    return (v5 = v5 || r63.host && g5.length) && !O4 && g5.unshift(""), g5.length ? r63.pathname = g5.join("/") : (r63.pathname = null, r63.path = null), wt.isNull(r63.pathname) && wt.isNull(r63.search) || (r63.path = (r63.pathname ? r63.pathname : "") + (r63.search ? r63.search : "")), r63.auth = t133.auth || r63.auth, r63.slashes = r63.slashes || t133.slashes, r63.href = r63.format(), r63;
}, jt.prototype.parseHost = function() {
    var t134 = this.host, e81 = Vt.exec(t134);
    e81 && (":" !== (e81 = e81[0]) && (this.port = e81.substr(1)), t134 = t134.substr(0, t134.length - e81.length)), t134 && (this.hostname = t134);
};
var ie, ne, oe, se, ae, he, ue, le, ce, de, fe, pe, _e, me, ve, ye, ge, Ee, Te;
!function(t135) {
    t135[t135.WEBGL_LEGACY = 0] = "WEBGL_LEGACY", t135[t135.WEBGL = 1] = "WEBGL", t135[t135.WEBGL2 = 2] = "WEBGL2";
}(ie || (ie = {
})), (function(t136) {
    t136[t136.UNKNOWN = 0] = "UNKNOWN", t136[t136.WEBGL = 1] = "WEBGL", t136[t136.CANVAS = 2] = "CANVAS";
})(ne || (ne = {
})), (function(t137) {
    t137[t137.COLOR = 16384] = "COLOR", t137[t137.DEPTH = 256] = "DEPTH", t137[t137.STENCIL = 1024] = "STENCIL";
})(oe || (oe = {
})), (function(t138) {
    t138[t138.NORMAL = 0] = "NORMAL", t138[t138.ADD = 1] = "ADD", t138[t138.MULTIPLY = 2] = "MULTIPLY", t138[t138.SCREEN = 3] = "SCREEN", t138[t138.OVERLAY = 4] = "OVERLAY", t138[t138.DARKEN = 5] = "DARKEN", t138[t138.LIGHTEN = 6] = "LIGHTEN", t138[t138.COLOR_DODGE = 7] = "COLOR_DODGE", t138[t138.COLOR_BURN = 8] = "COLOR_BURN", t138[t138.HARD_LIGHT = 9] = "HARD_LIGHT", t138[t138.SOFT_LIGHT = 10] = "SOFT_LIGHT", t138[t138.DIFFERENCE = 11] = "DIFFERENCE", t138[t138.EXCLUSION = 12] = "EXCLUSION", t138[t138.HUE = 13] = "HUE", t138[t138.SATURATION = 14] = "SATURATION", t138[t138.COLOR = 15] = "COLOR", t138[t138.LUMINOSITY = 16] = "LUMINOSITY", t138[t138.NORMAL_NPM = 17] = "NORMAL_NPM", t138[t138.ADD_NPM = 18] = "ADD_NPM", t138[t138.SCREEN_NPM = 19] = "SCREEN_NPM", t138[t138.NONE = 20] = "NONE", t138[t138.SRC_OVER = 0] = "SRC_OVER", t138[t138.SRC_IN = 21] = "SRC_IN", t138[t138.SRC_OUT = 22] = "SRC_OUT", t138[t138.SRC_ATOP = 23] = "SRC_ATOP", t138[t138.DST_OVER = 24] = "DST_OVER", t138[t138.DST_IN = 25] = "DST_IN", t138[t138.DST_OUT = 26] = "DST_OUT", t138[t138.DST_ATOP = 27] = "DST_ATOP", t138[t138.ERASE = 26] = "ERASE", t138[t138.SUBTRACT = 28] = "SUBTRACT", t138[t138.XOR = 29] = "XOR";
})(se || (se = {
})), (function(t139) {
    t139[t139.POINTS = 0] = "POINTS", t139[t139.LINES = 1] = "LINES", t139[t139.LINE_LOOP = 2] = "LINE_LOOP", t139[t139.LINE_STRIP = 3] = "LINE_STRIP", t139[t139.TRIANGLES = 4] = "TRIANGLES", t139[t139.TRIANGLE_STRIP = 5] = "TRIANGLE_STRIP", t139[t139.TRIANGLE_FAN = 6] = "TRIANGLE_FAN";
})(ae || (ae = {
})), (function(t140) {
    t140[t140.RGBA = 6408] = "RGBA", t140[t140.RGB = 6407] = "RGB", t140[t140.RG = 33319] = "RG", t140[t140.RED = 6403] = "RED", t140[t140.RGBA_INTEGER = 36249] = "RGBA_INTEGER", t140[t140.RGB_INTEGER = 36248] = "RGB_INTEGER", t140[t140.RG_INTEGER = 33320] = "RG_INTEGER", t140[t140.RED_INTEGER = 36244] = "RED_INTEGER", t140[t140.ALPHA = 6406] = "ALPHA", t140[t140.LUMINANCE = 6409] = "LUMINANCE", t140[t140.LUMINANCE_ALPHA = 6410] = "LUMINANCE_ALPHA", t140[t140.DEPTH_COMPONENT = 6402] = "DEPTH_COMPONENT", t140[t140.DEPTH_STENCIL = 34041] = "DEPTH_STENCIL";
})(he || (he = {
})), (function(t141) {
    t141[t141.TEXTURE_2D = 3553] = "TEXTURE_2D", t141[t141.TEXTURE_CUBE_MAP = 34067] = "TEXTURE_CUBE_MAP", t141[t141.TEXTURE_2D_ARRAY = 35866] = "TEXTURE_2D_ARRAY", t141[t141.TEXTURE_CUBE_MAP_POSITIVE_X = 34069] = "TEXTURE_CUBE_MAP_POSITIVE_X", t141[t141.TEXTURE_CUBE_MAP_NEGATIVE_X = 34070] = "TEXTURE_CUBE_MAP_NEGATIVE_X", t141[t141.TEXTURE_CUBE_MAP_POSITIVE_Y = 34071] = "TEXTURE_CUBE_MAP_POSITIVE_Y", t141[t141.TEXTURE_CUBE_MAP_NEGATIVE_Y = 34072] = "TEXTURE_CUBE_MAP_NEGATIVE_Y", t141[t141.TEXTURE_CUBE_MAP_POSITIVE_Z = 34073] = "TEXTURE_CUBE_MAP_POSITIVE_Z", t141[t141.TEXTURE_CUBE_MAP_NEGATIVE_Z = 34074] = "TEXTURE_CUBE_MAP_NEGATIVE_Z";
})(ue || (ue = {
})), (function(t142) {
    t142[t142.UNSIGNED_BYTE = 5121] = "UNSIGNED_BYTE", t142[t142.UNSIGNED_SHORT = 5123] = "UNSIGNED_SHORT", t142[t142.UNSIGNED_SHORT_5_6_5 = 33635] = "UNSIGNED_SHORT_5_6_5", t142[t142.UNSIGNED_SHORT_4_4_4_4 = 32819] = "UNSIGNED_SHORT_4_4_4_4", t142[t142.UNSIGNED_SHORT_5_5_5_1 = 32820] = "UNSIGNED_SHORT_5_5_5_1", t142[t142.UNSIGNED_INT = 5125] = "UNSIGNED_INT", t142[t142.UNSIGNED_INT_10F_11F_11F_REV = 35899] = "UNSIGNED_INT_10F_11F_11F_REV", t142[t142.UNSIGNED_INT_2_10_10_10_REV = 33640] = "UNSIGNED_INT_2_10_10_10_REV", t142[t142.UNSIGNED_INT_24_8 = 34042] = "UNSIGNED_INT_24_8", t142[t142.UNSIGNED_INT_5_9_9_9_REV = 35902] = "UNSIGNED_INT_5_9_9_9_REV", t142[t142.BYTE = 5120] = "BYTE", t142[t142.SHORT = 5122] = "SHORT", t142[t142.INT = 5124] = "INT", t142[t142.FLOAT = 5126] = "FLOAT", t142[t142.FLOAT_32_UNSIGNED_INT_24_8_REV = 36269] = "FLOAT_32_UNSIGNED_INT_24_8_REV", t142[t142.HALF_FLOAT = 36193] = "HALF_FLOAT";
})(le || (le = {
})), (function(t143) {
    t143[t143.FLOAT = 0] = "FLOAT", t143[t143.INT = 1] = "INT", t143[t143.UINT = 2] = "UINT";
})(ce || (ce = {
})), (function(t144) {
    t144[t144.NEAREST = 0] = "NEAREST", t144[t144.LINEAR = 1] = "LINEAR";
})(de || (de = {
})), (function(t145) {
    t145[t145.CLAMP = 33071] = "CLAMP", t145[t145.REPEAT = 10497] = "REPEAT", t145[t145.MIRRORED_REPEAT = 33648] = "MIRRORED_REPEAT";
})(fe || (fe = {
})), (function(t146) {
    t146[t146.OFF = 0] = "OFF", t146[t146.POW2 = 1] = "POW2", t146[t146.ON = 2] = "ON", t146[t146.ON_MANUAL = 3] = "ON_MANUAL";
})(pe || (pe = {
})), (function(t147) {
    t147[t147.NPM = 0] = "NPM", t147[t147.UNPACK = 1] = "UNPACK", t147[t147.PMA = 2] = "PMA", t147[t147.NO_PREMULTIPLIED_ALPHA = 0] = "NO_PREMULTIPLIED_ALPHA", t147[t147.PREMULTIPLY_ON_UPLOAD = 1] = "PREMULTIPLY_ON_UPLOAD", t147[t147.PREMULTIPLY_ALPHA = 2] = "PREMULTIPLY_ALPHA", t147[t147.PREMULTIPLIED_ALPHA = 2] = "PREMULTIPLIED_ALPHA";
})(_e || (_e = {
})), (function(t148) {
    t148[t148.NO = 0] = "NO", t148[t148.YES = 1] = "YES", t148[t148.AUTO = 2] = "AUTO", t148[t148.BLEND = 0] = "BLEND", t148[t148.CLEAR = 1] = "CLEAR", t148[t148.BLIT = 2] = "BLIT";
})(me || (me = {
})), (function(t149) {
    t149[t149.AUTO = 0] = "AUTO", t149[t149.MANUAL = 1] = "MANUAL";
})(ve || (ve = {
})), (function(t150) {
    t150.LOW = "lowp", t150.MEDIUM = "mediump", t150.HIGH = "highp";
})(ye || (ye = {
})), (function(t151) {
    t151[t151.NONE = 0] = "NONE", t151[t151.SCISSOR = 1] = "SCISSOR", t151[t151.STENCIL = 2] = "STENCIL", t151[t151.SPRITE = 3] = "SPRITE";
})(ge || (ge = {
})), (function(t152) {
    t152[t152.NONE = 0] = "NONE", t152[t152.LOW = 2] = "LOW", t152[t152.MEDIUM = 4] = "MEDIUM", t152[t152.HIGH = 8] = "HIGH";
})(Ee || (Ee = {
})), (function(t153) {
    t153[t153.ELEMENT_ARRAY_BUFFER = 34963] = "ELEMENT_ARRAY_BUFFER", t153[t153.ARRAY_BUFFER = 34962] = "ARRAY_BUFFER", t153[t153.UNIFORM_BUFFER = 35345] = "UNIFORM_BUFFER";
})(Te || (Te = {
}));
var be = {
    parse: Xt,
    format: Ht,
    resolve: kt
};
et.RETINA_PREFIX = /@([0-9\.]+)x/, et.FAIL_IF_MAJOR_PERFORMANCE_CAVEAT = !1;
var xe, Re = !1, Ae = "6.2.0";
function Oe(t154) {
    var e82;
    if (!Re) {
        if (navigator.userAgent.toLowerCase().indexOf("chrome") > -1) {
            var r64 = [
                "\n %c %c %c PixiJS " + Ae + " - ✰ " + t154 + " ✰  %c  %c  http://www.pixijs.com/  %c %c ♥%c♥%c♥ \n\n",
                "background: #ff66a5; padding:5px 0;",
                "background: #ff66a5; padding:5px 0;",
                "color: #ff66a5; background: #030307; padding:5px 0;",
                "background: #ff66a5; padding:5px 0;",
                "background: #ffc3dc; padding:5px 0;",
                "background: #ff66a5; padding:5px 0;",
                "color: #ff2424; background: #fff; padding:5px 0;",
                "color: #ff2424; background: #fff; padding:5px 0;",
                "color: #ff2424; background: #fff; padding:5px 0;"
            ];
            (e82 = self.console).log.apply(e82, r64);
        } else self.console && self.console.log("PixiJS " + Ae + " - " + t154 + " - http://www.pixijs.com/");
        Re = !0;
    }
}
function Se() {
    return void 0 === xe && (xe = (function() {
        var t155 = {
            stencil: !0,
            failIfMajorPerformanceCaveat: et.FAIL_IF_MAJOR_PERFORMANCE_CAVEAT
        };
        try {
            if (!self.WebGLRenderingContext) return !1;
            var e83 = document.createElement("canvas"), r65 = e83.getContext("webgl", t155) || e83.getContext("experimental-webgl", t155), i50 = !(!r65 || !r65.getContextAttributes().stencil);
            if (r65) {
                var n41 = r65.getExtension("WEBGL_lose_context");
                n41 && n41.loseContext();
            }
            return r65 = null, i50;
        } catch (t) {
            return !1;
        }
    })()), xe;
}
var Ie = {
    aliceblue: "#f0f8ff",
    antiquewhite: "#faebd7",
    aqua: "#00ffff",
    aquamarine: "#7fffd4",
    azure: "#f0ffff",
    beige: "#f5f5dc",
    bisque: "#ffe4c4",
    black: "#000000",
    blanchedalmond: "#ffebcd",
    blue: "#0000ff",
    blueviolet: "#8a2be2",
    brown: "#a52a2a",
    burlywood: "#deb887",
    cadetblue: "#5f9ea0",
    chartreuse: "#7fff00",
    chocolate: "#d2691e",
    coral: "#ff7f50",
    cornflowerblue: "#6495ed",
    cornsilk: "#fff8dc",
    crimson: "#dc143c",
    cyan: "#00ffff",
    darkblue: "#00008b",
    darkcyan: "#008b8b",
    darkgoldenrod: "#b8860b",
    darkgray: "#a9a9a9",
    darkgreen: "#006400",
    darkgrey: "#a9a9a9",
    darkkhaki: "#bdb76b",
    darkmagenta: "#8b008b",
    darkolivegreen: "#556b2f",
    darkorange: "#ff8c00",
    darkorchid: "#9932cc",
    darkred: "#8b0000",
    darksalmon: "#e9967a",
    darkseagreen: "#8fbc8f",
    darkslateblue: "#483d8b",
    darkslategray: "#2f4f4f",
    darkslategrey: "#2f4f4f",
    darkturquoise: "#00ced1",
    darkviolet: "#9400d3",
    deeppink: "#ff1493",
    deepskyblue: "#00bfff",
    dimgray: "#696969",
    dimgrey: "#696969",
    dodgerblue: "#1e90ff",
    firebrick: "#b22222",
    floralwhite: "#fffaf0",
    forestgreen: "#228b22",
    fuchsia: "#ff00ff",
    gainsboro: "#dcdcdc",
    ghostwhite: "#f8f8ff",
    goldenrod: "#daa520",
    gold: "#ffd700",
    gray: "#808080",
    green: "#008000",
    greenyellow: "#adff2f",
    grey: "#808080",
    honeydew: "#f0fff0",
    hotpink: "#ff69b4",
    indianred: "#cd5c5c",
    indigo: "#4b0082",
    ivory: "#fffff0",
    khaki: "#f0e68c",
    lavenderblush: "#fff0f5",
    lavender: "#e6e6fa",
    lawngreen: "#7cfc00",
    lemonchiffon: "#fffacd",
    lightblue: "#add8e6",
    lightcoral: "#f08080",
    lightcyan: "#e0ffff",
    lightgoldenrodyellow: "#fafad2",
    lightgray: "#d3d3d3",
    lightgreen: "#90ee90",
    lightgrey: "#d3d3d3",
    lightpink: "#ffb6c1",
    lightsalmon: "#ffa07a",
    lightseagreen: "#20b2aa",
    lightskyblue: "#87cefa",
    lightslategray: "#778899",
    lightslategrey: "#778899",
    lightsteelblue: "#b0c4de",
    lightyellow: "#ffffe0",
    lime: "#00ff00",
    limegreen: "#32cd32",
    linen: "#faf0e6",
    magenta: "#ff00ff",
    maroon: "#800000",
    mediumaquamarine: "#66cdaa",
    mediumblue: "#0000cd",
    mediumorchid: "#ba55d3",
    mediumpurple: "#9370db",
    mediumseagreen: "#3cb371",
    mediumslateblue: "#7b68ee",
    mediumspringgreen: "#00fa9a",
    mediumturquoise: "#48d1cc",
    mediumvioletred: "#c71585",
    midnightblue: "#191970",
    mintcream: "#f5fffa",
    mistyrose: "#ffe4e1",
    moccasin: "#ffe4b5",
    navajowhite: "#ffdead",
    navy: "#000080",
    oldlace: "#fdf5e6",
    olive: "#808000",
    olivedrab: "#6b8e23",
    orange: "#ffa500",
    orangered: "#ff4500",
    orchid: "#da70d6",
    palegoldenrod: "#eee8aa",
    palegreen: "#98fb98",
    paleturquoise: "#afeeee",
    palevioletred: "#db7093",
    papayawhip: "#ffefd5",
    peachpuff: "#ffdab9",
    peru: "#cd853f",
    pink: "#ffc0cb",
    plum: "#dda0dd",
    powderblue: "#b0e0e6",
    purple: "#800080",
    rebeccapurple: "#663399",
    red: "#ff0000",
    rosybrown: "#bc8f8f",
    royalblue: "#4169e1",
    saddlebrown: "#8b4513",
    salmon: "#fa8072",
    sandybrown: "#f4a460",
    seagreen: "#2e8b57",
    seashell: "#fff5ee",
    sienna: "#a0522d",
    silver: "#c0c0c0",
    skyblue: "#87ceeb",
    slateblue: "#6a5acd",
    slategray: "#708090",
    slategrey: "#708090",
    snow: "#fffafa",
    springgreen: "#00ff7f",
    steelblue: "#4682b4",
    tan: "#d2b48c",
    teal: "#008080",
    thistle: "#d8bfd8",
    tomato: "#ff6347",
    turquoise: "#40e0d0",
    violet: "#ee82ee",
    wheat: "#f5deb3",
    white: "#ffffff",
    whitesmoke: "#f5f5f5",
    yellow: "#ffff00",
    yellowgreen: "#9acd32"
};
function Pe(t156, e84) {
    return void 0 === e84 && (e84 = []), e84[0] = (t156 >> 16 & 255) / 255, e84[1] = (t156 >> 8 & 255) / 255, e84[2] = (255 & t156) / 255, e84;
}
function Ne(t157) {
    var e85 = t157.toString(16);
    return "#" + ("000000".substr(0, 6 - e85.length) + e85);
}
function Me(t158) {
    return "string" == typeof t158 && "#" === (t158 = Ie[t158.toLowerCase()] || t158)[0] && (t158 = t158.substr(1)), parseInt(t158, 16);
}
var De = function() {
    for(var t159 = [], e86 = [], r66 = 0; r66 < 32; r66++)t159[r66] = r66, e86[r66] = r66;
    t159[se.NORMAL_NPM] = se.NORMAL, t159[se.ADD_NPM] = se.ADD, t159[se.SCREEN_NPM] = se.SCREEN, e86[se.NORMAL] = se.NORMAL_NPM, e86[se.ADD] = se.ADD_NPM, e86[se.SCREEN] = se.SCREEN_NPM;
    var i51 = [];
    return i51.push(e86), i51.push(t159), i51;
}();
function Ce(t, e) {
    return De[e ? 1 : 0][t];
}
function we(t160, e87, r67, i52) {
    return r67 = r67 || new Float32Array(4), i52 || void 0 === i52 ? (r67[0] = t160[0] * e87, r67[1] = t160[1] * e87, r67[2] = t160[2] * e87) : (r67[0] = t160[0], r67[1] = t160[1], r67[2] = t160[2]), r67[3] = e87, r67;
}
function Le(t161, e88) {
    if (1 === e88) return (255 * e88 << 24) + t161;
    if (0 === e88) return 0;
    var r68 = t161 >> 16 & 255, i53 = t161 >> 8 & 255, n42 = 255 & t161;
    return (255 * e88 << 24) + ((r68 = r68 * e88 + 0.5 | 0) << 16) + ((i53 = i53 * e88 + 0.5 | 0) << 8) + (n42 * e88 + 0.5 | 0);
}
function Fe(t162, e89, r69, i54) {
    return (r69 = r69 || new Float32Array(4))[0] = (t162 >> 16 & 255) / 255, r69[1] = (t162 >> 8 & 255) / 255, r69[2] = (255 & t162) / 255, (i54 || void 0 === i54) && (r69[0] *= e89, r69[1] *= e89, r69[2] *= e89), r69[3] = e89, r69;
}
function Ue(t163, e90) {
    void 0 === e90 && (e90 = null);
    var r70 = 6 * t163;
    if ((e90 = e90 || new Uint16Array(r70)).length !== r70) throw new Error("Out buffer length is incorrect, got " + e90.length + " and expected " + r70);
    for(var i55 = 0, n43 = 0; i55 < r70; i55 += 6, n43 += 4)e90[i55 + 0] = n43 + 0, e90[i55 + 1] = n43 + 1, e90[i55 + 2] = n43 + 2, e90[i55 + 3] = n43 + 0, e90[i55 + 4] = n43 + 2, e90[i55 + 5] = n43 + 3;
    return e90;
}
function Ge(t164) {
    if (4 === t164.BYTES_PER_ELEMENT) return t164 instanceof Float32Array ? "Float32Array" : t164 instanceof Uint32Array ? "Uint32Array" : "Int32Array";
    if (2 === t164.BYTES_PER_ELEMENT) {
        if (t164 instanceof Uint16Array) return "Uint16Array";
    } else if (1 === t164.BYTES_PER_ELEMENT && t164 instanceof Uint8Array) return "Uint8Array";
    return null;
}
var Be = {
    Float32Array: Float32Array,
    Uint32Array: Uint32Array,
    Int32Array: Int32Array,
    Uint8Array: Uint8Array
};
function Xe(t165) {
    return t165 += 0 === t165 ? 1 : 0, --t165, t165 |= t165 >>> 1, t165 |= t165 >>> 2, t165 |= t165 >>> 4, t165 |= t165 >>> 8, 1 + (t165 |= t165 >>> 16);
}
function ke(t166) {
    return !(t166 & t166 - 1 || !t166);
}
function He(t167) {
    var e91 = (t167 > 65535 ? 1 : 0) << 4, r71 = ((t167 >>>= e91) > 255 ? 1 : 0) << 3;
    return e91 |= r71, e91 |= r71 = ((t167 >>>= r71) > 15 ? 1 : 0) << 2, (e91 |= r71 = ((t167 >>>= r71) > 3 ? 1 : 0) << 1) | (t167 >>>= r71) >> 1;
}
function je(t168, e92, r72) {
    var i56, n44 = t168.length;
    if (!(e92 >= n44 || 0 === r72)) {
        var o35 = n44 - (r72 = e92 + r72 > n44 ? n44 - e92 : r72);
        for(i56 = e92; i56 < o35; ++i56)t168[i56] = t168[i56 + r72];
        t168.length = o35;
    }
}
function Ye(t169) {
    return 0 === t169 ? 0 : t169 < 0 ? -1 : 1;
}
var Ve = 0;
function We() {
    return ++Ve;
}
var ze = {
};
var qe = {
}, Ke = Object.create(null), Ze = Object.create(null);
var Je = function() {
    function t170(t171, e93, r73) {
        this.canvas = document.createElement("canvas"), this.context = this.canvas.getContext("2d"), this.resolution = r73 || et.RESOLUTION, this.resize(t171, e93);
    }
    return t170.prototype.clear = function() {
        this.context.setTransform(1, 0, 0, 1, 0, 0), this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }, t170.prototype.resize = function(t172, e94) {
        this.canvas.width = Math.round(t172 * this.resolution), this.canvas.height = Math.round(e94 * this.resolution);
    }, t170.prototype.destroy = function() {
        this.context = null, this.canvas = null;
    }, Object.defineProperty(t170.prototype, "width", {
        get: function() {
            return this.canvas.width;
        },
        set: function(t173) {
            this.canvas.width = Math.round(t173);
        },
        enumerable: !1,
        configurable: !0
    }), Object.defineProperty(t170.prototype, "height", {
        get: function() {
            return this.canvas.height;
        },
        set: function(t174) {
            this.canvas.height = Math.round(t174);
        },
        enumerable: !1,
        configurable: !0
    }), t170;
}();
function Qe(t175) {
    var e95, r74, i57, n45 = t175.width, o36 = t175.height, s30 = t175.getContext("2d"), a24 = s30.getImageData(0, 0, n45, o36).data, h15 = a24.length, u14 = {
        top: null,
        left: null,
        right: null,
        bottom: null
    }, l11 = null;
    for(e95 = 0; e95 < h15; e95 += 4)0 !== a24[e95 + 3] && (r74 = e95 / 4 % n45, i57 = ~~(e95 / 4 / n45), null === u14.top && (u14.top = i57), null === u14.left ? u14.left = r74 : r74 < u14.left && (u14.left = r74), null === u14.right ? u14.right = r74 + 1 : u14.right < r74 && (u14.right = r74 + 1), null === u14.bottom ? u14.bottom = i57 : u14.bottom < i57 && (u14.bottom = i57));
    return null !== u14.top && (n45 = u14.right - u14.left, o36 = u14.bottom - u14.top + 1, l11 = s30.getImageData(u14.left, u14.top, n45, o36)), {
        height: o36,
        width: n45,
        data: l11
    };
}
var $e, tr = /^\s*data:(?:([\w-]+)\/([\w+.-]+))?(?:;charset=([\w-]+))?(?:;(base64))?,(.*)/i;
function er(t176, e96) {
    if (void 0 === e96 && (e96 = self.location), 0 === t176.indexOf("data:")) return "";
    e96 = e96 || self.location, $e || ($e = document.createElement("a")), $e.href = t176;
    var r75 = be.parse($e.href), i58 = !r75.port && "" === e96.port || r75.port === e96.port;
    return r75.hostname === e96.hostname && i58 && r75.protocol === e96.protocol ? "" : "anonymous";
}
function rr(t177, e97) {
    var r76 = et.RETINA_PREFIX.exec(t177);
    return r76 ? parseFloat(r76[1]) : void 0 !== e97 ? e97 : 1;
}
var ir, nr = {
    __proto__: null,
    BaseTextureCache: Ze,
    CanvasRenderTarget: Je,
    DATA_URI: tr,
    ProgramCache: qe,
    TextureCache: Ke,
    clearTextureCache: function() {
        var t178;
        for(t178 in Ke)delete Ke[t178];
        for(t178 in Ze)delete Ze[t178];
    },
    correctBlendMode: Ce,
    createIndicesForQuads: Ue,
    decomposeDataUri: function(t179) {
        var e98 = tr.exec(t179);
        if (e98) return {
            mediaType: e98[1] ? e98[1].toLowerCase() : void 0,
            subType: e98[2] ? e98[2].toLowerCase() : void 0,
            charset: e98[3] ? e98[3].toLowerCase() : void 0,
            encoding: e98[4] ? e98[4].toLowerCase() : void 0,
            data: e98[5]
        };
    },
    deprecation: function(t180, e99, r77) {
        if (void 0 === r77 && (r77 = 3), !ze[e99]) {
            var i59 = (new Error).stack;
            void 0 === i59 ? console.warn("PixiJS Deprecation Warning: ", e99 + "\nDeprecated since v" + t180) : (i59 = i59.split("\n").splice(r77).join("\n"), console.groupCollapsed ? (console.groupCollapsed("%cPixiJS Deprecation Warning: %c%s", "color:#614108;background:#fffbe6", "font-weight:normal;color:#614108;background:#fffbe6", e99 + "\nDeprecated since v" + t180), console.warn(i59), console.groupEnd()) : (console.warn("PixiJS Deprecation Warning: ", e99 + "\nDeprecated since v" + t180), console.warn(i59))), ze[e99] = !0;
        }
    },
    destroyTextureCache: function() {
        var t181;
        for(t181 in Ke)Ke[t181].destroy();
        for(t181 in Ze)Ze[t181].destroy();
    },
    determineCrossOrigin: er,
    getBufferType: Ge,
    getResolutionOfUrl: rr,
    hex2rgb: Pe,
    hex2string: Ne,
    interleaveTypedArrays: function(t182, e100) {
        for(var r78 = 0, i60 = 0, n46 = {
        }, o37 = 0; o37 < t182.length; o37++)i60 += e100[o37], r78 += t182[o37].length;
        var s31 = new ArrayBuffer(4 * r78), a25 = null, h16 = 0;
        for(o37 = 0; o37 < t182.length; o37++){
            var u15 = e100[o37], l12 = t182[o37], c = Ge(l12);
            n46[c] || (n46[c] = new Be[c](s31)), a25 = n46[c];
            for(var d11 = 0; d11 < l12.length; d11++)a25[(d11 / u15 | 0) * i60 + h16 + d11 % u15] = l12[d11];
            h16 += u15;
        }
        return new Float32Array(s31);
    },
    isPow2: ke,
    isWebGLSupported: Se,
    log2: He,
    nextPow2: Xe,
    premultiplyBlendMode: De,
    premultiplyRgba: we,
    premultiplyTint: Le,
    premultiplyTintToRgba: Fe,
    removeItems: je,
    rgb2hex: function(t183) {
        return (255 * t183[0] << 16) + (255 * t183[1] << 8) + (255 * t183[2] | 0);
    },
    sayHello: Oe,
    sign: Ye,
    skipHello: function() {
        Re = !0;
    },
    string2hex: Me,
    trimCanvas: Qe,
    uid: We,
    url: be,
    isMobile: tt,
    EventEmitter: nt,
    earcut: ot
}, or = 2 * Math.PI, sr = 180 / Math.PI, ar = Math.PI / 180;
!function(t184) {
    t184[t184.POLY = 0] = "POLY", t184[t184.RECT = 1] = "RECT", t184[t184.CIRC = 2] = "CIRC", t184[t184.ELIP = 3] = "ELIP", t184[t184.RREC = 4] = "RREC";
}(ir || (ir = {
}));
var hr = function() {
    function t185(t186, e101, r79, i61) {
        void 0 === t186 && (t186 = 0), void 0 === e101 && (e101 = 0), void 0 === r79 && (r79 = 0), void 0 === i61 && (i61 = 0), this.x = Number(t186), this.y = Number(e101), this.width = Number(r79), this.height = Number(i61), this.type = ir.RECT;
    }
    return Object.defineProperty(t185.prototype, "left", {
        get: function() {
            return this.x;
        },
        enumerable: !1,
        configurable: !0
    }), Object.defineProperty(t185.prototype, "right", {
        get: function() {
            return this.x + this.width;
        },
        enumerable: !1,
        configurable: !0
    }), Object.defineProperty(t185.prototype, "top", {
        get: function() {
            return this.y;
        },
        enumerable: !1,
        configurable: !0
    }), Object.defineProperty(t185.prototype, "bottom", {
        get: function() {
            return this.y + this.height;
        },
        enumerable: !1,
        configurable: !0
    }), Object.defineProperty(t185, "EMPTY", {
        get: function() {
            return new t185(0, 0, 0, 0);
        },
        enumerable: !1,
        configurable: !0
    }), t185.prototype.clone = function() {
        return new t185(this.x, this.y, this.width, this.height);
    }, t185.prototype.copyFrom = function(t187) {
        return this.x = t187.x, this.y = t187.y, this.width = t187.width, this.height = t187.height, this;
    }, t185.prototype.copyTo = function(t188) {
        return t188.x = this.x, t188.y = this.y, t188.width = this.width, t188.height = this.height, t188;
    }, t185.prototype.contains = function(t189, e102) {
        return !(this.width <= 0 || this.height <= 0) && t189 >= this.x && t189 < this.x + this.width && e102 >= this.y && e102 < this.y + this.height;
    }, t185.prototype.pad = function(t190, e103) {
        return void 0 === t190 && (t190 = 0), void 0 === e103 && (e103 = t190), this.x -= t190, this.y -= e103, this.width += 2 * t190, this.height += 2 * e103, this;
    }, t185.prototype.fit = function(t191) {
        var e104 = Math.max(this.x, t191.x), r80 = Math.min(this.x + this.width, t191.x + t191.width), i62 = Math.max(this.y, t191.y), n47 = Math.min(this.y + this.height, t191.y + t191.height);
        return this.x = e104, this.width = Math.max(r80 - e104, 0), this.y = i62, this.height = Math.max(n47 - i62, 0), this;
    }, t185.prototype.ceil = function(t192, e105) {
        void 0 === t192 && (t192 = 1), void 0 === e105 && (e105 = 0.001);
        var r81 = Math.ceil((this.x + this.width - e105) * t192) / t192, i63 = Math.ceil((this.y + this.height - e105) * t192) / t192;
        return this.x = Math.floor((this.x + e105) * t192) / t192, this.y = Math.floor((this.y + e105) * t192) / t192, this.width = r81 - this.x, this.height = i63 - this.y, this;
    }, t185.prototype.enlarge = function(t193) {
        var e106 = Math.min(this.x, t193.x), r82 = Math.max(this.x + this.width, t193.x + t193.width), i64 = Math.min(this.y, t193.y), n48 = Math.max(this.y + this.height, t193.y + t193.height);
        return this.x = e106, this.width = r82 - e106, this.y = i64, this.height = n48 - i64, this;
    }, t185;
}(), ur = function() {
    function t194(t195, e107, r83) {
        void 0 === t195 && (t195 = 0), void 0 === e107 && (e107 = 0), void 0 === r83 && (r83 = 0), this.x = t195, this.y = e107, this.radius = r83, this.type = ir.CIRC;
    }
    return t194.prototype.clone = function() {
        return new t194(this.x, this.y, this.radius);
    }, t194.prototype.contains = function(t196, e108) {
        if (this.radius <= 0) return !1;
        var r84 = this.radius * this.radius, i65 = this.x - t196, n49 = this.y - e108;
        return (i65 *= i65) + (n49 *= n49) <= r84;
    }, t194.prototype.getBounds = function() {
        return new hr(this.x - this.radius, this.y - this.radius, 2 * this.radius, 2 * this.radius);
    }, t194;
}(), lr = function() {
    function t197(t198, e109, r85, i66) {
        void 0 === t198 && (t198 = 0), void 0 === e109 && (e109 = 0), void 0 === r85 && (r85 = 0), void 0 === i66 && (i66 = 0), this.x = t198, this.y = e109, this.width = r85, this.height = i66, this.type = ir.ELIP;
    }
    return t197.prototype.clone = function() {
        return new t197(this.x, this.y, this.width, this.height);
    }, t197.prototype.contains = function(t199, e110) {
        if (this.width <= 0 || this.height <= 0) return !1;
        var r86 = (t199 - this.x) / this.width, i67 = (e110 - this.y) / this.height;
        return (r86 *= r86) + (i67 *= i67) <= 1;
    }, t197.prototype.getBounds = function() {
        return new hr(this.x - this.width, this.y - this.height, this.width, this.height);
    }, t197;
}(), cr = function() {
    function t200() {
        for(var t201 = arguments, e111 = [], r87 = 0; r87 < arguments.length; r87++)e111[r87] = t201[r87];
        var i68 = Array.isArray(e111[0]) ? e111[0] : e111;
        if ("number" != typeof i68[0]) {
            for(var n50 = [], o38 = 0, s32 = i68.length; o38 < s32; o38++)n50.push(i68[o38].x, i68[o38].y);
            i68 = n50;
        }
        this.points = i68, this.type = ir.POLY, this.closeStroke = !0;
    }
    return t200.prototype.clone = function() {
        var e112 = new t200(this.points.slice());
        return e112.closeStroke = this.closeStroke, e112;
    }, t200.prototype.contains = function(t202, e113) {
        for(var r88 = !1, i69 = this.points.length / 2, n51 = 0, o39 = i69 - 1; n51 < i69; o39 = n51++){
            var s33 = this.points[2 * n51], a26 = this.points[2 * n51 + 1], h17 = this.points[2 * o39], u16 = this.points[2 * o39 + 1];
            a26 > e113 != u16 > e113 && t202 < (e113 - a26) / (u16 - a26) * (h17 - s33) + s33 && (r88 = !r88);
        }
        return r88;
    }, t200;
}(), dr = function() {
    function t203(t204, e114, r89, i70, n52) {
        void 0 === t204 && (t204 = 0), void 0 === e114 && (e114 = 0), void 0 === r89 && (r89 = 0), void 0 === i70 && (i70 = 0), void 0 === n52 && (n52 = 20), this.x = t204, this.y = e114, this.width = r89, this.height = i70, this.radius = n52, this.type = ir.RREC;
    }
    return t203.prototype.clone = function() {
        return new t203(this.x, this.y, this.width, this.height, this.radius);
    }, t203.prototype.contains = function(t205, e115) {
        if (this.width <= 0 || this.height <= 0) return !1;
        if (t205 >= this.x && t205 <= this.x + this.width && e115 >= this.y && e115 <= this.y + this.height) {
            if (e115 >= this.y + this.radius && e115 <= this.y + this.height - this.radius || t205 >= this.x + this.radius && t205 <= this.x + this.width - this.radius) return !0;
            var r90 = t205 - (this.x + this.radius), i71 = e115 - (this.y + this.radius), n53 = this.radius * this.radius;
            if (r90 * r90 + i71 * i71 <= n53) return !0;
            if ((r90 = t205 - (this.x + this.width - this.radius)) * r90 + i71 * i71 <= n53) return !0;
            if (r90 * r90 + (i71 = e115 - (this.y + this.height - this.radius)) * i71 <= n53) return !0;
            if ((r90 = t205 - (this.x + this.radius)) * r90 + i71 * i71 <= n53) return !0;
        }
        return !1;
    }, t203;
}(), fr = function() {
    function t206(t207, e116) {
        void 0 === t207 && (t207 = 0), void 0 === e116 && (e116 = 0), this.x = 0, this.y = 0, this.x = t207, this.y = e116;
    }
    return t206.prototype.clone = function() {
        return new t206(this.x, this.y);
    }, t206.prototype.copyFrom = function(t208) {
        return this.set(t208.x, t208.y), this;
    }, t206.prototype.copyTo = function(t209) {
        return t209.set(this.x, this.y), t209;
    }, t206.prototype.equals = function(t210) {
        return t210.x === this.x && t210.y === this.y;
    }, t206.prototype.set = function(t211, e117) {
        return void 0 === t211 && (t211 = 0), void 0 === e117 && (e117 = t211), this.x = t211, this.y = e117, this;
    }, t206;
}(), pr = function() {
    function t212(t213, e118, r91, i72) {
        void 0 === r91 && (r91 = 0), void 0 === i72 && (i72 = 0), this._x = r91, this._y = i72, this.cb = t213, this.scope = e118;
    }
    return t212.prototype.clone = function(e119, r92) {
        return void 0 === e119 && (e119 = this.cb), void 0 === r92 && (r92 = this.scope), new t212(e119, r92, this._x, this._y);
    }, t212.prototype.set = function(t214, e120) {
        return void 0 === t214 && (t214 = 0), void 0 === e120 && (e120 = t214), this._x === t214 && this._y === e120 || (this._x = t214, this._y = e120, this.cb.call(this.scope)), this;
    }, t212.prototype.copyFrom = function(t215) {
        return this._x === t215.x && this._y === t215.y || (this._x = t215.x, this._y = t215.y, this.cb.call(this.scope)), this;
    }, t212.prototype.copyTo = function(t216) {
        return t216.set(this._x, this._y), t216;
    }, t212.prototype.equals = function(t217) {
        return t217.x === this._x && t217.y === this._y;
    }, Object.defineProperty(t212.prototype, "x", {
        get: function() {
            return this._x;
        },
        set: function(t218) {
            this._x !== t218 && (this._x = t218, this.cb.call(this.scope));
        },
        enumerable: !1,
        configurable: !0
    }), Object.defineProperty(t212.prototype, "y", {
        get: function() {
            return this._y;
        },
        set: function(t219) {
            this._y !== t219 && (this._y = t219, this.cb.call(this.scope));
        },
        enumerable: !1,
        configurable: !0
    }), t212;
}(), _r = function() {
    function t220(t221, e121, r93, i73, n54, o40) {
        void 0 === t221 && (t221 = 1), void 0 === e121 && (e121 = 0), void 0 === r93 && (r93 = 0), void 0 === i73 && (i73 = 1), void 0 === n54 && (n54 = 0), void 0 === o40 && (o40 = 0), this.array = null, this.a = t221, this.b = e121, this.c = r93, this.d = i73, this.tx = n54, this.ty = o40;
    }
    return t220.prototype.fromArray = function(t222) {
        this.a = t222[0], this.b = t222[1], this.c = t222[3], this.d = t222[4], this.tx = t222[2], this.ty = t222[5];
    }, t220.prototype.set = function(t223, e122, r94, i74, n55, o41) {
        return this.a = t223, this.b = e122, this.c = r94, this.d = i74, this.tx = n55, this.ty = o41, this;
    }, t220.prototype.toArray = function(t224, e123) {
        this.array || (this.array = new Float32Array(9));
        var r95 = e123 || this.array;
        return t224 ? (r95[0] = this.a, r95[1] = this.b, r95[2] = 0, r95[3] = this.c, r95[4] = this.d, r95[5] = 0, r95[6] = this.tx, r95[7] = this.ty, r95[8] = 1) : (r95[0] = this.a, r95[1] = this.c, r95[2] = this.tx, r95[3] = this.b, r95[4] = this.d, r95[5] = this.ty, r95[6] = 0, r95[7] = 0, r95[8] = 1), r95;
    }, t220.prototype.apply = function(t225, e124) {
        e124 = e124 || new fr;
        var r96 = t225.x, i75 = t225.y;
        return e124.x = this.a * r96 + this.c * i75 + this.tx, e124.y = this.b * r96 + this.d * i75 + this.ty, e124;
    }, t220.prototype.applyInverse = function(t226, e125) {
        e125 = e125 || new fr;
        var r97 = 1 / (this.a * this.d + this.c * -this.b), i76 = t226.x, n56 = t226.y;
        return e125.x = this.d * r97 * i76 + -this.c * r97 * n56 + (this.ty * this.c - this.tx * this.d) * r97, e125.y = this.a * r97 * n56 + -this.b * r97 * i76 + (-this.ty * this.a + this.tx * this.b) * r97, e125;
    }, t220.prototype.translate = function(t227, e126) {
        return this.tx += t227, this.ty += e126, this;
    }, t220.prototype.scale = function(t228, e127) {
        return this.a *= t228, this.d *= e127, this.c *= t228, this.b *= e127, this.tx *= t228, this.ty *= e127, this;
    }, t220.prototype.rotate = function(t229) {
        var e128 = Math.cos(t229), r98 = Math.sin(t229), i77 = this.a, n57 = this.c, o42 = this.tx;
        return this.a = i77 * e128 - this.b * r98, this.b = i77 * r98 + this.b * e128, this.c = n57 * e128 - this.d * r98, this.d = n57 * r98 + this.d * e128, this.tx = o42 * e128 - this.ty * r98, this.ty = o42 * r98 + this.ty * e128, this;
    }, t220.prototype.append = function(t230) {
        var e129 = this.a, r99 = this.b, i78 = this.c, n58 = this.d;
        return this.a = t230.a * e129 + t230.b * i78, this.b = t230.a * r99 + t230.b * n58, this.c = t230.c * e129 + t230.d * i78, this.d = t230.c * r99 + t230.d * n58, this.tx = t230.tx * e129 + t230.ty * i78 + this.tx, this.ty = t230.tx * r99 + t230.ty * n58 + this.ty, this;
    }, t220.prototype.setTransform = function(t231, e130, r100, i79, n59, o43, s34, a27, h18) {
        return this.a = Math.cos(s34 + h18) * n59, this.b = Math.sin(s34 + h18) * n59, this.c = -Math.sin(s34 - a27) * o43, this.d = Math.cos(s34 - a27) * o43, this.tx = t231 - (r100 * this.a + i79 * this.c), this.ty = e130 - (r100 * this.b + i79 * this.d), this;
    }, t220.prototype.prepend = function(t232) {
        var e131 = this.tx;
        if (1 !== t232.a || 0 !== t232.b || 0 !== t232.c || 1 !== t232.d) {
            var r101 = this.a, i80 = this.c;
            this.a = r101 * t232.a + this.b * t232.c, this.b = r101 * t232.b + this.b * t232.d, this.c = i80 * t232.a + this.d * t232.c, this.d = i80 * t232.b + this.d * t232.d;
        }
        return this.tx = e131 * t232.a + this.ty * t232.c + t232.tx, this.ty = e131 * t232.b + this.ty * t232.d + t232.ty, this;
    }, t220.prototype.decompose = function(t233) {
        var e132 = this.a, r102 = this.b, i81 = this.c, n60 = this.d, o44 = t233.pivot, s35 = -Math.atan2(-i81, n60), a28 = Math.atan2(r102, e132), h19 = Math.abs(s35 + a28);
        return h19 < 0.00001 || Math.abs(or - h19) < 0.00001 ? (t233.rotation = a28, t233.skew.x = t233.skew.y = 0) : (t233.rotation = 0, t233.skew.x = s35, t233.skew.y = a28), t233.scale.x = Math.sqrt(e132 * e132 + r102 * r102), t233.scale.y = Math.sqrt(i81 * i81 + n60 * n60), t233.position.x = this.tx + (o44.x * e132 + o44.y * i81), t233.position.y = this.ty + (o44.x * r102 + o44.y * n60), t233;
    }, t220.prototype.invert = function() {
        var t234 = this.a, e133 = this.b, r103 = this.c, i82 = this.d, n61 = this.tx, o45 = t234 * i82 - e133 * r103;
        return this.a = i82 / o45, this.b = -e133 / o45, this.c = -r103 / o45, this.d = t234 / o45, this.tx = (r103 * this.ty - i82 * n61) / o45, this.ty = -(t234 * this.ty - e133 * n61) / o45, this;
    }, t220.prototype.identity = function() {
        return this.a = 1, this.b = 0, this.c = 0, this.d = 1, this.tx = 0, this.ty = 0, this;
    }, t220.prototype.clone = function() {
        var e134 = new t220;
        return e134.a = this.a, e134.b = this.b, e134.c = this.c, e134.d = this.d, e134.tx = this.tx, e134.ty = this.ty, e134;
    }, t220.prototype.copyTo = function(t235) {
        return t235.a = this.a, t235.b = this.b, t235.c = this.c, t235.d = this.d, t235.tx = this.tx, t235.ty = this.ty, t235;
    }, t220.prototype.copyFrom = function(t236) {
        return this.a = t236.a, this.b = t236.b, this.c = t236.c, this.d = t236.d, this.tx = t236.tx, this.ty = t236.ty, this;
    }, Object.defineProperty(t220, "IDENTITY", {
        get: function() {
            return new t220;
        },
        enumerable: !1,
        configurable: !0
    }), Object.defineProperty(t220, "TEMP_MATRIX", {
        get: function() {
            return new t220;
        },
        enumerable: !1,
        configurable: !0
    }), t220;
}(), mr = [
    1,
    1,
    0,
    -1,
    -1,
    -1,
    0,
    1,
    1,
    1,
    0,
    -1,
    -1,
    -1,
    0,
    1
], vr = [
    0,
    1,
    1,
    1,
    0,
    -1,
    -1,
    -1,
    0,
    1,
    1,
    1,
    0,
    -1,
    -1,
    -1
], yr = [
    0,
    -1,
    -1,
    -1,
    0,
    1,
    1,
    1,
    0,
    1,
    1,
    1,
    0,
    -1,
    -1,
    -1
], gr = [
    1,
    1,
    0,
    -1,
    -1,
    -1,
    0,
    1,
    -1,
    -1,
    0,
    1,
    1,
    1,
    0,
    -1
], Er = [], Tr = [], br = Math.sign;
!function() {
    for(var t237 = 0; t237 < 16; t237++){
        var e135 = [];
        Er.push(e135);
        for(var r104 = 0; r104 < 16; r104++)for(var i83 = br(mr[t237] * mr[r104] + yr[t237] * vr[r104]), n62 = br(vr[t237] * mr[r104] + gr[t237] * vr[r104]), o46 = br(mr[t237] * yr[r104] + yr[t237] * gr[r104]), s36 = br(vr[t237] * yr[r104] + gr[t237] * gr[r104]), a29 = 0; a29 < 16; a29++)if (mr[a29] === i83 && vr[a29] === n62 && yr[a29] === o46 && gr[a29] === s36) {
            e135.push(a29);
            break;
        }
    }
    for(t237 = 0; t237 < 16; t237++){
        var h20 = new _r;
        h20.set(mr[t237], vr[t237], yr[t237], gr[t237], 0, 0), Tr.push(h20);
    }
}();
var xr = {
    E: 0,
    SE: 1,
    S: 2,
    SW: 3,
    W: 4,
    NW: 5,
    N: 6,
    NE: 7,
    MIRROR_VERTICAL: 8,
    MAIN_DIAGONAL: 10,
    MIRROR_HORIZONTAL: 12,
    REVERSE_DIAGONAL: 14,
    uX: function(t) {
        return mr[t];
    },
    uY: function(t) {
        return vr[t];
    },
    vX: function(t) {
        return yr[t];
    },
    vY: function(t) {
        return gr[t];
    },
    inv: function(t238) {
        return 8 & t238 ? 15 & t238 : 7 & -t238;
    },
    add: function(t, e) {
        return Er[t][e];
    },
    sub: function(t, e) {
        return Er[t][xr.inv(e)];
    },
    rotate180: function(t239) {
        return 4 ^ t239;
    },
    isVertical: function(t240) {
        return 2 == (3 & t240);
    },
    byDirection: function(t241, e136) {
        return 2 * Math.abs(t241) <= Math.abs(e136) ? e136 >= 0 ? xr.S : xr.N : 2 * Math.abs(e136) <= Math.abs(t241) ? t241 > 0 ? xr.E : xr.W : e136 > 0 ? t241 > 0 ? xr.SE : xr.SW : t241 > 0 ? xr.NE : xr.NW;
    },
    matrixAppendRotationInv: function(t242, e, r105, i84) {
        void 0 === r105 && (r105 = 0), void 0 === i84 && (i84 = 0);
        var n63 = Tr[xr.inv(e)];
        n63.tx = r105, n63.ty = i84, t242.append(n63);
    }
}, Rr = function() {
    function t243() {
        this.worldTransform = new _r, this.localTransform = new _r, this.position = new pr(this.onChange, this, 0, 0), this.scale = new pr(this.onChange, this, 1, 1), this.pivot = new pr(this.onChange, this, 0, 0), this.skew = new pr(this.updateSkew, this, 0, 0), this._rotation = 0, this._cx = 1, this._sx = 0, this._cy = 0, this._sy = 1, this._localID = 0, this._currentLocalID = 0, this._worldID = 0, this._parentID = 0;
    }
    return t243.prototype.onChange = function() {
        this._localID++;
    }, t243.prototype.updateSkew = function() {
        this._cx = Math.cos(this._rotation + this.skew.y), this._sx = Math.sin(this._rotation + this.skew.y), this._cy = -Math.sin(this._rotation - this.skew.x), this._sy = Math.cos(this._rotation - this.skew.x), this._localID++;
    }, t243.prototype.updateLocalTransform = function() {
        var t244 = this.localTransform;
        this._localID !== this._currentLocalID && (t244.a = this._cx * this.scale.x, t244.b = this._sx * this.scale.x, t244.c = this._cy * this.scale.y, t244.d = this._sy * this.scale.y, t244.tx = this.position.x - (this.pivot.x * t244.a + this.pivot.y * t244.c), t244.ty = this.position.y - (this.pivot.x * t244.b + this.pivot.y * t244.d), this._currentLocalID = this._localID, this._parentID = -1);
    }, t243.prototype.updateTransform = function(t245) {
        var e137 = this.localTransform;
        if (this._localID !== this._currentLocalID && (e137.a = this._cx * this.scale.x, e137.b = this._sx * this.scale.x, e137.c = this._cy * this.scale.y, e137.d = this._sy * this.scale.y, e137.tx = this.position.x - (this.pivot.x * e137.a + this.pivot.y * e137.c), e137.ty = this.position.y - (this.pivot.x * e137.b + this.pivot.y * e137.d), this._currentLocalID = this._localID, this._parentID = -1), this._parentID !== t245._worldID) {
            var r106 = t245.worldTransform, i85 = this.worldTransform;
            i85.a = e137.a * r106.a + e137.b * r106.c, i85.b = e137.a * r106.b + e137.b * r106.d, i85.c = e137.c * r106.a + e137.d * r106.c, i85.d = e137.c * r106.b + e137.d * r106.d, i85.tx = e137.tx * r106.a + e137.ty * r106.c + r106.tx, i85.ty = e137.tx * r106.b + e137.ty * r106.d + r106.ty, this._parentID = t245._worldID, this._worldID++;
        }
    }, t243.prototype.setFromMatrix = function(t246) {
        t246.decompose(this), this._localID++;
    }, Object.defineProperty(t243.prototype, "rotation", {
        get: function() {
            return this._rotation;
        },
        set: function(t247) {
            this._rotation !== t247 && (this._rotation = t247, this.updateSkew());
        },
        enumerable: !1,
        configurable: !0
    }), t243.IDENTITY = new t243, t243;
}();
et.SORTABLE_CHILDREN = !1;
var Ar = function() {
    function t248() {
        this.minX = 1 / 0, this.minY = 1 / 0, this.maxX = -1 / 0, this.maxY = -1 / 0, this.rect = null, this.updateID = -1;
    }
    return t248.prototype.isEmpty = function() {
        return this.minX > this.maxX || this.minY > this.maxY;
    }, t248.prototype.clear = function() {
        this.minX = 1 / 0, this.minY = 1 / 0, this.maxX = -1 / 0, this.maxY = -1 / 0;
    }, t248.prototype.getRectangle = function(t249) {
        return this.minX > this.maxX || this.minY > this.maxY ? hr.EMPTY : ((t249 = t249 || new hr(0, 0, 1, 1)).x = this.minX, t249.y = this.minY, t249.width = this.maxX - this.minX, t249.height = this.maxY - this.minY, t249);
    }, t248.prototype.addPoint = function(t250) {
        this.minX = Math.min(this.minX, t250.x), this.maxX = Math.max(this.maxX, t250.x), this.minY = Math.min(this.minY, t250.y), this.maxY = Math.max(this.maxY, t250.y);
    }, t248.prototype.addPointMatrix = function(t251, e138) {
        var r107 = t251.a, i86 = t251.b, n64 = t251.c, o47 = t251.d, s37 = t251.tx, a30 = t251.ty, h21 = r107 * e138.x + n64 * e138.y + s37, u17 = i86 * e138.x + o47 * e138.y + a30;
        this.minX = Math.min(this.minX, h21), this.maxX = Math.max(this.maxX, h21), this.minY = Math.min(this.minY, u17), this.maxY = Math.max(this.maxY, u17);
    }, t248.prototype.addQuad = function(t252) {
        var e139 = this.minX, r108 = this.minY, i87 = this.maxX, n65 = this.maxY, o48 = t252[0], s38 = t252[1];
        e139 = o48 < e139 ? o48 : e139, r108 = s38 < r108 ? s38 : r108, i87 = o48 > i87 ? o48 : i87, n65 = s38 > n65 ? s38 : n65, e139 = (o48 = t252[2]) < e139 ? o48 : e139, r108 = (s38 = t252[3]) < r108 ? s38 : r108, i87 = o48 > i87 ? o48 : i87, n65 = s38 > n65 ? s38 : n65, e139 = (o48 = t252[4]) < e139 ? o48 : e139, r108 = (s38 = t252[5]) < r108 ? s38 : r108, i87 = o48 > i87 ? o48 : i87, n65 = s38 > n65 ? s38 : n65, e139 = (o48 = t252[6]) < e139 ? o48 : e139, r108 = (s38 = t252[7]) < r108 ? s38 : r108, i87 = o48 > i87 ? o48 : i87, n65 = s38 > n65 ? s38 : n65, this.minX = e139, this.minY = r108, this.maxX = i87, this.maxY = n65;
    }, t248.prototype.addFrame = function(t253, e140, r109, i88, n66) {
        this.addFrameMatrix(t253.worldTransform, e140, r109, i88, n66);
    }, t248.prototype.addFrameMatrix = function(t254, e141, r110, i89, n67) {
        var o49 = t254.a, s39 = t254.b, a31 = t254.c, h22 = t254.d, u18 = t254.tx, l13 = t254.ty, c9 = this.minX, d12 = this.minY, f10 = this.maxX, p = this.maxY, _4 = o49 * e141 + a31 * r110 + u18, m4 = s39 * e141 + h22 * r110 + l13;
        c9 = _4 < c9 ? _4 : c9, d12 = m4 < d12 ? m4 : d12, f10 = _4 > f10 ? _4 : f10, p = m4 > p ? m4 : p, c9 = (_4 = o49 * i89 + a31 * r110 + u18) < c9 ? _4 : c9, d12 = (m4 = s39 * i89 + h22 * r110 + l13) < d12 ? m4 : d12, f10 = _4 > f10 ? _4 : f10, p = m4 > p ? m4 : p, c9 = (_4 = o49 * e141 + a31 * n67 + u18) < c9 ? _4 : c9, d12 = (m4 = s39 * e141 + h22 * n67 + l13) < d12 ? m4 : d12, f10 = _4 > f10 ? _4 : f10, p = m4 > p ? m4 : p, c9 = (_4 = o49 * i89 + a31 * n67 + u18) < c9 ? _4 : c9, d12 = (m4 = s39 * i89 + h22 * n67 + l13) < d12 ? m4 : d12, f10 = _4 > f10 ? _4 : f10, p = m4 > p ? m4 : p, this.minX = c9, this.minY = d12, this.maxX = f10, this.maxY = p;
    }, t248.prototype.addVertexData = function(t255, e142, r111) {
        for(var i90 = this.minX, n68 = this.minY, o50 = this.maxX, s40 = this.maxY, a32 = e142; a32 < r111; a32 += 2){
            var h23 = t255[a32], u19 = t255[a32 + 1];
            i90 = h23 < i90 ? h23 : i90, n68 = u19 < n68 ? u19 : n68, o50 = h23 > o50 ? h23 : o50, s40 = u19 > s40 ? u19 : s40;
        }
        this.minX = i90, this.minY = n68, this.maxX = o50, this.maxY = s40;
    }, t248.prototype.addVertices = function(t256, e143, r112, i91) {
        this.addVerticesMatrix(t256.worldTransform, e143, r112, i91);
    }, t248.prototype.addVerticesMatrix = function(t257, e144, r113, i92, n69, o51) {
        void 0 === n69 && (n69 = 0), void 0 === o51 && (o51 = n69);
        for(var s41 = t257.a, a33 = t257.b, h24 = t257.c, u20 = t257.d, l14 = t257.tx, c10 = t257.ty, d13 = this.minX, f11 = this.minY, p = this.maxX, _5 = this.maxY, m5 = r113; m5 < i92; m5 += 2){
            var v6 = e144[m5], y = e144[m5 + 1], g6 = s41 * v6 + h24 * y + l14, E6 = u20 * y + a33 * v6 + c10;
            d13 = Math.min(d13, g6 - n69), p = Math.max(p, g6 + n69), f11 = Math.min(f11, E6 - o51), _5 = Math.max(_5, E6 + o51);
        }
        this.minX = d13, this.minY = f11, this.maxX = p, this.maxY = _5;
    }, t248.prototype.addBounds = function(t258) {
        var e145 = this.minX, r114 = this.minY, i93 = this.maxX, n70 = this.maxY;
        this.minX = t258.minX < e145 ? t258.minX : e145, this.minY = t258.minY < r114 ? t258.minY : r114, this.maxX = t258.maxX > i93 ? t258.maxX : i93, this.maxY = t258.maxY > n70 ? t258.maxY : n70;
    }, t248.prototype.addBoundsMask = function(t259, e146) {
        var r115 = t259.minX > e146.minX ? t259.minX : e146.minX, i94 = t259.minY > e146.minY ? t259.minY : e146.minY, n71 = t259.maxX < e146.maxX ? t259.maxX : e146.maxX, o52 = t259.maxY < e146.maxY ? t259.maxY : e146.maxY;
        if (r115 <= n71 && i94 <= o52) {
            var s42 = this.minX, a34 = this.minY, h25 = this.maxX, u21 = this.maxY;
            this.minX = r115 < s42 ? r115 : s42, this.minY = i94 < a34 ? i94 : a34, this.maxX = n71 > h25 ? n71 : h25, this.maxY = o52 > u21 ? o52 : u21;
        }
    }, t248.prototype.addBoundsMatrix = function(t260, e147) {
        this.addFrameMatrix(e147, t260.minX, t260.minY, t260.maxX, t260.maxY);
    }, t248.prototype.addBoundsArea = function(t261, e148) {
        var r116 = t261.minX > e148.x ? t261.minX : e148.x, i95 = t261.minY > e148.y ? t261.minY : e148.y, n72 = t261.maxX < e148.x + e148.width ? t261.maxX : e148.x + e148.width, o53 = t261.maxY < e148.y + e148.height ? t261.maxY : e148.y + e148.height;
        if (r116 <= n72 && i95 <= o53) {
            var s43 = this.minX, a35 = this.minY, h26 = this.maxX, u22 = this.maxY;
            this.minX = r116 < s43 ? r116 : s43, this.minY = i95 < a35 ? i95 : a35, this.maxX = n72 > h26 ? n72 : h26, this.maxY = o53 > u22 ? o53 : u22;
        }
    }, t248.prototype.pad = function(t262, e149) {
        void 0 === t262 && (t262 = 0), void 0 === e149 && (e149 = t262), this.isEmpty() || (this.minX -= t262, this.maxX += t262, this.minY -= e149, this.maxY += e149);
    }, t248.prototype.addFramePad = function(t263, e150, r117, i96, n73, o54) {
        t263 -= n73, e150 -= o54, r117 += n73, i96 += o54, this.minX = this.minX < t263 ? this.minX : t263, this.maxX = this.maxX > r117 ? this.maxX : r117, this.minY = this.minY < e150 ? this.minY : e150, this.maxY = this.maxY > i96 ? this.maxY : i96;
    }, t248;
}(), Or = function(t264, e151) {
    return (Or = Object.setPrototypeOf || ({
        __proto__: []
    }) instanceof Array && function(t265, e152) {
        t265.__proto__ = e152;
    } || function(t266, e153) {
        for(var r118 in e153)e153.hasOwnProperty(r118) && (t266[r118] = e153[r118]);
    })(t264, e151);
};
function Sr(t267, e154) {
    function r119() {
        this.constructor = t267;
    }
    Or(t267, e154), t267.prototype = null === e154 ? Object.create(e154) : (r119.prototype = e154.prototype, new r119);
}
var Ir, Pr, Nr, Mr, Dr, Cr, wr, Lr, Fr, Ur, Gr, Br, Xr, kr, Hr, jr, Yr, Vr, Wr, zr = function(t268) {
    function e155() {
        var e156 = t268.call(this) || this;
        return e156.tempDisplayObjectParent = null, e156.transform = new Rr, e156.alpha = 1, e156.visible = !0, e156.renderable = !0, e156.parent = null, e156.worldAlpha = 1, e156._lastSortedIndex = 0, e156._zIndex = 0, e156.filterArea = null, e156.filters = null, e156._enabledFilters = null, e156._bounds = new Ar, e156._localBounds = null, e156._boundsID = 0, e156._boundsRect = null, e156._localBoundsRect = null, e156._mask = null, e156._maskRefCount = 0, e156._destroyed = !1, e156.isSprite = !1, e156.isMask = !1, e156;
    }
    return Sr(e155, t268), e155.mixin = function(t269) {
        for(var r120 = Object.keys(t269), i97 = 0; i97 < r120.length; ++i97){
            var n74 = r120[i97];
            Object.defineProperty(e155.prototype, n74, Object.getOwnPropertyDescriptor(t269, n74));
        }
    }, Object.defineProperty(e155.prototype, "destroyed", {
        get: function() {
            return this._destroyed;
        },
        enumerable: !1,
        configurable: !0
    }), e155.prototype._recursivePostUpdateTransform = function() {
        this.parent ? (this.parent._recursivePostUpdateTransform(), this.transform.updateTransform(this.parent.transform)) : this.transform.updateTransform(this._tempDisplayObjectParent.transform);
    }, e155.prototype.updateTransform = function() {
        this._boundsID++, this.transform.updateTransform(this.parent.transform), this.worldAlpha = this.alpha * this.parent.worldAlpha;
    }, e155.prototype.getBounds = function(t270, e157) {
        return t270 || (this.parent ? (this._recursivePostUpdateTransform(), this.updateTransform()) : (this.parent = this._tempDisplayObjectParent, this.updateTransform(), this.parent = null)), this._bounds.updateID !== this._boundsID && (this.calculateBounds(), this._bounds.updateID = this._boundsID), e157 || (this._boundsRect || (this._boundsRect = new hr), e157 = this._boundsRect), this._bounds.getRectangle(e157);
    }, e155.prototype.getLocalBounds = function(t271) {
        t271 || (this._localBoundsRect || (this._localBoundsRect = new hr), t271 = this._localBoundsRect), this._localBounds || (this._localBounds = new Ar);
        var e158 = this.transform, r121 = this.parent;
        this.parent = null, this.transform = this._tempDisplayObjectParent.transform;
        var i98 = this._bounds, n75 = this._boundsID;
        this._bounds = this._localBounds;
        var o55 = this.getBounds(!1, t271);
        return this.parent = r121, this.transform = e158, this._bounds = i98, this._bounds.updateID += this._boundsID - n75, o55;
    }, e155.prototype.toGlobal = function(t272, e159, r122) {
        return void 0 === r122 && (r122 = !1), r122 || (this._recursivePostUpdateTransform(), this.parent ? this.displayObjectUpdateTransform() : (this.parent = this._tempDisplayObjectParent, this.displayObjectUpdateTransform(), this.parent = null)), this.worldTransform.apply(t272, e159);
    }, e155.prototype.toLocal = function(t273, e160, r123, i99) {
        return e160 && (t273 = e160.toGlobal(t273, r123, i99)), i99 || (this._recursivePostUpdateTransform(), this.parent ? this.displayObjectUpdateTransform() : (this.parent = this._tempDisplayObjectParent, this.displayObjectUpdateTransform(), this.parent = null)), this.worldTransform.applyInverse(t273, r123);
    }, e155.prototype.setParent = function(t274) {
        if (!t274 || !t274.addChild) throw new Error("setParent: Argument must be a Container");
        return t274.addChild(this), t274;
    }, e155.prototype.setTransform = function(t275, e161, r124, i100, n76, o56, s44, a36, h27) {
        return void 0 === t275 && (t275 = 0), void 0 === e161 && (e161 = 0), void 0 === r124 && (r124 = 1), void 0 === i100 && (i100 = 1), void 0 === n76 && (n76 = 0), void 0 === o56 && (o56 = 0), void 0 === s44 && (s44 = 0), void 0 === a36 && (a36 = 0), void 0 === h27 && (h27 = 0), this.position.x = t275, this.position.y = e161, this.scale.x = r124 || 1, this.scale.y = i100 || 1, this.rotation = n76, this.skew.x = o56, this.skew.y = s44, this.pivot.x = a36, this.pivot.y = h27, this;
    }, e155.prototype.destroy = function(t) {
        this.parent && this.parent.removeChild(this), this.emit("destroyed"), this.removeAllListeners(), this.transform = null, this.parent = null, this._bounds = null, this.mask = null, this.filters = null, this.filterArea = null, this.hitArea = null, this.interactive = !1, this.interactiveChildren = !1, this._destroyed = !0;
    }, Object.defineProperty(e155.prototype, "_tempDisplayObjectParent", {
        get: function() {
            return null === this.tempDisplayObjectParent && (this.tempDisplayObjectParent = new qr), this.tempDisplayObjectParent;
        },
        enumerable: !1,
        configurable: !0
    }), e155.prototype.enableTempParent = function() {
        var t276 = this.parent;
        return this.parent = this._tempDisplayObjectParent, t276;
    }, e155.prototype.disableTempParent = function(t277) {
        this.parent = t277;
    }, Object.defineProperty(e155.prototype, "x", {
        get: function() {
            return this.position.x;
        },
        set: function(t278) {
            this.transform.position.x = t278;
        },
        enumerable: !1,
        configurable: !0
    }), Object.defineProperty(e155.prototype, "y", {
        get: function() {
            return this.position.y;
        },
        set: function(t279) {
            this.transform.position.y = t279;
        },
        enumerable: !1,
        configurable: !0
    }), Object.defineProperty(e155.prototype, "worldTransform", {
        get: function() {
            return this.transform.worldTransform;
        },
        enumerable: !1,
        configurable: !0
    }), Object.defineProperty(e155.prototype, "localTransform", {
        get: function() {
            return this.transform.localTransform;
        },
        enumerable: !1,
        configurable: !0
    }), Object.defineProperty(e155.prototype, "position", {
        get: function() {
            return this.transform.position;
        },
        set: function(t280) {
            this.transform.position.copyFrom(t280);
        },
        enumerable: !1,
        configurable: !0
    }), Object.defineProperty(e155.prototype, "scale", {
        get: function() {
            return this.transform.scale;
        },
        set: function(t281) {
            this.transform.scale.copyFrom(t281);
        },
        enumerable: !1,
        configurable: !0
    }), Object.defineProperty(e155.prototype, "pivot", {
        get: function() {
            return this.transform.pivot;
        },
        set: function(t282) {
            this.transform.pivot.copyFrom(t282);
        },
        enumerable: !1,
        configurable: !0
    }), Object.defineProperty(e155.prototype, "skew", {
        get: function() {
            return this.transform.skew;
        },
        set: function(t283) {
            this.transform.skew.copyFrom(t283);
        },
        enumerable: !1,
        configurable: !0
    }), Object.defineProperty(e155.prototype, "rotation", {
        get: function() {
            return this.transform.rotation;
        },
        set: function(t284) {
            this.transform.rotation = t284;
        },
        enumerable: !1,
        configurable: !0
    }), Object.defineProperty(e155.prototype, "angle", {
        get: function() {
            return this.transform.rotation * sr;
        },
        set: function(t285) {
            this.transform.rotation = t285 * ar;
        },
        enumerable: !1,
        configurable: !0
    }), Object.defineProperty(e155.prototype, "zIndex", {
        get: function() {
            return this._zIndex;
        },
        set: function(t286) {
            this._zIndex = t286, this.parent && (this.parent.sortDirty = !0);
        },
        enumerable: !1,
        configurable: !0
    }), Object.defineProperty(e155.prototype, "worldVisible", {
        get: function() {
            var t287 = this;
            do {
                if (!t287.visible) return !1;
                t287 = t287.parent;
            }while (t287)
            return !0;
        },
        enumerable: !1,
        configurable: !0
    }), Object.defineProperty(e155.prototype, "mask", {
        get: function() {
            return this._mask;
        },
        set: function(t288) {
            var e162;
            this._mask !== t288 && (this._mask && ((e162 = this._mask.maskObject || this._mask)._maskRefCount--, 0 === e162._maskRefCount && (e162.renderable = !0, e162.isMask = !1)), this._mask = t288, this._mask && (0 === (e162 = this._mask.maskObject || this._mask)._maskRefCount && (e162.renderable = !1, e162.isMask = !0), e162._maskRefCount++));
        },
        enumerable: !1,
        configurable: !0
    }), e155;
}(nt), qr = function(t289) {
    function e163() {
        var e164 = null !== t289 && t289.apply(this, arguments) || this;
        return e164.sortDirty = null, e164;
    }
    return Sr(e163, t289), e163;
}(zr);
function Kr(t290, e165) {
    return t290.zIndex === e165.zIndex ? t290._lastSortedIndex - e165._lastSortedIndex : t290.zIndex - e165.zIndex;
}
zr.prototype.displayObjectUpdateTransform = zr.prototype.updateTransform, (function(t291) {
    t291[t291.WEBGL_LEGACY = 0] = "WEBGL_LEGACY", t291[t291.WEBGL = 1] = "WEBGL", t291[t291.WEBGL2 = 2] = "WEBGL2";
})(Ir || (Ir = {
})), (function(t292) {
    t292[t292.UNKNOWN = 0] = "UNKNOWN", t292[t292.WEBGL = 1] = "WEBGL", t292[t292.CANVAS = 2] = "CANVAS";
})(Pr || (Pr = {
})), (function(t293) {
    t293[t293.COLOR = 16384] = "COLOR", t293[t293.DEPTH = 256] = "DEPTH", t293[t293.STENCIL = 1024] = "STENCIL";
})(Nr || (Nr = {
})), (function(t294) {
    t294[t294.NORMAL = 0] = "NORMAL", t294[t294.ADD = 1] = "ADD", t294[t294.MULTIPLY = 2] = "MULTIPLY", t294[t294.SCREEN = 3] = "SCREEN", t294[t294.OVERLAY = 4] = "OVERLAY", t294[t294.DARKEN = 5] = "DARKEN", t294[t294.LIGHTEN = 6] = "LIGHTEN", t294[t294.COLOR_DODGE = 7] = "COLOR_DODGE", t294[t294.COLOR_BURN = 8] = "COLOR_BURN", t294[t294.HARD_LIGHT = 9] = "HARD_LIGHT", t294[t294.SOFT_LIGHT = 10] = "SOFT_LIGHT", t294[t294.DIFFERENCE = 11] = "DIFFERENCE", t294[t294.EXCLUSION = 12] = "EXCLUSION", t294[t294.HUE = 13] = "HUE", t294[t294.SATURATION = 14] = "SATURATION", t294[t294.COLOR = 15] = "COLOR", t294[t294.LUMINOSITY = 16] = "LUMINOSITY", t294[t294.NORMAL_NPM = 17] = "NORMAL_NPM", t294[t294.ADD_NPM = 18] = "ADD_NPM", t294[t294.SCREEN_NPM = 19] = "SCREEN_NPM", t294[t294.NONE = 20] = "NONE", t294[t294.SRC_OVER = 0] = "SRC_OVER", t294[t294.SRC_IN = 21] = "SRC_IN", t294[t294.SRC_OUT = 22] = "SRC_OUT", t294[t294.SRC_ATOP = 23] = "SRC_ATOP", t294[t294.DST_OVER = 24] = "DST_OVER", t294[t294.DST_IN = 25] = "DST_IN", t294[t294.DST_OUT = 26] = "DST_OUT", t294[t294.DST_ATOP = 27] = "DST_ATOP", t294[t294.ERASE = 26] = "ERASE", t294[t294.SUBTRACT = 28] = "SUBTRACT", t294[t294.XOR = 29] = "XOR";
})(Mr || (Mr = {
})), (function(t295) {
    t295[t295.POINTS = 0] = "POINTS", t295[t295.LINES = 1] = "LINES", t295[t295.LINE_LOOP = 2] = "LINE_LOOP", t295[t295.LINE_STRIP = 3] = "LINE_STRIP", t295[t295.TRIANGLES = 4] = "TRIANGLES", t295[t295.TRIANGLE_STRIP = 5] = "TRIANGLE_STRIP", t295[t295.TRIANGLE_FAN = 6] = "TRIANGLE_FAN";
})(Dr || (Dr = {
})), (function(t296) {
    t296[t296.RGBA = 6408] = "RGBA", t296[t296.RGB = 6407] = "RGB", t296[t296.RG = 33319] = "RG", t296[t296.RED = 6403] = "RED", t296[t296.RGBA_INTEGER = 36249] = "RGBA_INTEGER", t296[t296.RGB_INTEGER = 36248] = "RGB_INTEGER", t296[t296.RG_INTEGER = 33320] = "RG_INTEGER", t296[t296.RED_INTEGER = 36244] = "RED_INTEGER", t296[t296.ALPHA = 6406] = "ALPHA", t296[t296.LUMINANCE = 6409] = "LUMINANCE", t296[t296.LUMINANCE_ALPHA = 6410] = "LUMINANCE_ALPHA", t296[t296.DEPTH_COMPONENT = 6402] = "DEPTH_COMPONENT", t296[t296.DEPTH_STENCIL = 34041] = "DEPTH_STENCIL";
})(Cr || (Cr = {
})), (function(t297) {
    t297[t297.TEXTURE_2D = 3553] = "TEXTURE_2D", t297[t297.TEXTURE_CUBE_MAP = 34067] = "TEXTURE_CUBE_MAP", t297[t297.TEXTURE_2D_ARRAY = 35866] = "TEXTURE_2D_ARRAY", t297[t297.TEXTURE_CUBE_MAP_POSITIVE_X = 34069] = "TEXTURE_CUBE_MAP_POSITIVE_X", t297[t297.TEXTURE_CUBE_MAP_NEGATIVE_X = 34070] = "TEXTURE_CUBE_MAP_NEGATIVE_X", t297[t297.TEXTURE_CUBE_MAP_POSITIVE_Y = 34071] = "TEXTURE_CUBE_MAP_POSITIVE_Y", t297[t297.TEXTURE_CUBE_MAP_NEGATIVE_Y = 34072] = "TEXTURE_CUBE_MAP_NEGATIVE_Y", t297[t297.TEXTURE_CUBE_MAP_POSITIVE_Z = 34073] = "TEXTURE_CUBE_MAP_POSITIVE_Z", t297[t297.TEXTURE_CUBE_MAP_NEGATIVE_Z = 34074] = "TEXTURE_CUBE_MAP_NEGATIVE_Z";
})(wr || (wr = {
})), (function(t298) {
    t298[t298.UNSIGNED_BYTE = 5121] = "UNSIGNED_BYTE", t298[t298.UNSIGNED_SHORT = 5123] = "UNSIGNED_SHORT", t298[t298.UNSIGNED_SHORT_5_6_5 = 33635] = "UNSIGNED_SHORT_5_6_5", t298[t298.UNSIGNED_SHORT_4_4_4_4 = 32819] = "UNSIGNED_SHORT_4_4_4_4", t298[t298.UNSIGNED_SHORT_5_5_5_1 = 32820] = "UNSIGNED_SHORT_5_5_5_1", t298[t298.UNSIGNED_INT = 5125] = "UNSIGNED_INT", t298[t298.UNSIGNED_INT_10F_11F_11F_REV = 35899] = "UNSIGNED_INT_10F_11F_11F_REV", t298[t298.UNSIGNED_INT_2_10_10_10_REV = 33640] = "UNSIGNED_INT_2_10_10_10_REV", t298[t298.UNSIGNED_INT_24_8 = 34042] = "UNSIGNED_INT_24_8", t298[t298.UNSIGNED_INT_5_9_9_9_REV = 35902] = "UNSIGNED_INT_5_9_9_9_REV", t298[t298.BYTE = 5120] = "BYTE", t298[t298.SHORT = 5122] = "SHORT", t298[t298.INT = 5124] = "INT", t298[t298.FLOAT = 5126] = "FLOAT", t298[t298.FLOAT_32_UNSIGNED_INT_24_8_REV = 36269] = "FLOAT_32_UNSIGNED_INT_24_8_REV", t298[t298.HALF_FLOAT = 36193] = "HALF_FLOAT";
})(Lr || (Lr = {
})), (function(t299) {
    t299[t299.FLOAT = 0] = "FLOAT", t299[t299.INT = 1] = "INT", t299[t299.UINT = 2] = "UINT";
})(Fr || (Fr = {
})), (function(t300) {
    t300[t300.NEAREST = 0] = "NEAREST", t300[t300.LINEAR = 1] = "LINEAR";
})(Ur || (Ur = {
})), (function(t301) {
    t301[t301.CLAMP = 33071] = "CLAMP", t301[t301.REPEAT = 10497] = "REPEAT", t301[t301.MIRRORED_REPEAT = 33648] = "MIRRORED_REPEAT";
})(Gr || (Gr = {
})), (function(t302) {
    t302[t302.OFF = 0] = "OFF", t302[t302.POW2 = 1] = "POW2", t302[t302.ON = 2] = "ON", t302[t302.ON_MANUAL = 3] = "ON_MANUAL";
})(Br || (Br = {
})), (function(t303) {
    t303[t303.NPM = 0] = "NPM", t303[t303.UNPACK = 1] = "UNPACK", t303[t303.PMA = 2] = "PMA", t303[t303.NO_PREMULTIPLIED_ALPHA = 0] = "NO_PREMULTIPLIED_ALPHA", t303[t303.PREMULTIPLY_ON_UPLOAD = 1] = "PREMULTIPLY_ON_UPLOAD", t303[t303.PREMULTIPLY_ALPHA = 2] = "PREMULTIPLY_ALPHA", t303[t303.PREMULTIPLIED_ALPHA = 2] = "PREMULTIPLIED_ALPHA";
})(Xr || (Xr = {
})), (function(t304) {
    t304[t304.NO = 0] = "NO", t304[t304.YES = 1] = "YES", t304[t304.AUTO = 2] = "AUTO", t304[t304.BLEND = 0] = "BLEND", t304[t304.CLEAR = 1] = "CLEAR", t304[t304.BLIT = 2] = "BLIT";
})(kr || (kr = {
})), (function(t305) {
    t305[t305.AUTO = 0] = "AUTO", t305[t305.MANUAL = 1] = "MANUAL";
})(Hr || (Hr = {
})), (function(t306) {
    t306.LOW = "lowp", t306.MEDIUM = "mediump", t306.HIGH = "highp";
})(jr || (jr = {
})), (function(t307) {
    t307[t307.NONE = 0] = "NONE", t307[t307.SCISSOR = 1] = "SCISSOR", t307[t307.STENCIL = 2] = "STENCIL", t307[t307.SPRITE = 3] = "SPRITE";
})(Yr || (Yr = {
})), (function(t308) {
    t308[t308.NONE = 0] = "NONE", t308[t308.LOW = 2] = "LOW", t308[t308.MEDIUM = 4] = "MEDIUM", t308[t308.HIGH = 8] = "HIGH";
})(Vr || (Vr = {
})), (function(t309) {
    t309[t309.ELEMENT_ARRAY_BUFFER = 34963] = "ELEMENT_ARRAY_BUFFER", t309[t309.ARRAY_BUFFER = 34962] = "ARRAY_BUFFER", t309[t309.UNIFORM_BUFFER = 35345] = "UNIFORM_BUFFER";
})(Wr || (Wr = {
}));
var Zr = function(t310) {
    function e166() {
        var e167 = t310.call(this) || this;
        return e167.children = [], e167.sortableChildren = et.SORTABLE_CHILDREN, e167.sortDirty = !1, e167;
    }
    return Sr(e166, t310), e166.prototype.onChildrenChange = function(t) {
    }, e166.prototype.addChild = function() {
        for(var t311 = arguments, e168 = [], r125 = 0; r125 < arguments.length; r125++)e168[r125] = t311[r125];
        if (e168.length > 1) for(var i101 = 0; i101 < e168.length; i101++)this.addChild(e168[i101]);
        else {
            var n77 = e168[0];
            n77.parent && n77.parent.removeChild(n77), n77.parent = this, this.sortDirty = !0, n77.transform._parentID = -1, this.children.push(n77), this._boundsID++, this.onChildrenChange(this.children.length - 1), this.emit("childAdded", n77, this, this.children.length - 1), n77.emit("added", this);
        }
        return e168[0];
    }, e166.prototype.addChildAt = function(t312, e169) {
        if (e169 < 0 || e169 > this.children.length) throw new Error(t312 + "addChildAt: The index " + e169 + " supplied is out of bounds " + this.children.length);
        return t312.parent && t312.parent.removeChild(t312), t312.parent = this, this.sortDirty = !0, t312.transform._parentID = -1, this.children.splice(e169, 0, t312), this._boundsID++, this.onChildrenChange(e169), t312.emit("added", this), this.emit("childAdded", t312, this, e169), t312;
    }, e166.prototype.swapChildren = function(t313, e170) {
        if (t313 !== e170) {
            var r126 = this.getChildIndex(t313), i102 = this.getChildIndex(e170);
            this.children[r126] = e170, this.children[i102] = t313, this.onChildrenChange(r126 < i102 ? r126 : i102);
        }
    }, e166.prototype.getChildIndex = function(t314) {
        var e171 = this.children.indexOf(t314);
        if (-1 === e171) throw new Error("The supplied DisplayObject must be a child of the caller");
        return e171;
    }, e166.prototype.setChildIndex = function(t315, e172) {
        if (e172 < 0 || e172 >= this.children.length) throw new Error("The index " + e172 + " supplied is out of bounds " + this.children.length);
        var r127 = this.getChildIndex(t315);
        je(this.children, r127, 1), this.children.splice(e172, 0, t315), this.onChildrenChange(e172);
    }, e166.prototype.getChildAt = function(t316) {
        if (t316 < 0 || t316 >= this.children.length) throw new Error("getChildAt: Index (" + t316 + ") does not exist.");
        return this.children[t316];
    }, e166.prototype.removeChild = function() {
        for(var t317 = arguments, e173 = [], r128 = 0; r128 < arguments.length; r128++)e173[r128] = t317[r128];
        if (e173.length > 1) for(var i103 = 0; i103 < e173.length; i103++)this.removeChild(e173[i103]);
        else {
            var n78 = e173[0], o57 = this.children.indexOf(n78);
            if (-1 === o57) return null;
            n78.parent = null, n78.transform._parentID = -1, je(this.children, o57, 1), this._boundsID++, this.onChildrenChange(o57), n78.emit("removed", this), this.emit("childRemoved", n78, this, o57);
        }
        return e173[0];
    }, e166.prototype.removeChildAt = function(t318) {
        var e174 = this.getChildAt(t318);
        return e174.parent = null, e174.transform._parentID = -1, je(this.children, t318, 1), this._boundsID++, this.onChildrenChange(t318), e174.emit("removed", this), this.emit("childRemoved", e174, this, t318), e174;
    }, e166.prototype.removeChildren = function(t319, e175) {
        void 0 === t319 && (t319 = 0), void 0 === e175 && (e175 = this.children.length);
        var r129, i104 = t319, n79 = e175 - i104;
        if (n79 > 0 && n79 <= e175) {
            r129 = this.children.splice(i104, n79);
            for(var o58 = 0; o58 < r129.length; ++o58)r129[o58].parent = null, r129[o58].transform && (r129[o58].transform._parentID = -1);
            for(this._boundsID++, this.onChildrenChange(t319), o58 = 0; o58 < r129.length; ++o58)r129[o58].emit("removed", this), this.emit("childRemoved", r129[o58], this, o58);
            return r129;
        }
        if (0 === n79 && 0 === this.children.length) return [];
        throw new RangeError("removeChildren: numeric values are outside the acceptable range.");
    }, e166.prototype.sortChildren = function() {
        for(var t320 = !1, e176 = 0, r130 = this.children.length; e176 < r130; ++e176){
            var i105 = this.children[e176];
            i105._lastSortedIndex = e176, t320 || 0 === i105.zIndex || (t320 = !0);
        }
        t320 && this.children.length > 1 && this.children.sort(Kr), this.sortDirty = !1;
    }, e166.prototype.updateTransform = function() {
        this.sortableChildren && this.sortDirty && this.sortChildren(), this._boundsID++, this.transform.updateTransform(this.parent.transform), this.worldAlpha = this.alpha * this.parent.worldAlpha;
        for(var t321 = 0, e177 = this.children.length; t321 < e177; ++t321){
            var r131 = this.children[t321];
            r131.visible && r131.updateTransform();
        }
    }, e166.prototype.calculateBounds = function() {
        this._bounds.clear(), this._calculateBounds();
        for(var t322 = 0; t322 < this.children.length; t322++){
            var e178 = this.children[t322];
            if (e178.visible && e178.renderable) if (e178.calculateBounds(), e178._mask) {
                var r132 = e178._mask.maskObject || e178._mask;
                r132.calculateBounds(), this._bounds.addBoundsMask(e178._bounds, r132._bounds);
            } else e178.filterArea ? this._bounds.addBoundsArea(e178._bounds, e178.filterArea) : this._bounds.addBounds(e178._bounds);
        }
        this._bounds.updateID = this._boundsID;
    }, e166.prototype.getLocalBounds = function(e179, r133) {
        void 0 === r133 && (r133 = !1);
        var i106 = t310.prototype.getLocalBounds.call(this, e179);
        if (!r133) for(var n80 = 0, o59 = this.children.length; n80 < o59; ++n80){
            var s45 = this.children[n80];
            s45.visible && s45.updateTransform();
        }
        return i106;
    }, e166.prototype._calculateBounds = function() {
    }, e166.prototype.render = function(t323) {
        if (this.visible && !(this.worldAlpha <= 0) && this.renderable) if (this._mask || this.filters && this.filters.length) this.renderAdvanced(t323);
        else {
            this._render(t323);
            for(var e180 = 0, r134 = this.children.length; e180 < r134; ++e180)this.children[e180].render(t323);
        }
    }, e166.prototype.renderAdvanced = function(t324) {
        var e181 = this.filters, r135 = this._mask;
        if (e181) {
            this._enabledFilters || (this._enabledFilters = []), this._enabledFilters.length = 0;
            for(var i107 = 0; i107 < e181.length; i107++)e181[i107].enabled && this._enabledFilters.push(e181[i107]);
        }
        var n81 = e181 && this._enabledFilters && this._enabledFilters.length || r135 && (!r135.isMaskData || r135.enabled && (r135.autoDetect || r135.type !== Yr.NONE));
        n81 && t324.batch.flush(), e181 && this._enabledFilters && this._enabledFilters.length && t324.filter.push(this, this._enabledFilters), r135 && t324.mask.push(this, this._mask), this._render(t324), i107 = 0;
        for(var o60 = this.children.length; i107 < o60; i107++)this.children[i107].render(t324);
        n81 && t324.batch.flush(), r135 && t324.mask.pop(this), e181 && this._enabledFilters && this._enabledFilters.length && t324.filter.pop();
    }, e166.prototype._render = function(t) {
    }, e166.prototype.destroy = function(e182) {
        t310.prototype.destroy.call(this), this.sortDirty = !1;
        var r136 = "boolean" == typeof e182 ? e182 : e182 && e182.children, i108 = this.removeChildren(0, this.children.length);
        if (r136) for(var n82 = 0; n82 < i108.length; ++n82)i108[n82].destroy(e182);
    }, Object.defineProperty(e166.prototype, "width", {
        get: function() {
            return this.scale.x * this.getLocalBounds().width;
        },
        set: function(t325) {
            var e183 = this.getLocalBounds().width;
            this.scale.x = 0 !== e183 ? t325 / e183 : 1, this._width = t325;
        },
        enumerable: !1,
        configurable: !0
    }), Object.defineProperty(e166.prototype, "height", {
        get: function() {
            return this.scale.y * this.getLocalBounds().height;
        },
        set: function(t326) {
            var e184 = this.getLocalBounds().height;
            this.scale.y = 0 !== e184 ? t326 / e184 : 1, this._height = t326;
        },
        enumerable: !1,
        configurable: !0
    }), e166;
}(zr);
Zr.prototype.containerUpdateTransform = Zr.prototype.updateTransform;
var Jr = {
    accessible: !1,
    accessibleTitle: null,
    accessibleHint: null,
    tabIndex: 0,
    _accessibleActive: !1,
    _accessibleDiv: null,
    accessibleType: "button",
    accessiblePointerEvents: "auto",
    accessibleChildren: !0,
    renderId: -1
};
zr.mixin(Jr);
var Qr, $r = 100, ti = 0, ei = 0, ri = 2, ii = function() {
    function t327(t328) {
        this.debug = !1, this._isActive = !1, this._isMobileAccessibility = !1, this.pool = [], this.renderId = 0, this.children = [], this.androidUpdateCount = 0, this.androidUpdateFrequency = 500, this._hookDiv = null, (tt.tablet || tt.phone) && this.createTouchHook();
        var e185 = document.createElement("div");
        e185.style.width = $r + "px", e185.style.height = $r + "px", e185.style.position = "absolute", e185.style.top = ti + "px", e185.style.left = ei + "px", e185.style.zIndex = ri.toString(), this.div = e185, this.renderer = t328, this._onKeyDown = this._onKeyDown.bind(this), this._onMouseMove = this._onMouseMove.bind(this), self.addEventListener("keydown", this._onKeyDown, !1);
    }
    return Object.defineProperty(t327.prototype, "isActive", {
        get: function() {
            return this._isActive;
        },
        enumerable: !1,
        configurable: !0
    }), Object.defineProperty(t327.prototype, "isMobileAccessibility", {
        get: function() {
            return this._isMobileAccessibility;
        },
        enumerable: !1,
        configurable: !0
    }), t327.prototype.createTouchHook = function() {
        var t329 = this, e186 = document.createElement("button");
        e186.style.width = "1px", e186.style.height = "1px", e186.style.position = "absolute", e186.style.top = "-1000px", e186.style.left = "-1000px", e186.style.zIndex = 2..toString(), e186.style.backgroundColor = "#FF0000", e186.title = "select to enable accessibility for this content", e186.addEventListener("focus", function() {
            t329._isMobileAccessibility = !0, t329.activate(), t329.destroyTouchHook();
        }), document.body.appendChild(e186), this._hookDiv = e186;
    }, t327.prototype.destroyTouchHook = function() {
        this._hookDiv && (document.body.removeChild(this._hookDiv), this._hookDiv = null);
    }, t327.prototype.activate = function() {
        var t330;
        this._isActive || (this._isActive = !0, self.document.addEventListener("mousemove", this._onMouseMove, !0), self.removeEventListener("keydown", this._onKeyDown, !1), this.renderer.on("postrender", this.update, this), null === (t330 = this.renderer.view.parentNode) || void 0 === t330 || t330.appendChild(this.div));
    }, t327.prototype.deactivate = function() {
        var t331;
        this._isActive && !this._isMobileAccessibility && (this._isActive = !1, self.document.removeEventListener("mousemove", this._onMouseMove, !0), self.addEventListener("keydown", this._onKeyDown, !1), this.renderer.off("postrender", this.update), null === (t331 = this.div.parentNode) || void 0 === t331 || t331.removeChild(this.div));
    }, t327.prototype.updateAccessibleObjects = function(t332) {
        if (t332.visible && t332.accessibleChildren) {
            t332.accessible && t332.interactive && (t332._accessibleActive || this.addChild(t332), t332.renderId = this.renderId);
            var e187 = t332.children;
            if (e187) for(var r137 = 0; r137 < e187.length; r137++)this.updateAccessibleObjects(e187[r137]);
        }
    }, t327.prototype.update = function() {
        var t333 = performance.now();
        if (!(tt.android.device && t333 < this.androidUpdateCount) && (this.androidUpdateCount = t333 + this.androidUpdateFrequency, this.renderer.renderingToScreen)) {
            this.renderer._lastObjectRendered && this.updateAccessibleObjects(this.renderer._lastObjectRendered);
            var e188 = this.renderer.view.getBoundingClientRect(), r138 = e188.left, i109 = e188.top, n83 = e188.width, o61 = e188.height, s46 = this.renderer, a37 = s46.width, h28 = s46.height, u23 = s46.resolution, l15 = n83 / a37 * u23, c11 = o61 / h28 * u23, d14 = this.div;
            d14.style.left = r138 + "px", d14.style.top = i109 + "px", d14.style.width = a37 + "px", d14.style.height = h28 + "px";
            for(var f12 = 0; f12 < this.children.length; f12++){
                var p = this.children[f12];
                if (p.renderId !== this.renderId) p._accessibleActive = !1, je(this.children, f12, 1), this.div.removeChild(p._accessibleDiv), this.pool.push(p._accessibleDiv), p._accessibleDiv = null, f12--;
                else {
                    d14 = p._accessibleDiv;
                    var _6 = p.hitArea, m6 = p.worldTransform;
                    p.hitArea ? (d14.style.left = (m6.tx + _6.x * m6.a) * l15 + "px", d14.style.top = (m6.ty + _6.y * m6.d) * c11 + "px", d14.style.width = _6.width * m6.a * l15 + "px", d14.style.height = _6.height * m6.d * c11 + "px") : (_6 = p.getBounds(), this.capHitArea(_6), d14.style.left = _6.x * l15 + "px", d14.style.top = _6.y * c11 + "px", d14.style.width = _6.width * l15 + "px", d14.style.height = _6.height * c11 + "px", d14.title !== p.accessibleTitle && null !== p.accessibleTitle && (d14.title = p.accessibleTitle), d14.getAttribute("aria-label") !== p.accessibleHint && null !== p.accessibleHint && d14.setAttribute("aria-label", p.accessibleHint)), p.accessibleTitle === d14.title && p.tabIndex === d14.tabIndex || (d14.title = p.accessibleTitle, d14.tabIndex = p.tabIndex, this.debug && this.updateDebugHTML(d14));
                }
            }
            this.renderId++;
        }
    }, t327.prototype.updateDebugHTML = function(t334) {
        t334.innerHTML = "type: " + t334.type + "</br> title : " + t334.title + "</br> tabIndex: " + t334.tabIndex;
    }, t327.prototype.capHitArea = function(t335) {
        t335.x < 0 && (t335.width += t335.x, t335.x = 0), t335.y < 0 && (t335.height += t335.y, t335.y = 0);
        var e189 = this.renderer, r139 = e189.width, i110 = e189.height;
        t335.x + t335.width > r139 && (t335.width = r139 - t335.x), t335.y + t335.height > i110 && (t335.height = i110 - t335.y);
    }, t327.prototype.addChild = function(t336) {
        var e190 = this.pool.pop();
        e190 || ((e190 = document.createElement("button")).style.width = $r + "px", e190.style.height = $r + "px", e190.style.backgroundColor = this.debug ? "rgba(255,255,255,0.5)" : "transparent", e190.style.position = "absolute", e190.style.zIndex = ri.toString(), e190.style.borderStyle = "none", navigator.userAgent.toLowerCase().indexOf("chrome") > -1 ? e190.setAttribute("aria-live", "off") : e190.setAttribute("aria-live", "polite"), navigator.userAgent.match(/rv:.*Gecko\//) ? e190.setAttribute("aria-relevant", "additions") : e190.setAttribute("aria-relevant", "text"), e190.addEventListener("click", this._onClick.bind(this)), e190.addEventListener("focus", this._onFocus.bind(this)), e190.addEventListener("focusout", this._onFocusOut.bind(this))), e190.style.pointerEvents = t336.accessiblePointerEvents, e190.type = t336.accessibleType, t336.accessibleTitle && null !== t336.accessibleTitle ? e190.title = t336.accessibleTitle : t336.accessibleHint && null !== t336.accessibleHint || (e190.title = "displayObject " + t336.tabIndex), t336.accessibleHint && null !== t336.accessibleHint && e190.setAttribute("aria-label", t336.accessibleHint), this.debug && this.updateDebugHTML(e190), t336._accessibleActive = !0, t336._accessibleDiv = e190, e190.displayObject = t336, this.children.push(t336), this.div.appendChild(t336._accessibleDiv), t336._accessibleDiv.tabIndex = t336.tabIndex;
    }, t327.prototype._onClick = function(t337) {
        var e191 = this.renderer.plugins.interaction, r140 = t337.target.displayObject, i111 = e191.eventData;
        e191.dispatchEvent(r140, "click", i111), e191.dispatchEvent(r140, "pointertap", i111), e191.dispatchEvent(r140, "tap", i111);
    }, t327.prototype._onFocus = function(t338) {
        t338.target.getAttribute("aria-live") || t338.target.setAttribute("aria-live", "assertive");
        var e192 = this.renderer.plugins.interaction, r141 = t338.target.displayObject, i112 = e192.eventData;
        e192.dispatchEvent(r141, "mouseover", i112);
    }, t327.prototype._onFocusOut = function(t339) {
        t339.target.getAttribute("aria-live") || t339.target.setAttribute("aria-live", "polite");
        var e193 = this.renderer.plugins.interaction, r142 = t339.target.displayObject, i113 = e193.eventData;
        e193.dispatchEvent(r142, "mouseout", i113);
    }, t327.prototype._onKeyDown = function(t340) {
        9 === t340.keyCode && this.activate();
    }, t327.prototype._onMouseMove = function(t341) {
        0 === t341.movementX && 0 === t341.movementY || this.deactivate();
    }, t327.prototype.destroy = function() {
        this.destroyTouchHook(), this.div = null, self.document.removeEventListener("mousemove", this._onMouseMove, !0), self.removeEventListener("keydown", this._onKeyDown), this.pool = null, this.children = null, this.renderer = null;
    }, t327;
}();
et.TARGET_FPMS = 0.06, (function(t342) {
    t342[t342.INTERACTION = 50] = "INTERACTION", t342[t342.HIGH = 25] = "HIGH", t342[t342.NORMAL = 0] = "NORMAL", t342[t342.LOW = -25] = "LOW", t342[t342.UTILITY = -50] = "UTILITY";
})(Qr || (Qr = {
}));
var ni = function() {
    function t343(t344, e194, r143, i114) {
        void 0 === e194 && (e194 = null), void 0 === r143 && (r143 = 0), void 0 === i114 && (i114 = !1), this.next = null, this.previous = null, this._destroyed = !1, this.fn = t344, this.context = e194, this.priority = r143, this.once = i114;
    }
    return t343.prototype.match = function(t345, e195) {
        return void 0 === e195 && (e195 = null), this.fn === t345 && this.context === e195;
    }, t343.prototype.emit = function(t346) {
        this.fn && (this.context ? this.fn.call(this.context, t346) : this.fn(t346));
        var e196 = this.next;
        return this.once && this.destroy(!0), this._destroyed && (this.next = null), e196;
    }, t343.prototype.connect = function(t347) {
        this.previous = t347, t347.next && (t347.next.previous = this), this.next = t347.next, t347.next = this;
    }, t343.prototype.destroy = function(t348) {
        void 0 === t348 && (t348 = !1), this._destroyed = !0, this.fn = null, this.context = null, this.previous && (this.previous.next = this.next), this.next && (this.next.previous = this.previous);
        var e197 = this.next;
        return this.next = t348 ? null : e197, this.previous = null, e197;
    }, t343;
}(), oi = function() {
    function t349() {
        var t350 = this;
        this.autoStart = !1, this.deltaTime = 1, this.lastTime = -1, this.speed = 1, this.started = !1, this._requestId = null, this._maxElapsedMS = 100, this._minElapsedMS = 0, this._protected = !1, this._lastFrame = -1, this._head = new ni(null, null, 1 / 0), this.deltaMS = 1 / et.TARGET_FPMS, this.elapsedMS = 1 / et.TARGET_FPMS, this._tick = function(e198) {
            t350._requestId = null, t350.started && (t350.update(e198), t350.started && null === t350._requestId && t350._head.next && (t350._requestId = requestAnimationFrame(t350._tick)));
        };
    }
    return t349.prototype._requestIfNeeded = function() {
        null === this._requestId && this._head.next && (this.lastTime = performance.now(), this._lastFrame = this.lastTime, this._requestId = requestAnimationFrame(this._tick));
    }, t349.prototype._cancelIfNeeded = function() {
        null !== this._requestId && (cancelAnimationFrame(this._requestId), this._requestId = null);
    }, t349.prototype._startIfPossible = function() {
        this.started ? this._requestIfNeeded() : this.autoStart && this.start();
    }, t349.prototype.add = function(t351, e199, r144) {
        return void 0 === r144 && (r144 = Qr.NORMAL), this._addListener(new ni(t351, e199, r144));
    }, t349.prototype.addOnce = function(t352, e200, r145) {
        return void 0 === r145 && (r145 = Qr.NORMAL), this._addListener(new ni(t352, e200, r145, !0));
    }, t349.prototype._addListener = function(t353) {
        var e201 = this._head.next, r146 = this._head;
        if (e201) {
            for(; e201;){
                if (t353.priority > e201.priority) {
                    t353.connect(r146);
                    break;
                }
                r146 = e201, e201 = e201.next;
            }
            t353.previous || t353.connect(r146);
        } else t353.connect(r146);
        return this._startIfPossible(), this;
    }, t349.prototype.remove = function(t354, e202) {
        for(var r147 = this._head.next; r147;)r147 = r147.match(t354, e202) ? r147.destroy() : r147.next;
        return this._head.next || this._cancelIfNeeded(), this;
    }, Object.defineProperty(t349.prototype, "count", {
        get: function() {
            if (!this._head) return 0;
            for(var t355 = 0, e203 = this._head; e203 = e203.next;)t355++;
            return t355;
        },
        enumerable: !1,
        configurable: !0
    }), t349.prototype.start = function() {
        this.started || (this.started = !0, this._requestIfNeeded());
    }, t349.prototype.stop = function() {
        this.started && (this.started = !1, this._cancelIfNeeded());
    }, t349.prototype.destroy = function() {
        if (!this._protected) {
            this.stop();
            for(var t356 = this._head.next; t356;)t356 = t356.destroy(!0);
            this._head.destroy(), this._head = null;
        }
    }, t349.prototype.update = function(t357) {
        var e204;
        if (void 0 === t357 && (t357 = performance.now()), t357 > this.lastTime) {
            if ((e204 = this.elapsedMS = t357 - this.lastTime) > this._maxElapsedMS && (e204 = this._maxElapsedMS), e204 *= this.speed, this._minElapsedMS) {
                var r148 = t357 - this._lastFrame | 0;
                if (r148 < this._minElapsedMS) return;
                this._lastFrame = t357 - r148 % this._minElapsedMS;
            }
            this.deltaMS = e204, this.deltaTime = this.deltaMS * et.TARGET_FPMS;
            for(var i115 = this._head, n84 = i115.next; n84;)n84 = n84.emit(this.deltaTime);
            i115.next || this._cancelIfNeeded();
        } else this.deltaTime = this.deltaMS = this.elapsedMS = 0;
        this.lastTime = t357;
    }, Object.defineProperty(t349.prototype, "FPS", {
        get: function() {
            return 1000 / this.elapsedMS;
        },
        enumerable: !1,
        configurable: !0
    }), Object.defineProperty(t349.prototype, "minFPS", {
        get: function() {
            return 1000 / this._maxElapsedMS;
        },
        set: function(t358) {
            var e205 = Math.min(this.maxFPS, t358), r149 = Math.min(Math.max(0, e205) / 1000, et.TARGET_FPMS);
            this._maxElapsedMS = 1 / r149;
        },
        enumerable: !1,
        configurable: !0
    }), Object.defineProperty(t349.prototype, "maxFPS", {
        get: function() {
            return this._minElapsedMS ? Math.round(1000 / this._minElapsedMS) : 0;
        },
        set: function(t359) {
            if (0 === t359) this._minElapsedMS = 0;
            else {
                var e206 = Math.max(this.minFPS, t359);
                this._minElapsedMS = 1 / (e206 / 1000);
            }
        },
        enumerable: !1,
        configurable: !0
    }), Object.defineProperty(t349, "shared", {
        get: function() {
            if (!t349._shared) {
                var e207 = t349._shared = new t349;
                e207.autoStart = !0, e207._protected = !0;
            }
            return t349._shared;
        },
        enumerable: !1,
        configurable: !0
    }), Object.defineProperty(t349, "system", {
        get: function() {
            if (!t349._system) {
                var e208 = t349._system = new t349;
                e208.autoStart = !0, e208._protected = !0;
            }
            return t349._system;
        },
        enumerable: !1,
        configurable: !0
    }), t349;
}(), si = function() {
    function t360() {
    }
    return t360.init = function(t361) {
        var e209 = this;
        t361 = Object.assign({
            autoStart: !0,
            sharedTicker: !1
        }, t361), Object.defineProperty(this, "ticker", {
            set: function(t362) {
                this._ticker && this._ticker.remove(this.render, this), this._ticker = t362, t362 && t362.add(this.render, this, Qr.LOW);
            },
            get: function() {
                return this._ticker;
            }
        }), this.stop = function() {
            e209._ticker.stop();
        }, this.start = function() {
            e209._ticker.start();
        }, this._ticker = null, this.ticker = t361.sharedTicker ? oi.shared : new oi, t361.autoStart && this.start();
    }, t360.destroy = function() {
        if (this._ticker) {
            var t363 = this._ticker;
            this.ticker = null, t363.destroy();
        }
    }, t360;
}(), ai = function() {
    function t364() {
        this.pressure = 0, this.rotationAngle = 0, this.twist = 0, this.tangentialPressure = 0, this.global = new fr, this.target = null, this.originalEvent = null, this.identifier = null, this.isPrimary = !1, this.button = 0, this.buttons = 0, this.width = 0, this.height = 0, this.tiltX = 0, this.tiltY = 0, this.pointerType = null, this.pressure = 0, this.rotationAngle = 0, this.twist = 0, this.tangentialPressure = 0;
    }
    return Object.defineProperty(t364.prototype, "pointerId", {
        get: function() {
            return this.identifier;
        },
        enumerable: !1,
        configurable: !0
    }), t364.prototype.getLocalPosition = function(t365, e210, r150) {
        return t365.worldTransform.applyInverse(r150 || this.global, e210);
    }, t364.prototype.copyEvent = function(t366) {
        "isPrimary" in t366 && t366.isPrimary && (this.isPrimary = !0), this.button = "button" in t366 && t366.button;
        var e211 = "buttons" in t366 && t366.buttons;
        this.buttons = Number.isInteger(e211) ? e211 : "which" in t366 && t366.which, this.width = "width" in t366 && t366.width, this.height = "height" in t366 && t366.height, this.tiltX = "tiltX" in t366 && t366.tiltX, this.tiltY = "tiltY" in t366 && t366.tiltY, this.pointerType = "pointerType" in t366 && t366.pointerType, this.pressure = "pressure" in t366 && t366.pressure, this.rotationAngle = "rotationAngle" in t366 && t366.rotationAngle, this.twist = "twist" in t366 && t366.twist || 0, this.tangentialPressure = "tangentialPressure" in t366 && t366.tangentialPressure || 0;
    }, t364.prototype.reset = function() {
        this.isPrimary = !1;
    }, t364;
}(), hi = function(t367, e212) {
    return (hi = Object.setPrototypeOf || ({
        __proto__: []
    }) instanceof Array && function(t368, e213) {
        t368.__proto__ = e213;
    } || function(t369, e214) {
        for(var r151 in e214)e214.hasOwnProperty(r151) && (t369[r151] = e214[r151]);
    })(t367, e212);
}, ui = function() {
    function t370() {
        this.stopped = !1, this.stopsPropagatingAt = null, this.stopPropagationHint = !1, this.target = null, this.currentTarget = null, this.type = null, this.data = null;
    }
    return t370.prototype.stopPropagation = function() {
        this.stopped = !0, this.stopPropagationHint = !0, this.stopsPropagatingAt = this.currentTarget;
    }, t370.prototype.reset = function() {
        this.stopped = !1, this.stopsPropagatingAt = null, this.stopPropagationHint = !1, this.currentTarget = null, this.target = null;
    }, t370;
}(), li = function() {
    function t371(e215) {
        this._pointerId = e215, this._flags = t371.FLAGS.NONE;
    }
    return t371.prototype._doSet = function(t372, e216) {
        this._flags = e216 ? this._flags | t372 : this._flags & ~t372;
    }, Object.defineProperty(t371.prototype, "pointerId", {
        get: function() {
            return this._pointerId;
        },
        enumerable: !1,
        configurable: !0
    }), Object.defineProperty(t371.prototype, "flags", {
        get: function() {
            return this._flags;
        },
        set: function(t373) {
            this._flags = t373;
        },
        enumerable: !1,
        configurable: !0
    }), Object.defineProperty(t371.prototype, "none", {
        get: function() {
            return this._flags === t371.FLAGS.NONE;
        },
        enumerable: !1,
        configurable: !0
    }), Object.defineProperty(t371.prototype, "over", {
        get: function() {
            return 0 != (this._flags & t371.FLAGS.OVER);
        },
        set: function(e217) {
            this._doSet(t371.FLAGS.OVER, e217);
        },
        enumerable: !1,
        configurable: !0
    }), Object.defineProperty(t371.prototype, "rightDown", {
        get: function() {
            return 0 != (this._flags & t371.FLAGS.RIGHT_DOWN);
        },
        set: function(e218) {
            this._doSet(t371.FLAGS.RIGHT_DOWN, e218);
        },
        enumerable: !1,
        configurable: !0
    }), Object.defineProperty(t371.prototype, "leftDown", {
        get: function() {
            return 0 != (this._flags & t371.FLAGS.LEFT_DOWN);
        },
        set: function(e219) {
            this._doSet(t371.FLAGS.LEFT_DOWN, e219);
        },
        enumerable: !1,
        configurable: !0
    }), t371.FLAGS = Object.freeze({
        NONE: 0,
        OVER: 1,
        LEFT_DOWN: 2,
        RIGHT_DOWN: 4
    }), t371;
}(), ci = function() {
    function t374() {
        this._tempPoint = new fr;
    }
    return t374.prototype.recursiveFindHit = function(t375, e220, r152, i116, n85) {
        if (!e220 || !e220.visible) return !1;
        var o62 = t375.data.global, s47 = !1, a38 = n85 = e220.interactive || n85, h29 = !0;
        if (e220.hitArea ? (i116 && (e220.worldTransform.applyInverse(o62, this._tempPoint), e220.hitArea.contains(this._tempPoint.x, this._tempPoint.y) ? s47 = !0 : (i116 = !1, h29 = !1)), a38 = !1) : e220._mask && i116 && (e220._mask.containsPoint && e220._mask.containsPoint(o62) || (i116 = !1)), h29 && e220.interactiveChildren && e220.children) for(var u24 = e220.children, l16 = u24.length - 1; l16 >= 0; l16--){
            var c12 = u24[l16], d15 = this.recursiveFindHit(t375, c12, r152, i116, a38);
            if (d15) {
                if (!c12.parent) continue;
                a38 = !1, d15 && (t375.target && (i116 = !1), s47 = !0);
            }
        }
        return n85 && (i116 && !t375.target && !e220.hitArea && e220.containsPoint && e220.containsPoint(o62) && (s47 = !0), e220.interactive && (s47 && !t375.target && (t375.target = e220), r152 && r152(t375, e220, !!s47))), s47;
    }, t374.prototype.findHit = function(t376, e221, r153, i117) {
        this.recursiveFindHit(t376, e221, r153, i117, !1);
    }, t374;
}(), di = {
    interactive: !1,
    interactiveChildren: !0,
    hitArea: null,
    get buttonMode () {
        return "pointer" === this.cursor;
    },
    set buttonMode (t){
        t ? this.cursor = "pointer" : "pointer" === this.cursor && (this.cursor = null);
    },
    cursor: null,
    get trackedPointers () {
        return void 0 === this._trackedPointers && (this._trackedPointers = {
        }), this._trackedPointers;
    },
    _trackedPointers: void 0
};
zr.mixin(di);
var fi = 1, pi = {
    target: null,
    data: {
        global: null
    }
}, _i = function(t378) {
    function e222(e223, r154) {
        var i118 = t378.call(this) || this;
        return r154 = r154 || {
        }, i118.renderer = e223, i118.autoPreventDefault = void 0 === r154.autoPreventDefault || r154.autoPreventDefault, i118.interactionFrequency = r154.interactionFrequency || 10, i118.mouse = new ai, i118.mouse.identifier = fi, i118.mouse.global.set(-999999), i118.activeInteractionData = {
        }, i118.activeInteractionData[fi] = i118.mouse, i118.interactionDataPool = [], i118.eventData = new ui, i118.interactionDOMElement = null, i118.moveWhenInside = !1, i118.eventsAdded = !1, i118.tickerAdded = !1, i118.mouseOverRenderer = !("PointerEvent" in self), i118.supportsTouchEvents = "ontouchstart" in self, i118.supportsPointerEvents = !!self.PointerEvent, i118.onPointerUp = i118.onPointerUp.bind(i118), i118.processPointerUp = i118.processPointerUp.bind(i118), i118.onPointerCancel = i118.onPointerCancel.bind(i118), i118.processPointerCancel = i118.processPointerCancel.bind(i118), i118.onPointerDown = i118.onPointerDown.bind(i118), i118.processPointerDown = i118.processPointerDown.bind(i118), i118.onPointerMove = i118.onPointerMove.bind(i118), i118.processPointerMove = i118.processPointerMove.bind(i118), i118.onPointerOut = i118.onPointerOut.bind(i118), i118.processPointerOverOut = i118.processPointerOverOut.bind(i118), i118.onPointerOver = i118.onPointerOver.bind(i118), i118.cursorStyles = {
            default: "inherit",
            pointer: "pointer"
        }, i118.currentCursorMode = null, i118.cursor = null, i118.resolution = 1, i118.delayedEvents = [], i118.search = new ci, i118._tempDisplayObject = new qr, i118._eventListenerOptions = {
            capture: !0,
            passive: !1
        }, i118._useSystemTicker = void 0 === r154.useSystemTicker || r154.useSystemTicker, i118.setTargetElement(i118.renderer.view, i118.renderer.resolution), i118;
    }
    return (function(t, e224) {
        function r155() {
            this.constructor = t;
        }
        hi(t, e224), t.prototype = null === e224 ? Object.create(e224) : (r155.prototype = e224.prototype, new r155);
    })(e222, t378), Object.defineProperty(e222.prototype, "useSystemTicker", {
        get: function() {
            return this._useSystemTicker;
        },
        set: function(t) {
            this._useSystemTicker = t, t ? this.addTickerListener() : this.removeTickerListener();
        },
        enumerable: !1,
        configurable: !0
    }), Object.defineProperty(e222.prototype, "lastObjectRendered", {
        get: function() {
            return this.renderer._lastObjectRendered || this._tempDisplayObject;
        },
        enumerable: !1,
        configurable: !0
    }), e222.prototype.hitTest = function(t, e225) {
        return pi.target = null, pi.data.global = t, e225 || (e225 = this.lastObjectRendered), this.processInteractive(pi, e225, null, !0), pi.target;
    }, e222.prototype.setTargetElement = function(t, e226) {
        void 0 === e226 && (e226 = 1), this.removeTickerListener(), this.removeEvents(), this.interactionDOMElement = t, this.resolution = e226, this.addEvents(), this.addTickerListener();
    }, e222.prototype.addTickerListener = function() {
        !this.tickerAdded && this.interactionDOMElement && this._useSystemTicker && (oi.system.add(this.tickerUpdate, this, Qr.INTERACTION), this.tickerAdded = !0);
    }, e222.prototype.removeTickerListener = function() {
        this.tickerAdded && (oi.system.remove(this.tickerUpdate, this), this.tickerAdded = !1);
    }, e222.prototype.addEvents = function() {
        if (!this.eventsAdded && this.interactionDOMElement) {
            var t = this.interactionDOMElement.style;
            self.navigator.msPointerEnabled ? (t.msContentZooming = "none", t.msTouchAction = "none") : this.supportsPointerEvents && (t.touchAction = "none"), this.supportsPointerEvents ? (self.document.addEventListener("pointermove", this.onPointerMove, this._eventListenerOptions), this.interactionDOMElement.addEventListener("pointerdown", this.onPointerDown, this._eventListenerOptions), this.interactionDOMElement.addEventListener("pointerleave", this.onPointerOut, this._eventListenerOptions), this.interactionDOMElement.addEventListener("pointerover", this.onPointerOver, this._eventListenerOptions), self.addEventListener("pointercancel", this.onPointerCancel, this._eventListenerOptions), self.addEventListener("pointerup", this.onPointerUp, this._eventListenerOptions)) : (self.document.addEventListener("mousemove", this.onPointerMove, this._eventListenerOptions), this.interactionDOMElement.addEventListener("mousedown", this.onPointerDown, this._eventListenerOptions), this.interactionDOMElement.addEventListener("mouseout", this.onPointerOut, this._eventListenerOptions), this.interactionDOMElement.addEventListener("mouseover", this.onPointerOver, this._eventListenerOptions), self.addEventListener("mouseup", this.onPointerUp, this._eventListenerOptions)), this.supportsTouchEvents && (this.interactionDOMElement.addEventListener("touchstart", this.onPointerDown, this._eventListenerOptions), this.interactionDOMElement.addEventListener("touchcancel", this.onPointerCancel, this._eventListenerOptions), this.interactionDOMElement.addEventListener("touchend", this.onPointerUp, this._eventListenerOptions), this.interactionDOMElement.addEventListener("touchmove", this.onPointerMove, this._eventListenerOptions)), this.eventsAdded = !0;
        }
    }, e222.prototype.removeEvents = function() {
        if (this.eventsAdded && this.interactionDOMElement) {
            var t = this.interactionDOMElement.style;
            self.navigator.msPointerEnabled ? (t.msContentZooming = "", t.msTouchAction = "") : this.supportsPointerEvents && (t.touchAction = ""), this.supportsPointerEvents ? (self.document.removeEventListener("pointermove", this.onPointerMove, this._eventListenerOptions), this.interactionDOMElement.removeEventListener("pointerdown", this.onPointerDown, this._eventListenerOptions), this.interactionDOMElement.removeEventListener("pointerleave", this.onPointerOut, this._eventListenerOptions), this.interactionDOMElement.removeEventListener("pointerover", this.onPointerOver, this._eventListenerOptions), self.removeEventListener("pointercancel", this.onPointerCancel, this._eventListenerOptions), self.removeEventListener("pointerup", this.onPointerUp, this._eventListenerOptions)) : (self.document.removeEventListener("mousemove", this.onPointerMove, this._eventListenerOptions), this.interactionDOMElement.removeEventListener("mousedown", this.onPointerDown, this._eventListenerOptions), this.interactionDOMElement.removeEventListener("mouseout", this.onPointerOut, this._eventListenerOptions), this.interactionDOMElement.removeEventListener("mouseover", this.onPointerOver, this._eventListenerOptions), self.removeEventListener("mouseup", this.onPointerUp, this._eventListenerOptions)), this.supportsTouchEvents && (this.interactionDOMElement.removeEventListener("touchstart", this.onPointerDown, this._eventListenerOptions), this.interactionDOMElement.removeEventListener("touchcancel", this.onPointerCancel, this._eventListenerOptions), this.interactionDOMElement.removeEventListener("touchend", this.onPointerUp, this._eventListenerOptions), this.interactionDOMElement.removeEventListener("touchmove", this.onPointerMove, this._eventListenerOptions)), this.interactionDOMElement = null, this.eventsAdded = !1;
        }
    }, e222.prototype.tickerUpdate = function(t) {
        this._deltaTime += t, this._deltaTime < this.interactionFrequency || (this._deltaTime = 0, this.update());
    }, e222.prototype.update = function() {
        if (this.interactionDOMElement) if (this._didMove) this._didMove = !1;
        else {
            for(var t in this.cursor = null, this.activeInteractionData)if (this.activeInteractionData.hasOwnProperty(t)) {
                var e227 = this.activeInteractionData[t];
                if (e227.originalEvent && "touch" !== e227.pointerType) {
                    var r156 = this.configureInteractionEventForDOMEvent(this.eventData, e227.originalEvent, e227);
                    this.processInteractive(r156, this.lastObjectRendered, this.processPointerOverOut, !0);
                }
            }
            this.setCursorMode(this.cursor);
        }
    }, e222.prototype.setCursorMode = function(t) {
        t = t || "default";
        var e228 = !0;
        if (self.OffscreenCanvas && this.interactionDOMElement instanceof OffscreenCanvas && (e228 = !1), this.currentCursorMode !== t) {
            this.currentCursorMode = t;
            var r157 = this.cursorStyles[t];
            if (r157) switch(typeof r157){
                case "string":
                    e228 && (this.interactionDOMElement.style.cursor = r157);
                    break;
                case "function":
                    r157(t);
                    break;
                case "object":
                    e228 && Object.assign(this.interactionDOMElement.style, r157);
            }
            else e228 && "string" == typeof t && !Object.prototype.hasOwnProperty.call(this.cursorStyles, t) && (this.interactionDOMElement.style.cursor = t);
        }
    }, e222.prototype.dispatchEvent = function(t, e229, r158) {
        r158.stopPropagationHint && t !== r158.stopsPropagatingAt || (r158.currentTarget = t, r158.type = e229, t.emit(e229, r158), t[e229] && t[e229](r158));
    }, e222.prototype.delayDispatchEvent = function(t, e230, r159) {
        this.delayedEvents.push({
            displayObject: t,
            eventString: e230,
            eventData: r159
        });
    }, e222.prototype.mapPositionToPoint = function(t, e231, r160) {
        var i119;
        i119 = this.interactionDOMElement.parentElement ? this.interactionDOMElement.getBoundingClientRect() : {
            x: 0,
            y: 0,
            width: this.interactionDOMElement.width,
            height: this.interactionDOMElement.height,
            left: 0,
            top: 0
        };
        var n86 = 1 / this.resolution;
        t.x = (e231 - i119.left) * (this.interactionDOMElement.width / i119.width) * n86, t.y = (r160 - i119.top) * (this.interactionDOMElement.height / i119.height) * n86;
    }, e222.prototype.processInteractive = function(t, e232, r161, i120) {
        var n87 = this.search.findHit(t, e232, r161, i120), o63 = this.delayedEvents;
        if (!o63.length) return n87;
        t.stopPropagationHint = !1;
        var s48 = o63.length;
        this.delayedEvents = [];
        for(var a39 = 0; a39 < s48; a39++){
            var h30 = o63[a39], u25 = h30.displayObject, l17 = h30.eventString, c13 = h30.eventData;
            c13.stopsPropagatingAt === u25 && (c13.stopPropagationHint = !0), this.dispatchEvent(u25, l17, c13);
        }
        return n87;
    }, e222.prototype.onPointerDown = function(t) {
        if (!this.supportsTouchEvents || "touch" !== t.pointerType) {
            var e233 = this.normalizeToPointerData(t);
            this.autoPreventDefault && e233[0].isNormalized && (t.cancelable || !("cancelable" in t)) && t.preventDefault();
            for(var r162 = e233.length, i121 = 0; i121 < r162; i121++){
                var n88 = e233[i121], o64 = this.getInteractionDataForPointerId(n88), s49 = this.configureInteractionEventForDOMEvent(this.eventData, n88, o64);
                if (s49.data.originalEvent = t, this.processInteractive(s49, this.lastObjectRendered, this.processPointerDown, !0), this.emit("pointerdown", s49), "touch" === n88.pointerType) this.emit("touchstart", s49);
                else if ("mouse" === n88.pointerType || "pen" === n88.pointerType) {
                    var a40 = 2 === n88.button;
                    this.emit(a40 ? "rightdown" : "mousedown", this.eventData);
                }
            }
        }
    }, e222.prototype.processPointerDown = function(t, e234, r163) {
        var i122 = t.data, n89 = t.data.identifier;
        if (r163) {
            if (e234.trackedPointers[n89] || (e234.trackedPointers[n89] = new li(n89)), this.dispatchEvent(e234, "pointerdown", t), "touch" === i122.pointerType) this.dispatchEvent(e234, "touchstart", t);
            else if ("mouse" === i122.pointerType || "pen" === i122.pointerType) {
                var o65 = 2 === i122.button;
                o65 ? e234.trackedPointers[n89].rightDown = !0 : e234.trackedPointers[n89].leftDown = !0, this.dispatchEvent(e234, o65 ? "rightdown" : "mousedown", t);
            }
        }
    }, e222.prototype.onPointerComplete = function(t, e235, r164) {
        for(var i123 = this.normalizeToPointerData(t), n90 = i123.length, o66 = t.target !== this.interactionDOMElement ? "outside" : "", s50 = 0; s50 < n90; s50++){
            var a41 = i123[s50], h31 = this.getInteractionDataForPointerId(a41), u26 = this.configureInteractionEventForDOMEvent(this.eventData, a41, h31);
            if (u26.data.originalEvent = t, this.processInteractive(u26, this.lastObjectRendered, r164, e235 || !o66), this.emit(e235 ? "pointercancel" : "pointerup" + o66, u26), "mouse" === a41.pointerType || "pen" === a41.pointerType) {
                var l18 = 2 === a41.button;
                this.emit(l18 ? "rightup" + o66 : "mouseup" + o66, u26);
            } else "touch" === a41.pointerType && (this.emit(e235 ? "touchcancel" : "touchend" + o66, u26), this.releaseInteractionDataForPointerId(a41.pointerId));
        }
    }, e222.prototype.onPointerCancel = function(t) {
        this.supportsTouchEvents && "touch" === t.pointerType || this.onPointerComplete(t, !0, this.processPointerCancel);
    }, e222.prototype.processPointerCancel = function(t, e236) {
        var r165 = t.data, i = t.data.identifier;
        void 0 !== e236.trackedPointers[i] && (delete e236.trackedPointers[i], this.dispatchEvent(e236, "pointercancel", t), "touch" === r165.pointerType && this.dispatchEvent(e236, "touchcancel", t));
    }, e222.prototype.onPointerUp = function(t) {
        this.supportsTouchEvents && "touch" === t.pointerType || this.onPointerComplete(t, !1, this.processPointerUp);
    }, e222.prototype.processPointerUp = function(t, e237, r166) {
        var i124 = t.data, n = t.data.identifier, o67 = e237.trackedPointers[n], s51 = "touch" === i124.pointerType, a42 = "mouse" === i124.pointerType || "pen" === i124.pointerType, h32 = !1;
        if (a42) {
            var u27 = 2 === i124.button, l19 = li.FLAGS, c14 = u27 ? l19.RIGHT_DOWN : l19.LEFT_DOWN, d16 = void 0 !== o67 && o67.flags & c14;
            r166 ? (this.dispatchEvent(e237, u27 ? "rightup" : "mouseup", t), d16 && (this.dispatchEvent(e237, u27 ? "rightclick" : "click", t), h32 = !0)) : d16 && this.dispatchEvent(e237, u27 ? "rightupoutside" : "mouseupoutside", t), o67 && (u27 ? o67.rightDown = !1 : o67.leftDown = !1);
        }
        r166 ? (this.dispatchEvent(e237, "pointerup", t), s51 && this.dispatchEvent(e237, "touchend", t), o67 && (a42 && !h32 || this.dispatchEvent(e237, "pointertap", t), s51 && (this.dispatchEvent(e237, "tap", t), o67.over = !1))) : o67 && (this.dispatchEvent(e237, "pointerupoutside", t), s51 && this.dispatchEvent(e237, "touchendoutside", t)), o67 && o67.none && delete e237.trackedPointers[n];
    }, e222.prototype.onPointerMove = function(t) {
        if (!this.supportsTouchEvents || "touch" !== t.pointerType) {
            var e238 = this.normalizeToPointerData(t);
            "mouse" !== e238[0].pointerType && "pen" !== e238[0].pointerType || (this._didMove = !0, this.cursor = null);
            for(var r167 = e238.length, i125 = 0; i125 < r167; i125++){
                var n91 = e238[i125], o68 = this.getInteractionDataForPointerId(n91), s52 = this.configureInteractionEventForDOMEvent(this.eventData, n91, o68);
                s52.data.originalEvent = t, this.processInteractive(s52, this.lastObjectRendered, this.processPointerMove, !0), this.emit("pointermove", s52), "touch" === n91.pointerType && this.emit("touchmove", s52), "mouse" !== n91.pointerType && "pen" !== n91.pointerType || this.emit("mousemove", s52);
            }
            "mouse" === e238[0].pointerType && this.setCursorMode(this.cursor);
        }
    }, e222.prototype.processPointerMove = function(t, e239, r168) {
        var i126 = t.data, n92 = "touch" === i126.pointerType, o69 = "mouse" === i126.pointerType || "pen" === i126.pointerType;
        o69 && this.processPointerOverOut(t, e239, r168), this.moveWhenInside && !r168 || (this.dispatchEvent(e239, "pointermove", t), n92 && this.dispatchEvent(e239, "touchmove", t), o69 && this.dispatchEvent(e239, "mousemove", t));
    }, e222.prototype.onPointerOut = function(t) {
        if (!this.supportsTouchEvents || "touch" !== t.pointerType) {
            var e240 = this.normalizeToPointerData(t)[0];
            "mouse" === e240.pointerType && (this.mouseOverRenderer = !1, this.setCursorMode(null));
            var r169 = this.getInteractionDataForPointerId(e240), i127 = this.configureInteractionEventForDOMEvent(this.eventData, e240, r169);
            i127.data.originalEvent = e240, this.processInteractive(i127, this.lastObjectRendered, this.processPointerOverOut, !1), this.emit("pointerout", i127), "mouse" === e240.pointerType || "pen" === e240.pointerType ? this.emit("mouseout", i127) : this.releaseInteractionDataForPointerId(r169.identifier);
        }
    }, e222.prototype.processPointerOverOut = function(t, e241, r170) {
        var i128 = t.data, n93 = t.data.identifier, o70 = "mouse" === i128.pointerType || "pen" === i128.pointerType, s53 = e241.trackedPointers[n93];
        r170 && !s53 && (s53 = e241.trackedPointers[n93] = new li(n93)), void 0 !== s53 && (r170 && this.mouseOverRenderer ? (s53.over || (s53.over = !0, this.delayDispatchEvent(e241, "pointerover", t), o70 && this.delayDispatchEvent(e241, "mouseover", t)), o70 && null === this.cursor && (this.cursor = e241.cursor)) : s53.over && (s53.over = !1, this.dispatchEvent(e241, "pointerout", this.eventData), o70 && this.dispatchEvent(e241, "mouseout", t), s53.none && delete e241.trackedPointers[n93]));
    }, e222.prototype.onPointerOver = function(t) {
        var e242 = this.normalizeToPointerData(t)[0], r171 = this.getInteractionDataForPointerId(e242), i129 = this.configureInteractionEventForDOMEvent(this.eventData, e242, r171);
        i129.data.originalEvent = e242, "mouse" === e242.pointerType && (this.mouseOverRenderer = !0), this.emit("pointerover", i129), "mouse" !== e242.pointerType && "pen" !== e242.pointerType || this.emit("mouseover", i129);
    }, e222.prototype.getInteractionDataForPointerId = function(t) {
        var e243, r172 = t.pointerId;
        return r172 === fi || "mouse" === t.pointerType ? e243 = this.mouse : this.activeInteractionData[r172] ? e243 = this.activeInteractionData[r172] : ((e243 = this.interactionDataPool.pop() || new ai).identifier = r172, this.activeInteractionData[r172] = e243), e243.copyEvent(t), e243;
    }, e222.prototype.releaseInteractionDataForPointerId = function(t) {
        var e244 = this.activeInteractionData[t];
        e244 && (delete this.activeInteractionData[t], e244.reset(), this.interactionDataPool.push(e244));
    }, e222.prototype.configureInteractionEventForDOMEvent = function(t, e245, r173) {
        return t.data = r173, this.mapPositionToPoint(r173.global, e245.clientX, e245.clientY), "touch" === e245.pointerType && (e245.globalX = r173.global.x, e245.globalY = r173.global.y), r173.originalEvent = e245, t.reset(), t;
    }, e222.prototype.normalizeToPointerData = function(t) {
        var e246 = [];
        if (this.supportsTouchEvents && t instanceof TouchEvent) for(var r174 = 0, i130 = t.changedTouches.length; r174 < i130; r174++){
            var n94 = t.changedTouches[r174];
            void 0 === n94.button && (n94.button = t.touches.length ? 1 : 0), void 0 === n94.buttons && (n94.buttons = t.touches.length ? 1 : 0), void 0 === n94.isPrimary && (n94.isPrimary = 1 === t.touches.length && "touchstart" === t.type), void 0 === n94.width && (n94.width = n94.radiusX || 1), void 0 === n94.height && (n94.height = n94.radiusY || 1), void 0 === n94.tiltX && (n94.tiltX = 0), void 0 === n94.tiltY && (n94.tiltY = 0), void 0 === n94.pointerType && (n94.pointerType = "touch"), void 0 === n94.pointerId && (n94.pointerId = n94.identifier || 0), void 0 === n94.pressure && (n94.pressure = n94.force || 0.5), void 0 === n94.twist && (n94.twist = 0), void 0 === n94.tangentialPressure && (n94.tangentialPressure = 0), void 0 === n94.layerX && (n94.layerX = n94.offsetX = n94.clientX), void 0 === n94.layerY && (n94.layerY = n94.offsetY = n94.clientY), n94.isNormalized = !0, e246.push(n94);
        }
        else if (!self.MouseEvent || t instanceof MouseEvent && !(this.supportsPointerEvents && t instanceof self.PointerEvent)) {
            var o71 = t;
            void 0 === o71.isPrimary && (o71.isPrimary = !0), void 0 === o71.width && (o71.width = 1), void 0 === o71.height && (o71.height = 1), void 0 === o71.tiltX && (o71.tiltX = 0), void 0 === o71.tiltY && (o71.tiltY = 0), void 0 === o71.pointerType && (o71.pointerType = "mouse"), void 0 === o71.pointerId && (o71.pointerId = fi), void 0 === o71.pressure && (o71.pressure = 0.5), void 0 === o71.twist && (o71.twist = 0), void 0 === o71.tangentialPressure && (o71.tangentialPressure = 0), o71.isNormalized = !0, e246.push(o71);
        } else e246.push(t);
        return e246;
    }, e222.prototype.destroy = function() {
        this.removeEvents(), this.removeTickerListener(), this.removeAllListeners(), this.renderer = null, this.mouse = null, this.eventData = null, this.interactionDOMElement = null, this.onPointerDown = null, this.processPointerDown = null, this.onPointerUp = null, this.processPointerUp = null, this.onPointerCancel = null, this.processPointerCancel = null, this.onPointerMove = null, this.processPointerMove = null, this.onPointerOut = null, this.processPointerOverOut = null, this.onPointerOver = null, this.search = null;
    }, e222;
}(nt), mi = function() {
    function t379(t) {
        this.items = [], this._name = t, this._aliasCount = 0;
    }
    return t379.prototype.emit = function(t, e247, r175, i131, n95, o72, s54, a43) {
        if (arguments.length > 8) throw new Error("max arguments reached");
        var h = this.name, u28 = this.items;
        this._aliasCount++;
        for(var l20 = 0, c15 = u28.length; l20 < c15; l20++)u28[l20][h](t, e247, r175, i131, n95, o72, s54, a43);
        return u28 === this.items && this._aliasCount--, this;
    }, t379.prototype.ensureNonAliasedItems = function() {
        this._aliasCount > 0 && this.items.length > 1 && (this._aliasCount = 0, this.items = this.items.slice(0));
    }, t379.prototype.add = function(t) {
        return t[this._name] && (this.ensureNonAliasedItems(), this.remove(t), this.items.push(t)), this;
    }, t379.prototype.remove = function(t) {
        var e248 = this.items.indexOf(t);
        return -1 !== e248 && (this.ensureNonAliasedItems(), this.items.splice(e248, 1)), this;
    }, t379.prototype.contains = function(t) {
        return -1 !== this.items.indexOf(t);
    }, t379.prototype.removeAll = function() {
        return this.ensureNonAliasedItems(), this.items.length = 0, this;
    }, t379.prototype.destroy = function() {
        this.removeAll(), this.items = null, this._name = null;
    }, Object.defineProperty(t379.prototype, "empty", {
        get: function() {
            return 0 === this.items.length;
        },
        enumerable: !1,
        configurable: !0
    }), Object.defineProperty(t379.prototype, "name", {
        get: function() {
            return this._name;
        },
        enumerable: !1,
        configurable: !0
    }), t379;
}();
Object.defineProperties(mi.prototype, {
    dispatch: {
        value: mi.prototype.emit
    },
    run: {
        value: mi.prototype.emit
    }
}), et.PREFER_ENV = tt.any ? ie.WEBGL : ie.WEBGL2, et.STRICT_TEXTURE_CACHE = !1;
var vi = [];
function yi(t, e249) {
    if (!t) return null;
    var r176 = "";
    if ("string" == typeof t) {
        var i132 = /\.(\w{3,4})(?:$|\?|#)/i.exec(t);
        i132 && (r176 = i132[1].toLowerCase());
    }
    for(var n96 = vi.length - 1; n96 >= 0; --n96){
        var o73 = vi[n96];
        if (o73.test && o73.test(t, r176)) return new o73(t, e249);
    }
    throw new Error("Unrecognized source type to auto-detect Resource");
}
var gi = function(t380, e250) {
    return (gi = Object.setPrototypeOf || ({
        __proto__: []
    }) instanceof Array && function(t, e251) {
        t.__proto__ = e251;
    } || function(t, e252) {
        for(var r177 in e252)e252.hasOwnProperty(r177) && (t[r177] = e252[r177]);
    })(t380, e250);
};
function Ei(t, e253) {
    function r178() {
        this.constructor = t;
    }
    gi(t, e253), t.prototype = null === e253 ? Object.create(e253) : (r178.prototype = e253.prototype, new r178);
}
var Ti = function() {
    return (Ti = Object.assign || function(t) {
        for(var e254, r179 = arguments, i133 = 1, n97 = arguments.length; i133 < n97; i133++)for(var o74 in e254 = r179[i133])Object.prototype.hasOwnProperty.call(e254, o74) && (t[o74] = e254[o74]);
        return t;
    }).apply(this, arguments);
}, bi = function() {
    function t381(t, e255) {
        void 0 === t && (t = 0), void 0 === e255 && (e255 = 0), this._width = t, this._height = e255, this.destroyed = !1, this.internal = !1, this.onResize = new mi("setRealSize"), this.onUpdate = new mi("update"), this.onError = new mi("onError");
    }
    return t381.prototype.bind = function(t) {
        this.onResize.add(t), this.onUpdate.add(t), this.onError.add(t), (this._width || this._height) && this.onResize.emit(this._width, this._height);
    }, t381.prototype.unbind = function(t) {
        this.onResize.remove(t), this.onUpdate.remove(t), this.onError.remove(t);
    }, t381.prototype.resize = function(t, e256) {
        t === this._width && e256 === this._height || (this._width = t, this._height = e256, this.onResize.emit(t, e256));
    }, Object.defineProperty(t381.prototype, "valid", {
        get: function() {
            return !!this._width && !!this._height;
        },
        enumerable: !1,
        configurable: !0
    }), t381.prototype.update = function() {
        this.destroyed || this.onUpdate.emit();
    }, t381.prototype.load = function() {
        return Promise.resolve(this);
    }, Object.defineProperty(t381.prototype, "width", {
        get: function() {
            return this._width;
        },
        enumerable: !1,
        configurable: !0
    }), Object.defineProperty(t381.prototype, "height", {
        get: function() {
            return this._height;
        },
        enumerable: !1,
        configurable: !0
    }), t381.prototype.style = function(t, e, r) {
        return !1;
    }, t381.prototype.dispose = function() {
    }, t381.prototype.destroy = function() {
        this.destroyed || (this.destroyed = !0, this.dispose(), this.onError.removeAll(), this.onError = null, this.onResize.removeAll(), this.onResize = null, this.onUpdate.removeAll(), this.onUpdate = null);
    }, t381.test = function(t, e) {
        return !1;
    }, t381;
}(), xi = function(t382) {
    function e257(e258, r180) {
        var i134 = this, n98 = r180 || {
        }, o75 = n98.width, s55 = n98.height;
        if (!o75 || !s55) throw new Error("BufferResource width or height invalid");
        return (i134 = t382.call(this, o75, s55) || this).data = e258, i134;
    }
    return Ei(e257, t382), e257.prototype.upload = function(t, e259, r181) {
        var i135 = t.gl;
        i135.pixelStorei(i135.UNPACK_PREMULTIPLY_ALPHA_WEBGL, e259.alphaMode === _e.UNPACK);
        var n99 = e259.realWidth, o76 = e259.realHeight;
        return r181.width === n99 && r181.height === o76 ? i135.texSubImage2D(e259.target, 0, 0, 0, n99, o76, e259.format, r181.type, this.data) : (r181.width = n99, r181.height = o76, i135.texImage2D(e259.target, 0, r181.internalFormat, n99, o76, 0, e259.format, r181.type, this.data)), !0;
    }, e257.prototype.dispose = function() {
        this.data = null;
    }, e257.test = function(t) {
        return t instanceof Float32Array || t instanceof Uint8Array || t instanceof Uint32Array;
    }, e257;
}(bi), Ri = {
    scaleMode: de.NEAREST,
    format: he.RGBA,
    alphaMode: _e.NPM
}, Ai = function(t383) {
    function e260(e261, r182) {
        void 0 === e261 && (e261 = null), void 0 === r182 && (r182 = null);
        var i136 = t383.call(this) || this, n100 = (r182 = r182 || {
        }).alphaMode, o77 = r182.mipmap, s56 = r182.anisotropicLevel, a44 = r182.scaleMode, h33 = r182.width, u29 = r182.height, l21 = r182.wrapMode, c16 = r182.format, d17 = r182.type, f13 = r182.target, p = r182.resolution, _7 = r182.resourceOptions;
        return !e261 || e261 instanceof bi || ((e261 = yi(e261, _7)).internal = !0), i136.resolution = p || et.RESOLUTION, i136.width = Math.round((h33 || 0) * i136.resolution) / i136.resolution, i136.height = Math.round((u29 || 0) * i136.resolution) / i136.resolution, i136._mipmap = void 0 !== o77 ? o77 : et.MIPMAP_TEXTURES, i136.anisotropicLevel = void 0 !== s56 ? s56 : et.ANISOTROPIC_LEVEL, i136._wrapMode = l21 || et.WRAP_MODE, i136._scaleMode = void 0 !== a44 ? a44 : et.SCALE_MODE, i136.format = c16 || he.RGBA, i136.type = d17 || le.UNSIGNED_BYTE, i136.target = f13 || ue.TEXTURE_2D, i136.alphaMode = void 0 !== n100 ? n100 : _e.UNPACK, i136.uid = We(), i136.touched = 0, i136.isPowerOfTwo = !1, i136._refreshPOT(), i136._glTextures = {
        }, i136.dirtyId = 0, i136.dirtyStyleId = 0, i136.cacheId = null, i136.valid = h33 > 0 && u29 > 0, i136.textureCacheIds = [], i136.destroyed = !1, i136.resource = null, i136._batchEnabled = 0, i136._batchLocation = 0, i136.parentTextureArray = null, i136.setResource(e261), i136;
    }
    return Ei(e260, t383), Object.defineProperty(e260.prototype, "realWidth", {
        get: function() {
            return Math.round(this.width * this.resolution);
        },
        enumerable: !1,
        configurable: !0
    }), Object.defineProperty(e260.prototype, "realHeight", {
        get: function() {
            return Math.round(this.height * this.resolution);
        },
        enumerable: !1,
        configurable: !0
    }), Object.defineProperty(e260.prototype, "mipmap", {
        get: function() {
            return this._mipmap;
        },
        set: function(t) {
            this._mipmap !== t && (this._mipmap = t, this.dirtyStyleId++);
        },
        enumerable: !1,
        configurable: !0
    }), Object.defineProperty(e260.prototype, "scaleMode", {
        get: function() {
            return this._scaleMode;
        },
        set: function(t) {
            this._scaleMode !== t && (this._scaleMode = t, this.dirtyStyleId++);
        },
        enumerable: !1,
        configurable: !0
    }), Object.defineProperty(e260.prototype, "wrapMode", {
        get: function() {
            return this._wrapMode;
        },
        set: function(t) {
            this._wrapMode !== t && (this._wrapMode = t, this.dirtyStyleId++);
        },
        enumerable: !1,
        configurable: !0
    }), e260.prototype.setStyle = function(t, e262) {
        var r183;
        return void 0 !== t && t !== this.scaleMode && (this.scaleMode = t, r183 = !0), void 0 !== e262 && e262 !== this.mipmap && (this.mipmap = e262, r183 = !0), r183 && this.dirtyStyleId++, this;
    }, e260.prototype.setSize = function(t, e263, r184) {
        return r184 = r184 || this.resolution, this.setRealSize(t * r184, e263 * r184, r184);
    }, e260.prototype.setRealSize = function(t, e264, r185) {
        return this.resolution = r185 || this.resolution, this.width = Math.round(t) / this.resolution, this.height = Math.round(e264) / this.resolution, this._refreshPOT(), this.update(), this;
    }, e260.prototype._refreshPOT = function() {
        this.isPowerOfTwo = ke(this.realWidth) && ke(this.realHeight);
    }, e260.prototype.setResolution = function(t) {
        var e265 = this.resolution;
        return e265 === t ? this : (this.resolution = t, this.valid && (this.width = Math.round(this.width * e265) / t, this.height = Math.round(this.height * e265) / t, this.emit("update", this)), this._refreshPOT(), this);
    }, e260.prototype.setResource = function(t) {
        if (this.resource === t) return this;
        if (this.resource) throw new Error("Resource can be set only once");
        return t.bind(this), this.resource = t, this;
    }, e260.prototype.update = function() {
        this.valid ? (this.dirtyId++, this.dirtyStyleId++, this.emit("update", this)) : this.width > 0 && this.height > 0 && (this.valid = !0, this.emit("loaded", this), this.emit("update", this));
    }, e260.prototype.onError = function(t) {
        this.emit("error", this, t);
    }, e260.prototype.destroy = function() {
        this.resource && (this.resource.unbind(this), this.resource.internal && this.resource.destroy(), this.resource = null), this.cacheId && (delete Ze[this.cacheId], delete Ke[this.cacheId], this.cacheId = null), this.dispose(), e260.removeFromCache(this), this.textureCacheIds = null, this.destroyed = !0;
    }, e260.prototype.dispose = function() {
        this.emit("dispose", this);
    }, e260.prototype.castToBaseTexture = function() {
        return this;
    }, e260.from = function(t, r186, i137) {
        void 0 === i137 && (i137 = et.STRICT_TEXTURE_CACHE);
        var n101 = "string" == typeof t, o78 = null;
        if (n101) o78 = t;
        else {
            if (!t._pixiId) {
                var s57 = r186 && r186.pixiIdPrefix || "pixiid";
                t._pixiId = s57 + "_" + We();
            }
            o78 = t._pixiId;
        }
        var a45 = Ze[o78];
        if (n101 && i137 && !a45) throw new Error('The cacheId "' + o78 + '" does not exist in BaseTextureCache.');
        return a45 || ((a45 = new e260(t, r186)).cacheId = o78, e260.addToCache(a45, o78)), a45;
    }, e260.fromBuffer = function(t, r187, i138, n102) {
        t = t || new Float32Array(r187 * i138 * 4);
        var o79 = new xi(t, {
            width: r187,
            height: i138
        }), s58 = t instanceof Float32Array ? le.FLOAT : le.UNSIGNED_BYTE;
        return new e260(o79, Object.assign(Ri, n102 || {
            width: r187,
            height: i138,
            type: s58
        }));
    }, e260.addToCache = function(t, e266) {
        e266 && (-1 === t.textureCacheIds.indexOf(e266) && t.textureCacheIds.push(e266), Ze[e266] && console.warn("BaseTexture added to the cache with an id [" + e266 + "] that already had an entry"), Ze[e266] = t);
    }, e260.removeFromCache = function(t) {
        if ("string" == typeof t) {
            var e267 = Ze[t];
            if (e267) {
                var r188 = e267.textureCacheIds.indexOf(t);
                return r188 > -1 && e267.textureCacheIds.splice(r188, 1), delete Ze[t], e267;
            }
        } else if (t && t.textureCacheIds) {
            for(var i139 = 0; i139 < t.textureCacheIds.length; ++i139)delete Ze[t.textureCacheIds[i139]];
            return t.textureCacheIds.length = 0, t;
        }
        return null;
    }, e260._globalBatch = 0, e260;
}(nt), Oi = function(t384) {
    function e268(e269, r189) {
        var i140 = this, n103 = r189 || {
        }, o80 = n103.width, s59 = n103.height;
        (i140 = t384.call(this, o80, s59) || this).items = [], i140.itemDirtyIds = [];
        for(var a46 = 0; a46 < e269; a46++){
            var h34 = new Ai;
            i140.items.push(h34), i140.itemDirtyIds.push(-2);
        }
        return i140.length = e269, i140._load = null, i140.baseTexture = null, i140;
    }
    return Ei(e268, t384), e268.prototype.initFromArray = function(t, e270) {
        for(var r190 = 0; r190 < this.length; r190++)t[r190] && (t[r190].castToBaseTexture ? this.addBaseTextureAt(t[r190].castToBaseTexture(), r190) : t[r190] instanceof bi ? this.addResourceAt(t[r190], r190) : this.addResourceAt(yi(t[r190], e270), r190));
    }, e268.prototype.dispose = function() {
        for(var t = 0, e271 = this.length; t < e271; t++)this.items[t].destroy();
        this.items = null, this.itemDirtyIds = null, this._load = null;
    }, e268.prototype.addResourceAt = function(t, e272) {
        if (!this.items[e272]) throw new Error("Index " + e272 + " is out of bounds");
        return t.valid && !this.valid && this.resize(t.width, t.height), this.items[e272].setResource(t), this;
    }, e268.prototype.bind = function(e273) {
        if (null !== this.baseTexture) throw new Error("Only one base texture per TextureArray is allowed");
        t384.prototype.bind.call(this, e273);
        for(var r191 = 0; r191 < this.length; r191++)this.items[r191].parentTextureArray = e273, this.items[r191].on("update", e273.update, e273);
    }, e268.prototype.unbind = function(e274) {
        t384.prototype.unbind.call(this, e274);
        for(var r192 = 0; r192 < this.length; r192++)this.items[r192].parentTextureArray = null, this.items[r192].off("update", e274.update, e274);
    }, e268.prototype.load = function() {
        var t385 = this;
        if (this._load) return this._load;
        var e275 = this.items.map(function(t) {
            return t.resource;
        }).filter(function(t) {
            return t;
        }).map(function(t) {
            return t.load();
        });
        return this._load = Promise.all(e275).then(function() {
            var e276 = t385.items[0], r193 = e276.realWidth, i141 = e276.realHeight;
            return t385.resize(r193, i141), Promise.resolve(t385);
        }), this._load;
    }, e268;
}(bi), Si = function(t386) {
    function e277(e278, r194) {
        var i142, n104, o81 = this, s60 = r194 || {
        }, a47 = s60.width, h35 = s60.height;
        return Array.isArray(e278) ? (i142 = e278, n104 = e278.length) : n104 = e278, o81 = t386.call(this, n104, {
            width: a47,
            height: h35
        }) || this, i142 && o81.initFromArray(i142, r194), o81;
    }
    return Ei(e277, t386), e277.prototype.addBaseTextureAt = function(t, e279) {
        if (!t.resource) throw new Error("ArrayResource does not support RenderTexture");
        return this.addResourceAt(t.resource, e279), this;
    }, e277.prototype.bind = function(e280) {
        t386.prototype.bind.call(this, e280), e280.target = ue.TEXTURE_2D_ARRAY;
    }, e277.prototype.upload = function(t, e281, r195) {
        var i143 = this.length, n105 = this.itemDirtyIds, o82 = this.items, s61 = t.gl;
        r195.dirtyId < 0 && s61.texImage3D(s61.TEXTURE_2D_ARRAY, 0, r195.internalFormat, this._width, this._height, i143, 0, e281.format, r195.type, null);
        for(var a48 = 0; a48 < i143; a48++){
            var h36 = o82[a48];
            n105[a48] < h36.dirtyId && (n105[a48] = h36.dirtyId, h36.valid && s61.texSubImage3D(s61.TEXTURE_2D_ARRAY, 0, 0, 0, a48, h36.resource.width, h36.resource.height, 1, e281.format, r195.type, h36.resource.source));
        }
        return !0;
    }, e277;
}(Oi), Ii = function(t387) {
    function e282(e283) {
        var r196 = this, i144 = e283, n106 = i144.naturalWidth || i144.videoWidth || i144.width, o83 = i144.naturalHeight || i144.videoHeight || i144.height;
        return (r196 = t387.call(this, n106, o83) || this).source = e283, r196.noSubImage = !1, r196;
    }
    return Ei(e282, t387), e282.crossOrigin = function(t, e284, r197) {
        void 0 === r197 && 0 !== e284.indexOf("data:") ? t.crossOrigin = er(e284) : !1 !== r197 && (t.crossOrigin = "string" == typeof r197 ? r197 : "anonymous");
    }, e282.prototype.upload = function(t, e285, r198, i145) {
        var n107 = t.gl, o84 = e285.realWidth, s62 = e285.realHeight;
        return i145 = i145 || this.source, n107.pixelStorei(n107.UNPACK_PREMULTIPLY_ALPHA_WEBGL, e285.alphaMode === _e.UNPACK), this.noSubImage || e285.target !== n107.TEXTURE_2D || r198.width !== o84 || r198.height !== s62 ? (r198.width = o84, r198.height = s62, n107.texImage2D(e285.target, 0, r198.internalFormat, e285.format, r198.type, i145)) : n107.texSubImage2D(n107.TEXTURE_2D, 0, 0, 0, e285.format, r198.type, i145), !0;
    }, e282.prototype.update = function() {
        if (!this.destroyed) {
            var e286 = this.source, r199 = e286.naturalWidth || e286.videoWidth || e286.width, i146 = e286.naturalHeight || e286.videoHeight || e286.height;
            this.resize(r199, i146), t387.prototype.update.call(this);
        }
    }, e282.prototype.dispose = function() {
        this.source = null;
    }, e282;
}(bi), Pi = function(t388) {
    function e287(e288) {
        return t388.call(this, e288) || this;
    }
    return Ei(e287, t388), e287.test = function(t) {
        var e289 = self.OffscreenCanvas;
        return !!(e289 && t instanceof e289) || self.HTMLCanvasElement && t instanceof HTMLCanvasElement;
    }, e287;
}(Ii), Ni = function(t389) {
    function e290(r200, i147) {
        var n108 = this, o85 = i147 || {
        }, s63 = o85.width, a49 = o85.height, h37 = o85.autoLoad, u30 = o85.linkBaseTexture;
        if (r200 && r200.length !== e290.SIDES) throw new Error("Invalid length. Got " + r200.length + ", expected 6");
        n108 = t389.call(this, 6, {
            width: s63,
            height: a49
        }) || this;
        for(var l22 = 0; l22 < e290.SIDES; l22++)n108.items[l22].target = ue.TEXTURE_CUBE_MAP_POSITIVE_X + l22;
        return n108.linkBaseTexture = !1 !== u30, r200 && n108.initFromArray(r200, i147), !1 !== h37 && n108.load(), n108;
    }
    return Ei(e290, t389), e290.prototype.bind = function(e291) {
        t389.prototype.bind.call(this, e291), e291.target = ue.TEXTURE_CUBE_MAP;
    }, e290.prototype.addBaseTextureAt = function(t, e292, r201) {
        if (void 0 === r201 && (r201 = this.linkBaseTexture), !this.items[e292]) throw new Error("Index " + e292 + " is out of bounds");
        if (!this.linkBaseTexture || t.parentTextureArray || Object.keys(t._glTextures).length > 0) {
            if (!t.resource) throw new Error("CubeResource does not support copying of renderTexture.");
            this.addResourceAt(t.resource, e292);
        } else t.target = ue.TEXTURE_CUBE_MAP_POSITIVE_X + e292, t.parentTextureArray = this.baseTexture, this.items[e292] = t;
        return t.valid && !this.valid && this.resize(t.realWidth, t.realHeight), this.items[e292] = t, this;
    }, e290.prototype.upload = function(t, r202, i148) {
        for(var n109 = this.itemDirtyIds, o86 = 0; o86 < e290.SIDES; o86++){
            var s64 = this.items[o86];
            n109[o86] < s64.dirtyId && (s64.valid && s64.resource ? (s64.resource.upload(t, s64, i148), n109[o86] = s64.dirtyId) : n109[o86] < -1 && (t.gl.texImage2D(s64.target, 0, i148.internalFormat, r202.realWidth, r202.realHeight, 0, r202.format, i148.type, null), n109[o86] = -1));
        }
        return !0;
    }, e290.test = function(t) {
        return Array.isArray(t) && t.length === e290.SIDES;
    }, e290.SIDES = 6, e290;
}(Oi), Mi = function(t390) {
    function e293(e294, r203) {
        var i149 = this;
        if (r203 = r203 || {
        }, !(e294 instanceof HTMLImageElement)) {
            var n110 = new Image;
            Ii.crossOrigin(n110, e294, r203.crossorigin), n110.src = e294, e294 = n110;
        }
        return i149 = t390.call(this, e294) || this, !e294.complete && i149._width && i149._height && (i149._width = 0, i149._height = 0), i149.url = e294.src, i149._process = null, i149.preserveBitmap = !1, i149.createBitmap = (void 0 !== r203.createBitmap ? r203.createBitmap : et.CREATE_IMAGE_BITMAP) && !!self.createImageBitmap, i149.alphaMode = "number" == typeof r203.alphaMode ? r203.alphaMode : null, i149.bitmap = null, i149._load = null, !1 !== r203.autoLoad && i149.load(), i149;
    }
    return Ei(e293, t390), e293.prototype.load = function(t391) {
        var e295 = this;
        return this._load ? this._load : (void 0 !== t391 && (this.createBitmap = t391), this._load = new Promise(function(t392, r204) {
            var i150 = e295.source;
            e295.url = i150.src;
            var n111 = function() {
                e295.destroyed || (i150.onload = null, i150.onerror = null, e295.resize(i150.width, i150.height), e295._load = null, e295.createBitmap ? t392(e295.process()) : t392(e295));
            };
            i150.complete && i150.src ? n111() : (i150.onload = n111, i150.onerror = function(t) {
                r204(t), e295.onError.emit(t);
            });
        }), this._load);
    }, e293.prototype.process = function() {
        var t393 = this, e296 = this.source;
        if (null !== this._process) return this._process;
        if (null !== this.bitmap || !self.createImageBitmap) return Promise.resolve(this);
        var r205 = self.createImageBitmap, i151 = !e296.crossOrigin || "anonymous" === e296.crossOrigin;
        return this._process = fetch(e296.src, {
            mode: i151 ? "cors" : "no-cors"
        }).then(function(t) {
            return t.blob();
        }).then(function(i152) {
            return r205(i152, 0, 0, e296.width, e296.height, {
                premultiplyAlpha: t393.alphaMode === _e.UNPACK ? "premultiply" : "none"
            });
        }).then(function(e297) {
            return t393.destroyed ? Promise.reject() : (t393.bitmap = e297, t393.update(), t393._process = null, Promise.resolve(t393));
        }), this._process;
    }, e293.prototype.upload = function(e298, r206, i153) {
        if ("number" == typeof this.alphaMode && (r206.alphaMode = this.alphaMode), !this.createBitmap) return t390.prototype.upload.call(this, e298, r206, i153);
        if (!this.bitmap && (this.process(), !this.bitmap)) return !1;
        if (t390.prototype.upload.call(this, e298, r206, i153, this.bitmap), !this.preserveBitmap) {
            var n112 = !0, o87 = r206._glTextures;
            for(var s in o87){
                var a50 = o87[s];
                if (a50 !== i153 && a50.dirtyId !== r206.dirtyId) {
                    n112 = !1;
                    break;
                }
            }
            n112 && (this.bitmap.close && this.bitmap.close(), this.bitmap = null);
        }
        return !0;
    }, e293.prototype.dispose = function() {
        this.source.onload = null, this.source.onerror = null, t390.prototype.dispose.call(this), this.bitmap && (this.bitmap.close(), this.bitmap = null), this._process = null, this._load = null;
    }, e293.test = function(t) {
        return "string" == typeof t || t instanceof HTMLImageElement;
    }, e293;
}(Ii), Di = function(t394) {
    function e299(e300, r207) {
        var i154 = this;
        return r207 = r207 || {
        }, (i154 = t394.call(this, document.createElement("canvas")) || this)._width = 0, i154._height = 0, i154.svg = e300, i154.scale = r207.scale || 1, i154._overrideWidth = r207.width, i154._overrideHeight = r207.height, i154._resolve = null, i154._crossorigin = r207.crossorigin, i154._load = null, !1 !== r207.autoLoad && i154.load(), i154;
    }
    return Ei(e299, t394), e299.prototype.load = function() {
        var t = this;
        return this._load ? this._load : (this._load = new Promise(function(r208) {
            if (t._resolve = function() {
                t.resize(t.source.width, t.source.height), r208(t);
            }, e299.SVG_XML.test(t.svg.trim())) {
                if (!btoa) throw new Error("Your browser doesn't support base64 conversions.");
                t.svg = "data:image/svg+xml;base64," + btoa(unescape(encodeURIComponent(t.svg)));
            }
            t._loadSvg();
        }), this._load);
    }, e299.prototype._loadSvg = function() {
        var t = this, e301 = new Image;
        Ii.crossOrigin(e301, this.svg, this._crossorigin), e301.src = this.svg, e301.onerror = function(r209) {
            t._resolve && (e301.onerror = null, t.onError.emit(r209));
        }, e301.onload = function() {
            if (t._resolve) {
                var r210 = e301.width, i155 = e301.height;
                if (!r210 || !i155) throw new Error("The SVG image must have width and height defined (in pixels), canvas API needs them.");
                var n113 = r210 * t.scale, o88 = i155 * t.scale;
                (t._overrideWidth || t._overrideHeight) && (n113 = t._overrideWidth || t._overrideHeight / i155 * r210, o88 = t._overrideHeight || t._overrideWidth / r210 * i155), n113 = Math.round(n113), o88 = Math.round(o88);
                var s65 = t.source;
                s65.width = n113, s65.height = o88, s65._pixiId = "canvas_" + We(), s65.getContext("2d").drawImage(e301, 0, 0, r210, i155, 0, 0, n113, o88), t._resolve(), t._resolve = null;
            }
        };
    }, e299.getSize = function(t) {
        var r211 = e299.SVG_SIZE.exec(t), i156 = {
        };
        return r211 && (i156[r211[1]] = Math.round(parseFloat(r211[3])), i156[r211[5]] = Math.round(parseFloat(r211[7]))), i156;
    }, e299.prototype.dispose = function() {
        t394.prototype.dispose.call(this), this._resolve = null, this._crossorigin = null;
    }, e299.test = function(t, r212) {
        return "svg" === r212 || "string" == typeof t && /^data:image\/svg\+xml(;(charset=utf8|utf8))?;base64/.test(t) || "string" == typeof t && e299.SVG_XML.test(t);
    }, e299.SVG_XML = /^(<\?xml[^?]+\?>)?\s*(<!--[^(-->)]*-->)?\s*\<svg/m, e299.SVG_SIZE = /<svg[^>]*(?:\s(width|height)=('|")(\d*(?:\.\d+)?)(?:px)?('|"))[^>]*(?:\s(width|height)=('|")(\d*(?:\.\d+)?)(?:px)?('|"))[^>]*>/i, e299;
}(Ii), Ci = function(t395) {
    function e302(r213, i157) {
        var n114 = this;
        if (i157 = i157 || {
        }, !(r213 instanceof HTMLVideoElement)) {
            var o89 = document.createElement("video");
            o89.setAttribute("preload", "auto"), o89.setAttribute("webkit-playsinline", ""), o89.setAttribute("playsinline", ""), "string" == typeof r213 && (r213 = [
                r213
            ]);
            var s66 = r213[0].src || r213[0];
            Ii.crossOrigin(o89, s66, i157.crossorigin);
            for(var a51 = 0; a51 < r213.length; ++a51){
                var h38 = document.createElement("source"), u31 = r213[a51], l23 = u31.src, c17 = u31.mime, d18 = (l23 = l23 || r213[a51]).split("?").shift().toLowerCase(), f14 = d18.substr(d18.lastIndexOf(".") + 1);
                c17 = c17 || e302.MIME_TYPES[f14] || "video/" + f14, h38.src = l23, h38.type = c17, o89.appendChild(h38);
            }
            r213 = o89;
        }
        return (n114 = t395.call(this, r213) || this).noSubImage = !0, n114._autoUpdate = !0, n114._isConnectedToTicker = !1, n114._updateFPS = i157.updateFPS || 0, n114._msToNextUpdate = 0, n114.autoPlay = !1 !== i157.autoPlay, n114._load = null, n114._resolve = null, n114._onCanPlay = n114._onCanPlay.bind(n114), n114._onError = n114._onError.bind(n114), !1 !== i157.autoLoad && n114.load(), n114;
    }
    return Ei(e302, t395), e302.prototype.update = function(e) {
        if (!this.destroyed) {
            var r214 = oi.shared.elapsedMS * this.source.playbackRate;
            this._msToNextUpdate = Math.floor(this._msToNextUpdate - r214), (!this._updateFPS || this._msToNextUpdate <= 0) && (t395.prototype.update.call(this), this._msToNextUpdate = this._updateFPS ? Math.floor(1000 / this._updateFPS) : 0);
        }
    }, e302.prototype.load = function() {
        var t = this;
        if (this._load) return this._load;
        var e303 = this.source;
        return (e303.readyState === e303.HAVE_ENOUGH_DATA || e303.readyState === e303.HAVE_FUTURE_DATA) && e303.width && e303.height && (e303.complete = !0), e303.addEventListener("play", this._onPlayStart.bind(this)), e303.addEventListener("pause", this._onPlayStop.bind(this)), this._isSourceReady() ? this._onCanPlay() : (e303.addEventListener("canplay", this._onCanPlay), e303.addEventListener("canplaythrough", this._onCanPlay), e303.addEventListener("error", this._onError, !0)), this._load = new Promise(function(r215) {
            t.valid ? r215(t) : (t._resolve = r215, e303.load());
        }), this._load;
    }, e302.prototype._onError = function(t) {
        this.source.removeEventListener("error", this._onError, !0), this.onError.emit(t);
    }, e302.prototype._isSourcePlaying = function() {
        var t = this.source;
        return t.currentTime > 0 && !1 === t.paused && !1 === t.ended && t.readyState > 2;
    }, e302.prototype._isSourceReady = function() {
        var t = this.source;
        return 3 === t.readyState || 4 === t.readyState;
    }, e302.prototype._onPlayStart = function() {
        this.valid || this._onCanPlay(), this.autoUpdate && !this._isConnectedToTicker && (oi.shared.add(this.update, this), this._isConnectedToTicker = !0);
    }, e302.prototype._onPlayStop = function() {
        this._isConnectedToTicker && (oi.shared.remove(this.update, this), this._isConnectedToTicker = !1);
    }, e302.prototype._onCanPlay = function() {
        var t = this.source;
        t.removeEventListener("canplay", this._onCanPlay), t.removeEventListener("canplaythrough", this._onCanPlay);
        var e304 = this.valid;
        this.resize(t.videoWidth, t.videoHeight), !e304 && this._resolve && (this._resolve(this), this._resolve = null), this._isSourcePlaying() ? this._onPlayStart() : this.autoPlay && t.play();
    }, e302.prototype.dispose = function() {
        this._isConnectedToTicker && (oi.shared.remove(this.update, this), this._isConnectedToTicker = !1);
        var e305 = this.source;
        e305 && (e305.removeEventListener("error", this._onError, !0), e305.pause(), e305.src = "", e305.load()), t395.prototype.dispose.call(this);
    }, Object.defineProperty(e302.prototype, "autoUpdate", {
        get: function() {
            return this._autoUpdate;
        },
        set: function(t) {
            t !== this._autoUpdate && (this._autoUpdate = t, !this._autoUpdate && this._isConnectedToTicker ? (oi.shared.remove(this.update, this), this._isConnectedToTicker = !1) : this._autoUpdate && !this._isConnectedToTicker && this._isSourcePlaying() && (oi.shared.add(this.update, this), this._isConnectedToTicker = !0));
        },
        enumerable: !1,
        configurable: !0
    }), Object.defineProperty(e302.prototype, "updateFPS", {
        get: function() {
            return this._updateFPS;
        },
        set: function(t) {
            t !== this._updateFPS && (this._updateFPS = t);
        },
        enumerable: !1,
        configurable: !0
    }), e302.test = function(t, r216) {
        return self.HTMLVideoElement && t instanceof HTMLVideoElement || e302.TYPES.indexOf(r216) > -1;
    }, e302.TYPES = [
        "mp4",
        "m4v",
        "webm",
        "ogg",
        "ogv",
        "h264",
        "avi",
        "mov"
    ], e302.MIME_TYPES = {
        ogv: "video/ogg",
        mov: "video/quicktime",
        m4v: "video/mp4"
    }, e302;
}(Ii), wi = function(t396) {
    function e306(e307) {
        return t396.call(this, e307) || this;
    }
    return Ei(e306, t396), e306.test = function(t) {
        return !!self.createImageBitmap && t instanceof ImageBitmap;
    }, e306;
}(Ii);
vi.push(Mi, wi, Pi, Ci, Di, xi, Ni, Si);
var Li = {
    __proto__: null,
    Resource: bi,
    BaseImageResource: Ii,
    INSTALLED: vi,
    autoDetectResource: yi,
    AbstractMultiResource: Oi,
    ArrayResource: Si,
    BufferResource: xi,
    CanvasResource: Pi,
    CubeResource: Ni,
    ImageResource: Mi,
    SVGResource: Di,
    VideoResource: Ci,
    ImageBitmapResource: wi
}, Fi = function(t397) {
    function e308() {
        return null !== t397 && t397.apply(this, arguments) || this;
    }
    return Ei(e308, t397), e308.prototype.upload = function(t, e309, r217) {
        var i158 = t.gl;
        i158.pixelStorei(i158.UNPACK_PREMULTIPLY_ALPHA_WEBGL, e309.alphaMode === _e.UNPACK);
        var n115 = e309.realWidth, o90 = e309.realHeight;
        return r217.width === n115 && r217.height === o90 ? i158.texSubImage2D(e309.target, 0, 0, 0, n115, o90, e309.format, r217.type, this.data) : (r217.width = n115, r217.height = o90, i158.texImage2D(e309.target, 0, r217.internalFormat, n115, o90, 0, e309.format, r217.type, this.data)), !0;
    }, e308;
}(xi), Ui = function() {
    function t398(t, e310) {
        this.width = Math.round(t || 100), this.height = Math.round(e310 || 100), this.stencil = !1, this.depth = !1, this.dirtyId = 0, this.dirtyFormat = 0, this.dirtySize = 0, this.depthTexture = null, this.colorTextures = [], this.glFramebuffers = {
        }, this.disposeRunner = new mi("disposeFramebuffer"), this.multisample = Ee.NONE;
    }
    return Object.defineProperty(t398.prototype, "colorTexture", {
        get: function() {
            return this.colorTextures[0];
        },
        enumerable: !1,
        configurable: !0
    }), t398.prototype.addColorTexture = function(t, e311) {
        return void 0 === t && (t = 0), this.colorTextures[t] = e311 || new Ai(null, {
            scaleMode: de.NEAREST,
            resolution: 1,
            mipmap: pe.OFF,
            width: this.width,
            height: this.height
        }), this.dirtyId++, this.dirtyFormat++, this;
    }, t398.prototype.addDepthTexture = function(t) {
        return this.depthTexture = t || new Ai(new Fi(null, {
            width: this.width,
            height: this.height
        }), {
            scaleMode: de.NEAREST,
            resolution: 1,
            width: this.width,
            height: this.height,
            mipmap: pe.OFF,
            format: he.DEPTH_COMPONENT,
            type: le.UNSIGNED_SHORT
        }), this.dirtyId++, this.dirtyFormat++, this;
    }, t398.prototype.enableDepth = function() {
        return this.depth = !0, this.dirtyId++, this.dirtyFormat++, this;
    }, t398.prototype.enableStencil = function() {
        return this.stencil = !0, this.dirtyId++, this.dirtyFormat++, this;
    }, t398.prototype.resize = function(t, e312) {
        if (t = Math.round(t), e312 = Math.round(e312), t !== this.width || e312 !== this.height) {
            this.width = t, this.height = e312, this.dirtyId++, this.dirtySize++;
            for(var r218 = 0; r218 < this.colorTextures.length; r218++){
                var i159 = this.colorTextures[r218], n116 = i159.resolution;
                i159.setSize(t / n116, e312 / n116);
            }
            this.depthTexture && (n116 = this.depthTexture.resolution, this.depthTexture.setSize(t / n116, e312 / n116));
        }
    }, t398.prototype.dispose = function() {
        this.disposeRunner.emit(this, !1);
    }, t398.prototype.destroyDepthTexture = function() {
        this.depthTexture && (this.depthTexture.destroy(), this.depthTexture = null, ++this.dirtyId, ++this.dirtyFormat);
    }, t398;
}(), Gi = function(t399) {
    function e313(e314) {
        var r219 = this;
        return "number" == typeof e314 && (e314 = {
            width: arguments[0],
            height: arguments[1],
            scaleMode: arguments[2],
            resolution: arguments[3]
        }), e314.width = e314.width || 100, e314.height = e314.height || 100, e314.multisample = void 0 !== e314.multisample ? e314.multisample : Ee.NONE, (r219 = t399.call(this, null, e314) || this).mipmap = pe.OFF, r219.valid = !0, r219.clearColor = [
            0,
            0,
            0,
            0
        ], r219.framebuffer = new Ui(r219.realWidth, r219.realHeight).addColorTexture(0, r219), r219.framebuffer.multisample = e314.multisample, r219.maskStack = [], r219.filterStack = [
            {
            }
        ], r219;
    }
    return Ei(e313, t399), e313.prototype.resize = function(t, e315) {
        this.framebuffer.resize(t * this.resolution, e315 * this.resolution), this.setRealSize(this.framebuffer.width, this.framebuffer.height);
    }, e313.prototype.dispose = function() {
        this.framebuffer.dispose(), t399.prototype.dispose.call(this);
    }, e313.prototype.destroy = function() {
        t399.prototype.destroy.call(this), this.framebuffer.destroyDepthTexture(), this.framebuffer = null;
    }, e313;
}(Ai), Bi = function() {
    function t400() {
        this.x0 = 0, this.y0 = 0, this.x1 = 1, this.y1 = 0, this.x2 = 1, this.y2 = 1, this.x3 = 0, this.y3 = 1, this.uvsFloat32 = new Float32Array(8);
    }
    return t400.prototype.set = function(t, e316, r220) {
        var i160 = e316.width, n117 = e316.height;
        if (r220) {
            var o91 = t.width / 2 / i160, s67 = t.height / 2 / n117, a52 = t.x / i160 + o91, h39 = t.y / n117 + s67;
            r220 = xr.add(r220, xr.NW), this.x0 = a52 + o91 * xr.uX(r220), this.y0 = h39 + s67 * xr.uY(r220), r220 = xr.add(r220, 2), this.x1 = a52 + o91 * xr.uX(r220), this.y1 = h39 + s67 * xr.uY(r220), r220 = xr.add(r220, 2), this.x2 = a52 + o91 * xr.uX(r220), this.y2 = h39 + s67 * xr.uY(r220), r220 = xr.add(r220, 2), this.x3 = a52 + o91 * xr.uX(r220), this.y3 = h39 + s67 * xr.uY(r220);
        } else this.x0 = t.x / i160, this.y0 = t.y / n117, this.x1 = (t.x + t.width) / i160, this.y1 = t.y / n117, this.x2 = (t.x + t.width) / i160, this.y2 = (t.y + t.height) / n117, this.x3 = t.x / i160, this.y3 = (t.y + t.height) / n117;
        this.uvsFloat32[0] = this.x0, this.uvsFloat32[1] = this.y0, this.uvsFloat32[2] = this.x1, this.uvsFloat32[3] = this.y1, this.uvsFloat32[4] = this.x2, this.uvsFloat32[5] = this.y2, this.uvsFloat32[6] = this.x3, this.uvsFloat32[7] = this.y3;
    }, t400;
}(), Xi = new Bi, ki = function(t401) {
    function e317(r221, i161, n118, o92, s68, a53) {
        var h40 = t401.call(this) || this;
        if (h40.noFrame = !1, i161 || (h40.noFrame = !0, i161 = new hr(0, 0, 1, 1)), r221 instanceof e317 && (r221 = r221.baseTexture), h40.baseTexture = r221, h40._frame = i161, h40.trim = o92, h40.valid = !1, h40._uvs = Xi, h40.uvMatrix = null, h40.orig = n118 || i161, h40._rotate = Number(s68 || 0), !0 === s68) h40._rotate = 2;
        else if (h40._rotate % 2 != 0) throw new Error("attempt to use diamond-shaped UVs. If you are sure, set rotation manually");
        return h40.defaultAnchor = a53 ? new fr(a53.x, a53.y) : new fr(0, 0), h40._updateID = 0, h40.textureCacheIds = [], r221.valid ? h40.noFrame ? r221.valid && h40.onBaseTextureUpdated(r221) : h40.frame = i161 : r221.once("loaded", h40.onBaseTextureUpdated, h40), h40.noFrame && r221.on("update", h40.onBaseTextureUpdated, h40), h40;
    }
    return Ei(e317, t401), e317.prototype.update = function() {
        this.baseTexture.resource && this.baseTexture.resource.update();
    }, e317.prototype.onBaseTextureUpdated = function(t) {
        if (this.noFrame) {
            if (!this.baseTexture.valid) return;
            this._frame.width = t.width, this._frame.height = t.height, this.valid = !0, this.updateUvs();
        } else this.frame = this._frame;
        this.emit("update", this);
    }, e317.prototype.destroy = function(t) {
        if (this.baseTexture) {
            if (t) {
                var r222 = this.baseTexture.resource;
                r222 && r222.url && Ke[r222.url] && e317.removeFromCache(r222.url), this.baseTexture.destroy();
            }
            this.baseTexture.off("loaded", this.onBaseTextureUpdated, this), this.baseTexture.off("update", this.onBaseTextureUpdated, this), this.baseTexture = null;
        }
        this._frame = null, this._uvs = null, this.trim = null, this.orig = null, this.valid = !1, e317.removeFromCache(this), this.textureCacheIds = null;
    }, e317.prototype.clone = function() {
        var t = this._frame.clone(), r223 = this._frame === this.orig ? t : this.orig.clone(), i162 = new e317(this.baseTexture, !this.noFrame && t, r223, this.trim && this.trim.clone(), this.rotate, this.defaultAnchor);
        return this.noFrame && (i162._frame = t), i162;
    }, e317.prototype.updateUvs = function() {
        this._uvs === Xi && (this._uvs = new Bi), this._uvs.set(this._frame, this.baseTexture, this.rotate), this._updateID++;
    }, e317.from = function(t, r224, i163) {
        void 0 === r224 && (r224 = {
        }), void 0 === i163 && (i163 = et.STRICT_TEXTURE_CACHE);
        var n119 = "string" == typeof t, o93 = null;
        if (n119) o93 = t;
        else if (t instanceof Ai) {
            if (!t.cacheId) {
                var s69 = r224 && r224.pixiIdPrefix || "pixiid";
                t.cacheId = s69 + "-" + We(), Ai.addToCache(t, t.cacheId);
            }
            o93 = t.cacheId;
        } else t._pixiId || (s69 = r224 && r224.pixiIdPrefix || "pixiid", t._pixiId = s69 + "_" + We()), o93 = t._pixiId;
        var a54 = Ke[o93];
        if (n119 && i163 && !a54) throw new Error('The cacheId "' + o93 + '" does not exist in TextureCache.');
        return a54 || t instanceof Ai ? !a54 && t instanceof Ai && (a54 = new e317(t), e317.addToCache(a54, o93)) : (r224.resolution || (r224.resolution = rr(t)), (a54 = new e317(new Ai(t, r224))).baseTexture.cacheId = o93, Ai.addToCache(a54.baseTexture, o93), e317.addToCache(a54, o93)), a54;
    }, e317.fromURL = function(t, r225) {
        var i164 = Object.assign({
            autoLoad: !1
        }, null == r225 ? void 0 : r225.resourceOptions), n120 = e317.from(t, Object.assign({
            resourceOptions: i164
        }, r225), !1), o94 = n120.baseTexture.resource;
        return n120.baseTexture.valid ? Promise.resolve(n120) : o94.load().then(function() {
            return Promise.resolve(n120);
        });
    }, e317.fromBuffer = function(t, r226, i165, n121) {
        return new e317(Ai.fromBuffer(t, r226, i165, n121));
    }, e317.fromLoader = function(t402, r227, i166, n122) {
        var o95 = new Ai(t402, Object.assign({
            scaleMode: et.SCALE_MODE,
            resolution: rr(r227)
        }, n122)), s70 = o95.resource;
        s70 instanceof Mi && (s70.url = r227);
        var a55 = new e317(o95);
        return i166 || (i166 = r227), Ai.addToCache(a55.baseTexture, i166), e317.addToCache(a55, i166), i166 !== r227 && (Ai.addToCache(a55.baseTexture, r227), e317.addToCache(a55, r227)), a55.baseTexture.valid ? Promise.resolve(a55) : new Promise(function(t) {
            a55.baseTexture.once("loaded", function() {
                return t(a55);
            });
        });
    }, e317.addToCache = function(t, e318) {
        e318 && (-1 === t.textureCacheIds.indexOf(e318) && t.textureCacheIds.push(e318), Ke[e318] && console.warn("Texture added to the cache with an id [" + e318 + "] that already had an entry"), Ke[e318] = t);
    }, e317.removeFromCache = function(t) {
        if ("string" == typeof t) {
            var e319 = Ke[t];
            if (e319) {
                var r228 = e319.textureCacheIds.indexOf(t);
                return r228 > -1 && e319.textureCacheIds.splice(r228, 1), delete Ke[t], e319;
            }
        } else if (t && t.textureCacheIds) {
            for(var i167 = 0; i167 < t.textureCacheIds.length; ++i167)Ke[t.textureCacheIds[i167]] === t && delete Ke[t.textureCacheIds[i167]];
            return t.textureCacheIds.length = 0, t;
        }
        return null;
    }, Object.defineProperty(e317.prototype, "resolution", {
        get: function() {
            return this.baseTexture.resolution;
        },
        enumerable: !1,
        configurable: !0
    }), Object.defineProperty(e317.prototype, "frame", {
        get: function() {
            return this._frame;
        },
        set: function(t) {
            this._frame = t, this.noFrame = !1;
            var e320 = t.x, r229 = t.y, i168 = t.width, n123 = t.height, o96 = e320 + i168 > this.baseTexture.width, s71 = r229 + n123 > this.baseTexture.height;
            if (o96 || s71) {
                var a56 = o96 && s71 ? "and" : "or", h41 = "X: " + e320 + " + " + i168 + " = " + (e320 + i168) + " > " + this.baseTexture.width, u32 = "Y: " + r229 + " + " + n123 + " = " + (r229 + n123) + " > " + this.baseTexture.height;
                throw new Error("Texture Error: frame does not fit inside the base Texture dimensions: " + h41 + " " + a56 + " " + u32);
            }
            this.valid = i168 && n123 && this.baseTexture.valid, this.trim || this.rotate || (this.orig = t), this.valid && this.updateUvs();
        },
        enumerable: !1,
        configurable: !0
    }), Object.defineProperty(e317.prototype, "rotate", {
        get: function() {
            return this._rotate;
        },
        set: function(t) {
            this._rotate = t, this.valid && this.updateUvs();
        },
        enumerable: !1,
        configurable: !0
    }), Object.defineProperty(e317.prototype, "width", {
        get: function() {
            return this.orig.width;
        },
        enumerable: !1,
        configurable: !0
    }), Object.defineProperty(e317.prototype, "height", {
        get: function() {
            return this.orig.height;
        },
        enumerable: !1,
        configurable: !0
    }), e317.prototype.castToBaseTexture = function() {
        return this.baseTexture;
    }, e317;
}(nt);
function Hi(t) {
    t.destroy = function() {
    }, t.on = function() {
    }, t.once = function() {
    }, t.emit = function() {
    };
}
ki.EMPTY = new ki(new Ai), Hi(ki.EMPTY), Hi(ki.EMPTY.baseTexture), ki.WHITE = (function() {
    var t = document.createElement("canvas");
    t.width = 16, t.height = 16;
    var e321 = t.getContext("2d");
    return e321.fillStyle = "white", e321.fillRect(0, 0, 16, 16), new ki(new Ai(new Pi(t)));
})(), Hi(ki.WHITE), Hi(ki.WHITE.baseTexture);
var ji = function(t403) {
    function e322(e323, r230) {
        var i169 = t403.call(this, e323, r230) || this;
        return i169.valid = !0, i169.filterFrame = null, i169.filterPoolKey = null, i169.updateUvs(), i169;
    }
    return Ei(e322, t403), Object.defineProperty(e322.prototype, "framebuffer", {
        get: function() {
            return this.baseTexture.framebuffer;
        },
        enumerable: !1,
        configurable: !0
    }), Object.defineProperty(e322.prototype, "multisample", {
        get: function() {
            return this.framebuffer.multisample;
        },
        set: function(t) {
            this.framebuffer.multisample = t;
        },
        enumerable: !1,
        configurable: !0
    }), e322.prototype.resize = function(t, e324, r231) {
        void 0 === r231 && (r231 = !0);
        var i170 = this.baseTexture.resolution, n124 = Math.round(t * i170) / i170, o97 = Math.round(e324 * i170) / i170;
        this.valid = n124 > 0 && o97 > 0, this._frame.width = this.orig.width = n124, this._frame.height = this.orig.height = o97, r231 && this.baseTexture.resize(n124, o97), this.updateUvs();
    }, e322.prototype.setResolution = function(t) {
        var e325 = this.baseTexture;
        e325.resolution !== t && (e325.setResolution(t), this.resize(e325.width, e325.height, !1));
    }, e322.create = function(t) {
        for(var r232 = arguments, i171 = [], n125 = 1; n125 < arguments.length; n125++)i171[n125 - 1] = r232[n125];
        return "number" == typeof t && (t = {
            width: t,
            height: i171[0],
            scaleMode: i171[1],
            resolution: i171[2]
        }), new e322(new Gi(t));
    }, e322;
}(ki), Yi = function() {
    function t404(t) {
        this.texturePool = {
        }, this.textureOptions = t || {
        }, this.enableFullScreen = !1, this._pixelsWidth = 0, this._pixelsHeight = 0;
    }
    return t404.prototype.createTexture = function(t, e326, r233) {
        void 0 === r233 && (r233 = Ee.NONE);
        var i172 = new Gi(Object.assign({
            width: t,
            height: e326,
            resolution: 1,
            multisample: r233
        }, this.textureOptions));
        return new ji(i172);
    }, t404.prototype.getOptimalTexture = function(t, e327, r234, i173) {
        var n126;
        void 0 === r234 && (r234 = 1), void 0 === i173 && (i173 = Ee.NONE), t = Math.ceil(t * r234), e327 = Math.ceil(e327 * r234), this.enableFullScreen && t === this._pixelsWidth && e327 === this._pixelsHeight ? n126 = i173 > 1 ? -i173 : -1 : (n126 = ((65535 & (t = Xe(t))) << 16 | 65535 & (e327 = Xe(e327))) >>> 0, i173 > 1 && (n126 += 4294967296 * i173)), this.texturePool[n126] || (this.texturePool[n126] = []);
        var o98 = this.texturePool[n126].pop();
        return o98 || (o98 = this.createTexture(t, e327, i173)), o98.filterPoolKey = n126, o98.setResolution(r234), o98;
    }, t404.prototype.getFilterTexture = function(t, e328, r235) {
        var i174 = this.getOptimalTexture(t.width, t.height, e328 || t.resolution, r235 || Ee.NONE);
        return i174.filterFrame = t.filterFrame, i174;
    }, t404.prototype.returnTexture = function(t) {
        var e = t.filterPoolKey;
        t.filterFrame = null, this.texturePool[e].push(t);
    }, t404.prototype.returnFilterTexture = function(t) {
        this.returnTexture(t);
    }, t404.prototype.clear = function(t) {
        if (t = !1 !== t) for(var e in this.texturePool){
            var r236 = this.texturePool[e];
            if (r236) for(var i175 = 0; i175 < r236.length; i175++)r236[i175].destroy(!0);
        }
        this.texturePool = {
        };
    }, t404.prototype.setScreenSize = function(t) {
        if (t.width !== this._pixelsWidth || t.height !== this._pixelsHeight) {
            for(var e329 in this.enableFullScreen = t.width > 0 && t.height > 0, this.texturePool)if (Number(e329) < 0) {
                var r237 = this.texturePool[e329];
                if (r237) for(var i176 = 0; i176 < r237.length; i176++)r237[i176].destroy(!0);
                this.texturePool[e329] = [];
            }
            this._pixelsWidth = t.width, this._pixelsHeight = t.height;
        }
    }, t404.SCREEN_KEY = -1, t404;
}(), Vi = function() {
    function t405(t, e330, r238, i177, n127, o99, s72) {
        void 0 === e330 && (e330 = 0), void 0 === r238 && (r238 = !1), void 0 === i177 && (i177 = le.FLOAT), this.buffer = t, this.size = e330, this.normalized = r238, this.type = i177, this.stride = n127, this.start = o99, this.instance = s72;
    }
    return t405.prototype.destroy = function() {
        this.buffer = null;
    }, t405.from = function(e331, r239, i178, n128, o100) {
        return new t405(e331, r239, i178, n128, o100);
    }, t405;
}(), Wi = 0, zi = function() {
    function t406(t, e332, r240) {
        void 0 === e332 && (e332 = !0), void 0 === r240 && (r240 = !1), this.data = t || new Float32Array(1), this._glBuffers = {
        }, this._updateID = 0, this.index = r240, this.static = e332, this.id = Wi++, this.disposeRunner = new mi("disposeBuffer");
    }
    return t406.prototype.update = function(t) {
        t instanceof Array && (t = new Float32Array(t)), this.data = t || this.data, this._updateID++;
    }, t406.prototype.dispose = function() {
        this.disposeRunner.emit(this, !1);
    }, t406.prototype.destroy = function() {
        this.dispose(), this.data = null;
    }, Object.defineProperty(t406.prototype, "index", {
        get: function() {
            return this.type === Te.ELEMENT_ARRAY_BUFFER;
        },
        set: function(t) {
            this.type = t ? Te.ELEMENT_ARRAY_BUFFER : Te.ARRAY_BUFFER;
        },
        enumerable: !1,
        configurable: !0
    }), t406.from = function(e333) {
        return e333 instanceof Array && (e333 = new Float32Array(e333)), new t406(e333);
    }, t406;
}(), qi = {
    Float32Array: Float32Array,
    Uint32Array: Uint32Array,
    Int32Array: Int32Array,
    Uint8Array: Uint8Array
}, Ki = {
    5126: 4,
    5123: 2,
    5121: 1
}, Zi = 0, Ji = {
    Float32Array: Float32Array,
    Uint32Array: Uint32Array,
    Int32Array: Int32Array,
    Uint8Array: Uint8Array,
    Uint16Array: Uint16Array
}, Qi = function() {
    function t407(t, e334) {
        void 0 === t && (t = []), void 0 === e334 && (e334 = {
        }), this.buffers = t, this.indexBuffer = null, this.attributes = e334, this.glVertexArrayObjects = {
        }, this.id = Zi++, this.instanced = !1, this.instanceCount = 1, this.disposeRunner = new mi("disposeGeometry"), this.refCount = 0;
    }
    return t407.prototype.addAttribute = function(t, e335, r241, i179, n129, o101, s73, a57) {
        if (void 0 === r241 && (r241 = 0), void 0 === i179 && (i179 = !1), void 0 === a57 && (a57 = !1), !e335) throw new Error("You must pass a buffer when creating an attribute");
        e335 instanceof zi || (e335 instanceof Array && (e335 = new Float32Array(e335)), e335 = new zi(e335));
        var h42 = t.split("|");
        if (h42.length > 1) {
            for(var u33 = 0; u33 < h42.length; u33++)this.addAttribute(h42[u33], e335, r241, i179, n129);
            return this;
        }
        var l24 = this.buffers.indexOf(e335);
        return -1 === l24 && (this.buffers.push(e335), l24 = this.buffers.length - 1), this.attributes[t] = new Vi(l24, r241, i179, n129, o101, s73, a57), this.instanced = this.instanced || a57, this;
    }, t407.prototype.getAttribute = function(t) {
        return this.attributes[t];
    }, t407.prototype.getBuffer = function(t) {
        return this.buffers[this.getAttribute(t).buffer];
    }, t407.prototype.addIndex = function(t) {
        return t instanceof zi || (t instanceof Array && (t = new Uint16Array(t)), t = new zi(t)), t.type = Te.ELEMENT_ARRAY_BUFFER, this.indexBuffer = t, -1 === this.buffers.indexOf(t) && this.buffers.push(t), this;
    }, t407.prototype.getIndex = function() {
        return this.indexBuffer;
    }, t407.prototype.interleave = function() {
        if (1 === this.buffers.length || 2 === this.buffers.length && this.indexBuffer) return this;
        var t408, e336 = [], r242 = [], i180 = new zi;
        for(t408 in this.attributes){
            var n130 = this.attributes[t408], o102 = this.buffers[n130.buffer];
            e336.push(o102.data), r242.push(n130.size * Ki[n130.type] / 4), n130.buffer = 0;
        }
        for(i180.data = (function(t, e337) {
            for(var r243 = 0, i181 = 0, n131 = {
            }, o103 = 0; o103 < t.length; o103++)i181 += e337[o103], r243 += t[o103].length;
            var s74 = new ArrayBuffer(4 * r243), a58 = null, h43 = 0;
            for(o103 = 0; o103 < t.length; o103++){
                var u34 = e337[o103], l25 = t[o103], c = Ge(l25);
                n131[c] || (n131[c] = new qi[c](s74)), a58 = n131[c];
                for(var d19 = 0; d19 < l25.length; d19++)a58[(d19 / u34 | 0) * i181 + h43 + d19 % u34] = l25[d19];
                h43 += u34;
            }
            return new Float32Array(s74);
        })(e336, r242), t408 = 0; t408 < this.buffers.length; t408++)this.buffers[t408] !== this.indexBuffer && this.buffers[t408].destroy();
        return this.buffers = [
            i180
        ], this.indexBuffer && this.buffers.push(this.indexBuffer), this;
    }, t407.prototype.getSize = function() {
        for(var t in this.attributes){
            var e338 = this.attributes[t];
            return this.buffers[e338.buffer].data.length / (e338.stride / 4 || e338.size);
        }
        return 0;
    }, t407.prototype.dispose = function() {
        this.disposeRunner.emit(this, !1);
    }, t407.prototype.destroy = function() {
        this.dispose(), this.buffers = null, this.indexBuffer = null, this.attributes = null;
    }, t407.prototype.clone = function() {
        for(var e339 = new t407, r244 = 0; r244 < this.buffers.length; r244++)e339.buffers[r244] = new zi(this.buffers[r244].data.slice(0));
        for(var r244 in this.attributes){
            var i182 = this.attributes[r244];
            e339.attributes[r244] = new Vi(i182.buffer, i182.size, i182.normalized, i182.type, i182.stride, i182.start, i182.instance);
        }
        return this.indexBuffer && (e339.indexBuffer = e339.buffers[this.buffers.indexOf(this.indexBuffer)], e339.indexBuffer.type = Te.ELEMENT_ARRAY_BUFFER), e339;
    }, t407.merge = function(e340) {
        for(var r245, i183 = new t407, n132 = [], o104 = [], s75 = [], a59 = 0; a59 < e340.length; a59++){
            r245 = e340[a59];
            for(var h44 = 0; h44 < r245.buffers.length; h44++)o104[h44] = o104[h44] || 0, o104[h44] += r245.buffers[h44].data.length, s75[h44] = 0;
        }
        for(a59 = 0; a59 < r245.buffers.length; a59++)n132[a59] = new Ji[Ge(r245.buffers[a59].data)](o104[a59]), i183.buffers[a59] = new zi(n132[a59]);
        for(a59 = 0; a59 < e340.length; a59++)for(r245 = e340[a59], h44 = 0; h44 < r245.buffers.length; h44++)n132[h44].set(r245.buffers[h44].data, s75[h44]), s75[h44] += r245.buffers[h44].data.length;
        if (i183.attributes = r245.attributes, r245.indexBuffer) {
            i183.indexBuffer = i183.buffers[r245.buffers.indexOf(r245.indexBuffer)], i183.indexBuffer.type = Te.ELEMENT_ARRAY_BUFFER;
            var u35 = 0, l26 = 0, c18 = 0, d20 = 0;
            for(a59 = 0; a59 < r245.buffers.length; a59++)if (r245.buffers[a59] !== r245.indexBuffer) {
                d20 = a59;
                break;
            }
            for(var a59 in r245.attributes){
                var f15 = r245.attributes[a59];
                (0 | f15.buffer) === d20 && (l26 += f15.size * Ki[f15.type] / 4);
            }
            for(a59 = 0; a59 < e340.length; a59++){
                var p = e340[a59].indexBuffer.data;
                for(h44 = 0; h44 < p.length; h44++)i183.indexBuffer.data[h44 + c18] += u35;
                u35 += e340[a59].buffers[d20].data.length / l26, c18 += p.length;
            }
        }
        return i183;
    }, t407;
}(), $i = function(t) {
    function e341() {
        var e342 = t.call(this) || this;
        return e342.addAttribute("aVertexPosition", new Float32Array([
            0,
            0,
            1,
            0,
            1,
            1,
            0,
            1
        ])).addIndex([
            0,
            1,
            3,
            2
        ]), e342;
    }
    return Ei(e341, t), e341;
}(Qi), tn = function(t409) {
    function e343() {
        var e344 = t409.call(this) || this;
        return e344.vertices = new Float32Array([
            -1,
            -1,
            1,
            -1,
            1,
            1,
            -1,
            1
        ]), e344.uvs = new Float32Array([
            0,
            0,
            1,
            0,
            1,
            1,
            0,
            1
        ]), e344.vertexBuffer = new zi(e344.vertices), e344.uvBuffer = new zi(e344.uvs), e344.addAttribute("aVertexPosition", e344.vertexBuffer).addAttribute("aTextureCoord", e344.uvBuffer).addIndex([
            0,
            1,
            2,
            0,
            2,
            3
        ]), e344;
    }
    return Ei(e343, t409), e343.prototype.map = function(t, e345) {
        var r246 = 0, i184 = 0;
        return this.uvs[0] = r246, this.uvs[1] = i184, this.uvs[2] = r246 + e345.width / t.width, this.uvs[3] = i184, this.uvs[4] = r246 + e345.width / t.width, this.uvs[5] = i184 + e345.height / t.height, this.uvs[6] = r246, this.uvs[7] = i184 + e345.height / t.height, r246 = e345.x, i184 = e345.y, this.vertices[0] = r246, this.vertices[1] = i184, this.vertices[2] = r246 + e345.width, this.vertices[3] = i184, this.vertices[4] = r246 + e345.width, this.vertices[5] = i184 + e345.height, this.vertices[6] = r246, this.vertices[7] = i184 + e345.height, this.invalidate(), this;
    }, e343.prototype.invalidate = function() {
        return this.vertexBuffer._updateID++, this.uvBuffer._updateID++, this;
    }, e343;
}(Qi), en = 0, rn = function() {
    function t410(t, e346, r247) {
        this.group = !0, this.syncUniforms = {
        }, this.dirtyId = 0, this.id = en++, this.static = !!e346, this.ubo = !!r247, t instanceof zi ? (this.buffer = t, this.buffer.type = Te.UNIFORM_BUFFER, this.autoManage = !1, this.ubo = !0) : (this.uniforms = t, this.ubo && (this.buffer = new zi(new Float32Array(1)), this.buffer.type = Te.UNIFORM_BUFFER, this.autoManage = !0));
    }
    return t410.prototype.update = function() {
        this.dirtyId++, !this.autoManage && this.buffer && this.buffer.update();
    }, t410.prototype.add = function(e, r248, i185) {
        if (this.ubo) throw new Error("[UniformGroup] uniform groups in ubo mode cannot be modified, or have uniform groups nested in them");
        this.uniforms[e] = new t410(r248, i185);
    }, t410.from = function(e347, r249, i186) {
        return new t410(e347, r249, i186);
    }, t410.uboFrom = function(e348, r250) {
        return new t410(e348, null == r250 || r250, !0);
    }, t410;
}(), nn = function() {
    function t() {
        this.renderTexture = null, this.target = null, this.legacy = !1, this.resolution = 1, this.multisample = Ee.NONE, this.sourceFrame = new hr, this.destinationFrame = new hr, this.bindingSourceFrame = new hr, this.bindingDestinationFrame = new hr, this.filters = [], this.transform = null;
    }
    return t.prototype.clear = function() {
        this.target = null, this.filters = null, this.renderTexture = null;
    }, t;
}(), on = [
    new fr,
    new fr,
    new fr,
    new fr
], sn = new _r, an = function() {
    function t411(t) {
        this.renderer = t, this.defaultFilterStack = [
            {
            }
        ], this.texturePool = new Yi, this.texturePool.setScreenSize(t.view), this.statePool = [], this.quad = new $i, this.quadUv = new tn, this.tempRect = new hr, this.activeState = {
        }, this.globalUniforms = new rn({
            outputFrame: new hr,
            inputSize: new Float32Array(4),
            inputPixel: new Float32Array(4),
            inputClamp: new Float32Array(4),
            resolution: 1,
            filterArea: new Float32Array(4),
            filterClamp: new Float32Array(4)
        }, !0), this.forceClear = !1, this.useMaxPadding = !1;
    }
    return t411.prototype.push = function(t, e349) {
        for(var r251 = this.renderer, i187 = this.defaultFilterStack, n133 = this.statePool.pop() || new nn, o105 = this.renderer.renderTexture, s76 = e349[0].resolution, a60 = e349[0].multisample, h45 = e349[0].padding, u36 = e349[0].autoFit, l27 = e349[0].legacy, c19 = 1; c19 < e349.length; c19++){
            var d21 = e349[c19];
            s76 = Math.min(s76, d21.resolution), a60 = Math.min(a60, d21.multisample), h45 = this.useMaxPadding ? Math.max(h45, d21.padding) : h45 + d21.padding, u36 = u36 && d21.autoFit, l27 = l27 || d21.legacy;
        }
        if (1 === i187.length && (this.defaultFilterStack[0].renderTexture = o105.current), i187.push(n133), n133.resolution = s76, n133.multisample = a60, n133.legacy = l27, n133.target = t, n133.sourceFrame.copyFrom(t.filterArea || t.getBounds(!0)), n133.sourceFrame.pad(h45), u36) {
            var f16 = this.tempRect.copyFrom(o105.sourceFrame);
            r251.projection.transform && this.transformAABB(sn.copyFrom(r251.projection.transform).invert(), f16), n133.sourceFrame.fit(f16);
        }
        this.roundFrame(n133.sourceFrame, o105.current ? o105.current.resolution : r251.resolution, o105.sourceFrame, o105.destinationFrame, r251.projection.transform), n133.renderTexture = this.getOptimalFilterTexture(n133.sourceFrame.width, n133.sourceFrame.height, s76, a60), n133.filters = e349, n133.destinationFrame.width = n133.renderTexture.width, n133.destinationFrame.height = n133.renderTexture.height;
        var p = this.tempRect;
        p.x = 0, p.y = 0, p.width = n133.sourceFrame.width, p.height = n133.sourceFrame.height, n133.renderTexture.filterFrame = n133.sourceFrame, n133.bindingSourceFrame.copyFrom(o105.sourceFrame), n133.bindingDestinationFrame.copyFrom(o105.destinationFrame), n133.transform = r251.projection.transform, r251.projection.transform = null, o105.bind(n133.renderTexture, n133.sourceFrame, p), r251.framebuffer.clear(0, 0, 0, 0);
    }, t411.prototype.pop = function() {
        var t = this.defaultFilterStack, e350 = t.pop(), r252 = e350.filters;
        this.activeState = e350;
        var i188 = this.globalUniforms.uniforms;
        i188.outputFrame = e350.sourceFrame, i188.resolution = e350.resolution;
        var n134 = i188.inputSize, o106 = i188.inputPixel, s77 = i188.inputClamp;
        if (n134[0] = e350.destinationFrame.width, n134[1] = e350.destinationFrame.height, n134[2] = 1 / n134[0], n134[3] = 1 / n134[1], o106[0] = Math.round(n134[0] * e350.resolution), o106[1] = Math.round(n134[1] * e350.resolution), o106[2] = 1 / o106[0], o106[3] = 1 / o106[1], s77[0] = 0.5 * o106[2], s77[1] = 0.5 * o106[3], s77[2] = e350.sourceFrame.width * n134[2] - 0.5 * o106[2], s77[3] = e350.sourceFrame.height * n134[3] - 0.5 * o106[3], e350.legacy) {
            var a61 = i188.filterArea;
            a61[0] = e350.destinationFrame.width, a61[1] = e350.destinationFrame.height, a61[2] = e350.sourceFrame.x, a61[3] = e350.sourceFrame.y, i188.filterClamp = i188.inputClamp;
        }
        this.globalUniforms.update();
        var h46 = t[t.length - 1];
        if (this.renderer.framebuffer.blit(), 1 === r252.length) r252[0].apply(this, e350.renderTexture, h46.renderTexture, me.BLEND, e350), this.returnFilterTexture(e350.renderTexture);
        else {
            var u37 = e350.renderTexture, l28 = this.getOptimalFilterTexture(u37.width, u37.height, e350.resolution);
            l28.filterFrame = u37.filterFrame;
            var c20 = 0;
            for(c20 = 0; c20 < r252.length - 1; ++c20){
                1 === c20 && e350.multisample > 1 && ((l28 = this.getOptimalFilterTexture(u37.width, u37.height, e350.resolution)).filterFrame = u37.filterFrame), r252[c20].apply(this, u37, l28, me.CLEAR, e350);
                var d22 = u37;
                u37 = l28, l28 = d22;
            }
            r252[c20].apply(this, u37, h46.renderTexture, me.BLEND, e350), c20 > 1 && e350.multisample > 1 && this.returnFilterTexture(e350.renderTexture), this.returnFilterTexture(u37), this.returnFilterTexture(l28);
        }
        e350.clear(), this.statePool.push(e350);
    }, t411.prototype.bindAndClear = function(t, e351) {
        void 0 === e351 && (e351 = me.CLEAR);
        var r253 = this.renderer, i189 = r253.renderTexture, n135 = r253.state;
        if (t === this.defaultFilterStack[this.defaultFilterStack.length - 1].renderTexture ? this.renderer.projection.transform = this.activeState.transform : this.renderer.projection.transform = null, t && t.filterFrame) {
            var o107 = this.tempRect;
            o107.x = 0, o107.y = 0, o107.width = t.filterFrame.width, o107.height = t.filterFrame.height, i189.bind(t, t.filterFrame, o107);
        } else t !== this.defaultFilterStack[this.defaultFilterStack.length - 1].renderTexture ? i189.bind(t) : this.renderer.renderTexture.bind(t, this.activeState.bindingSourceFrame, this.activeState.bindingDestinationFrame);
        var s78 = 1 & n135.stateId || this.forceClear;
        (e351 === me.CLEAR || e351 === me.BLIT && s78) && this.renderer.framebuffer.clear(0, 0, 0, 0);
    }, t411.prototype.applyFilter = function(t, e352, r254, i190) {
        var n136 = this.renderer;
        n136.state.set(t.state), this.bindAndClear(r254, i190), t.uniforms.uSampler = e352, t.uniforms.filterGlobals = this.globalUniforms, n136.shader.bind(t), t.legacy = !!t.program.attributeData.aTextureCoord, t.legacy ? (this.quadUv.map(e352._frame, e352.filterFrame), n136.geometry.bind(this.quadUv), n136.geometry.draw(ae.TRIANGLES)) : (n136.geometry.bind(this.quad), n136.geometry.draw(ae.TRIANGLE_STRIP));
    }, t411.prototype.calculateSpriteMatrix = function(t, e353) {
        var r255 = this.activeState, i191 = r255.sourceFrame, n137 = r255.destinationFrame, o108 = e353._texture.orig, s79 = t.set(n137.width, 0, 0, n137.height, i191.x, i191.y), a62 = e353.worldTransform.copyTo(_r.TEMP_MATRIX);
        return a62.invert(), s79.prepend(a62), s79.scale(1 / o108.width, 1 / o108.height), s79.translate(e353.anchor.x, e353.anchor.y), s79;
    }, t411.prototype.destroy = function() {
        this.renderer = null, this.texturePool.clear(!1);
    }, t411.prototype.getOptimalFilterTexture = function(t, e354, r256, i192) {
        return void 0 === r256 && (r256 = 1), void 0 === i192 && (i192 = Ee.NONE), this.texturePool.getOptimalTexture(t, e354, r256, i192);
    }, t411.prototype.getFilterTexture = function(t, e355, r257) {
        if ("number" == typeof t) {
            var i193 = t;
            t = e355, e355 = i193;
        }
        t = t || this.activeState.renderTexture;
        var n138 = this.texturePool.getOptimalTexture(t.width, t.height, e355 || t.resolution, r257 || Ee.NONE);
        return n138.filterFrame = t.filterFrame, n138;
    }, t411.prototype.returnFilterTexture = function(t) {
        this.texturePool.returnTexture(t);
    }, t411.prototype.emptyPool = function() {
        this.texturePool.clear(!0);
    }, t411.prototype.resize = function() {
        this.texturePool.setScreenSize(this.renderer.view);
    }, t411.prototype.transformAABB = function(t, e356) {
        var r258 = on[0], i194 = on[1], n139 = on[2], o109 = on[3];
        r258.set(e356.left, e356.top), i194.set(e356.left, e356.bottom), n139.set(e356.right, e356.top), o109.set(e356.right, e356.bottom), t.apply(r258, r258), t.apply(i194, i194), t.apply(n139, n139), t.apply(o109, o109);
        var s80 = Math.min(r258.x, i194.x, n139.x, o109.x), a63 = Math.min(r258.y, i194.y, n139.y, o109.y), h47 = Math.max(r258.x, i194.x, n139.x, o109.x), u38 = Math.max(r258.y, i194.y, n139.y, o109.y);
        e356.x = s80, e356.y = a63, e356.width = h47 - s80, e356.height = u38 - a63;
    }, t411.prototype.roundFrame = function(t, e357, r259, i195, n140) {
        if (n140) {
            var o110 = n140.a, s81 = n140.b, a64 = n140.c, h48 = n140.d;
            if ((Math.abs(s81) > 0.0001 || Math.abs(a64) > 0.0001) && (Math.abs(o110) > 0.0001 || Math.abs(h48) > 0.0001)) return;
        }
        (n140 = n140 ? sn.copyFrom(n140) : sn.identity()).translate(-r259.x, -r259.y).scale(i195.width / r259.width, i195.height / r259.height).translate(i195.x, i195.y), this.transformAABB(n140, t), t.ceil(e357), this.transformAABB(n140.invert(), t);
    }, t411;
}(), hn = function() {
    function t412(t) {
        this.renderer = t;
    }
    return t412.prototype.flush = function() {
    }, t412.prototype.destroy = function() {
        this.renderer = null;
    }, t412.prototype.start = function() {
    }, t412.prototype.stop = function() {
        this.flush();
    }, t412.prototype.render = function(t) {
    }, t412;
}(), un = function() {
    function t413(t) {
        this.renderer = t, this.emptyRenderer = new hn(t), this.currentRenderer = this.emptyRenderer;
    }
    return t413.prototype.setObjectRenderer = function(t) {
        this.currentRenderer !== t && (this.currentRenderer.stop(), this.currentRenderer = t, this.currentRenderer.start());
    }, t413.prototype.flush = function() {
        this.setObjectRenderer(this.emptyRenderer);
    }, t413.prototype.reset = function() {
        this.setObjectRenderer(this.emptyRenderer);
    }, t413.prototype.copyBoundTextures = function(t, e358) {
        for(var r260 = this.renderer.texture.boundTextures, i196 = e358 - 1; i196 >= 0; --i196)t[i196] = r260[i196] || null, t[i196] && (t[i196]._batchLocation = i196);
    }, t413.prototype.boundArray = function(t, e359, r261, i197) {
        for(var n141 = t.elements, o111 = t.ids, s82 = t.count, a65 = 0, h49 = 0; h49 < s82; h49++){
            var u39 = n141[h49], l29 = u39._batchLocation;
            if (l29 >= 0 && l29 < i197 && e359[l29] === u39) o111[h49] = l29;
            else for(; a65 < i197;){
                var c21 = e359[a65];
                if (!c21 || c21._batchEnabled !== r261 || c21._batchLocation !== a65) {
                    o111[h49] = a65, u39._batchLocation = a65, e359[a65] = u39;
                    break;
                }
                a65++;
            }
        }
    }, t413.prototype.destroy = function() {
        this.renderer = null;
    }, t413;
}(), ln = 0, cn = function() {
    function t414(t) {
        this.renderer = t, this.webGLVersion = 1, this.extensions = {
        }, this.supports = {
            uint32Indices: !1
        }, this.handleContextLost = this.handleContextLost.bind(this), this.handleContextRestored = this.handleContextRestored.bind(this), t.view.addEventListener("webglcontextlost", this.handleContextLost, !1), t.view.addEventListener("webglcontextrestored", this.handleContextRestored, !1);
    }
    return Object.defineProperty(t414.prototype, "isLost", {
        get: function() {
            return !this.gl || this.gl.isContextLost();
        },
        enumerable: !1,
        configurable: !0
    }), t414.prototype.contextChange = function(t) {
        this.gl = t, this.renderer.gl = t, this.renderer.CONTEXT_UID = ln++, t.isContextLost() && t.getExtension("WEBGL_lose_context") && t.getExtension("WEBGL_lose_context").restoreContext();
    }, t414.prototype.initFromContext = function(t) {
        this.gl = t, this.validateContext(t), this.renderer.gl = t, this.renderer.CONTEXT_UID = ln++, this.renderer.runners.contextChange.emit(t);
    }, t414.prototype.initFromOptions = function(t) {
        var e360 = this.createContext(this.renderer.view, t);
        this.initFromContext(e360);
    }, t414.prototype.createContext = function(t, e361) {
        var r262;
        if (et.PREFER_ENV >= ie.WEBGL2 && (r262 = t.getContext("webgl2", e361)), r262) this.webGLVersion = 2;
        else if (this.webGLVersion = 1, !(r262 = t.getContext("webgl", e361) || t.getContext("experimental-webgl", e361))) throw new Error("This browser does not support WebGL. Try using the canvas renderer");
        return this.gl = r262, this.getExtensions(), this.gl;
    }, t414.prototype.getExtensions = function() {
        var t = this.gl, e362 = {
            anisotropicFiltering: t.getExtension("EXT_texture_filter_anisotropic"),
            floatTextureLinear: t.getExtension("OES_texture_float_linear"),
            s3tc: t.getExtension("WEBGL_compressed_texture_s3tc"),
            s3tc_sRGB: t.getExtension("WEBGL_compressed_texture_s3tc_srgb"),
            etc: t.getExtension("WEBGL_compressed_texture_etc"),
            etc1: t.getExtension("WEBGL_compressed_texture_etc1"),
            pvrtc: t.getExtension("WEBGL_compressed_texture_pvrtc") || t.getExtension("WEBKIT_WEBGL_compressed_texture_pvrtc"),
            atc: t.getExtension("WEBGL_compressed_texture_atc"),
            astc: t.getExtension("WEBGL_compressed_texture_astc")
        };
        1 === this.webGLVersion ? Object.assign(this.extensions, e362, {
            drawBuffers: t.getExtension("WEBGL_draw_buffers"),
            depthTexture: t.getExtension("WEBGL_depth_texture"),
            loseContext: t.getExtension("WEBGL_lose_context"),
            vertexArrayObject: t.getExtension("OES_vertex_array_object") || t.getExtension("MOZ_OES_vertex_array_object") || t.getExtension("WEBKIT_OES_vertex_array_object"),
            uint32ElementIndex: t.getExtension("OES_element_index_uint"),
            floatTexture: t.getExtension("OES_texture_float"),
            floatTextureLinear: t.getExtension("OES_texture_float_linear"),
            textureHalfFloat: t.getExtension("OES_texture_half_float"),
            textureHalfFloatLinear: t.getExtension("OES_texture_half_float_linear")
        }) : 2 === this.webGLVersion && Object.assign(this.extensions, e362, {
            colorBufferFloat: t.getExtension("EXT_color_buffer_float")
        });
    }, t414.prototype.handleContextLost = function(t) {
        t.preventDefault();
    }, t414.prototype.handleContextRestored = function() {
        this.renderer.runners.contextChange.emit(this.gl);
    }, t414.prototype.destroy = function() {
        var t = this.renderer.view;
        this.renderer = null, t.removeEventListener("webglcontextlost", this.handleContextLost), t.removeEventListener("webglcontextrestored", this.handleContextRestored), this.gl.useProgram(null), this.extensions.loseContext && this.extensions.loseContext.loseContext();
    }, t414.prototype.postrender = function() {
        this.renderer.renderingToScreen && this.gl.flush();
    }, t414.prototype.validateContext = function(t) {
        var e363 = t.getContextAttributes(), r263 = "WebGL2RenderingContext" in self && t instanceof self.WebGL2RenderingContext;
        r263 && (this.webGLVersion = 2), e363.stencil || console.warn("Provided WebGL context does not have a stencil buffer, masks may not render correctly");
        var i198 = r263 || !!t.getExtension("OES_element_index_uint");
        this.supports.uint32Indices = i198, i198 || console.warn("Provided WebGL context does not support 32 index buffer, complex graphics may not render correctly");
    }, t414;
}(), dn = function(t) {
    this.framebuffer = t, this.stencil = null, this.dirtyId = -1, this.dirtyFormat = -1, this.dirtySize = -1, this.multisample = Ee.NONE, this.msaaBuffer = null, this.blitFramebuffer = null, this.mipLevel = 0;
}, fn = new hr, pn = function() {
    function t415(t) {
        this.renderer = t, this.managedFramebuffers = [], this.unknownFramebuffer = new Ui(10, 10), this.msaaSamples = null;
    }
    return t415.prototype.contextChange = function() {
        var t416 = this.gl = this.renderer.gl;
        if (this.CONTEXT_UID = this.renderer.CONTEXT_UID, this.current = this.unknownFramebuffer, this.viewport = new hr, this.hasMRT = !0, this.writeDepthTexture = !0, this.disposeAll(!0), 1 === this.renderer.context.webGLVersion) {
            var e364 = this.renderer.context.extensions.drawBuffers, r264 = this.renderer.context.extensions.depthTexture;
            et.PREFER_ENV === ie.WEBGL_LEGACY && (e364 = null, r264 = null), e364 ? t416.drawBuffers = function(t) {
                return e364.drawBuffersWEBGL(t);
            } : (this.hasMRT = !1, t416.drawBuffers = function() {
            }), r264 || (this.writeDepthTexture = !1);
        } else this.msaaSamples = t416.getInternalformatParameter(t416.RENDERBUFFER, t416.RGBA8, t416.SAMPLES);
    }, t415.prototype.bind = function(t, e365, r265) {
        void 0 === r265 && (r265 = 0);
        var i199 = this.gl;
        if (t) {
            var n142 = t.glFramebuffers[this.CONTEXT_UID] || this.initFramebuffer(t);
            this.current !== t && (this.current = t, i199.bindFramebuffer(i199.FRAMEBUFFER, n142.framebuffer)), n142.mipLevel !== r265 && (t.dirtyId++, t.dirtyFormat++, n142.mipLevel = r265), n142.dirtyId !== t.dirtyId && (n142.dirtyId = t.dirtyId, n142.dirtyFormat !== t.dirtyFormat ? (n142.dirtyFormat = t.dirtyFormat, n142.dirtySize = t.dirtySize, this.updateFramebuffer(t, r265)) : n142.dirtySize !== t.dirtySize && (n142.dirtySize = t.dirtySize, this.resizeFramebuffer(t)));
            for(var o112 = 0; o112 < t.colorTextures.length; o112++){
                var s83 = t.colorTextures[o112];
                this.renderer.texture.unbind(s83.parentTextureArray || s83);
            }
            if (t.depthTexture && this.renderer.texture.unbind(t.depthTexture), e365) {
                var a66 = e365.width >> r265, h50 = e365.height >> r265, u40 = a66 / e365.width;
                this.setViewport(e365.x * u40, e365.y * u40, a66, h50);
            } else a66 = t.width >> r265, h50 = t.height >> r265, this.setViewport(0, 0, a66, h50);
        } else this.current && (this.current = null, i199.bindFramebuffer(i199.FRAMEBUFFER, null)), e365 ? this.setViewport(e365.x, e365.y, e365.width, e365.height) : this.setViewport(0, 0, this.renderer.width, this.renderer.height);
    }, t415.prototype.setViewport = function(t, e366, r266, i200) {
        var n143 = this.viewport;
        t = Math.round(t), e366 = Math.round(e366), r266 = Math.round(r266), i200 = Math.round(i200), n143.width === r266 && n143.height === i200 && n143.x === t && n143.y === e366 || (n143.x = t, n143.y = e366, n143.width = r266, n143.height = i200, this.gl.viewport(t, e366, r266, i200));
    }, Object.defineProperty(t415.prototype, "size", {
        get: function() {
            return this.current ? {
                x: 0,
                y: 0,
                width: this.current.width,
                height: this.current.height
            } : {
                x: 0,
                y: 0,
                width: this.renderer.width,
                height: this.renderer.height
            };
        },
        enumerable: !1,
        configurable: !0
    }), t415.prototype.clear = function(t, e367, r267, i201, n144) {
        void 0 === n144 && (n144 = oe.COLOR | oe.DEPTH);
        var o113 = this.gl;
        o113.clearColor(t, e367, r267, i201), o113.clear(n144);
    }, t415.prototype.initFramebuffer = function(t) {
        var e368 = this.gl, r268 = new dn(e368.createFramebuffer());
        return r268.multisample = this.detectSamples(t.multisample), t.glFramebuffers[this.CONTEXT_UID] = r268, this.managedFramebuffers.push(t), t.disposeRunner.add(this), r268;
    }, t415.prototype.resizeFramebuffer = function(t) {
        var e369 = this.gl, r269 = t.glFramebuffers[this.CONTEXT_UID];
        r269.msaaBuffer && (e369.bindRenderbuffer(e369.RENDERBUFFER, r269.msaaBuffer), e369.renderbufferStorageMultisample(e369.RENDERBUFFER, r269.multisample, e369.RGBA8, t.width, t.height)), r269.stencil && (e369.bindRenderbuffer(e369.RENDERBUFFER, r269.stencil), r269.msaaBuffer ? e369.renderbufferStorageMultisample(e369.RENDERBUFFER, r269.multisample, e369.DEPTH24_STENCIL8, t.width, t.height) : e369.renderbufferStorage(e369.RENDERBUFFER, e369.DEPTH_STENCIL, t.width, t.height));
        var i202 = t.colorTextures, n145 = i202.length;
        e369.drawBuffers || (n145 = Math.min(n145, 1));
        for(var o114 = 0; o114 < n145; o114++){
            var s84 = i202[o114], a67 = s84.parentTextureArray || s84;
            this.renderer.texture.bind(a67, 0);
        }
        t.depthTexture && this.writeDepthTexture && this.renderer.texture.bind(t.depthTexture, 0);
    }, t415.prototype.updateFramebuffer = function(t, e370) {
        var r270 = this.gl, i203 = t.glFramebuffers[this.CONTEXT_UID], n146 = t.colorTextures, o115 = n146.length;
        r270.drawBuffers || (o115 = Math.min(o115, 1)), i203.multisample > 1 && this.canMultisampleFramebuffer(t) ? (i203.msaaBuffer = i203.msaaBuffer || r270.createRenderbuffer(), r270.bindRenderbuffer(r270.RENDERBUFFER, i203.msaaBuffer), r270.renderbufferStorageMultisample(r270.RENDERBUFFER, i203.multisample, r270.RGBA8, t.width, t.height), r270.framebufferRenderbuffer(r270.FRAMEBUFFER, r270.COLOR_ATTACHMENT0, r270.RENDERBUFFER, i203.msaaBuffer)) : i203.msaaBuffer && (r270.deleteRenderbuffer(i203.msaaBuffer), i203.msaaBuffer = null, i203.blitFramebuffer && (i203.blitFramebuffer.dispose(), i203.blitFramebuffer = null));
        for(var s85 = [], a68 = 0; a68 < o115; a68++){
            var h51 = n146[a68], u41 = h51.parentTextureArray || h51;
            this.renderer.texture.bind(u41, 0), 0 === a68 && i203.msaaBuffer || (r270.framebufferTexture2D(r270.FRAMEBUFFER, r270.COLOR_ATTACHMENT0 + a68, h51.target, u41._glTextures[this.CONTEXT_UID].texture, e370), s85.push(r270.COLOR_ATTACHMENT0 + a68));
        }
        if (s85.length > 1 && r270.drawBuffers(s85), t.depthTexture && this.writeDepthTexture) {
            var l30 = t.depthTexture;
            this.renderer.texture.bind(l30, 0), r270.framebufferTexture2D(r270.FRAMEBUFFER, r270.DEPTH_ATTACHMENT, r270.TEXTURE_2D, l30._glTextures[this.CONTEXT_UID].texture, e370);
        }
        !t.stencil && !t.depth || t.depthTexture && this.writeDepthTexture ? i203.stencil && (r270.deleteRenderbuffer(i203.stencil), i203.stencil = null) : (i203.stencil = i203.stencil || r270.createRenderbuffer(), r270.bindRenderbuffer(r270.RENDERBUFFER, i203.stencil), i203.msaaBuffer ? r270.renderbufferStorageMultisample(r270.RENDERBUFFER, i203.multisample, r270.DEPTH24_STENCIL8, t.width, t.height) : r270.renderbufferStorage(r270.RENDERBUFFER, r270.DEPTH_STENCIL, t.width, t.height), r270.framebufferRenderbuffer(r270.FRAMEBUFFER, r270.DEPTH_STENCIL_ATTACHMENT, r270.RENDERBUFFER, i203.stencil));
    }, t415.prototype.canMultisampleFramebuffer = function(t) {
        return 1 !== this.renderer.context.webGLVersion && t.colorTextures.length <= 1 && !t.depthTexture;
    }, t415.prototype.detectSamples = function(t) {
        var e371 = this.msaaSamples, r271 = Ee.NONE;
        if (t <= 1 || null === e371) return r271;
        for(var i204 = 0; i204 < e371.length; i204++)if (e371[i204] <= t) {
            r271 = e371[i204];
            break;
        }
        return 1 === r271 && (r271 = Ee.NONE), r271;
    }, t415.prototype.blit = function(t, e372, r272) {
        var i205 = this.current, n147 = this.renderer, o116 = this.gl, s = this.CONTEXT_UID;
        if (2 === n147.context.webGLVersion && i205) {
            var a69 = i205.glFramebuffers[s];
            if (a69) {
                if (!t) {
                    if (!a69.msaaBuffer) return;
                    var h52 = i205.colorTextures[0];
                    if (!h52) return;
                    a69.blitFramebuffer || (a69.blitFramebuffer = new Ui(i205.width, i205.height), a69.blitFramebuffer.addColorTexture(0, h52)), (t = a69.blitFramebuffer).colorTextures[0] !== h52 && (t.colorTextures[0] = h52, t.dirtyId++, t.dirtyFormat++), t.width === i205.width && t.height === i205.height || (t.width = i205.width, t.height = i205.height, t.dirtyId++, t.dirtySize++);
                }
                e372 || ((e372 = fn).width = i205.width, e372.height = i205.height), r272 || (r272 = e372);
                var u42 = e372.width === r272.width && e372.height === r272.height;
                this.bind(t), o116.bindFramebuffer(o116.READ_FRAMEBUFFER, a69.framebuffer), o116.blitFramebuffer(e372.x, e372.y, e372.width, e372.height, r272.x, r272.y, r272.width, r272.height, o116.COLOR_BUFFER_BIT, u42 ? o116.NEAREST : o116.LINEAR);
            }
        }
    }, t415.prototype.disposeFramebuffer = function(t, e373) {
        var r273 = t.glFramebuffers[this.CONTEXT_UID], i206 = this.gl;
        if (r273) {
            delete t.glFramebuffers[this.CONTEXT_UID];
            var n148 = this.managedFramebuffers.indexOf(t);
            n148 >= 0 && this.managedFramebuffers.splice(n148, 1), t.disposeRunner.remove(this), e373 || (i206.deleteFramebuffer(r273.framebuffer), r273.msaaBuffer && i206.deleteRenderbuffer(r273.msaaBuffer), r273.stencil && i206.deleteRenderbuffer(r273.stencil)), r273.blitFramebuffer && r273.blitFramebuffer.dispose();
        }
    }, t415.prototype.disposeAll = function(t) {
        var e374 = this.managedFramebuffers;
        this.managedFramebuffers = [];
        for(var r274 = 0; r274 < e374.length; r274++)this.disposeFramebuffer(e374[r274], t);
    }, t415.prototype.forceStencil = function() {
        var t = this.current;
        if (t) {
            var e375 = t.glFramebuffers[this.CONTEXT_UID];
            if (e375 && !e375.stencil) {
                t.stencil = !0;
                var r275 = t.width, i207 = t.height, n149 = this.gl, o117 = n149.createRenderbuffer();
                n149.bindRenderbuffer(n149.RENDERBUFFER, o117), e375.msaaBuffer ? n149.renderbufferStorageMultisample(n149.RENDERBUFFER, e375.multisample, n149.DEPTH24_STENCIL8, r275, i207) : n149.renderbufferStorage(n149.RENDERBUFFER, n149.DEPTH_STENCIL, r275, i207), e375.stencil = o117, n149.framebufferRenderbuffer(n149.FRAMEBUFFER, n149.DEPTH_STENCIL_ATTACHMENT, n149.RENDERBUFFER, o117);
            }
        }
    }, t415.prototype.reset = function() {
        this.current = this.unknownFramebuffer, this.viewport = new hr;
    }, t415.prototype.destroy = function() {
        this.renderer = null;
    }, t415;
}(), _n = {
    5126: 4,
    5123: 2,
    5121: 1
}, mn = function() {
    function t417(t) {
        this.renderer = t, this._activeGeometry = null, this._activeVao = null, this.hasVao = !0, this.hasInstance = !0, this.canUseUInt32ElementIndex = !1, this.managedGeometries = {
        };
    }
    return t417.prototype.contextChange = function() {
        this.disposeAll(!0);
        var t418 = this.gl = this.renderer.gl, e376 = this.renderer.context;
        if (this.CONTEXT_UID = this.renderer.CONTEXT_UID, 2 !== e376.webGLVersion) {
            var r276 = this.renderer.context.extensions.vertexArrayObject;
            et.PREFER_ENV === ie.WEBGL_LEGACY && (r276 = null), r276 ? (t418.createVertexArray = function() {
                return r276.createVertexArrayOES();
            }, t418.bindVertexArray = function(t) {
                return r276.bindVertexArrayOES(t);
            }, t418.deleteVertexArray = function(t) {
                return r276.deleteVertexArrayOES(t);
            }) : (this.hasVao = !1, t418.createVertexArray = function() {
                return null;
            }, t418.bindVertexArray = function() {
                return null;
            }, t418.deleteVertexArray = function() {
                return null;
            });
        }
        if (2 !== e376.webGLVersion) {
            var i208 = t418.getExtension("ANGLE_instanced_arrays");
            i208 ? (t418.vertexAttribDivisor = function(t, e377) {
                return i208.vertexAttribDivisorANGLE(t, e377);
            }, t418.drawElementsInstanced = function(t, e378, r277, n150, o118) {
                return i208.drawElementsInstancedANGLE(t, e378, r277, n150, o118);
            }, t418.drawArraysInstanced = function(t, e379, r278, n151) {
                return i208.drawArraysInstancedANGLE(t, e379, r278, n151);
            }) : this.hasInstance = !1;
        }
        this.canUseUInt32ElementIndex = 2 === e376.webGLVersion || !!e376.extensions.uint32ElementIndex;
    }, t417.prototype.bind = function(t, e380) {
        e380 = e380 || this.renderer.shader.shader;
        var r279 = this.gl, i209 = t.glVertexArrayObjects[this.CONTEXT_UID], n152 = !1;
        i209 || (this.managedGeometries[t.id] = t, t.disposeRunner.add(this), t.glVertexArrayObjects[this.CONTEXT_UID] = i209 = {
        }, n152 = !0);
        var o119 = i209[e380.program.id] || this.initGeometryVao(t, e380, n152);
        this._activeGeometry = t, this._activeVao !== o119 && (this._activeVao = o119, this.hasVao ? r279.bindVertexArray(o119) : this.activateVao(t, e380.program)), this.updateBuffers();
    }, t417.prototype.reset = function() {
        this.unbind();
    }, t417.prototype.updateBuffers = function() {
        for(var t = this._activeGeometry, e381 = this.renderer.buffer, r280 = 0; r280 < t.buffers.length; r280++){
            var i210 = t.buffers[r280];
            e381.update(i210);
        }
    }, t417.prototype.checkCompatibility = function(t, e382) {
        var r281 = t.attributes, i211 = e382.attributeData;
        for(var n153 in i211)if (!r281[n153]) throw new Error('shader and geometry incompatible, geometry missing the "' + n153 + '" attribute');
    }, t417.prototype.getSignature = function(t, e383) {
        var r282 = t.attributes, i212 = e383.attributeData, n154 = [
            "g",
            t.id
        ];
        for(var o120 in r282)i212[o120] && n154.push(o120);
        return n154.join("-");
    }, t417.prototype.initGeometryVao = function(t, e384, r283) {
        void 0 === r283 && (r283 = !0);
        var i213 = this.gl, n = this.CONTEXT_UID, o121 = this.renderer.buffer, s86 = e384.program;
        s86.glPrograms[n] || this.renderer.shader.generateProgram(e384), this.checkCompatibility(t, s86);
        var a = this.getSignature(t, s86), h53 = t.glVertexArrayObjects[this.CONTEXT_UID], u43 = h53[a];
        if (u43) return h53[s86.id] = u43, u43;
        var l31 = t.buffers, c22 = t.attributes, d23 = {
        }, f17 = {
        };
        for(var p in l31)d23[p] = 0, f17[p] = 0;
        for(var p in c22)!c22[p].size && s86.attributeData[p] ? c22[p].size = s86.attributeData[p].size : c22[p].size || console.warn("PIXI Geometry attribute '" + p + "' size cannot be determined (likely the bound shader does not have the attribute)"), d23[c22[p].buffer] += c22[p].size * _n[c22[p].type];
        for(var p in c22){
            var _8 = c22[p], m7 = _8.size;
            void 0 === _8.stride && (d23[_8.buffer] === m7 * _n[_8.type] ? _8.stride = 0 : _8.stride = d23[_8.buffer]), void 0 === _8.start && (_8.start = f17[_8.buffer], f17[_8.buffer] += m7 * _n[_8.type]);
        }
        u43 = i213.createVertexArray(), i213.bindVertexArray(u43);
        for(var v7 = 0; v7 < l31.length; v7++){
            var y = l31[v7];
            o121.bind(y), r283 && y._glBuffers[n].refCount++;
        }
        return this.activateVao(t, s86), this._activeVao = u43, h53[s86.id] = u43, h53[a] = u43, u43;
    }, t417.prototype.disposeGeometry = function(t, e385) {
        var r284;
        if (this.managedGeometries[t.id]) {
            delete this.managedGeometries[t.id];
            var i214 = t.glVertexArrayObjects[this.CONTEXT_UID], n155 = this.gl, o122 = t.buffers, s87 = null === (r284 = this.renderer) || void 0 === r284 ? void 0 : r284.buffer;
            if (t.disposeRunner.remove(this), i214) {
                if (s87) for(var a70 = 0; a70 < o122.length; a70++){
                    var h54 = o122[a70]._glBuffers[this.CONTEXT_UID];
                    h54 && (h54.refCount--, 0 !== h54.refCount || e385 || s87.dispose(o122[a70], e385));
                }
                if (!e385) {
                    for(var u44 in i214)if ("g" === u44[0]) {
                        var l32 = i214[u44];
                        this._activeVao === l32 && this.unbind(), n155.deleteVertexArray(l32);
                    }
                }
                delete t.glVertexArrayObjects[this.CONTEXT_UID];
            }
        }
    }, t417.prototype.disposeAll = function(t) {
        for(var e386 = Object.keys(this.managedGeometries), r285 = 0; r285 < e386.length; r285++)this.disposeGeometry(this.managedGeometries[e386[r285]], t);
    }, t417.prototype.activateVao = function(t, e387) {
        var r286 = this.gl, i = this.CONTEXT_UID, n156 = this.renderer.buffer, o123 = t.buffers, s88 = t.attributes;
        t.indexBuffer && n156.bind(t.indexBuffer);
        var a71 = null;
        for(var h in s88){
            var u45 = s88[h], l33 = o123[u45.buffer], c23 = l33._glBuffers[i];
            if (e387.attributeData[h]) {
                a71 !== c23 && (n156.bind(l33), a71 = c23);
                var d24 = e387.attributeData[h].location;
                if (r286.enableVertexAttribArray(d24), r286.vertexAttribPointer(d24, u45.size, u45.type || r286.FLOAT, u45.normalized, u45.stride, u45.start), u45.instance) {
                    if (!this.hasInstance) throw new Error("geometry error, GPU Instancing is not supported on this device");
                    r286.vertexAttribDivisor(d24, 1);
                }
            }
        }
    }, t417.prototype.draw = function(t, e388, r287, i215) {
        var n157 = this.gl, o124 = this._activeGeometry;
        if (o124.indexBuffer) {
            var s89 = o124.indexBuffer.data.BYTES_PER_ELEMENT, a72 = 2 === s89 ? n157.UNSIGNED_SHORT : n157.UNSIGNED_INT;
            2 === s89 || 4 === s89 && this.canUseUInt32ElementIndex ? o124.instanced ? n157.drawElementsInstanced(t, e388 || o124.indexBuffer.data.length, a72, (r287 || 0) * s89, i215 || 1) : n157.drawElements(t, e388 || o124.indexBuffer.data.length, a72, (r287 || 0) * s89) : console.warn("unsupported index buffer type: uint32");
        } else o124.instanced ? n157.drawArraysInstanced(t, r287, e388 || o124.getSize(), i215 || 1) : n157.drawArrays(t, r287, e388 || o124.getSize());
        return this;
    }, t417.prototype.unbind = function() {
        this.gl.bindVertexArray(null), this._activeVao = null, this._activeGeometry = null;
    }, t417.prototype.destroy = function() {
        this.renderer = null;
    }, t417;
}(), vn = function() {
    function t419(t) {
        void 0 === t && (t = null), this.type = ge.NONE, this.autoDetect = !0, this.maskObject = t || null, this.pooled = !1, this.isMaskData = !0, this.resolution = null, this.multisample = et.FILTER_MULTISAMPLE, this.enabled = !0, this._filters = null, this._stencilCounter = 0, this._scissorCounter = 0, this._scissorRect = null, this._scissorRectLocal = null, this._target = null;
    }
    return Object.defineProperty(t419.prototype, "filter", {
        get: function() {
            return this._filters ? this._filters[0] : null;
        },
        set: function(t) {
            t ? this._filters ? this._filters[0] = t : this._filters = [
                t
            ] : this._filters = null;
        },
        enumerable: !1,
        configurable: !0
    }), t419.prototype.reset = function() {
        this.pooled && (this.maskObject = null, this.type = ge.NONE, this.autoDetect = !0), this._target = null, this._scissorRectLocal = null;
    }, t419.prototype.copyCountersOrReset = function(t) {
        t ? (this._stencilCounter = t._stencilCounter, this._scissorCounter = t._scissorCounter, this._scissorRect = t._scissorRect) : (this._stencilCounter = 0, this._scissorCounter = 0, this._scissorRect = null);
    }, t419;
}();
function yn(t, e389, r288) {
    var i216 = t.createShader(e389);
    return t.shaderSource(i216, r288), t.compileShader(i216), i216;
}
function gn(t420, e390) {
    var r289 = t420.getShaderSource(e390).split("\n").map(function(t, e391) {
        return e391 + ": " + t;
    }), i217 = t420.getShaderInfoLog(e390), n158 = i217.split("\n"), o125 = {
    }, s90 = n158.map(function(t) {
        return parseFloat(t.replace(/^ERROR\: 0\:([\d]+)\:.*$/, "$1"));
    }).filter(function(t) {
        return !(!t || o125[t] || (o125[t] = !0, 0));
    }), a73 = [
        ""
    ];
    s90.forEach(function(t) {
        r289[t - 1] = "%c" + r289[t - 1] + "%c", a73.push("background: #FF0000; color:#FFFFFF; font-size: 10px", "font-size: 10px");
    });
    var h55 = r289.join("\n");
    a73[0] = h55, console.error(i217), console.groupCollapsed("click to view full shader code"), console.warn.apply(console, a73), console.groupEnd();
}
function En(t) {
    for(var e392 = new Array(t), r290 = 0; r290 < e392.length; r290++)e392[r290] = !1;
    return e392;
}
function Tn(t, e393) {
    switch(t){
        case "float":
            return 0;
        case "vec2":
            return new Float32Array(2 * e393);
        case "vec3":
            return new Float32Array(3 * e393);
        case "vec4":
            return new Float32Array(4 * e393);
        case "int":
        case "uint":
        case "sampler2D":
        case "sampler2DArray":
            return 0;
        case "ivec2":
            return new Int32Array(2 * e393);
        case "ivec3":
            return new Int32Array(3 * e393);
        case "ivec4":
            return new Int32Array(4 * e393);
        case "uvec2":
            return new Uint32Array(2 * e393);
        case "uvec3":
            return new Uint32Array(3 * e393);
        case "uvec4":
            return new Uint32Array(4 * e393);
        case "bool":
            return !1;
        case "bvec2":
            return En(2 * e393);
        case "bvec3":
            return En(3 * e393);
        case "bvec4":
            return En(4 * e393);
        case "mat2":
            return new Float32Array([
                1,
                0,
                0,
                1
            ]);
        case "mat3":
            return new Float32Array([
                1,
                0,
                0,
                0,
                1,
                0,
                0,
                0,
                1
            ]);
        case "mat4":
            return new Float32Array([
                1,
                0,
                0,
                0,
                0,
                1,
                0,
                0,
                0,
                0,
                1,
                0,
                0,
                0,
                0,
                1
            ]);
    }
    return null;
}
var bn, xn = {
}, Rn = xn;
function An() {
    if (Rn === xn || Rn && Rn.isContextLost()) {
        var t = document.createElement("canvas"), e394 = void 0;
        et.PREFER_ENV >= ie.WEBGL2 && (e394 = t.getContext("webgl2", {
        })), e394 || ((e394 = t.getContext("webgl", {
        }) || t.getContext("experimental-webgl", {
        })) ? e394.getExtension("WEBGL_draw_buffers") : e394 = null), Rn = e394;
    }
    return Rn;
}
function On(t, e395, r291) {
    if ("precision" !== t.substring(0, 9)) {
        var i218 = e395;
        return e395 === ye.HIGH && r291 !== ye.HIGH && (i218 = ye.MEDIUM), "precision " + i218 + " float;\n" + t;
    }
    return r291 !== ye.HIGH && "precision highp" === t.substring(0, 15) ? t.replace("precision highp", "precision mediump") : t;
}
var Sn = {
    float: 1,
    vec2: 2,
    vec3: 3,
    vec4: 4,
    int: 1,
    ivec2: 2,
    ivec3: 3,
    ivec4: 4,
    uint: 1,
    uvec2: 2,
    uvec3: 3,
    uvec4: 4,
    bool: 1,
    bvec2: 2,
    bvec3: 3,
    bvec4: 4,
    mat2: 4,
    mat3: 9,
    mat4: 16,
    sampler2D: 1
};
function In(t) {
    return Sn[t];
}
var Pn = null, Nn = {
    FLOAT: "float",
    FLOAT_VEC2: "vec2",
    FLOAT_VEC3: "vec3",
    FLOAT_VEC4: "vec4",
    INT: "int",
    INT_VEC2: "ivec2",
    INT_VEC3: "ivec3",
    INT_VEC4: "ivec4",
    UNSIGNED_INT: "uint",
    UNSIGNED_INT_VEC2: "uvec2",
    UNSIGNED_INT_VEC3: "uvec3",
    UNSIGNED_INT_VEC4: "uvec4",
    BOOL: "bool",
    BOOL_VEC2: "bvec2",
    BOOL_VEC3: "bvec3",
    BOOL_VEC4: "bvec4",
    FLOAT_MAT2: "mat2",
    FLOAT_MAT3: "mat3",
    FLOAT_MAT4: "mat4",
    SAMPLER_2D: "sampler2D",
    INT_SAMPLER_2D: "sampler2D",
    UNSIGNED_INT_SAMPLER_2D: "sampler2D",
    SAMPLER_CUBE: "samplerCube",
    INT_SAMPLER_CUBE: "samplerCube",
    UNSIGNED_INT_SAMPLER_CUBE: "samplerCube",
    SAMPLER_2D_ARRAY: "sampler2DArray",
    INT_SAMPLER_2D_ARRAY: "sampler2DArray",
    UNSIGNED_INT_SAMPLER_2D_ARRAY: "sampler2DArray"
};
function Mn(t, e) {
    if (!Pn) {
        var r292 = Object.keys(Nn);
        Pn = {
        };
        for(var i219 = 0; i219 < r292.length; ++i219){
            var n = r292[i219];
            Pn[t[n]] = Nn[n];
        }
    }
    return Pn[e];
}
var Dn, Cn = [
    {
        test: function(t) {
            return "float" === t.type && 1 === t.size;
        },
        code: function(t) {
            return '\n            if(uv["' + t + '"] !== ud["' + t + '"].value)\n            {\n                ud["' + t + '"].value = uv["' + t + '"]\n                gl.uniform1f(ud["' + t + '"].location, uv["' + t + '"])\n            }\n            ';
        }
    },
    {
        test: function(t) {
            return ("sampler2D" === t.type || "samplerCube" === t.type || "sampler2DArray" === t.type) && 1 === t.size && !t.isArray;
        },
        code: function(t) {
            return 't = syncData.textureCount++;\n\n            renderer.texture.bind(uv["' + t + '"], t);\n\n            if(ud["' + t + '"].value !== t)\n            {\n                ud["' + t + '"].value = t;\n                gl.uniform1i(ud["' + t + '"].location, t);\n; // eslint-disable-line max-len\n            }';
        }
    },
    {
        test: function(t, e396) {
            return "mat3" === t.type && 1 === t.size && void 0 !== e396.a;
        },
        code: function(t) {
            return '\n            gl.uniformMatrix3fv(ud["' + t + '"].location, false, uv["' + t + '"].toArray(true));\n            ';
        },
        codeUbo: function(t) {
            return "\n                var " + t + "_matrix = uv." + t + ".toArray(true);\n\n                data[offset] = " + t + "_matrix[0];\n                data[offset+1] = " + t + "_matrix[1];\n                data[offset+2] = " + t + "_matrix[2];\n        \n                data[offset + 4] = " + t + "_matrix[3];\n                data[offset + 5] = " + t + "_matrix[4];\n                data[offset + 6] = " + t + "_matrix[5];\n        \n                data[offset + 8] = " + t + "_matrix[6];\n                data[offset + 9] = " + t + "_matrix[7];\n                data[offset + 10] = " + t + "_matrix[8];\n            ";
        }
    },
    {
        test: function(t, e397) {
            return "vec2" === t.type && 1 === t.size && void 0 !== e397.x;
        },
        code: function(t) {
            return '\n                cv = ud["' + t + '"].value;\n                v = uv["' + t + '"];\n\n                if(cv[0] !== v.x || cv[1] !== v.y)\n                {\n                    cv[0] = v.x;\n                    cv[1] = v.y;\n                    gl.uniform2f(ud["' + t + '"].location, v.x, v.y);\n                }';
        },
        codeUbo: function(t) {
            return "\n                v = uv." + t + ";\n\n                data[offset] = v.x;\n                data[offset+1] = v.y;\n            ";
        }
    },
    {
        test: function(t) {
            return "vec2" === t.type && 1 === t.size;
        },
        code: function(t) {
            return '\n                cv = ud["' + t + '"].value;\n                v = uv["' + t + '"];\n\n                if(cv[0] !== v[0] || cv[1] !== v[1])\n                {\n                    cv[0] = v[0];\n                    cv[1] = v[1];\n                    gl.uniform2f(ud["' + t + '"].location, v[0], v[1]);\n                }\n            ';
        }
    },
    {
        test: function(t, e398) {
            return "vec4" === t.type && 1 === t.size && void 0 !== e398.width;
        },
        code: function(t) {
            return '\n                cv = ud["' + t + '"].value;\n                v = uv["' + t + '"];\n\n                if(cv[0] !== v.x || cv[1] !== v.y || cv[2] !== v.width || cv[3] !== v.height)\n                {\n                    cv[0] = v.x;\n                    cv[1] = v.y;\n                    cv[2] = v.width;\n                    cv[3] = v.height;\n                    gl.uniform4f(ud["' + t + '"].location, v.x, v.y, v.width, v.height)\n                }';
        },
        codeUbo: function(t) {
            return "\n                    v = uv." + t + ";\n\n                    data[offset] = v.x;\n                    data[offset+1] = v.y;\n                    data[offset+2] = v.width;\n                    data[offset+3] = v.height;\n                ";
        }
    },
    {
        test: function(t) {
            return "vec4" === t.type && 1 === t.size;
        },
        code: function(t) {
            return '\n                cv = ud["' + t + '"].value;\n                v = uv["' + t + '"];\n\n                if(cv[0] !== v[0] || cv[1] !== v[1] || cv[2] !== v[2] || cv[3] !== v[3])\n                {\n                    cv[0] = v[0];\n                    cv[1] = v[1];\n                    cv[2] = v[2];\n                    cv[3] = v[3];\n\n                    gl.uniform4f(ud["' + t + '"].location, v[0], v[1], v[2], v[3])\n                }';
        }
    }
], wn = {
    float: "\n    if (cv !== v)\n    {\n        cu.value = v;\n        gl.uniform1f(location, v);\n    }",
    vec2: "\n    if (cv[0] !== v[0] || cv[1] !== v[1])\n    {\n        cv[0] = v[0];\n        cv[1] = v[1];\n\n        gl.uniform2f(location, v[0], v[1])\n    }",
    vec3: "\n    if (cv[0] !== v[0] || cv[1] !== v[1] || cv[2] !== v[2])\n    {\n        cv[0] = v[0];\n        cv[1] = v[1];\n        cv[2] = v[2];\n\n        gl.uniform3f(location, v[0], v[1], v[2])\n    }",
    vec4: "\n    if (cv[0] !== v[0] || cv[1] !== v[1] || cv[2] !== v[2] || cv[3] !== v[3])\n    {\n        cv[0] = v[0];\n        cv[1] = v[1];\n        cv[2] = v[2];\n        cv[3] = v[3];\n\n        gl.uniform4f(location, v[0], v[1], v[2], v[3]);\n    }",
    int: "\n    if (cv !== v)\n    {\n        cu.value = v;\n\n        gl.uniform1i(location, v);\n    }",
    ivec2: "\n    if (cv[0] !== v[0] || cv[1] !== v[1])\n    {\n        cv[0] = v[0];\n        cv[1] = v[1];\n\n        gl.uniform2i(location, v[0], v[1]);\n    }",
    ivec3: "\n    if (cv[0] !== v[0] || cv[1] !== v[1] || cv[2] !== v[2])\n    {\n        cv[0] = v[0];\n        cv[1] = v[1];\n        cv[2] = v[2];\n\n        gl.uniform3i(location, v[0], v[1], v[2]);\n    }",
    ivec4: "\n    if (cv[0] !== v[0] || cv[1] !== v[1] || cv[2] !== v[2] || cv[3] !== v[3])\n    {\n        cv[0] = v[0];\n        cv[1] = v[1];\n        cv[2] = v[2];\n        cv[3] = v[3];\n\n        gl.uniform4i(location, v[0], v[1], v[2], v[3]);\n    }",
    uint: "\n    if (cv !== v)\n    {\n        cu.value = v;\n\n        gl.uniform1ui(location, v);\n    }",
    uvec2: "\n    if (cv[0] !== v[0] || cv[1] !== v[1])\n    {\n        cv[0] = v[0];\n        cv[1] = v[1];\n\n        gl.uniform2ui(location, v[0], v[1]);\n    }",
    uvec3: "\n    if (cv[0] !== v[0] || cv[1] !== v[1] || cv[2] !== v[2])\n    {\n        cv[0] = v[0];\n        cv[1] = v[1];\n        cv[2] = v[2];\n\n        gl.uniform3ui(location, v[0], v[1], v[2]);\n    }",
    uvec4: "\n    if (cv[0] !== v[0] || cv[1] !== v[1] || cv[2] !== v[2] || cv[3] !== v[3])\n    {\n        cv[0] = v[0];\n        cv[1] = v[1];\n        cv[2] = v[2];\n        cv[3] = v[3];\n\n        gl.uniform4ui(location, v[0], v[1], v[2], v[3]);\n    }",
    bool: "\n    if (cv !== v)\n    {\n        cu.value = v;\n        gl.uniform1i(location, v);\n    }",
    bvec2: "\n    if (cv[0] != v[0] || cv[1] != v[1])\n    {\n        cv[0] = v[0];\n        cv[1] = v[1];\n\n        gl.uniform2i(location, v[0], v[1]);\n    }",
    bvec3: "\n    if (cv[0] !== v[0] || cv[1] !== v[1] || cv[2] !== v[2])\n    {\n        cv[0] = v[0];\n        cv[1] = v[1];\n        cv[2] = v[2];\n\n        gl.uniform3i(location, v[0], v[1], v[2]);\n    }",
    bvec4: "\n    if (cv[0] !== v[0] || cv[1] !== v[1] || cv[2] !== v[2] || cv[3] !== v[3])\n    {\n        cv[0] = v[0];\n        cv[1] = v[1];\n        cv[2] = v[2];\n        cv[3] = v[3];\n\n        gl.uniform4i(location, v[0], v[1], v[2], v[3]);\n    }",
    mat2: "gl.uniformMatrix2fv(location, false, v)",
    mat3: "gl.uniformMatrix3fv(location, false, v)",
    mat4: "gl.uniformMatrix4fv(location, false, v)",
    sampler2D: "gl.uniform1i(location, v)",
    samplerCube: "gl.uniform1i(location, v)",
    sampler2DArray: "gl.uniform1i(location, v)"
}, Ln = {
    float: "gl.uniform1fv(location, v)",
    vec2: "gl.uniform2fv(location, v)",
    vec3: "gl.uniform3fv(location, v)",
    vec4: "gl.uniform4fv(location, v)",
    mat4: "gl.uniformMatrix4fv(location, false, v)",
    mat3: "gl.uniformMatrix3fv(location, false, v)",
    mat2: "gl.uniformMatrix2fv(location, false, v)",
    int: "gl.uniform1iv(location, v)",
    ivec2: "gl.uniform2iv(location, v)",
    ivec3: "gl.uniform3iv(location, v)",
    ivec4: "gl.uniform4iv(location, v)",
    uint: "gl.uniform1uiv(location, v)",
    uvec2: "gl.uniform2uiv(location, v)",
    uvec3: "gl.uniform3uiv(location, v)",
    uvec4: "gl.uniform4uiv(location, v)",
    bool: "gl.uniform1iv(location, v)",
    bvec2: "gl.uniform2iv(location, v)",
    bvec3: "gl.uniform3iv(location, v)",
    bvec4: "gl.uniform4iv(location, v)",
    sampler2D: "gl.uniform1iv(location, v)",
    samplerCube: "gl.uniform1iv(location, v)",
    sampler2DArray: "gl.uniform1iv(location, v)"
}, Fn = [
    "precision mediump float;",
    "void main(void){",
    "float test = 0.1;",
    "%forloop%",
    "gl_FragColor = vec4(0.0);",
    "}"
].join("\n");
function Un(t) {
    for(var e399 = "", r293 = 0; r293 < t; ++r293)r293 > 0 && (e399 += "\nelse "), r293 < t - 1 && (e399 += "if(test == " + r293 + ".0){}");
    return e399;
}
function Gn(t, e400) {
    if (0 === t) throw new Error("Invalid value of `0` passed to `checkMaxIfStatementsInShader`");
    for(var r294 = e400.createShader(e400.FRAGMENT_SHADER);;){
        var i220 = Fn.replace(/%forloop%/gi, Un(t));
        if (e400.shaderSource(r294, i220), e400.compileShader(r294), e400.getShaderParameter(r294, e400.COMPILE_STATUS)) break;
        t = t / 2 | 0;
    }
    return t;
}
var Bn = 0, Xn = {
}, kn = function() {
    function t421(e401, r295, i221) {
        void 0 === i221 && (i221 = "pixi-shader"), this.id = Bn++, this.vertexSrc = e401 || t421.defaultVertexSrc, this.fragmentSrc = r295 || t421.defaultFragmentSrc, this.vertexSrc = this.vertexSrc.trim(), this.fragmentSrc = this.fragmentSrc.trim(), "#version" !== this.vertexSrc.substring(0, 8) && (i221 = i221.replace(/\s+/g, "-"), Xn[i221] ? (Xn[i221]++, i221 += "-" + Xn[i221]) : Xn[i221] = 1, this.vertexSrc = "#define SHADER_NAME " + i221 + "\n" + this.vertexSrc, this.fragmentSrc = "#define SHADER_NAME " + i221 + "\n" + this.fragmentSrc, this.vertexSrc = On(this.vertexSrc, et.PRECISION_VERTEX, ye.HIGH), this.fragmentSrc = On(this.fragmentSrc, et.PRECISION_FRAGMENT, function() {
            if (!bn) {
                bn = ye.MEDIUM;
                var t = An();
                if (t && t.getShaderPrecisionFormat) {
                    var e402 = t.getShaderPrecisionFormat(t.FRAGMENT_SHADER, t.HIGH_FLOAT);
                    bn = e402.precision ? ye.HIGH : ye.MEDIUM;
                }
            }
            return bn;
        }())), this.glPrograms = {
        }, this.syncUniforms = null;
    }
    return Object.defineProperty(t421, "defaultVertexSrc", {
        get: function() {
            return "attribute vec2 aVertexPosition;\nattribute vec2 aTextureCoord;\n\nuniform mat3 projectionMatrix;\n\nvarying vec2 vTextureCoord;\n\nvoid main(void){\n   gl_Position = vec4((projectionMatrix * vec3(aVertexPosition, 1.0)).xy, 0.0, 1.0);\n   vTextureCoord = aTextureCoord;\n}\n";
        },
        enumerable: !1,
        configurable: !0
    }), Object.defineProperty(t421, "defaultFragmentSrc", {
        get: function() {
            return "varying vec2 vTextureCoord;\n\nuniform sampler2D uSampler;\n\nvoid main(void){\n   gl_FragColor *= texture2D(uSampler, vTextureCoord);\n}";
        },
        enumerable: !1,
        configurable: !0
    }), t421.from = function(e403, r296, i222) {
        var n = e403 + r296, o126 = qe[n];
        return o126 || (qe[n] = o126 = new t421(e403, r296, i222)), o126;
    }, t421;
}(), Hn = function() {
    function t422(t, e404) {
        this.uniformBindCount = 0, this.program = t, this.uniformGroup = e404 ? e404 instanceof rn ? e404 : new rn(e404) : new rn({
        });
    }
    return t422.prototype.checkUniformExists = function(t, e405) {
        if (e405.uniforms[t]) return !0;
        for(var r in e405.uniforms){
            var i223 = e405.uniforms[r];
            if (i223.group && this.checkUniformExists(t, i223)) return !0;
        }
        return !1;
    }, t422.prototype.destroy = function() {
        this.uniformGroup = null;
    }, Object.defineProperty(t422.prototype, "uniforms", {
        get: function() {
            return this.uniformGroup.uniforms;
        },
        enumerable: !1,
        configurable: !0
    }), t422.from = function(e406, r297, i224) {
        return new t422(kn.from(e406, r297), i224);
    }, t422;
}(), jn = function() {
    function t423() {
        this.data = 0, this.blendMode = se.NORMAL, this.polygonOffset = 0, this.blend = !0, this.depthMask = !0;
    }
    return Object.defineProperty(t423.prototype, "blend", {
        get: function() {
            return !!(1 & this.data);
        },
        set: function(t) {
            !!(1 & this.data) !== t && (this.data ^= 1);
        },
        enumerable: !1,
        configurable: !0
    }), Object.defineProperty(t423.prototype, "offsets", {
        get: function() {
            return !!(2 & this.data);
        },
        set: function(t) {
            !!(2 & this.data) !== t && (this.data ^= 2);
        },
        enumerable: !1,
        configurable: !0
    }), Object.defineProperty(t423.prototype, "culling", {
        get: function() {
            return !!(4 & this.data);
        },
        set: function(t) {
            !!(4 & this.data) !== t && (this.data ^= 4);
        },
        enumerable: !1,
        configurable: !0
    }), Object.defineProperty(t423.prototype, "depthTest", {
        get: function() {
            return !!(8 & this.data);
        },
        set: function(t) {
            !!(8 & this.data) !== t && (this.data ^= 8);
        },
        enumerable: !1,
        configurable: !0
    }), Object.defineProperty(t423.prototype, "depthMask", {
        get: function() {
            return !!(32 & this.data);
        },
        set: function(t) {
            !!(32 & this.data) !== t && (this.data ^= 32);
        },
        enumerable: !1,
        configurable: !0
    }), Object.defineProperty(t423.prototype, "clockwiseFrontFace", {
        get: function() {
            return !!(16 & this.data);
        },
        set: function(t) {
            !!(16 & this.data) !== t && (this.data ^= 16);
        },
        enumerable: !1,
        configurable: !0
    }), Object.defineProperty(t423.prototype, "blendMode", {
        get: function() {
            return this._blendMode;
        },
        set: function(t) {
            this.blend = t !== se.NONE, this._blendMode = t;
        },
        enumerable: !1,
        configurable: !0
    }), Object.defineProperty(t423.prototype, "polygonOffset", {
        get: function() {
            return this._polygonOffset;
        },
        set: function(t) {
            this.offsets = !!t, this._polygonOffset = t;
        },
        enumerable: !1,
        configurable: !0
    }), t423.for2d = function() {
        var e407 = new t423;
        return e407.depthTest = !1, e407.blend = !0, e407;
    }, t423;
}(), Yn = function(t424) {
    function e408(r298, i225, n159) {
        var o127 = this, s91 = kn.from(r298 || e408.defaultVertexSrc, i225 || e408.defaultFragmentSrc);
        return (o127 = t424.call(this, s91, n159) || this).padding = 0, o127.resolution = et.FILTER_RESOLUTION, o127.multisample = et.FILTER_MULTISAMPLE, o127.enabled = !0, o127.autoFit = !0, o127.state = new jn, o127;
    }
    return Ei(e408, t424), e408.prototype.apply = function(t, e409, r299, i226, n) {
        t.applyFilter(this, e409, r299, i226);
    }, Object.defineProperty(e408.prototype, "blendMode", {
        get: function() {
            return this.state.blendMode;
        },
        set: function(t) {
            this.state.blendMode = t;
        },
        enumerable: !1,
        configurable: !0
    }), Object.defineProperty(e408.prototype, "resolution", {
        get: function() {
            return this._resolution;
        },
        set: function(t) {
            this._resolution = t;
        },
        enumerable: !1,
        configurable: !0
    }), Object.defineProperty(e408, "defaultVertexSrc", {
        get: function() {
            return "attribute vec2 aVertexPosition;\n\nuniform mat3 projectionMatrix;\n\nvarying vec2 vTextureCoord;\n\nuniform vec4 inputSize;\nuniform vec4 outputFrame;\n\nvec4 filterVertexPosition( void )\n{\n    vec2 position = aVertexPosition * max(outputFrame.zw, vec2(0.)) + outputFrame.xy;\n\n    return vec4((projectionMatrix * vec3(position, 1.0)).xy, 0.0, 1.0);\n}\n\nvec2 filterTextureCoord( void )\n{\n    return aVertexPosition * (outputFrame.zw * inputSize.zw);\n}\n\nvoid main(void)\n{\n    gl_Position = filterVertexPosition();\n    vTextureCoord = filterTextureCoord();\n}\n";
        },
        enumerable: !1,
        configurable: !0
    }), Object.defineProperty(e408, "defaultFragmentSrc", {
        get: function() {
            return "varying vec2 vTextureCoord;\n\nuniform sampler2D uSampler;\n\nvoid main(void){\n   gl_FragColor = texture2D(uSampler, vTextureCoord);\n}\n";
        },
        enumerable: !1,
        configurable: !0
    }), e408;
}(Hn), Vn = "attribute vec2 aVertexPosition;\nattribute vec2 aTextureCoord;\n\nuniform mat3 projectionMatrix;\nuniform mat3 otherMatrix;\n\nvarying vec2 vMaskCoord;\nvarying vec2 vTextureCoord;\n\nvoid main(void)\n{\n    gl_Position = vec4((projectionMatrix * vec3(aVertexPosition, 1.0)).xy, 0.0, 1.0);\n\n    vTextureCoord = aTextureCoord;\n    vMaskCoord = ( otherMatrix * vec3( aTextureCoord, 1.0)  ).xy;\n}\n", Wn = "varying vec2 vMaskCoord;\nvarying vec2 vTextureCoord;\n\nuniform sampler2D uSampler;\nuniform sampler2D mask;\nuniform float alpha;\nuniform float npmAlpha;\nuniform vec4 maskClamp;\n\nvoid main(void)\n{\n    float clip = step(3.5,\n        step(maskClamp.x, vMaskCoord.x) +\n        step(maskClamp.y, vMaskCoord.y) +\n        step(vMaskCoord.x, maskClamp.z) +\n        step(vMaskCoord.y, maskClamp.w));\n\n    vec4 original = texture2D(uSampler, vTextureCoord);\n    vec4 masky = texture2D(mask, vMaskCoord);\n    float alphaMul = 1.0 - npmAlpha * (1.0 - masky.a);\n\n    original *= (alphaMul * masky.r * alpha * clip);\n\n    gl_FragColor = original;\n}\n", zn = new _r, qn = function() {
    function t425(t, e410) {
        this._texture = t, this.mapCoord = new _r, this.uClampFrame = new Float32Array(4), this.uClampOffset = new Float32Array(2), this._textureID = -1, this._updateID = 0, this.clampOffset = 0, this.clampMargin = void 0 === e410 ? 0.5 : e410, this.isSimple = !1;
    }
    return Object.defineProperty(t425.prototype, "texture", {
        get: function() {
            return this._texture;
        },
        set: function(t) {
            this._texture = t, this._textureID = -1;
        },
        enumerable: !1,
        configurable: !0
    }), t425.prototype.multiplyUvs = function(t, e411) {
        void 0 === e411 && (e411 = t);
        for(var r300 = this.mapCoord, i227 = 0; i227 < t.length; i227 += 2){
            var n160 = t[i227], o128 = t[i227 + 1];
            e411[i227] = n160 * r300.a + o128 * r300.c + r300.tx, e411[i227 + 1] = n160 * r300.b + o128 * r300.d + r300.ty;
        }
        return e411;
    }, t425.prototype.update = function(t) {
        var e412 = this._texture;
        if (!e412 || !e412.valid) return !1;
        if (!t && this._textureID === e412._updateID) return !1;
        this._textureID = e412._updateID, this._updateID++;
        var r301 = e412._uvs;
        this.mapCoord.set(r301.x1 - r301.x0, r301.y1 - r301.y0, r301.x3 - r301.x0, r301.y3 - r301.y0, r301.x0, r301.y0);
        var i228 = e412.orig, n161 = e412.trim;
        n161 && (zn.set(i228.width / n161.width, 0, 0, i228.height / n161.height, -n161.x / n161.width, -n161.y / n161.height), this.mapCoord.append(zn));
        var o129 = e412.baseTexture, s92 = this.uClampFrame, a74 = this.clampMargin / o129.resolution, h56 = this.clampOffset;
        return s92[0] = (e412._frame.x + a74 + h56) / o129.width, s92[1] = (e412._frame.y + a74 + h56) / o129.height, s92[2] = (e412._frame.x + e412._frame.width - a74 + h56) / o129.width, s92[3] = (e412._frame.y + e412._frame.height - a74 + h56) / o129.height, this.uClampOffset[0] = h56 / o129.realWidth, this.uClampOffset[1] = h56 / o129.realHeight, this.isSimple = e412._frame.width === o129.width && e412._frame.height === o129.height && 0 === e412.rotate, !0;
    }, t425;
}(), Kn = function(t426) {
    function e413(e414, r302, i229) {
        var n162 = this, o130 = null;
        return "string" != typeof e414 && void 0 === r302 && void 0 === i229 && (o130 = e414, e414 = void 0, r302 = void 0, i229 = void 0), (n162 = t426.call(this, e414 || Vn, r302 || Wn, i229) || this).maskSprite = o130, n162.maskMatrix = new _r, n162;
    }
    return Ei(e413, t426), Object.defineProperty(e413.prototype, "maskSprite", {
        get: function() {
            return this._maskSprite;
        },
        set: function(t) {
            this._maskSprite = t, this._maskSprite && (this._maskSprite.renderable = !1);
        },
        enumerable: !1,
        configurable: !0
    }), e413.prototype.apply = function(t, e415, r303, i230) {
        var n163 = this._maskSprite, o131 = n163._texture;
        o131.valid && (o131.uvMatrix || (o131.uvMatrix = new qn(o131, 0)), o131.uvMatrix.update(), this.uniforms.npmAlpha = o131.baseTexture.alphaMode ? 0 : 1, this.uniforms.mask = o131, this.uniforms.otherMatrix = t.calculateSpriteMatrix(this.maskMatrix, n163).prepend(o131.uvMatrix.mapCoord), this.uniforms.alpha = n163.worldAlpha, this.uniforms.maskClamp = o131.uvMatrix.uClampFrame, t.applyFilter(this, e415, r303, i230));
    }, e413;
}(Yn), Zn = function() {
    function t427(t) {
        this.renderer = t, this.enableScissor = !0, this.alphaMaskPool = [], this.maskDataPool = [], this.maskStack = [], this.alphaMaskIndex = 0;
    }
    return t427.prototype.setMaskStack = function(t) {
        this.maskStack = t, this.renderer.scissor.setMaskStack(t), this.renderer.stencil.setMaskStack(t);
    }, t427.prototype.push = function(t, e416) {
        var r304 = e416;
        if (!r304.isMaskData) {
            var i231 = this.maskDataPool.pop() || new vn;
            i231.pooled = !0, i231.maskObject = e416, r304 = i231;
        }
        var n164 = 0 !== this.maskStack.length ? this.maskStack[this.maskStack.length - 1] : null;
        if (r304.copyCountersOrReset(n164), r304.autoDetect && this.detect(r304), r304._target = t, r304.type !== ge.SPRITE && this.maskStack.push(r304), r304.enabled) switch(r304.type){
            case ge.SCISSOR:
                this.renderer.scissor.push(r304);
                break;
            case ge.STENCIL:
                this.renderer.stencil.push(r304);
                break;
            case ge.SPRITE:
                r304.copyCountersOrReset(null), this.pushSpriteMask(r304);
        }
        r304.type === ge.SPRITE && this.maskStack.push(r304);
    }, t427.prototype.pop = function(t) {
        var e417 = this.maskStack.pop();
        if (e417 && e417._target === t) {
            if (e417.enabled) switch(e417.type){
                case ge.SCISSOR:
                    this.renderer.scissor.pop();
                    break;
                case ge.STENCIL:
                    this.renderer.stencil.pop(e417.maskObject);
                    break;
                case ge.SPRITE:
                    this.popSpriteMask(e417);
            }
            if (e417.reset(), e417.pooled && this.maskDataPool.push(e417), 0 !== this.maskStack.length) {
                var r305 = this.maskStack[this.maskStack.length - 1];
                r305.type === ge.SPRITE && r305._filters && (r305._filters[0].maskSprite = r305.maskObject);
            }
        }
    }, t427.prototype.detect = function(t) {
        t.maskObject.isSprite ? t.type = ge.SPRITE : this.enableScissor && this.renderer.scissor.testScissor(t) ? t.type = ge.SCISSOR : t.type = ge.STENCIL;
    }, t427.prototype.pushSpriteMask = function(t) {
        var e418, r306, i232 = t.maskObject, n165 = t._target, o132 = t._filters;
        o132 || (o132 = this.alphaMaskPool[this.alphaMaskIndex]) || (o132 = this.alphaMaskPool[this.alphaMaskIndex] = [
            new Kn
        ]);
        var s93, a75, h57 = this.renderer, u46 = h57.renderTexture;
        if (u46.current) {
            var l34 = u46.current;
            s93 = t.resolution || l34.resolution, a75 = null !== (e418 = t.multisample) && void 0 !== e418 ? e418 : l34.multisample;
        } else s93 = t.resolution || h57.resolution, a75 = null !== (r306 = t.multisample) && void 0 !== r306 ? r306 : h57.multisample;
        o132[0].resolution = s93, o132[0].multisample = a75, o132[0].maskSprite = i232;
        var c24 = n165.filterArea;
        n165.filterArea = i232.getBounds(!0), h57.filter.push(n165, o132), n165.filterArea = c24, t._filters || this.alphaMaskIndex++;
    }, t427.prototype.popSpriteMask = function(t) {
        this.renderer.filter.pop(), t._filters ? t._filters[0].maskSprite = null : (this.alphaMaskIndex--, this.alphaMaskPool[this.alphaMaskIndex][0].maskSprite = null);
    }, t427.prototype.destroy = function() {
        this.renderer = null;
    }, t427;
}(), Jn = function() {
    function t428(t) {
        this.renderer = t, this.maskStack = [], this.glConst = 0;
    }
    return t428.prototype.getStackLength = function() {
        return this.maskStack.length;
    }, t428.prototype.setMaskStack = function(t) {
        var e419 = this.renderer.gl, r307 = this.getStackLength();
        this.maskStack = t;
        var i233 = this.getStackLength();
        i233 !== r307 && (0 === i233 ? e419.disable(this.glConst) : (e419.enable(this.glConst), this._useCurrent()));
    }, t428.prototype._useCurrent = function() {
    }, t428.prototype.destroy = function() {
        this.renderer = null, this.maskStack = null;
    }, t428;
}(), Qn = new _r, $n = function(t429) {
    function e420(e421) {
        var r308 = t429.call(this, e421) || this;
        return r308.glConst = WebGLRenderingContext.SCISSOR_TEST, r308;
    }
    return Ei(e420, t429), e420.prototype.getStackLength = function() {
        var t = this.maskStack[this.maskStack.length - 1];
        return t ? t._scissorCounter : 0;
    }, e420.prototype.calcScissorRect = function(t) {
        if (!t._scissorRectLocal) {
            var e422 = t._scissorRect, r309 = t.maskObject, i234 = this.renderer, n166 = i234.renderTexture;
            r309.renderable = !0;
            var o133 = r309.getBounds();
            this.roundFrameToPixels(o133, n166.current ? n166.current.resolution : i234.resolution, n166.sourceFrame, n166.destinationFrame, i234.projection.transform), r309.renderable = !1, e422 && o133.fit(e422), t._scissorRectLocal = o133;
        }
    }, e420.isMatrixRotated = function(t) {
        if (!t) return !1;
        var e423 = t.a, r310 = t.b, i235 = t.c, n167 = t.d;
        return (Math.abs(r310) > 0.0001 || Math.abs(i235) > 0.0001) && (Math.abs(e423) > 0.0001 || Math.abs(n167) > 0.0001);
    }, e420.prototype.testScissor = function(t) {
        var r311 = t.maskObject;
        if (!r311.isFastRect || !r311.isFastRect()) return !1;
        if (e420.isMatrixRotated(r311.worldTransform)) return !1;
        if (e420.isMatrixRotated(this.renderer.projection.transform)) return !1;
        this.calcScissorRect(t);
        var i236 = t._scissorRectLocal;
        return i236.width > 0 && i236.height > 0;
    }, e420.prototype.roundFrameToPixels = function(t, r312, i237, n168, o134) {
        e420.isMatrixRotated(o134) || ((o134 = o134 ? Qn.copyFrom(o134) : Qn.identity()).translate(-i237.x, -i237.y).scale(n168.width / i237.width, n168.height / i237.height).translate(n168.x, n168.y), this.renderer.filter.transformAABB(o134, t), t.fit(n168), t.x = Math.round(t.x * r312), t.y = Math.round(t.y * r312), t.width = Math.round(t.width * r312), t.height = Math.round(t.height * r312));
    }, e420.prototype.push = function(t) {
        t._scissorRectLocal || this.calcScissorRect(t);
        var e424 = this.renderer.gl;
        t._scissorRect || e424.enable(e424.SCISSOR_TEST), t._scissorCounter++, t._scissorRect = t._scissorRectLocal, this._useCurrent();
    }, e420.prototype.pop = function() {
        var t = this.renderer.gl;
        this.getStackLength() > 0 ? this._useCurrent() : t.disable(t.SCISSOR_TEST);
    }, e420.prototype._useCurrent = function() {
        var t, e425 = this.maskStack[this.maskStack.length - 1]._scissorRect;
        t = this.renderer.renderTexture.current ? e425.y : this.renderer.height - e425.height - e425.y, this.renderer.gl.scissor(e425.x, t, e425.width, e425.height);
    }, e420;
}(Jn), to = function(t430) {
    function e426(e427) {
        var r313 = t430.call(this, e427) || this;
        return r313.glConst = WebGLRenderingContext.STENCIL_TEST, r313;
    }
    return Ei(e426, t430), e426.prototype.getStackLength = function() {
        var t = this.maskStack[this.maskStack.length - 1];
        return t ? t._stencilCounter : 0;
    }, e426.prototype.push = function(t) {
        var e428 = t.maskObject, r314 = this.renderer.gl, i238 = t._stencilCounter;
        0 === i238 && (this.renderer.framebuffer.forceStencil(), r314.enable(r314.STENCIL_TEST)), t._stencilCounter++, r314.colorMask(!1, !1, !1, !1), r314.stencilFunc(r314.EQUAL, i238, 4294967295), r314.stencilOp(r314.KEEP, r314.KEEP, r314.INCR), e428.renderable = !0, e428.render(this.renderer), this.renderer.batch.flush(), e428.renderable = !1, this._useCurrent();
    }, e426.prototype.pop = function(t) {
        var e429 = this.renderer.gl;
        0 === this.getStackLength() ? (e429.disable(e429.STENCIL_TEST), e429.clearStencil(0), e429.clear(e429.STENCIL_BUFFER_BIT)) : (e429.colorMask(!1, !1, !1, !1), e429.stencilOp(e429.KEEP, e429.KEEP, e429.DECR), t.renderable = !0, t.render(this.renderer), this.renderer.batch.flush(), t.renderable = !1, this._useCurrent());
    }, e426.prototype._useCurrent = function() {
        var t = this.renderer.gl;
        t.colorMask(!0, !0, !0, !0), t.stencilFunc(t.EQUAL, this.getStackLength(), 4294967295), t.stencilOp(t.KEEP, t.KEEP, t.KEEP);
    }, e426;
}(Jn), eo = function() {
    function t431(t) {
        this.renderer = t, this.destinationFrame = null, this.sourceFrame = null, this.defaultFrame = null, this.projectionMatrix = new _r, this.transform = null;
    }
    return t431.prototype.update = function(t, e430, r315, i239) {
        this.destinationFrame = t || this.destinationFrame || this.defaultFrame, this.sourceFrame = e430 || this.sourceFrame || t, this.calculateProjection(this.destinationFrame, this.sourceFrame, r315, i239), this.transform && this.projectionMatrix.append(this.transform);
        var n169 = this.renderer;
        n169.globalUniforms.uniforms.projectionMatrix = this.projectionMatrix, n169.globalUniforms.update(), n169.shader.shader && n169.shader.syncUniformGroup(n169.shader.shader.uniforms.globals);
    }, t431.prototype.calculateProjection = function(t, e431, r, i240) {
        var n170 = this.projectionMatrix, o135 = i240 ? -1 : 1;
        n170.identity(), n170.a = 1 / e431.width * 2, n170.d = o135 * (1 / e431.height * 2), n170.tx = -1 - e431.x * n170.a, n170.ty = -o135 - e431.y * n170.d;
    }, t431.prototype.setTransform = function(t) {
    }, t431.prototype.destroy = function() {
        this.renderer = null;
    }, t431;
}(), ro = new hr, io = new hr, no = function() {
    function t432(t) {
        this.renderer = t, this.clearColor = t._backgroundColorRgba, this.defaultMaskStack = [], this.current = null, this.sourceFrame = new hr, this.destinationFrame = new hr, this.viewportFrame = new hr;
    }
    return t432.prototype.bind = function(t, e432, r316) {
        void 0 === t && (t = null);
        var i241, n171, o136, s94 = this.renderer;
        this.current = t, t ? (o136 = (i241 = t.baseTexture).resolution, e432 || (ro.width = t.frame.width, ro.height = t.frame.height, e432 = ro), r316 || (io.x = t.frame.x, io.y = t.frame.y, io.width = e432.width, io.height = e432.height, r316 = io), n171 = i241.framebuffer) : (o136 = s94.resolution, e432 || (ro.width = s94.screen.width, ro.height = s94.screen.height, e432 = ro), r316 || ((r316 = ro).width = e432.width, r316.height = e432.height));
        var a76 = this.viewportFrame;
        a76.x = r316.x * o136, a76.y = r316.y * o136, a76.width = r316.width * o136, a76.height = r316.height * o136, t || (a76.y = s94.view.height - (a76.y + a76.height)), a76.ceil(), this.renderer.framebuffer.bind(n171, a76), this.renderer.projection.update(r316, e432, o136, !n171), t ? this.renderer.mask.setMaskStack(i241.maskStack) : this.renderer.mask.setMaskStack(this.defaultMaskStack), this.sourceFrame.copyFrom(e432), this.destinationFrame.copyFrom(r316);
    }, t432.prototype.clear = function(t, e433) {
        t = this.current ? t || this.current.baseTexture.clearColor : t || this.clearColor;
        var r317 = this.destinationFrame, i242 = this.current ? this.current.baseTexture : this.renderer.screen, n172 = r317.width !== i242.width || r317.height !== i242.height;
        if (n172) {
            var o137 = this.viewportFrame, s95 = o137.x, a77 = o137.y, h58 = o137.width, u47 = o137.height;
            s95 = Math.round(s95), a77 = Math.round(a77), h58 = Math.round(h58), u47 = Math.round(u47), this.renderer.gl.enable(this.renderer.gl.SCISSOR_TEST), this.renderer.gl.scissor(s95, a77, h58, u47);
        }
        this.renderer.framebuffer.clear(t[0], t[1], t[2], t[3], e433), n172 && this.renderer.scissor.pop();
    }, t432.prototype.resize = function() {
        this.bind(null);
    }, t432.prototype.reset = function() {
        this.bind(null);
    }, t432.prototype.destroy = function() {
        this.renderer = null;
    }, t432;
}();
function oo(t, e, r318, i, n173) {
    r318.buffer.update(n173);
}
var so = {
    float: "\n        data[offset] = v;\n    ",
    vec2: "\n        data[offset] = v[0];\n        data[offset+1] = v[1];\n    ",
    vec3: "\n        data[offset] = v[0];\n        data[offset+1] = v[1];\n        data[offset+2] = v[2];\n\n    ",
    vec4: "\n        data[offset] = v[0];\n        data[offset+1] = v[1];\n        data[offset+2] = v[2];\n        data[offset+3] = v[3];\n    ",
    mat2: "\n        data[offset] = v[0];\n        data[offset+1] = v[1];\n\n        data[offset+4] = v[2];\n        data[offset+5] = v[3];\n    ",
    mat3: "\n        data[offset] = v[0];\n        data[offset+1] = v[1];\n        data[offset+2] = v[2];\n\n        data[offset + 4] = v[3];\n        data[offset + 5] = v[4];\n        data[offset + 6] = v[5];\n\n        data[offset + 8] = v[6];\n        data[offset + 9] = v[7];\n        data[offset + 10] = v[8];\n    ",
    mat4: "\n        for(var i = 0; i < 16; i++)\n        {\n            data[offset + i] = v[i];\n        }\n    "
}, ao = {
    float: 4,
    vec2: 8,
    vec3: 12,
    vec4: 16,
    int: 4,
    ivec2: 8,
    ivec3: 12,
    ivec4: 16,
    uint: 4,
    uvec2: 8,
    uvec3: 12,
    uvec4: 16,
    bool: 4,
    bvec2: 8,
    bvec3: 12,
    bvec4: 16,
    mat2: 32,
    mat3: 48,
    mat4: 64
};
function ho(t433) {
    for(var e434 = t433.map(function(t) {
        return {
            data: t,
            offset: 0,
            dataLen: 0,
            dirty: 0
        };
    }), r319 = 0, i243 = 0, n174 = 0, o138 = 0; o138 < e434.length; o138++){
        var s96 = e434[o138];
        if (r319 = ao[s96.data.type], s96.data.size > 1 && (r319 = Math.max(r319, 16) * s96.data.size), s96.dataLen = r319, i243 % r319 != 0 && i243 < 16) {
            var a78 = i243 % r319 % 16;
            i243 += a78, n174 += a78;
        }
        i243 + r319 > 16 ? (n174 = 16 * Math.ceil(n174 / 16), s96.offset = n174, n174 += r319, i243 = r319) : (s96.offset = n174, i243 += r319, n174 += r319);
    }
    return {
        uboElements: e434,
        size: n174 = 16 * Math.ceil(n174 / 16)
    };
}
function uo(t434, e435) {
    var r320 = [];
    for(var i in t434)e435[i] && r320.push(e435[i]);
    return r320.sort(function(t, e436) {
        return t.index - e436.index;
    }), r320;
}
function lo(t, e437) {
    if (!t.autoManage) return {
        size: 0,
        syncFunc: oo
    };
    for(var r321 = ho(uo(t.uniforms, e437)), i244 = r321.uboElements, n175 = r321.size, o139 = [
        "\n    var v = null;\n    var v2 = null;\n    var cv = null;\n    var t = 0;\n    var gl = renderer.gl\n    var index = 0;\n    var data = buffer.data;\n    "
    ], s97 = 0; s97 < i244.length; s97++){
        for(var a79 = i244[s97], h59 = t.uniforms[a79.data.name], u48 = a79.data.name, l35 = !1, c25 = 0; c25 < Cn.length; c25++){
            var d25 = Cn[c25];
            if (d25.codeUbo && d25.test(a79.data, h59)) {
                o139.push("offset = " + a79.offset / 4 + ";", Cn[c25].codeUbo(a79.data.name, h59)), l35 = !0;
                break;
            }
        }
        if (!l35) if (a79.data.size > 1) {
            var f18 = In(a79.data.type), p = Math.max(ao[a79.data.type] / 16, 1), _9 = f18 / p, m8 = (4 - _9 % 4) % 4;
            o139.push("\n                cv = ud." + u48 + ".value;\n                v = uv." + u48 + ";\n                offset = " + a79.offset / 4 + ";\n\n                t = 0;\n\n                for(var i=0; i < " + a79.data.size * p + "; i++)\n                {\n                    for(var j = 0; j < " + _9 + "; j++)\n                    {\n                        data[offset++] = v[t++];\n                    }\n                    offset += " + m8 + ";\n                }\n\n                ");
        } else {
            var v8 = so[a79.data.type];
            o139.push("\n                cv = ud." + u48 + ".value;\n                v = uv." + u48 + ";\n                offset = " + a79.offset / 4 + ";\n                " + v8 + ";\n                ");
        }
    }
    return o139.push("\n       renderer.buffer.update(buffer);\n    "), {
        size: n175,
        syncFunc: new Function("ud", "uv", "renderer", "syncData", "buffer", o139.join("\n"))
    };
}
var co = function() {
}, fo = function() {
    function t435(t, e438) {
        this.program = t, this.uniformData = e438, this.uniformGroups = {
        }, this.uniformDirtyGroups = {
        }, this.uniformBufferBindings = {
        };
    }
    return t435.prototype.destroy = function() {
        this.uniformData = null, this.uniformGroups = null, this.uniformDirtyGroups = null, this.uniformBufferBindings = null, this.program = null;
    }, t435;
}();
function po(t436, e439) {
    var r322 = yn(t436, t436.VERTEX_SHADER, e439.vertexSrc), i245 = yn(t436, t436.FRAGMENT_SHADER, e439.fragmentSrc), n176 = t436.createProgram();
    if (t436.attachShader(n176, r322), t436.attachShader(n176, i245), t436.linkProgram(n176), t436.getProgramParameter(n176, t436.LINK_STATUS) || (function(t, e440, r323, i246) {
        t.getProgramParameter(e440, t.LINK_STATUS) || (t.getShaderParameter(r323, t.COMPILE_STATUS) || gn(t, r323), t.getShaderParameter(i246, t.COMPILE_STATUS) || gn(t, i246), console.error("PixiJS Error: Could not initialize shader."), "" !== t.getProgramInfoLog(e440) && console.warn("PixiJS Warning: gl.getProgramInfoLog()", t.getProgramInfoLog(e440)));
    })(t436, n176, r322, i245), e439.attributeData = (function(t, e441) {
        for(var r324 = {
        }, i247 = e441.getProgramParameter(t, e441.ACTIVE_ATTRIBUTES), n177 = 0; n177 < i247; n177++){
            var o141 = e441.getActiveAttrib(t, n177);
            if (0 !== o141.name.indexOf("gl_")) {
                var s99 = Mn(e441, o141.type), a81 = {
                    type: s99,
                    name: o141.name,
                    size: In(s99),
                    location: e441.getAttribLocation(t, o141.name)
                };
                r324[o141.name] = a81;
            }
        }
        return r324;
    })(n176, t436), e439.uniformData = (function(t, e442) {
        for(var r325 = {
        }, i248 = e442.getProgramParameter(t, e442.ACTIVE_UNIFORMS), n178 = 0; n178 < i248; n178++){
            var o142 = e442.getActiveUniform(t, n178), s100 = o142.name.replace(/\[.*?\]$/, ""), a82 = !!o142.name.match(/\[.*?\]$/), h61 = Mn(e442, o142.type);
            r325[s100] = {
                name: s100,
                index: n178,
                type: h61,
                size: o142.size,
                isArray: a82,
                value: Tn(h61, o142.size)
            };
        }
        return r325;
    })(n176, t436), !/^[ \t]*#[ \t]*version[ \t]+300[ \t]+es[ \t]*$/m.test(e439.vertexSrc)) {
        var o140 = Object.keys(e439.attributeData);
        o140.sort(function(t, e443) {
            return t > e443 ? 1 : -1;
        });
        for(var s98 = 0; s98 < o140.length; s98++)e439.attributeData[o140[s98]].location = s98, t436.bindAttribLocation(n176, s98, o140[s98]);
        t436.linkProgram(n176);
    }
    t436.deleteShader(r322), t436.deleteShader(i245);
    var a80 = {
    };
    for(var s98 in e439.uniformData){
        var h60 = e439.uniformData[s98];
        a80[s98] = {
            location: t436.getUniformLocation(n176, s98),
            value: Tn(h60.type, h60.size)
        };
    }
    return new fo(n176, a80);
}
var _o = 0, mo = {
    textureCount: 0,
    uboCount: 0
}, vo = function() {
    function t437(t) {
        this.destroyed = !1, this.renderer = t, this.systemCheck(), this.gl = null, this.shader = null, this.program = null, this.cache = {
        }, this._uboCache = {
        }, this.id = _o++;
    }
    return t437.prototype.systemCheck = function() {
        if (!function() {
            if ("boolean" == typeof Dn) return Dn;
            try {
                var t = new Function("param1", "param2", "param3", "return param1[param2] === param3;");
                Dn = !0 === t({
                    a: "b"
                }, "a", "b");
            } catch (t) {
                Dn = !1;
            }
            return Dn;
        }()) throw new Error("Current environment does not allow unsafe-eval, please use @pixi/unsafe-eval module to enable support.");
    }, t437.prototype.contextChange = function(t) {
        this.gl = t, this.reset();
    }, t437.prototype.bind = function(t, e444) {
        t.uniforms.globals = this.renderer.globalUniforms;
        var r326 = t.program, i249 = r326.glPrograms[this.renderer.CONTEXT_UID] || this.generateProgram(t);
        return this.shader = t, this.program !== r326 && (this.program = r326, this.gl.useProgram(i249.program)), e444 || (mo.textureCount = 0, mo.uboCount = 0, this.syncUniformGroup(t.uniformGroup, mo)), i249;
    }, t437.prototype.setUniforms = function(t) {
        var e445 = this.shader.program, r327 = e445.glPrograms[this.renderer.CONTEXT_UID];
        e445.syncUniforms(r327.uniformData, t, this.renderer);
    }, t437.prototype.syncUniformGroup = function(t, e446) {
        var r328 = this.getGlProgram();
        t.static && t.dirtyId === r328.uniformDirtyGroups[t.id] || (r328.uniformDirtyGroups[t.id] = t.dirtyId, this.syncUniforms(t, r328, e446));
    }, t437.prototype.syncUniforms = function(t, e447, r329) {
        (t.syncUniforms[this.shader.program.id] || this.createSyncGroups(t))(e447.uniformData, t.uniforms, this.renderer, r329);
    }, t437.prototype.createSyncGroups = function(t438) {
        var e448 = this.getSignature(t438, this.shader.program.uniformData, "u");
        return this.cache[e448] || (this.cache[e448] = (function(t, e449) {
            var r330, i250 = [
                "\n        var v = null;\n        var cv = null;\n        var cu = null;\n        var t = 0;\n        var gl = renderer.gl;\n    "
            ];
            for(var n179 in t.uniforms){
                var o143 = e449[n179];
                if (o143) {
                    for(var s101 = t.uniforms[n179], a83 = !1, h62 = 0; h62 < Cn.length; h62++)if (Cn[h62].test(o143, s101)) {
                        i250.push(Cn[h62].code(n179, s101)), a83 = !0;
                        break;
                    }
                    if (!a83) {
                        var u49 = (1 === o143.size ? wn : Ln)[o143.type].replace("location", 'ud["' + n179 + '"].location');
                        i250.push('\n            cu = ud["' + n179 + '"];\n            cv = cu.value;\n            v = uv["' + n179 + '"];\n            ' + u49 + ";");
                    }
                } else (null === (r330 = t.uniforms[n179]) || void 0 === r330 ? void 0 : r330.group) && (t.uniforms[n179].ubo ? i250.push("\n                        renderer.shader.syncUniformBufferGroup(uv." + n179 + ", '" + n179 + "');\n                    ") : i250.push("\n                        renderer.shader.syncUniformGroup(uv." + n179 + ", syncData);\n                    "));
            }
            return new Function("ud", "uv", "renderer", "syncData", i250.join("\n"));
        })(t438, this.shader.program.uniformData)), t438.syncUniforms[this.shader.program.id] = this.cache[e448], t438.syncUniforms[this.shader.program.id];
    }, t437.prototype.syncUniformBufferGroup = function(t, e450) {
        var r331 = this.getGlProgram();
        if (!t.static || 0 !== t.dirtyId || !r331.uniformGroups[t.id]) {
            t.dirtyId = 0;
            var i251 = r331.uniformGroups[t.id] || this.createSyncBufferGroup(t, r331, e450);
            t.buffer.update(), i251(r331.uniformData, t.uniforms, this.renderer, mo, t.buffer);
        }
        this.renderer.buffer.bindBufferBase(t.buffer, r331.uniformBufferBindings[e450]);
    }, t437.prototype.createSyncBufferGroup = function(t, e451, r332) {
        var i252 = this.renderer.gl;
        this.renderer.buffer.bind(t.buffer);
        var n180 = this.gl.getUniformBlockIndex(e451.program, r332);
        e451.uniformBufferBindings[r332] = this.shader.uniformBindCount, i252.uniformBlockBinding(e451.program, n180, this.shader.uniformBindCount), this.shader.uniformBindCount++;
        var o = this.getSignature(t, this.shader.program.uniformData, "ubo"), s102 = this._uboCache[o];
        if (s102 || (s102 = this._uboCache[o] = lo(t, this.shader.program.uniformData)), t.autoManage) {
            var a84 = new Float32Array(s102.size / 4);
            t.buffer.update(a84);
        }
        return e451.uniformGroups[t.id] = s102.syncFunc, e451.uniformGroups[t.id];
    }, t437.prototype.getSignature = function(t, e452, r333) {
        var i253 = t.uniforms, n181 = [
            r333 + "-"
        ];
        for(var o144 in i253)n181.push(o144), e452[o144] && n181.push(e452[o144].type);
        return n181.join("-");
    }, t437.prototype.getGlProgram = function() {
        return this.shader ? this.shader.program.glPrograms[this.renderer.CONTEXT_UID] : null;
    }, t437.prototype.generateProgram = function(t) {
        var e453 = this.gl, r334 = t.program, i254 = po(e453, r334);
        return r334.glPrograms[this.renderer.CONTEXT_UID] = i254, i254;
    }, t437.prototype.reset = function() {
        this.program = null, this.shader = null;
    }, t437.prototype.destroy = function() {
        this.renderer = null, this.destroyed = !0;
    }, t437;
}(), yo = 0, go = 1, Eo = 2, To = 3, bo = 4, xo = 5, Ro = function() {
    function t439() {
        this.gl = null, this.stateId = 0, this.polygonOffset = 0, this.blendMode = se.NONE, this._blendEq = !1, this.map = [], this.map[yo] = this.setBlend, this.map[go] = this.setOffset, this.map[Eo] = this.setCullFace, this.map[To] = this.setDepthTest, this.map[bo] = this.setFrontFace, this.map[xo] = this.setDepthMask, this.checks = [], this.defaultState = new jn, this.defaultState.blend = !0;
    }
    return t439.prototype.contextChange = function(t440) {
        this.gl = t440, this.blendModes = (function(t, e454) {
            return void 0 === e454 && (e454 = []), e454[se.NORMAL] = [
                t.ONE,
                t.ONE_MINUS_SRC_ALPHA
            ], e454[se.ADD] = [
                t.ONE,
                t.ONE
            ], e454[se.MULTIPLY] = [
                t.DST_COLOR,
                t.ONE_MINUS_SRC_ALPHA,
                t.ONE,
                t.ONE_MINUS_SRC_ALPHA
            ], e454[se.SCREEN] = [
                t.ONE,
                t.ONE_MINUS_SRC_COLOR,
                t.ONE,
                t.ONE_MINUS_SRC_ALPHA
            ], e454[se.OVERLAY] = [
                t.ONE,
                t.ONE_MINUS_SRC_ALPHA
            ], e454[se.DARKEN] = [
                t.ONE,
                t.ONE_MINUS_SRC_ALPHA
            ], e454[se.LIGHTEN] = [
                t.ONE,
                t.ONE_MINUS_SRC_ALPHA
            ], e454[se.COLOR_DODGE] = [
                t.ONE,
                t.ONE_MINUS_SRC_ALPHA
            ], e454[se.COLOR_BURN] = [
                t.ONE,
                t.ONE_MINUS_SRC_ALPHA
            ], e454[se.HARD_LIGHT] = [
                t.ONE,
                t.ONE_MINUS_SRC_ALPHA
            ], e454[se.SOFT_LIGHT] = [
                t.ONE,
                t.ONE_MINUS_SRC_ALPHA
            ], e454[se.DIFFERENCE] = [
                t.ONE,
                t.ONE_MINUS_SRC_ALPHA
            ], e454[se.EXCLUSION] = [
                t.ONE,
                t.ONE_MINUS_SRC_ALPHA
            ], e454[se.HUE] = [
                t.ONE,
                t.ONE_MINUS_SRC_ALPHA
            ], e454[se.SATURATION] = [
                t.ONE,
                t.ONE_MINUS_SRC_ALPHA
            ], e454[se.COLOR] = [
                t.ONE,
                t.ONE_MINUS_SRC_ALPHA
            ], e454[se.LUMINOSITY] = [
                t.ONE,
                t.ONE_MINUS_SRC_ALPHA
            ], e454[se.NONE] = [
                0,
                0
            ], e454[se.NORMAL_NPM] = [
                t.SRC_ALPHA,
                t.ONE_MINUS_SRC_ALPHA,
                t.ONE,
                t.ONE_MINUS_SRC_ALPHA
            ], e454[se.ADD_NPM] = [
                t.SRC_ALPHA,
                t.ONE,
                t.ONE,
                t.ONE
            ], e454[se.SCREEN_NPM] = [
                t.SRC_ALPHA,
                t.ONE_MINUS_SRC_COLOR,
                t.ONE,
                t.ONE_MINUS_SRC_ALPHA
            ], e454[se.SRC_IN] = [
                t.DST_ALPHA,
                t.ZERO
            ], e454[se.SRC_OUT] = [
                t.ONE_MINUS_DST_ALPHA,
                t.ZERO
            ], e454[se.SRC_ATOP] = [
                t.DST_ALPHA,
                t.ONE_MINUS_SRC_ALPHA
            ], e454[se.DST_OVER] = [
                t.ONE_MINUS_DST_ALPHA,
                t.ONE
            ], e454[se.DST_IN] = [
                t.ZERO,
                t.SRC_ALPHA
            ], e454[se.DST_OUT] = [
                t.ZERO,
                t.ONE_MINUS_SRC_ALPHA
            ], e454[se.DST_ATOP] = [
                t.ONE_MINUS_DST_ALPHA,
                t.SRC_ALPHA
            ], e454[se.XOR] = [
                t.ONE_MINUS_DST_ALPHA,
                t.ONE_MINUS_SRC_ALPHA
            ], e454[se.SUBTRACT] = [
                t.ONE,
                t.ONE,
                t.ONE,
                t.ONE,
                t.FUNC_REVERSE_SUBTRACT,
                t.FUNC_ADD
            ], e454;
        })(t440), this.set(this.defaultState), this.reset();
    }, t439.prototype.set = function(t) {
        if (t = t || this.defaultState, this.stateId !== t.data) {
            for(var e455 = this.stateId ^ t.data, r335 = 0; e455;)1 & e455 && this.map[r335].call(this, !!(t.data & 1 << r335)), e455 >>= 1, r335++;
            this.stateId = t.data;
        }
        for(r335 = 0; r335 < this.checks.length; r335++)this.checks[r335](this, t);
    }, t439.prototype.forceState = function(t) {
        t = t || this.defaultState;
        for(var e456 = 0; e456 < this.map.length; e456++)this.map[e456].call(this, !!(t.data & 1 << e456));
        for(e456 = 0; e456 < this.checks.length; e456++)this.checks[e456](this, t);
        this.stateId = t.data;
    }, t439.prototype.setBlend = function(e457) {
        this.updateCheck(t439.checkBlendMode, e457), this.gl[e457 ? "enable" : "disable"](this.gl.BLEND);
    }, t439.prototype.setOffset = function(e458) {
        this.updateCheck(t439.checkPolygonOffset, e458), this.gl[e458 ? "enable" : "disable"](this.gl.POLYGON_OFFSET_FILL);
    }, t439.prototype.setDepthTest = function(t) {
        this.gl[t ? "enable" : "disable"](this.gl.DEPTH_TEST);
    }, t439.prototype.setDepthMask = function(t) {
        this.gl.depthMask(t);
    }, t439.prototype.setCullFace = function(t) {
        this.gl[t ? "enable" : "disable"](this.gl.CULL_FACE);
    }, t439.prototype.setFrontFace = function(t) {
        this.gl.frontFace(this.gl[t ? "CW" : "CCW"]);
    }, t439.prototype.setBlendMode = function(t) {
        if (t !== this.blendMode) {
            this.blendMode = t;
            var e459 = this.blendModes[t], r336 = this.gl;
            2 === e459.length ? r336.blendFunc(e459[0], e459[1]) : r336.blendFuncSeparate(e459[0], e459[1], e459[2], e459[3]), 6 === e459.length ? (this._blendEq = !0, r336.blendEquationSeparate(e459[4], e459[5])) : this._blendEq && (this._blendEq = !1, r336.blendEquationSeparate(r336.FUNC_ADD, r336.FUNC_ADD));
        }
    }, t439.prototype.setPolygonOffset = function(t, e460) {
        this.gl.polygonOffset(t, e460);
    }, t439.prototype.reset = function() {
        this.gl.pixelStorei(this.gl.UNPACK_FLIP_Y_WEBGL, !1), this.forceState(this.defaultState), this._blendEq = !0, this.blendMode = -1, this.setBlendMode(0);
    }, t439.prototype.updateCheck = function(t, e461) {
        var r337 = this.checks.indexOf(t);
        e461 && -1 === r337 ? this.checks.push(t) : e461 || -1 === r337 || this.checks.splice(r337, 1);
    }, t439.checkBlendMode = function(t, e462) {
        t.setBlendMode(e462.blendMode);
    }, t439.checkPolygonOffset = function(t, e463) {
        t.setPolygonOffset(1, e463.polygonOffset);
    }, t439.prototype.destroy = function() {
        this.gl = null;
    }, t439;
}(), Ao = function() {
    function t441(t) {
        this.renderer = t, this.count = 0, this.checkCount = 0, this.maxIdle = et.GC_MAX_IDLE, this.checkCountMax = et.GC_MAX_CHECK_COUNT, this.mode = et.GC_MODE;
    }
    return t441.prototype.postrender = function() {
        this.renderer.renderingToScreen && (this.count++, this.mode !== ve.MANUAL && (this.checkCount++, this.checkCount > this.checkCountMax && (this.checkCount = 0, this.run())));
    }, t441.prototype.run = function() {
        for(var t = this.renderer.texture, e464 = t.managedTextures, r338 = !1, i255 = 0; i255 < e464.length; i255++){
            var n182 = e464[i255];
            !n182.framebuffer && this.count - n182.touched > this.maxIdle && (t.destroyTexture(n182, !0), e464[i255] = null, r338 = !0);
        }
        if (r338) {
            var o145 = 0;
            for(i255 = 0; i255 < e464.length; i255++)null !== e464[i255] && (e464[o145++] = e464[i255]);
            e464.length = o145;
        }
    }, t441.prototype.unload = function(t) {
        var e465 = this.renderer.texture, r339 = t._texture;
        r339 && !r339.framebuffer && e465.destroyTexture(r339);
        for(var i256 = t.children.length - 1; i256 >= 0; i256--)this.unload(t.children[i256]);
    }, t441.prototype.destroy = function() {
        this.renderer = null;
    }, t441;
}(), Oo = function(t) {
    this.texture = t, this.width = -1, this.height = -1, this.dirtyId = -1, this.dirtyStyleId = -1, this.mipmap = !1, this.wrapMode = 33071, this.type = le.UNSIGNED_BYTE, this.internalFormat = he.RGBA, this.samplerType = 0;
}, So = function() {
    function t442(t) {
        this.renderer = t, this.boundTextures = [], this.currentLocation = -1, this.managedTextures = [], this._unknownBoundTextures = !1, this.unknownTexture = new Ai, this.hasIntegerTextures = !1;
    }
    return t442.prototype.contextChange = function() {
        var t443 = this.gl = this.renderer.gl;
        this.CONTEXT_UID = this.renderer.CONTEXT_UID, this.webGLVersion = this.renderer.context.webGLVersion, this.internalFormats = (function(t) {
            var e467, r341, i258, n183, o146, s103, a85, h63, u50, l36, c26, d26, f19, p, _10, m9, v9, y, g7, E7, T6, b4, x5;
            return "WebGL2RenderingContext" in self && t instanceof self.WebGL2RenderingContext ? ((e467 = {
            })[le.UNSIGNED_BYTE] = ((r341 = {
            })[he.RGBA] = t.RGBA8, r341[he.RGB] = t.RGB8, r341[he.RG] = t.RG8, r341[he.RED] = t.R8, r341[he.RGBA_INTEGER] = t.RGBA8UI, r341[he.RGB_INTEGER] = t.RGB8UI, r341[he.RG_INTEGER] = t.RG8UI, r341[he.RED_INTEGER] = t.R8UI, r341[he.ALPHA] = t.ALPHA, r341[he.LUMINANCE] = t.LUMINANCE, r341[he.LUMINANCE_ALPHA] = t.LUMINANCE_ALPHA, r341), e467[le.BYTE] = ((i258 = {
            })[he.RGBA] = t.RGBA8_SNORM, i258[he.RGB] = t.RGB8_SNORM, i258[he.RG] = t.RG8_SNORM, i258[he.RED] = t.R8_SNORM, i258[he.RGBA_INTEGER] = t.RGBA8I, i258[he.RGB_INTEGER] = t.RGB8I, i258[he.RG_INTEGER] = t.RG8I, i258[he.RED_INTEGER] = t.R8I, i258), e467[le.UNSIGNED_SHORT] = ((n183 = {
            })[he.RGBA_INTEGER] = t.RGBA16UI, n183[he.RGB_INTEGER] = t.RGB16UI, n183[he.RG_INTEGER] = t.RG16UI, n183[he.RED_INTEGER] = t.R16UI, n183[he.DEPTH_COMPONENT] = t.DEPTH_COMPONENT16, n183), e467[le.SHORT] = ((o146 = {
            })[he.RGBA_INTEGER] = t.RGBA16I, o146[he.RGB_INTEGER] = t.RGB16I, o146[he.RG_INTEGER] = t.RG16I, o146[he.RED_INTEGER] = t.R16I, o146), e467[le.UNSIGNED_INT] = ((s103 = {
            })[he.RGBA_INTEGER] = t.RGBA32UI, s103[he.RGB_INTEGER] = t.RGB32UI, s103[he.RG_INTEGER] = t.RG32UI, s103[he.RED_INTEGER] = t.R32UI, s103[he.DEPTH_COMPONENT] = t.DEPTH_COMPONENT24, s103), e467[le.INT] = ((a85 = {
            })[he.RGBA_INTEGER] = t.RGBA32I, a85[he.RGB_INTEGER] = t.RGB32I, a85[he.RG_INTEGER] = t.RG32I, a85[he.RED_INTEGER] = t.R32I, a85), e467[le.FLOAT] = ((h63 = {
            })[he.RGBA] = t.RGBA32F, h63[he.RGB] = t.RGB32F, h63[he.RG] = t.RG32F, h63[he.RED] = t.R32F, h63[he.DEPTH_COMPONENT] = t.DEPTH_COMPONENT32F, h63), e467[le.HALF_FLOAT] = ((u50 = {
            })[he.RGBA] = t.RGBA16F, u50[he.RGB] = t.RGB16F, u50[he.RG] = t.RG16F, u50[he.RED] = t.R16F, u50), e467[le.UNSIGNED_SHORT_5_6_5] = ((l36 = {
            })[he.RGB] = t.RGB565, l36), e467[le.UNSIGNED_SHORT_4_4_4_4] = ((c26 = {
            })[he.RGBA] = t.RGBA4, c26), e467[le.UNSIGNED_SHORT_5_5_5_1] = ((d26 = {
            })[he.RGBA] = t.RGB5_A1, d26), e467[le.UNSIGNED_INT_2_10_10_10_REV] = ((f19 = {
            })[he.RGBA] = t.RGB10_A2, f19[he.RGBA_INTEGER] = t.RGB10_A2UI, f19), e467[le.UNSIGNED_INT_10F_11F_11F_REV] = ((p = {
            })[he.RGB] = t.R11F_G11F_B10F, p), e467[le.UNSIGNED_INT_5_9_9_9_REV] = ((_10 = {
            })[he.RGB] = t.RGB9_E5, _10), e467[le.UNSIGNED_INT_24_8] = ((m9 = {
            })[he.DEPTH_STENCIL] = t.DEPTH24_STENCIL8, m9), e467[le.FLOAT_32_UNSIGNED_INT_24_8_REV] = ((v9 = {
            })[he.DEPTH_STENCIL] = t.DEPTH32F_STENCIL8, v9), x5 = e467) : ((y = {
            })[le.UNSIGNED_BYTE] = ((g7 = {
            })[he.RGBA] = t.RGBA, g7[he.RGB] = t.RGB, g7[he.ALPHA] = t.ALPHA, g7[he.LUMINANCE] = t.LUMINANCE, g7[he.LUMINANCE_ALPHA] = t.LUMINANCE_ALPHA, g7), y[le.UNSIGNED_SHORT_5_6_5] = ((E7 = {
            })[he.RGB] = t.RGB, E7), y[le.UNSIGNED_SHORT_4_4_4_4] = ((T6 = {
            })[he.RGBA] = t.RGBA, T6), y[le.UNSIGNED_SHORT_5_5_5_1] = ((b4 = {
            })[he.RGBA] = t.RGBA, b4), x5 = y), x5;
        })(t443);
        var e466 = t443.getParameter(t443.MAX_TEXTURE_IMAGE_UNITS);
        this.boundTextures.length = e466;
        for(var r340 = 0; r340 < e466; r340++)this.boundTextures[r340] = null;
        this.emptyTextures = {
        };
        var i257 = new Oo(t443.createTexture());
        for(t443.bindTexture(t443.TEXTURE_2D, i257.texture), t443.texImage2D(t443.TEXTURE_2D, 0, t443.RGBA, 1, 1, 0, t443.RGBA, t443.UNSIGNED_BYTE, new Uint8Array(4)), this.emptyTextures[t443.TEXTURE_2D] = i257, this.emptyTextures[t443.TEXTURE_CUBE_MAP] = new Oo(t443.createTexture()), t443.bindTexture(t443.TEXTURE_CUBE_MAP, this.emptyTextures[t443.TEXTURE_CUBE_MAP].texture), r340 = 0; r340 < 6; r340++)t443.texImage2D(t443.TEXTURE_CUBE_MAP_POSITIVE_X + r340, 0, t443.RGBA, 1, 1, 0, t443.RGBA, t443.UNSIGNED_BYTE, null);
        for(t443.texParameteri(t443.TEXTURE_CUBE_MAP, t443.TEXTURE_MAG_FILTER, t443.LINEAR), t443.texParameteri(t443.TEXTURE_CUBE_MAP, t443.TEXTURE_MIN_FILTER, t443.LINEAR), r340 = 0; r340 < this.boundTextures.length; r340++)this.bind(null, r340);
    }, t442.prototype.bind = function(t, e468) {
        void 0 === e468 && (e468 = 0);
        var r342 = this.gl;
        if ((t = null == t ? void 0 : t.castToBaseTexture()) && t.valid && !t.parentTextureArray) {
            t.touched = this.renderer.textureGC.count;
            var i259 = t._glTextures[this.CONTEXT_UID] || this.initTexture(t);
            this.boundTextures[e468] !== t && (this.currentLocation !== e468 && (this.currentLocation = e468, r342.activeTexture(r342.TEXTURE0 + e468)), r342.bindTexture(t.target, i259.texture)), i259.dirtyId !== t.dirtyId && (this.currentLocation !== e468 && (this.currentLocation = e468, r342.activeTexture(r342.TEXTURE0 + e468)), this.updateTexture(t)), this.boundTextures[e468] = t;
        } else this.currentLocation !== e468 && (this.currentLocation = e468, r342.activeTexture(r342.TEXTURE0 + e468)), r342.bindTexture(r342.TEXTURE_2D, this.emptyTextures[r342.TEXTURE_2D].texture), this.boundTextures[e468] = null;
    }, t442.prototype.reset = function() {
        this._unknownBoundTextures = !0, this.hasIntegerTextures = !1, this.currentLocation = -1;
        for(var t = 0; t < this.boundTextures.length; t++)this.boundTextures[t] = this.unknownTexture;
    }, t442.prototype.unbind = function(t) {
        var e469 = this.gl, r343 = this.boundTextures;
        if (this._unknownBoundTextures) {
            this._unknownBoundTextures = !1;
            for(var i260 = 0; i260 < r343.length; i260++)r343[i260] === this.unknownTexture && this.bind(null, i260);
        }
        for(i260 = 0; i260 < r343.length; i260++)r343[i260] === t && (this.currentLocation !== i260 && (e469.activeTexture(e469.TEXTURE0 + i260), this.currentLocation = i260), e469.bindTexture(t.target, this.emptyTextures[t.target].texture), r343[i260] = null);
    }, t442.prototype.ensureSamplerType = function(t) {
        var e470 = this.boundTextures, r344 = this.hasIntegerTextures, i = this.CONTEXT_UID;
        if (r344) for(var n184 = t - 1; n184 >= 0; --n184){
            var o147 = e470[n184];
            o147 && o147._glTextures[i].samplerType !== ce.FLOAT && this.renderer.texture.unbind(o147);
        }
    }, t442.prototype.initTexture = function(t) {
        var e471 = new Oo(this.gl.createTexture());
        return e471.dirtyId = -1, t._glTextures[this.CONTEXT_UID] = e471, this.managedTextures.push(t), t.on("dispose", this.destroyTexture, this), e471;
    }, t442.prototype.initTextureType = function(t, e472) {
        var r345, i261;
        e472.internalFormat = null !== (i261 = null === (r345 = this.internalFormats[t.type]) || void 0 === r345 ? void 0 : r345[t.format]) && void 0 !== i261 ? i261 : t.format, 2 === this.webGLVersion && t.type === le.HALF_FLOAT ? e472.type = this.gl.HALF_FLOAT : e472.type = t.type;
    }, t442.prototype.updateTexture = function(t) {
        var e473 = t._glTextures[this.CONTEXT_UID];
        if (e473) {
            var r346 = this.renderer;
            if (this.initTextureType(t, e473), t.resource && t.resource.upload(r346, t, e473)) e473.samplerType !== ce.FLOAT && (this.hasIntegerTextures = !0);
            else {
                var i262 = t.realWidth, n185 = t.realHeight, o148 = r346.gl;
                (e473.width !== i262 || e473.height !== n185 || e473.dirtyId < 0) && (e473.width = i262, e473.height = n185, o148.texImage2D(t.target, 0, e473.internalFormat, i262, n185, 0, t.format, e473.type, null));
            }
            t.dirtyStyleId !== e473.dirtyStyleId && this.updateTextureStyle(t), e473.dirtyId = t.dirtyId;
        }
    }, t442.prototype.destroyTexture = function(t, e474) {
        var r347 = this.gl;
        if ((t = t.castToBaseTexture())._glTextures[this.CONTEXT_UID] && (this.unbind(t), r347.deleteTexture(t._glTextures[this.CONTEXT_UID].texture), t.off("dispose", this.destroyTexture, this), delete t._glTextures[this.CONTEXT_UID], !e474)) {
            var i263 = this.managedTextures.indexOf(t);
            -1 !== i263 && je(this.managedTextures, i263, 1);
        }
    }, t442.prototype.updateTextureStyle = function(t) {
        var e475 = t._glTextures[this.CONTEXT_UID];
        e475 && (t.mipmap !== pe.POW2 && 2 === this.webGLVersion || t.isPowerOfTwo ? e475.mipmap = t.mipmap >= 1 : e475.mipmap = !1, 2 === this.webGLVersion || t.isPowerOfTwo ? e475.wrapMode = t.wrapMode : e475.wrapMode = fe.CLAMP, t.resource && t.resource.style(this.renderer, t, e475) || this.setStyle(t, e475), e475.dirtyStyleId = t.dirtyStyleId);
    }, t442.prototype.setStyle = function(t, e476) {
        var r348 = this.gl;
        if (e476.mipmap && t.mipmap !== pe.ON_MANUAL && r348.generateMipmap(t.target), r348.texParameteri(t.target, r348.TEXTURE_WRAP_S, e476.wrapMode), r348.texParameteri(t.target, r348.TEXTURE_WRAP_T, e476.wrapMode), e476.mipmap) {
            r348.texParameteri(t.target, r348.TEXTURE_MIN_FILTER, t.scaleMode === de.LINEAR ? r348.LINEAR_MIPMAP_LINEAR : r348.NEAREST_MIPMAP_NEAREST);
            var i264 = this.renderer.context.extensions.anisotropicFiltering;
            if (i264 && t.anisotropicLevel > 0 && t.scaleMode === de.LINEAR) {
                var n186 = Math.min(t.anisotropicLevel, r348.getParameter(i264.MAX_TEXTURE_MAX_ANISOTROPY_EXT));
                r348.texParameterf(t.target, i264.TEXTURE_MAX_ANISOTROPY_EXT, n186);
            }
        } else r348.texParameteri(t.target, r348.TEXTURE_MIN_FILTER, t.scaleMode === de.LINEAR ? r348.LINEAR : r348.NEAREST);
        r348.texParameteri(t.target, r348.TEXTURE_MAG_FILTER, t.scaleMode === de.LINEAR ? r348.LINEAR : r348.NEAREST);
    }, t442.prototype.destroy = function() {
        this.renderer = null;
    }, t442;
}(), Io = {
    __proto__: null,
    FilterSystem: an,
    BatchSystem: un,
    ContextSystem: cn,
    FramebufferSystem: pn,
    GeometrySystem: mn,
    MaskSystem: Zn,
    ScissorSystem: $n,
    StencilSystem: to,
    ProjectionSystem: eo,
    RenderTextureSystem: no,
    ShaderSystem: vo,
    StateSystem: Ro,
    TextureGCSystem: Ao,
    TextureSystem: So
}, Po = new _r, No = function(t444) {
    function e477(e478, r349) {
        void 0 === e478 && (e478 = ne.UNKNOWN);
        var i265 = t444.call(this) || this;
        return r349 = Object.assign({
        }, et.RENDER_OPTIONS, r349), i265.options = r349, i265.type = e478, i265.screen = new hr(0, 0, r349.width, r349.height), i265.view = r349.view || document.createElement("canvas"), i265.resolution = r349.resolution || et.RESOLUTION, i265.useContextAlpha = r349.useContextAlpha, i265.autoDensity = !!r349.autoDensity, i265.preserveDrawingBuffer = r349.preserveDrawingBuffer, i265.clearBeforeRender = r349.clearBeforeRender, i265._backgroundColor = 0, i265._backgroundColorRgba = [
            0,
            0,
            0,
            1
        ], i265._backgroundColorString = "#000000", i265.backgroundColor = r349.backgroundColor || i265._backgroundColor, i265.backgroundAlpha = r349.backgroundAlpha, void 0 !== r349.transparent && (i265.useContextAlpha = r349.transparent, i265.backgroundAlpha = r349.transparent ? 0 : 1), i265._lastObjectRendered = null, i265.plugins = {
        }, i265;
    }
    return Ei(e477, t444), e477.prototype.initPlugins = function(t) {
        for(var e in t)this.plugins[e] = new t[e](this);
    }, Object.defineProperty(e477.prototype, "width", {
        get: function() {
            return this.view.width;
        },
        enumerable: !1,
        configurable: !0
    }), Object.defineProperty(e477.prototype, "height", {
        get: function() {
            return this.view.height;
        },
        enumerable: !1,
        configurable: !0
    }), e477.prototype.resize = function(t, e479) {
        this.view.width = Math.round(t * this.resolution), this.view.height = Math.round(e479 * this.resolution);
        var r350 = this.view.width / this.resolution, i266 = this.view.height / this.resolution;
        this.screen.width = r350, this.screen.height = i266, this.autoDensity && (this.view.style.width = r350 + "px", this.view.style.height = i266 + "px"), this.emit("resize", r350, i266);
    }, e477.prototype.generateTexture = function(t445, e480, r351, i267) {
        void 0 === e480 && (e480 = {
        }), "number" == typeof e480 && (e480 = {
            scaleMode: e480,
            resolution: r351,
            region: i267
        });
        var n187 = e480.region, o149 = function(t, e481) {
            var r352 = {
            };
            for(var i268 in t)Object.prototype.hasOwnProperty.call(t, i268) && e481.indexOf(i268) < 0 && (r352[i268] = t[i268]);
            if (null != t && "function" == typeof Object.getOwnPropertySymbols) {
                var n188 = 0;
                for(i268 = Object.getOwnPropertySymbols(t); n188 < i268.length; n188++)e481.indexOf(i268[n188]) < 0 && (r352[i268[n188]] = t[i268[n188]]);
            }
            return r352;
        }(e480, [
            "region"
        ]);
        0 === (i267 = n187 || t445.getLocalBounds(null, !0)).width && (i267.width = 1), 0 === i267.height && (i267.height = 1);
        var s104 = ji.create(Ti({
            width: i267.width,
            height: i267.height
        }, o149));
        return Po.tx = -i267.x, Po.ty = -i267.y, this.render(t445, {
            renderTexture: s104,
            clear: !1,
            transform: Po,
            skipUpdateTransform: !!t445.parent
        }), s104;
    }, e477.prototype.destroy = function(t) {
        for(var e in this.plugins)this.plugins[e].destroy(), this.plugins[e] = null;
        t && this.view.parentNode && this.view.parentNode.removeChild(this.view), this.plugins = null, this.type = ne.UNKNOWN, this.view = null, this.screen = null, this._tempDisplayObjectParent = null, this.options = null, this._backgroundColorRgba = null, this._backgroundColorString = null, this._lastObjectRendered = null;
    }, Object.defineProperty(e477.prototype, "backgroundColor", {
        get: function() {
            return this._backgroundColor;
        },
        set: function(t) {
            this._backgroundColor = t, this._backgroundColorString = Ne(t), Pe(t, this._backgroundColorRgba);
        },
        enumerable: !1,
        configurable: !0
    }), Object.defineProperty(e477.prototype, "backgroundAlpha", {
        get: function() {
            return this._backgroundColorRgba[3];
        },
        set: function(t) {
            this._backgroundColorRgba[3] = t;
        },
        enumerable: !1,
        configurable: !0
    }), e477;
}(nt), Mo = function(t) {
    this.buffer = t || null, this.updateID = -1, this.byteLength = -1, this.refCount = 0;
}, Do = function() {
    function t446(t) {
        this.renderer = t, this.managedBuffers = {
        }, this.boundBufferBases = {
        };
    }
    return t446.prototype.destroy = function() {
        this.renderer = null;
    }, t446.prototype.contextChange = function() {
        this.disposeAll(!0), this.gl = this.renderer.gl, this.CONTEXT_UID = this.renderer.CONTEXT_UID;
    }, t446.prototype.bind = function(t) {
        var e482 = this.gl, r = this.CONTEXT_UID, i269 = t._glBuffers[r] || this.createGLBuffer(t);
        e482.bindBuffer(t.type, i269.buffer);
    }, t446.prototype.bindBufferBase = function(t, e483) {
        var r353 = this.gl, i = this.CONTEXT_UID;
        if (this.boundBufferBases[e483] !== t) {
            var n189 = t._glBuffers[i] || this.createGLBuffer(t);
            this.boundBufferBases[e483] = t, r353.bindBufferBase(r353.UNIFORM_BUFFER, e483, n189.buffer);
        }
    }, t446.prototype.bindBufferRange = function(t, e484, r354) {
        var i270 = this.gl, n = this.CONTEXT_UID;
        r354 = r354 || 0;
        var o150 = t._glBuffers[n] || this.createGLBuffer(t);
        i270.bindBufferRange(i270.UNIFORM_BUFFER, e484 || 0, o150.buffer, 256 * r354, 256);
    }, t446.prototype.update = function(t) {
        var e485 = this.gl, r = this.CONTEXT_UID, i271 = t._glBuffers[r];
        if (t._updateID !== i271.updateID) if (i271.updateID = t._updateID, e485.bindBuffer(t.type, i271.buffer), i271.byteLength >= t.data.byteLength) e485.bufferSubData(t.type, 0, t.data);
        else {
            var n190 = t.static ? e485.STATIC_DRAW : e485.DYNAMIC_DRAW;
            i271.byteLength = t.data.byteLength, e485.bufferData(t.type, t.data, n190);
        }
    }, t446.prototype.dispose = function(t, e486) {
        if (this.managedBuffers[t.id]) {
            delete this.managedBuffers[t.id];
            var r355 = t._glBuffers[this.CONTEXT_UID], i272 = this.gl;
            t.disposeRunner.remove(this), r355 && (e486 || i272.deleteBuffer(r355.buffer), delete t._glBuffers[this.CONTEXT_UID]);
        }
    }, t446.prototype.disposeAll = function(t) {
        for(var e487 = Object.keys(this.managedBuffers), r356 = 0; r356 < e487.length; r356++)this.dispose(this.managedBuffers[e487[r356]], t);
    }, t446.prototype.createGLBuffer = function(t) {
        var e = this.CONTEXT_UID, r357 = this.gl;
        return t._glBuffers[e] = new Mo(r357.createBuffer()), this.managedBuffers[t.id] = t, t.disposeRunner.add(this), t._glBuffers[e];
    }, t446;
}(), Co = function(t447) {
    function e488(r358) {
        var i273 = t447.call(this, ne.WEBGL, r358) || this;
        return r358 = i273.options, i273.gl = null, i273.CONTEXT_UID = 0, i273.runners = {
            destroy: new mi("destroy"),
            contextChange: new mi("contextChange"),
            reset: new mi("reset"),
            update: new mi("update"),
            postrender: new mi("postrender"),
            prerender: new mi("prerender"),
            resize: new mi("resize")
        }, i273.runners.contextChange.add(i273), i273.globalUniforms = new rn({
            projectionMatrix: new _r
        }, !0), i273.addSystem(Zn, "mask").addSystem(cn, "context").addSystem(Ro, "state").addSystem(vo, "shader").addSystem(So, "texture").addSystem(Do, "buffer").addSystem(mn, "geometry").addSystem(pn, "framebuffer").addSystem($n, "scissor").addSystem(to, "stencil").addSystem(eo, "projection").addSystem(Ao, "textureGC").addSystem(an, "filter").addSystem(no, "renderTexture").addSystem(un, "batch"), i273.initPlugins(e488.__plugins), i273.multisample = void 0, r358.context ? i273.context.initFromContext(r358.context) : i273.context.initFromOptions({
            alpha: !!i273.useContextAlpha,
            antialias: r358.antialias,
            premultipliedAlpha: i273.useContextAlpha && "notMultiplied" !== i273.useContextAlpha,
            stencil: !0,
            preserveDrawingBuffer: r358.preserveDrawingBuffer,
            powerPreference: i273.options.powerPreference
        }), i273.renderingToScreen = !0, Oe(2 === i273.context.webGLVersion ? "WebGL 2" : "WebGL 1"), i273.resize(i273.options.width, i273.options.height), i273;
    }
    return Ei(e488, t447), e488.create = function(t) {
        if (Se()) return new e488(t);
        throw new Error('WebGL unsupported in this browser, use "pixi.js-legacy" for fallback canvas2d support.');
    }, e488.prototype.contextChange = function() {
        var t, e489 = this.gl;
        if (1 === this.context.webGLVersion) {
            var r359 = e489.getParameter(e489.FRAMEBUFFER_BINDING);
            e489.bindFramebuffer(e489.FRAMEBUFFER, null), t = e489.getParameter(e489.SAMPLES), e489.bindFramebuffer(e489.FRAMEBUFFER, r359);
        } else r359 = e489.getParameter(e489.DRAW_FRAMEBUFFER_BINDING), e489.bindFramebuffer(e489.DRAW_FRAMEBUFFER, null), t = e489.getParameter(e489.SAMPLES), e489.bindFramebuffer(e489.DRAW_FRAMEBUFFER, r359);
        t >= Ee.HIGH ? this.multisample = Ee.HIGH : t >= Ee.MEDIUM ? this.multisample = Ee.MEDIUM : t >= Ee.LOW ? this.multisample = Ee.LOW : this.multisample = Ee.NONE;
    }, e488.prototype.addSystem = function(t, e490) {
        var r360 = new t(this);
        if (this[e490]) throw new Error('Whoops! The name "' + e490 + '" is already in use');
        for(var i in this[e490] = r360, this.runners)this.runners[i].add(r360);
        return this;
    }, e488.prototype.render = function(t, e491) {
        var r361, i274, n191, o151;
        if (e491 && (e491 instanceof ji ? (r361 = e491, i274 = arguments[2], n191 = arguments[3], o151 = arguments[4]) : (r361 = e491.renderTexture, i274 = e491.clear, n191 = e491.transform, o151 = e491.skipUpdateTransform)), this.renderingToScreen = !r361, this.runners.prerender.emit(), this.emit("prerender"), this.projection.transform = n191, !this.context.isLost) {
            if (r361 || (this._lastObjectRendered = t), !o151) {
                var s105 = t.enableTempParent();
                t.updateTransform(), t.disableTempParent(s105);
            }
            this.renderTexture.bind(r361), this.batch.currentRenderer.start(), (void 0 !== i274 ? i274 : this.clearBeforeRender) && this.renderTexture.clear(), t.render(this), this.batch.currentRenderer.flush(), r361 && r361.baseTexture.update(), this.runners.postrender.emit(), this.projection.transform = null, this.emit("postrender");
        }
    }, e488.prototype.generateTexture = function(e492, r362, i275, n192) {
        void 0 === r362 && (r362 = {
        });
        var o152 = t447.prototype.generateTexture.call(this, e492, r362, i275, n192);
        return this.framebuffer.blit(), o152;
    }, e488.prototype.resize = function(e493, r363) {
        t447.prototype.resize.call(this, e493, r363), this.runners.resize.emit(this.screen.height, this.screen.width);
    }, e488.prototype.reset = function() {
        return this.runners.reset.emit(), this;
    }, e488.prototype.clear = function() {
        this.renderTexture.bind(), this.renderTexture.clear();
    }, e488.prototype.destroy = function(e494) {
        for(var r in this.runners.destroy.emit(), this.runners)this.runners[r].destroy();
        t447.prototype.destroy.call(this, e494), this.gl = null;
    }, Object.defineProperty(e488.prototype, "extract", {
        get: function() {
            return this.plugins.extract;
        },
        enumerable: !1,
        configurable: !0
    }), e488.registerPlugin = function(t, r364) {
        e488.__plugins = e488.__plugins || {
        }, e488.__plugins[t] = r364;
    }, e488;
}(No);
function wo(t) {
    return Co.create(t);
}
var Lo = "attribute vec2 aVertexPosition;\nattribute vec2 aTextureCoord;\n\nuniform mat3 projectionMatrix;\n\nvarying vec2 vTextureCoord;\n\nvoid main(void)\n{\n    gl_Position = vec4((projectionMatrix * vec3(aVertexPosition, 1.0)).xy, 0.0, 1.0);\n    vTextureCoord = aTextureCoord;\n}", Fo = "attribute vec2 aVertexPosition;\n\nuniform mat3 projectionMatrix;\n\nvarying vec2 vTextureCoord;\n\nuniform vec4 inputSize;\nuniform vec4 outputFrame;\n\nvec4 filterVertexPosition( void )\n{\n    vec2 position = aVertexPosition * max(outputFrame.zw, vec2(0.)) + outputFrame.xy;\n\n    return vec4((projectionMatrix * vec3(position, 1.0)).xy, 0.0, 1.0);\n}\n\nvec2 filterTextureCoord( void )\n{\n    return aVertexPosition * (outputFrame.zw * inputSize.zw);\n}\n\nvoid main(void)\n{\n    gl_Position = filterVertexPosition();\n    vTextureCoord = filterTextureCoord();\n}\n", Uo = function() {
    function t448(t) {
        this.renderer = t;
    }
    return t448.prototype.destroy = function() {
        this.renderer = null;
    }, t448;
}(), Go = function() {
    this.texArray = null, this.blend = 0, this.type = ae.TRIANGLES, this.start = 0, this.size = 0, this.data = null;
}, Bo = function() {
    function t449() {
        this.elements = [], this.ids = [], this.count = 0;
    }
    return t449.prototype.clear = function() {
        for(var t = 0; t < this.count; t++)this.elements[t] = null;
        this.count = 0;
    }, t449;
}(), Xo = function() {
    function t450(t) {
        "number" == typeof t ? this.rawBinaryData = new ArrayBuffer(t) : t instanceof Uint8Array ? this.rawBinaryData = t.buffer : this.rawBinaryData = t, this.uint32View = new Uint32Array(this.rawBinaryData), this.float32View = new Float32Array(this.rawBinaryData);
    }
    return Object.defineProperty(t450.prototype, "int8View", {
        get: function() {
            return this._int8View || (this._int8View = new Int8Array(this.rawBinaryData)), this._int8View;
        },
        enumerable: !1,
        configurable: !0
    }), Object.defineProperty(t450.prototype, "uint8View", {
        get: function() {
            return this._uint8View || (this._uint8View = new Uint8Array(this.rawBinaryData)), this._uint8View;
        },
        enumerable: !1,
        configurable: !0
    }), Object.defineProperty(t450.prototype, "int16View", {
        get: function() {
            return this._int16View || (this._int16View = new Int16Array(this.rawBinaryData)), this._int16View;
        },
        enumerable: !1,
        configurable: !0
    }), Object.defineProperty(t450.prototype, "uint16View", {
        get: function() {
            return this._uint16View || (this._uint16View = new Uint16Array(this.rawBinaryData)), this._uint16View;
        },
        enumerable: !1,
        configurable: !0
    }), Object.defineProperty(t450.prototype, "int32View", {
        get: function() {
            return this._int32View || (this._int32View = new Int32Array(this.rawBinaryData)), this._int32View;
        },
        enumerable: !1,
        configurable: !0
    }), t450.prototype.view = function(t) {
        return this[t + "View"];
    }, t450.prototype.destroy = function() {
        this.rawBinaryData = null, this._int8View = null, this._uint8View = null, this._int16View = null, this._uint16View = null, this._int32View = null, this.uint32View = null, this.float32View = null;
    }, t450.sizeOf = function(t) {
        switch(t){
            case "int8":
            case "uint8":
                return 1;
            case "int16":
            case "uint16":
                return 2;
            case "int32":
            case "uint32":
            case "float32":
                return 4;
            default:
                throw new Error(t + " isn't a valid view type");
        }
    }, t450;
}(), ko = function(t451) {
    function e495(e496) {
        var r365 = t451.call(this, e496) || this;
        return r365.shaderGenerator = null, r365.geometryClass = null, r365.vertexSize = null, r365.state = jn.for2d(), r365.size = 4 * et.SPRITE_BATCH_SIZE, r365._vertexCount = 0, r365._indexCount = 0, r365._bufferedElements = [], r365._bufferedTextures = [], r365._bufferSize = 0, r365._shader = null, r365._packedGeometries = [], r365._packedGeometryPoolSize = 2, r365._flushId = 0, r365._aBuffers = {
        }, r365._iBuffers = {
        }, r365.MAX_TEXTURES = 1, r365.renderer.on("prerender", r365.onPrerender, r365), e496.runners.contextChange.add(r365), r365._dcIndex = 0, r365._aIndex = 0, r365._iIndex = 0, r365._attributeBuffer = null, r365._indexBuffer = null, r365._tempBoundTextures = [], r365;
    }
    return Ei(e495, t451), e495.prototype.contextChange = function() {
        var t = this.renderer.gl;
        et.PREFER_ENV === ie.WEBGL_LEGACY ? this.MAX_TEXTURES = 1 : (this.MAX_TEXTURES = Math.min(t.getParameter(t.MAX_TEXTURE_IMAGE_UNITS), et.SPRITE_MAX_TEXTURES), this.MAX_TEXTURES = Gn(this.MAX_TEXTURES, t)), this._shader = this.shaderGenerator.generateShader(this.MAX_TEXTURES);
        for(var e497 = 0; e497 < this._packedGeometryPoolSize; e497++)this._packedGeometries[e497] = new this.geometryClass;
        this.initFlushBuffers();
    }, e495.prototype.initFlushBuffers = function() {
        for(var t = e495._drawCallPool, r366 = e495._textureArrayPool, i276 = this.size / 4, n193 = Math.floor(i276 / this.MAX_TEXTURES) + 1; t.length < i276;)t.push(new Go);
        for(; r366.length < n193;)r366.push(new Bo);
        for(var o153 = 0; o153 < this.MAX_TEXTURES; o153++)this._tempBoundTextures[o153] = null;
    }, e495.prototype.onPrerender = function() {
        this._flushId = 0;
    }, e495.prototype.render = function(t) {
        t._texture.valid && (this._vertexCount + t.vertexData.length / 2 > this.size && this.flush(), this._vertexCount += t.vertexData.length / 2, this._indexCount += t.indices.length, this._bufferedTextures[this._bufferSize] = t._texture.baseTexture, this._bufferedElements[this._bufferSize++] = t);
    }, e495.prototype.buildTexturesAndDrawCalls = function() {
        var t = this._bufferedTextures, r367 = this.MAX_TEXTURES, i277 = e495._textureArrayPool, n194 = this.renderer.batch, o154 = this._tempBoundTextures, s106 = this.renderer.textureGC.count, a86 = ++Ai._globalBatch, h64 = 0, u51 = i277[0], l37 = 0;
        n194.copyBoundTextures(o154, r367);
        for(var c27 = 0; c27 < this._bufferSize; ++c27){
            var d27 = t[c27];
            t[c27] = null, d27._batchEnabled !== a86 && (u51.count >= r367 && (n194.boundArray(u51, o154, a86, r367), this.buildDrawCalls(u51, l37, c27), l37 = c27, u51 = i277[++h64], ++a86), d27._batchEnabled = a86, d27.touched = s106, u51.elements[u51.count++] = d27);
        }
        for(u51.count > 0 && (n194.boundArray(u51, o154, a86, r367), this.buildDrawCalls(u51, l37, this._bufferSize), ++h64, ++a86), c27 = 0; c27 < o154.length; c27++)o154[c27] = null;
        Ai._globalBatch = a86;
    }, e495.prototype.buildDrawCalls = function(t, r368, i278) {
        var n195 = this._bufferedElements, o155 = this._attributeBuffer, s107 = this._indexBuffer, a87 = this.vertexSize, h65 = e495._drawCallPool, u52 = this._dcIndex, l38 = this._aIndex, c28 = this._iIndex, d28 = h65[u52];
        d28.start = this._iIndex, d28.texArray = t;
        for(var f20 = r368; f20 < i278; ++f20){
            var p = n195[f20], _ = p._texture.baseTexture, m10 = De[_.alphaMode ? 1 : 0][p.blendMode];
            n195[f20] = null, r368 < f20 && d28.blend !== m10 && (d28.size = c28 - d28.start, r368 = f20, (d28 = h65[++u52]).texArray = t, d28.start = c28), this.packInterleavedGeometry(p, o155, s107, l38, c28), l38 += p.vertexData.length / 2 * a87, c28 += p.indices.length, d28.blend = m10;
        }
        r368 < i278 && (d28.size = c28 - d28.start, ++u52), this._dcIndex = u52, this._aIndex = l38, this._iIndex = c28;
    }, e495.prototype.bindAndClearTexArray = function(t) {
        for(var e498 = this.renderer.texture, r369 = 0; r369 < t.count; r369++)e498.bind(t.elements[r369], t.ids[r369]), t.elements[r369] = null;
        t.count = 0;
    }, e495.prototype.updateGeometry = function() {
        var t = this._packedGeometries, e499 = this._attributeBuffer, r370 = this._indexBuffer;
        et.CAN_UPLOAD_SAME_BUFFER ? (t[this._flushId]._buffer.update(e499.rawBinaryData), t[this._flushId]._indexBuffer.update(r370), this.renderer.geometry.updateBuffers()) : (this._packedGeometryPoolSize <= this._flushId && (this._packedGeometryPoolSize++, t[this._flushId] = new this.geometryClass), t[this._flushId]._buffer.update(e499.rawBinaryData), t[this._flushId]._indexBuffer.update(r370), this.renderer.geometry.bind(t[this._flushId]), this.renderer.geometry.updateBuffers(), this._flushId++);
    }, e495.prototype.drawBatches = function() {
        for(var t = this._dcIndex, r371 = this.renderer, i279 = r371.gl, n196 = r371.state, o156 = e495._drawCallPool, s108 = null, a88 = 0; a88 < t; a88++){
            var h66 = o156[a88], u53 = h66.texArray, l39 = h66.type, c29 = h66.size, d29 = h66.start, f21 = h66.blend;
            s108 !== u53 && (s108 = u53, this.bindAndClearTexArray(u53)), this.state.blendMode = f21, n196.set(this.state), i279.drawElements(l39, c29, i279.UNSIGNED_SHORT, 2 * d29);
        }
    }, e495.prototype.flush = function() {
        0 !== this._vertexCount && (this._attributeBuffer = this.getAttributeBuffer(this._vertexCount), this._indexBuffer = this.getIndexBuffer(this._indexCount), this._aIndex = 0, this._iIndex = 0, this._dcIndex = 0, this.buildTexturesAndDrawCalls(), this.updateGeometry(), this.drawBatches(), this._bufferSize = 0, this._vertexCount = 0, this._indexCount = 0);
    }, e495.prototype.start = function() {
        this.renderer.state.set(this.state), this.renderer.texture.ensureSamplerType(this.MAX_TEXTURES), this.renderer.shader.bind(this._shader), et.CAN_UPLOAD_SAME_BUFFER && this.renderer.geometry.bind(this._packedGeometries[this._flushId]);
    }, e495.prototype.stop = function() {
        this.flush();
    }, e495.prototype.destroy = function() {
        for(var e500 = 0; e500 < this._packedGeometryPoolSize; e500++)this._packedGeometries[e500] && this._packedGeometries[e500].destroy();
        this.renderer.off("prerender", this.onPrerender, this), this._aBuffers = null, this._iBuffers = null, this._packedGeometries = null, this._attributeBuffer = null, this._indexBuffer = null, this._shader && (this._shader.destroy(), this._shader = null), t451.prototype.destroy.call(this);
    }, e495.prototype.getAttributeBuffer = function(t) {
        var e501 = Xe(Math.ceil(t / 8)), r372 = He(e501), i280 = 8 * e501;
        this._aBuffers.length <= r372 && (this._iBuffers.length = r372 + 1);
        var n197 = this._aBuffers[i280];
        return n197 || (this._aBuffers[i280] = n197 = new Xo(i280 * this.vertexSize * 4)), n197;
    }, e495.prototype.getIndexBuffer = function(t) {
        var e502 = Xe(Math.ceil(t / 12)), r373 = He(e502), i281 = 12 * e502;
        this._iBuffers.length <= r373 && (this._iBuffers.length = r373 + 1);
        var n198 = this._iBuffers[r373];
        return n198 || (this._iBuffers[r373] = n198 = new Uint16Array(i281)), n198;
    }, e495.prototype.packInterleavedGeometry = function(t, e503, r374, i282, n) {
        for(var o157 = e503.uint32View, s109 = e503.float32View, a89 = i282 / this.vertexSize, h67 = t.uvs, u54 = t.indices, l40 = t.vertexData, c30 = t._texture.baseTexture._batchLocation, d30 = Math.min(t.worldAlpha, 1), f22 = d30 < 1 && t._texture.baseTexture.alphaMode ? Le(t._tintRGB, d30) : t._tintRGB + (255 * d30 << 24), p = 0; p < l40.length; p += 2)s109[i282++] = l40[p], s109[i282++] = l40[p + 1], s109[i282++] = h67[p], s109[i282++] = h67[p + 1], o157[i282++] = f22, s109[i282++] = c30;
        for(p = 0; p < u54.length; p++)r374[n++] = a89 + u54[p];
    }, e495._drawCallPool = [], e495._textureArrayPool = [], e495;
}(hn), Ho = function() {
    function t452(t, e504) {
        if (this.vertexSrc = t, this.fragTemplate = e504, this.programCache = {
        }, this.defaultGroupCache = {
        }, e504.indexOf("%count%") < 0) throw new Error('Fragment template must contain "%count%".');
        if (e504.indexOf("%forloop%") < 0) throw new Error('Fragment template must contain "%forloop%".');
    }
    return t452.prototype.generateShader = function(t) {
        if (!this.programCache[t]) {
            for(var e505 = new Int32Array(t), r375 = 0; r375 < t; r375++)e505[r375] = r375;
            this.defaultGroupCache[t] = rn.from({
                uSamplers: e505
            }, !0);
            var i283 = this.fragTemplate;
            i283 = (i283 = i283.replace(/%count%/gi, "" + t)).replace(/%forloop%/gi, this.generateSampleSrc(t)), this.programCache[t] = new kn(this.vertexSrc, i283);
        }
        var n199 = {
            tint: new Float32Array([
                1,
                1,
                1,
                1
            ]),
            translationMatrix: new _r,
            default: this.defaultGroupCache[t]
        };
        return new Hn(this.programCache[t], n199);
    }, t452.prototype.generateSampleSrc = function(t) {
        var e506 = "";
        e506 += "\n", e506 += "\n";
        for(var r376 = 0; r376 < t; r376++)r376 > 0 && (e506 += "\nelse "), r376 < t - 1 && (e506 += "if(vTextureId < " + r376 + ".5)"), e506 += "\n{", e506 += "\n\tcolor = texture2D(uSamplers[" + r376 + "], vTextureCoord);", e506 += "\n}";
        return (e506 += "\n") + "\n";
    }, t452;
}(), jo = function(t) {
    function e507(e508) {
        void 0 === e508 && (e508 = !1);
        var r377 = t.call(this) || this;
        return r377._buffer = new zi(null, e508, !1), r377._indexBuffer = new zi(null, e508, !0), r377.addAttribute("aVertexPosition", r377._buffer, 2, !1, le.FLOAT).addAttribute("aTextureCoord", r377._buffer, 2, !1, le.FLOAT).addAttribute("aColor", r377._buffer, 4, !0, le.UNSIGNED_BYTE).addAttribute("aTextureId", r377._buffer, 1, !0, le.FLOAT).addIndex(r377._indexBuffer), r377;
    }
    return Ei(e507, t), e507;
}(Qi), Yo = "precision highp float;\nattribute vec2 aVertexPosition;\nattribute vec2 aTextureCoord;\nattribute vec4 aColor;\nattribute float aTextureId;\n\nuniform mat3 projectionMatrix;\nuniform mat3 translationMatrix;\nuniform vec4 tint;\n\nvarying vec2 vTextureCoord;\nvarying vec4 vColor;\nvarying float vTextureId;\n\nvoid main(void){\n    gl_Position = vec4((projectionMatrix * translationMatrix * vec3(aVertexPosition, 1.0)).xy, 0.0, 1.0);\n\n    vTextureCoord = aTextureCoord;\n    vTextureId = aTextureId;\n    vColor = aColor * tint;\n}\n", Vo = "varying vec2 vTextureCoord;\nvarying vec4 vColor;\nvarying float vTextureId;\nuniform sampler2D uSamplers[%count%];\n\nvoid main(void){\n    vec4 color;\n    %forloop%\n    gl_FragColor = color * vColor;\n}\n", Wo = function() {
    function t453() {
    }
    return t453.create = function(t454) {
        var e509 = Object.assign({
            vertex: Yo,
            fragment: Vo,
            geometryClass: jo,
            vertexSize: 6
        }, t454), r378 = e509.vertex, i284 = e509.fragment, n200 = e509.vertexSize, o158 = e509.geometryClass;
        return (function(t) {
            function e510(e511) {
                var s110 = t.call(this, e511) || this;
                return s110.shaderGenerator = new Ho(r378, i284), s110.geometryClass = o158, s110.vertexSize = n200, s110;
            }
            return Ei(e510, t), e510;
        })(ko);
    }, Object.defineProperty(t453, "defaultVertexSrc", {
        get: function() {
            return Yo;
        },
        enumerable: !1,
        configurable: !0
    }), Object.defineProperty(t453, "defaultFragmentTemplate", {
        get: function() {
            return Vo;
        },
        enumerable: !1,
        configurable: !0
    }), t453;
}(), zo = Wo.create(), qo = {
}, Ko = function(t) {
    Object.defineProperty(qo, t, {
        get: function() {
            return Li[t];
        }
    });
};
for(var Zo in Li)Ko(Zo);
var Jo = {
}, Qo = function(t) {
    Object.defineProperty(Jo, t, {
        get: function() {
            return Io[t];
        }
    });
};
for(var Zo in Io)Qo(Zo);
var $o = function() {
    function t455(e512) {
        var r379 = this;
        this.stage = new Zr, e512 = Object.assign({
            forceCanvas: !1
        }, e512), this.renderer = wo(e512), t455._plugins.forEach(function(t) {
            t.init.call(r379, e512);
        });
    }
    return t455.registerPlugin = function(e513) {
        t455._plugins.push(e513);
    }, t455.prototype.render = function() {
        this.renderer.render(this.stage);
    }, Object.defineProperty(t455.prototype, "view", {
        get: function() {
            return this.renderer.view;
        },
        enumerable: !1,
        configurable: !0
    }), Object.defineProperty(t455.prototype, "screen", {
        get: function() {
            return this.renderer.screen;
        },
        enumerable: !1,
        configurable: !0
    }), t455.prototype.destroy = function(e514, r380) {
        var i285 = this, n201 = t455._plugins.slice(0);
        n201.reverse(), n201.forEach(function(t) {
            t.destroy.call(i285);
        }), this.stage.destroy(r380), this.stage = null, this.renderer.destroy(e514), this.renderer = null;
    }, t455._plugins = [], t455;
}(), ts = function() {
    function t456() {
    }
    return t456.init = function(t457) {
        var e515 = this;
        Object.defineProperty(this, "resizeTo", {
            set: function(t) {
                self.removeEventListener("resize", this.queueResize), this._resizeTo = t, t && (self.addEventListener("resize", this.queueResize), this.resize());
            },
            get: function() {
                return this._resizeTo;
            }
        }), this.queueResize = function() {
            e515._resizeTo && (e515.cancelResize(), e515._resizeId = requestAnimationFrame(function() {
                return e515.resize();
            }));
        }, this.cancelResize = function() {
            e515._resizeId && (cancelAnimationFrame(e515._resizeId), e515._resizeId = null);
        }, this.resize = function() {
            if (e515._resizeTo) {
                var t, r381;
                if (e515.cancelResize(), e515._resizeTo === self) t = self.innerWidth, r381 = self.innerHeight;
                else {
                    var i286 = e515._resizeTo;
                    t = i286.clientWidth, r381 = i286.clientHeight;
                }
                e515.renderer.resize(t, r381);
            }
        }, this._resizeId = null, this._resizeTo = null, this.resizeTo = t457.resizeTo || null;
    }, t456.destroy = function() {
        self.removeEventListener("resize", this.queueResize), this.cancelResize(), this.cancelResize = null, this.queueResize = null, this.resizeTo = null, this.resize = null;
    }, t456;
}();
$o.registerPlugin(ts);
var es = new hr, rs = function() {
    function t458(t) {
        this.renderer = t;
    }
    return t458.prototype.image = function(t, e516, r382) {
        var i287 = new Image;
        return i287.src = this.base64(t, e516, r382), i287;
    }, t458.prototype.base64 = function(t, e517, r383) {
        return this.canvas(t).toDataURL(e517, r383);
    }, t458.prototype.canvas = function(e518) {
        var r384, i288, n202, o159 = this.renderer, s111 = !1, a90 = !1;
        e518 && (e518 instanceof ji ? n202 = e518 : (n202 = this.renderer.generateTexture(e518), a90 = !0)), n202 ? (r384 = n202.baseTexture.resolution, i288 = n202.frame, s111 = !1, o159.renderTexture.bind(n202)) : (r384 = this.renderer.resolution, s111 = !0, (i288 = es).width = this.renderer.width, i288.height = this.renderer.height, o159.renderTexture.bind(null));
        var h68 = Math.floor(i288.width * r384 + 0.0001), u55 = Math.floor(i288.height * r384 + 0.0001), l41 = new Je(h68, u55, 1), c31 = new Uint8Array(4 * h68 * u55), d31 = o159.gl;
        d31.readPixels(i288.x * r384, i288.y * r384, h68, u55, d31.RGBA, d31.UNSIGNED_BYTE, c31);
        var f23 = l41.context.getImageData(0, 0, h68, u55);
        if (t458.arrayPostDivide(c31, f23.data), l41.context.putImageData(f23, 0, 0), s111) {
            var p = new Je(l41.width, l41.height, 1);
            p.context.scale(1, -1), p.context.drawImage(l41.canvas, 0, -u55), l41.destroy(), l41 = p;
        }
        return a90 && n202.destroy(!0), l41.canvas;
    }, t458.prototype.pixels = function(e519) {
        var r385, i289, n203, o160 = this.renderer, s112 = !1;
        e519 && (e519 instanceof ji ? n203 = e519 : (n203 = this.renderer.generateTexture(e519), s112 = !0)), n203 ? (r385 = n203.baseTexture.resolution, i289 = n203.frame, o160.renderTexture.bind(n203)) : (r385 = o160.resolution, (i289 = es).width = o160.width, i289.height = o160.height, o160.renderTexture.bind(null));
        var a91 = i289.width * r385, h69 = i289.height * r385, u56 = new Uint8Array(4 * a91 * h69), l42 = o160.gl;
        return l42.readPixels(i289.x * r385, i289.y * r385, a91, h69, l42.RGBA, l42.UNSIGNED_BYTE, u56), s112 && n203.destroy(!0), t458.arrayPostDivide(u56, u56), u56;
    }, t458.prototype.destroy = function() {
        this.renderer = null;
    }, t458.arrayPostDivide = function(t, e520) {
        for(var r386 = 0; r386 < t.length; r386 += 4){
            var i290 = e520[r386 + 3] = t[r386 + 3];
            0 !== i290 ? (e520[r386] = Math.round(Math.min(255 * t[r386] / i290, 255)), e520[r386 + 1] = Math.round(Math.min(255 * t[r386 + 1] / i290, 255)), e520[r386 + 2] = Math.round(Math.min(255 * t[r386 + 2] / i290, 255))) : (e520[r386] = t[r386], e520[r386 + 1] = t[r386 + 1], e520[r386 + 2] = t[r386 + 2]);
        }
    }, t458;
}(), is = function() {
    function t459(t, e521, r387) {
        void 0 === e521 && (e521 = !1), this._fn = t, this._once = e521, this._thisArg = r387, this._next = this._prev = this._owner = null;
    }
    return t459.prototype.detach = function() {
        return null !== this._owner && (this._owner.detach(this), !0);
    }, t459;
}();
function ns(t, e522) {
    return t._head ? (t._tail._next = e522, e522._prev = t._tail, t._tail = e522) : (t._head = e522, t._tail = e522), e522._owner = t, e522;
}
var os = function() {
    function t460() {
        this._head = this._tail = void 0;
    }
    return t460.prototype.handlers = function(t) {
        void 0 === t && (t = !1);
        var e523 = this._head;
        if (t) return !!e523;
        for(var r388 = []; e523;)r388.push(e523), e523 = e523._next;
        return r388;
    }, t460.prototype.has = function(t) {
        if (!(t instanceof is)) throw new Error("MiniSignal#has(): First arg must be a SignalBinding object.");
        return t._owner === this;
    }, t460.prototype.dispatch = function() {
        for(var t = arguments, e524 = [], r389 = 0; r389 < arguments.length; r389++)e524[r389] = t[r389];
        var i291 = this._head;
        if (!i291) return !1;
        for(; i291;)i291._once && this.detach(i291), i291._fn.apply(i291._thisArg, e524), i291 = i291._next;
        return !0;
    }, t460.prototype.add = function(t, e525) {
        if (void 0 === e525 && (e525 = null), "function" != typeof t) throw new Error("MiniSignal#add(): First arg must be a Function.");
        return ns(this, new is(t, !1, e525));
    }, t460.prototype.once = function(t, e526) {
        if (void 0 === e526 && (e526 = null), "function" != typeof t) throw new Error("MiniSignal#once(): First arg must be a Function.");
        return ns(this, new is(t, !0, e526));
    }, t460.prototype.detach = function(t) {
        if (!(t instanceof is)) throw new Error("MiniSignal#detach(): First arg must be a SignalBinding object.");
        return t._owner !== this ? this : (t._prev && (t._prev._next = t._next), t._next && (t._next._prev = t._prev), t === this._head ? (this._head = t._next, null === t._next && (this._tail = null)) : t === this._tail && (this._tail = t._prev, this._tail._next = null), t._owner = null, this);
    }, t460.prototype.detachAll = function() {
        var t = this._head;
        if (!t) return this;
        for(this._head = this._tail = null; t;)t._owner = null, t = t._next;
        return this;
    }, t460;
}();
function ss(t, e527) {
    e527 = e527 || {
    };
    for(var r390 = {
        key: [
            "source",
            "protocol",
            "authority",
            "userInfo",
            "user",
            "password",
            "host",
            "port",
            "relative",
            "path",
            "directory",
            "file",
            "query",
            "anchor"
        ],
        q: {
            name: "queryKey",
            parser: /(?:^|&)([^&=]*)=?([^&]*)/g
        },
        parser: {
            strict: /^(?:([^:\/?#]+):)?(?:\/\/((?:(([^:@]*)(?::([^:@]*))?)?@)?([^:\/?#]*)(?::(\d*))?))?((((?:[^?#\/]*\/)*)([^?#]*))(?:\?([^#]*))?(?:#(.*))?)/,
            loose: /^(?:(?![^:@]+:[^:@\/]*@)([^:\/?#.]+):)?(?:\/\/)?((?:(([^:@]*)(?::([^:@]*))?)?@)?([^:\/?#]*)(?::(\d*))?)(((\/(?:[^?#](?![^?#\/]*\.[^?#\/.]+(?:[?#]|$)))*\/?)?([^?#\/]*))(?:\?([^#]*))?(?:#(.*))?)/
        }
    }, i292 = r390.parser[e527.strictMode ? "strict" : "loose"].exec(t), n204 = {
    }, o161 = 14; o161--;)n204[r390.key[o161]] = i292[o161] || "";
    return n204[r390.q.name] = {
    }, n204[r390.key[12]].replace(r390.q.parser, function(t, e528, i293) {
        e528 && (n204[r390.q.name][e528] = i293);
    }), n204;
}
var as = !(!self.XDomainRequest || "withCredentials" in new XMLHttpRequest), hs = null;
function us() {
}
function ls(t, e529, r391) {
    e529 && 0 === e529.indexOf(".") && (e529 = e529.substring(1)), e529 && (t[e529] = r391);
}
function cs(t) {
    return t.toString().replace("object ", "");
}
var ds = function() {
    function t461(e530, r392, i294) {
        if (this._dequeue = us, this._onLoadBinding = null, this._elementTimer = 0, this._boundComplete = null, this._boundOnError = null, this._boundOnProgress = null, this._boundOnTimeout = null, this._boundXhrOnError = null, this._boundXhrOnTimeout = null, this._boundXhrOnAbort = null, this._boundXhrOnLoad = null, "string" != typeof e530 || "string" != typeof r392) throw new Error("Both name and url are required for constructing a resource.");
        i294 = i294 || {
        }, this._flags = 0, this._setFlag(t461.STATUS_FLAGS.DATA_URL, 0 === r392.indexOf("data:")), this.name = e530, this.url = r392, this.extension = this._getExtension(), this.data = null, this.crossOrigin = !0 === i294.crossOrigin ? "anonymous" : i294.crossOrigin, this.timeout = i294.timeout || 0, this.loadType = i294.loadType || this._determineLoadType(), this.xhrType = i294.xhrType, this.metadata = i294.metadata || {
        }, this.error = null, this.xhr = null, this.children = [], this.type = t461.TYPE.UNKNOWN, this.progressChunk = 0, this._dequeue = us, this._onLoadBinding = null, this._elementTimer = 0, this._boundComplete = this.complete.bind(this), this._boundOnError = this._onError.bind(this), this._boundOnProgress = this._onProgress.bind(this), this._boundOnTimeout = this._onTimeout.bind(this), this._boundXhrOnError = this._xhrOnError.bind(this), this._boundXhrOnTimeout = this._xhrOnTimeout.bind(this), this._boundXhrOnAbort = this._xhrOnAbort.bind(this), this._boundXhrOnLoad = this._xhrOnLoad.bind(this), this.onStart = new os, this.onProgress = new os, this.onComplete = new os, this.onAfterMiddleware = new os;
    }
    return t461.setExtensionLoadType = function(e531, r393) {
        ls(t461._loadTypeMap, e531, r393);
    }, t461.setExtensionXhrType = function(e532, r394) {
        ls(t461._xhrTypeMap, e532, r394);
    }, Object.defineProperty(t461.prototype, "isDataUrl", {
        get: function() {
            return this._hasFlag(t461.STATUS_FLAGS.DATA_URL);
        },
        enumerable: !1,
        configurable: !0
    }), Object.defineProperty(t461.prototype, "isComplete", {
        get: function() {
            return this._hasFlag(t461.STATUS_FLAGS.COMPLETE);
        },
        enumerable: !1,
        configurable: !0
    }), Object.defineProperty(t461.prototype, "isLoading", {
        get: function() {
            return this._hasFlag(t461.STATUS_FLAGS.LOADING);
        },
        enumerable: !1,
        configurable: !0
    }), t461.prototype.complete = function() {
        this._clearEvents(), this._finish();
    }, t461.prototype.abort = function(e533) {
        if (!this.error) {
            if (this.error = new Error(e533), this._clearEvents(), this.xhr) this.xhr.abort();
            else if (this.xdr) this.xdr.abort();
            else if (this.data) if (this.data.src) this.data.src = t461.EMPTY_GIF;
            else for(; this.data.firstChild;)this.data.removeChild(this.data.firstChild);
            this._finish();
        }
    }, t461.prototype.load = function(e534) {
        var r395 = this;
        if (!this.isLoading) if (this.isComplete) e534 && setTimeout(function() {
            return e534(r395);
        }, 1);
        else switch(e534 && this.onComplete.once(e534), this._setFlag(t461.STATUS_FLAGS.LOADING, !0), this.onStart.dispatch(this), !1 !== this.crossOrigin && "string" == typeof this.crossOrigin || (this.crossOrigin = this._determineCrossOrigin(this.url)), this.loadType){
            case t461.LOAD_TYPE.IMAGE:
                this.type = t461.TYPE.IMAGE, this._loadElement("image");
                break;
            case t461.LOAD_TYPE.AUDIO:
                this.type = t461.TYPE.AUDIO, this._loadSourceElement("audio");
                break;
            case t461.LOAD_TYPE.VIDEO:
                this.type = t461.TYPE.VIDEO, this._loadSourceElement("video");
                break;
            case t461.LOAD_TYPE.XHR:
            default:
                as && this.crossOrigin ? this._loadXdr() : this._loadXhr();
        }
    }, t461.prototype._hasFlag = function(t) {
        return 0 != (this._flags & t);
    }, t461.prototype._setFlag = function(t, e535) {
        this._flags = e535 ? this._flags | t : this._flags & ~t;
    }, t461.prototype._clearEvents = function() {
        clearTimeout(this._elementTimer), this.data && this.data.removeEventListener && (this.data.removeEventListener("error", this._boundOnError, !1), this.data.removeEventListener("load", this._boundComplete, !1), this.data.removeEventListener("progress", this._boundOnProgress, !1), this.data.removeEventListener("canplaythrough", this._boundComplete, !1)), this.xhr && (this.xhr.removeEventListener ? (this.xhr.removeEventListener("error", this._boundXhrOnError, !1), this.xhr.removeEventListener("timeout", this._boundXhrOnTimeout, !1), this.xhr.removeEventListener("abort", this._boundXhrOnAbort, !1), this.xhr.removeEventListener("progress", this._boundOnProgress, !1), this.xhr.removeEventListener("load", this._boundXhrOnLoad, !1)) : (this.xhr.onerror = null, this.xhr.ontimeout = null, this.xhr.onprogress = null, this.xhr.onload = null));
    }, t461.prototype._finish = function() {
        if (this.isComplete) throw new Error("Complete called again for an already completed resource.");
        this._setFlag(t461.STATUS_FLAGS.COMPLETE, !0), this._setFlag(t461.STATUS_FLAGS.LOADING, !1), this.onComplete.dispatch(this);
    }, t461.prototype._loadElement = function(t) {
        this.metadata.loadElement ? this.data = this.metadata.loadElement : "image" === t && void 0 !== self.Image ? this.data = new Image : this.data = document.createElement(t), this.crossOrigin && (this.data.crossOrigin = this.crossOrigin), this.metadata.skipSource || (this.data.src = this.url), this.data.addEventListener("error", this._boundOnError, !1), this.data.addEventListener("load", this._boundComplete, !1), this.data.addEventListener("progress", this._boundOnProgress, !1), this.timeout && (this._elementTimer = setTimeout(this._boundOnTimeout, this.timeout));
    }, t461.prototype._loadSourceElement = function(t) {
        if (this.metadata.loadElement ? this.data = this.metadata.loadElement : "audio" === t && void 0 !== self.Audio ? this.data = new Audio : this.data = document.createElement(t), null !== this.data) {
            if (this.crossOrigin && (this.data.crossOrigin = this.crossOrigin), !this.metadata.skipSource) if (navigator.isCocoonJS) this.data.src = Array.isArray(this.url) ? this.url[0] : this.url;
            else if (Array.isArray(this.url)) for(var e536 = this.metadata.mimeType, r396 = 0; r396 < this.url.length; ++r396)this.data.appendChild(this._createSource(t, this.url[r396], Array.isArray(e536) ? e536[r396] : e536));
            else e536 = this.metadata.mimeType, this.data.appendChild(this._createSource(t, this.url, Array.isArray(e536) ? e536[0] : e536));
            this.data.addEventListener("error", this._boundOnError, !1), this.data.addEventListener("load", this._boundComplete, !1), this.data.addEventListener("progress", this._boundOnProgress, !1), this.data.addEventListener("canplaythrough", this._boundComplete, !1), this.data.load(), this.timeout && (this._elementTimer = setTimeout(this._boundOnTimeout, this.timeout));
        } else this.abort("Unsupported element: " + t);
    }, t461.prototype._loadXhr = function() {
        "string" != typeof this.xhrType && (this.xhrType = this._determineXhrType());
        var e537 = this.xhr = new XMLHttpRequest;
        e537.open("GET", this.url, !0), e537.timeout = this.timeout, this.xhrType === t461.XHR_RESPONSE_TYPE.JSON || this.xhrType === t461.XHR_RESPONSE_TYPE.DOCUMENT ? e537.responseType = t461.XHR_RESPONSE_TYPE.TEXT : e537.responseType = this.xhrType, e537.addEventListener("error", this._boundXhrOnError, !1), e537.addEventListener("timeout", this._boundXhrOnTimeout, !1), e537.addEventListener("abort", this._boundXhrOnAbort, !1), e537.addEventListener("progress", this._boundOnProgress, !1), e537.addEventListener("load", this._boundXhrOnLoad, !1), e537.send();
    }, t461.prototype._loadXdr = function() {
        "string" != typeof this.xhrType && (this.xhrType = this._determineXhrType());
        var t = this.xhr = new self.XDomainRequest;
        t.timeout = this.timeout || 5000, t.onerror = this._boundXhrOnError, t.ontimeout = this._boundXhrOnTimeout, t.onprogress = this._boundOnProgress, t.onload = this._boundXhrOnLoad, t.open("GET", this.url, !0), setTimeout(function() {
            return t.send();
        }, 1);
    }, t461.prototype._createSource = function(t, e538, r397) {
        r397 || (r397 = t + "/" + this._getExtension(e538));
        var i295 = document.createElement("source");
        return i295.src = e538, i295.type = r397, i295;
    }, t461.prototype._onError = function(t) {
        this.abort("Failed to load element using: " + t.target.nodeName);
    }, t461.prototype._onProgress = function(t) {
        t && t.lengthComputable && this.onProgress.dispatch(this, t.loaded / t.total);
    }, t461.prototype._onTimeout = function() {
        this.abort("Load timed out.");
    }, t461.prototype._xhrOnError = function() {
        var t = this.xhr;
        this.abort(cs(t) + " Request failed. Status: " + t.status + ', text: "' + t.statusText + '"');
    }, t461.prototype._xhrOnTimeout = function() {
        var t = this.xhr;
        this.abort(cs(t) + " Request timed out.");
    }, t461.prototype._xhrOnAbort = function() {
        var t = this.xhr;
        this.abort(cs(t) + " Request was aborted by the user.");
    }, t461.prototype._xhrOnLoad = function() {
        var e539 = this.xhr, r398 = "", i296 = void 0 === e539.status ? 200 : e539.status;
        if ("" !== e539.responseType && "text" !== e539.responseType && void 0 !== e539.responseType || (r398 = e539.responseText), 0 === i296 && (r398.length > 0 || e539.responseType === t461.XHR_RESPONSE_TYPE.BUFFER) ? i296 = 200 : 1223 === i296 && (i296 = 204), 2 == (i296 / 100 | 0)) {
            if (this.xhrType === t461.XHR_RESPONSE_TYPE.TEXT) this.data = r398, this.type = t461.TYPE.TEXT;
            else if (this.xhrType === t461.XHR_RESPONSE_TYPE.JSON) try {
                this.data = JSON.parse(r398), this.type = t461.TYPE.JSON;
            } catch (t) {
                return void this.abort("Error trying to parse loaded json: " + t);
            }
            else if (this.xhrType === t461.XHR_RESPONSE_TYPE.DOCUMENT) try {
                if (self.DOMParser) {
                    var n205 = new DOMParser;
                    this.data = n205.parseFromString(r398, "text/xml");
                } else {
                    var o162 = document.createElement("div");
                    o162.innerHTML = r398, this.data = o162;
                }
                this.type = t461.TYPE.XML;
            } catch (t462) {
                return void this.abort("Error trying to parse loaded xml: " + t462);
            }
            else this.data = e539.response || r398;
            this.complete();
        } else this.abort("[" + e539.status + "] " + e539.statusText + ": " + e539.responseURL);
    }, t461.prototype._determineCrossOrigin = function(t, e540) {
        if (0 === t.indexOf("data:")) return "";
        if (self.origin !== self.location.origin) return "anonymous";
        e540 = e540 || self.location, hs || (hs = document.createElement("a")), hs.href = t;
        var r399 = ss(hs.href, {
            strictMode: !0
        }), i297 = !r399.port && "" === e540.port || r399.port === e540.port, n206 = r399.protocol ? r399.protocol + ":" : "";
        return r399.host === e540.hostname && i297 && n206 === e540.protocol ? "" : "anonymous";
    }, t461.prototype._determineXhrType = function() {
        return t461._xhrTypeMap[this.extension] || t461.XHR_RESPONSE_TYPE.TEXT;
    }, t461.prototype._determineLoadType = function() {
        return t461._loadTypeMap[this.extension] || t461.LOAD_TYPE.XHR;
    }, t461.prototype._getExtension = function(t) {
        void 0 === t && (t = this.url);
        var e541 = "";
        if (this.isDataUrl) {
            var r400 = t.indexOf("/");
            e541 = t.substring(r400 + 1, t.indexOf(";", r400));
        } else {
            var i298 = t.indexOf("?"), n207 = t.indexOf("#"), o163 = Math.min(i298 > -1 ? i298 : t.length, n207 > -1 ? n207 : t.length);
            e541 = (t = t.substring(0, o163)).substring(t.lastIndexOf(".") + 1);
        }
        return e541.toLowerCase();
    }, t461.prototype._getMimeFromXhrType = function(e542) {
        switch(e542){
            case t461.XHR_RESPONSE_TYPE.BUFFER:
                return "application/octet-binary";
            case t461.XHR_RESPONSE_TYPE.BLOB:
                return "application/blob";
            case t461.XHR_RESPONSE_TYPE.DOCUMENT:
                return "application/xml";
            case t461.XHR_RESPONSE_TYPE.JSON:
                return "application/json";
            case t461.XHR_RESPONSE_TYPE.DEFAULT:
            case t461.XHR_RESPONSE_TYPE.TEXT:
            default:
                return "text/plain";
        }
    }, t461;
}();
function fs() {
}
function ps(t) {
    return function() {
        for(var e543 = arguments, r401 = [], i299 = 0; i299 < arguments.length; i299++)r401[i299] = e543[i299];
        if (null === t) throw new Error("Callback was already called.");
        var n208 = t;
        t = null, n208.apply(this, r401);
    };
}
!function(t463) {
    !function(t) {
        t[t.NONE = 0] = "NONE", t[t.DATA_URL = 1] = "DATA_URL", t[t.COMPLETE = 2] = "COMPLETE", t[t.LOADING = 4] = "LOADING";
    }(t463.STATUS_FLAGS || (t463.STATUS_FLAGS = {
    })), (function(t) {
        t[t.UNKNOWN = 0] = "UNKNOWN", t[t.JSON = 1] = "JSON", t[t.XML = 2] = "XML", t[t.IMAGE = 3] = "IMAGE", t[t.AUDIO = 4] = "AUDIO", t[t.VIDEO = 5] = "VIDEO", t[t.TEXT = 6] = "TEXT";
    })(t463.TYPE || (t463.TYPE = {
    })), (function(t) {
        t[t.XHR = 1] = "XHR", t[t.IMAGE = 2] = "IMAGE", t[t.AUDIO = 3] = "AUDIO", t[t.VIDEO = 4] = "VIDEO";
    })(t463.LOAD_TYPE || (t463.LOAD_TYPE = {
    })), (function(t) {
        t.DEFAULT = "text", t.BUFFER = "arraybuffer", t.BLOB = "blob", t.DOCUMENT = "document", t.JSON = "json", t.TEXT = "text";
    })(t463.XHR_RESPONSE_TYPE || (t463.XHR_RESPONSE_TYPE = {
    })), t463._loadTypeMap = {
        gif: t463.LOAD_TYPE.IMAGE,
        png: t463.LOAD_TYPE.IMAGE,
        bmp: t463.LOAD_TYPE.IMAGE,
        jpg: t463.LOAD_TYPE.IMAGE,
        jpeg: t463.LOAD_TYPE.IMAGE,
        tif: t463.LOAD_TYPE.IMAGE,
        tiff: t463.LOAD_TYPE.IMAGE,
        webp: t463.LOAD_TYPE.IMAGE,
        tga: t463.LOAD_TYPE.IMAGE,
        svg: t463.LOAD_TYPE.IMAGE,
        "svg+xml": t463.LOAD_TYPE.IMAGE,
        mp3: t463.LOAD_TYPE.AUDIO,
        ogg: t463.LOAD_TYPE.AUDIO,
        wav: t463.LOAD_TYPE.AUDIO,
        mp4: t463.LOAD_TYPE.VIDEO,
        webm: t463.LOAD_TYPE.VIDEO
    }, t463._xhrTypeMap = {
        xhtml: t463.XHR_RESPONSE_TYPE.DOCUMENT,
        html: t463.XHR_RESPONSE_TYPE.DOCUMENT,
        htm: t463.XHR_RESPONSE_TYPE.DOCUMENT,
        xml: t463.XHR_RESPONSE_TYPE.DOCUMENT,
        tmx: t463.XHR_RESPONSE_TYPE.DOCUMENT,
        svg: t463.XHR_RESPONSE_TYPE.DOCUMENT,
        tsx: t463.XHR_RESPONSE_TYPE.DOCUMENT,
        gif: t463.XHR_RESPONSE_TYPE.BLOB,
        png: t463.XHR_RESPONSE_TYPE.BLOB,
        bmp: t463.XHR_RESPONSE_TYPE.BLOB,
        jpg: t463.XHR_RESPONSE_TYPE.BLOB,
        jpeg: t463.XHR_RESPONSE_TYPE.BLOB,
        tif: t463.XHR_RESPONSE_TYPE.BLOB,
        tiff: t463.XHR_RESPONSE_TYPE.BLOB,
        webp: t463.XHR_RESPONSE_TYPE.BLOB,
        tga: t463.XHR_RESPONSE_TYPE.BLOB,
        json: t463.XHR_RESPONSE_TYPE.JSON,
        text: t463.XHR_RESPONSE_TYPE.TEXT,
        txt: t463.XHR_RESPONSE_TYPE.TEXT,
        ttf: t463.XHR_RESPONSE_TYPE.BUFFER,
        otf: t463.XHR_RESPONSE_TYPE.BUFFER
    }, t463.EMPTY_GIF = "data:image/gif;base64,R0lGODlhAQABAIAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw==";
}(ds || (ds = {
}));
var _s = function(t, e544) {
    this.data = t, this.callback = e544;
}, ms = function() {
    function t464(t465, e545) {
        var r402 = this;
        if (void 0 === e545 && (e545 = 1), this.workers = 0, this.saturated = fs, this.unsaturated = fs, this.empty = fs, this.drain = fs, this.error = fs, this.started = !1, this.paused = !1, this._tasks = [], this._insert = function(t, e546, i300) {
            if (i300 && "function" != typeof i300) throw new Error("task callback must be a function");
            if (r402.started = !0, null == t && r402.idle()) setTimeout(function() {
                return r402.drain();
            }, 1);
            else {
                var n209 = new _s(t, "function" == typeof i300 ? i300 : fs);
                e546 ? r402._tasks.unshift(n209) : r402._tasks.push(n209), setTimeout(r402.process, 1);
            }
        }, this.process = function() {
            for(; !r402.paused && r402.workers < r402.concurrency && r402._tasks.length;){
                var t = r402._tasks.shift();
                0 === r402._tasks.length && r402.empty(), r402.workers += 1, r402.workers === r402.concurrency && r402.saturated(), r402._worker(t.data, ps(r402._next(t)));
            }
        }, this._worker = t465, 0 === e545) throw new Error("Concurrency must not be zero");
        this.concurrency = e545, this.buffer = e545 / 4;
    }
    return t464.prototype._next = function(t) {
        var e547 = this;
        return function() {
            for(var r403 = arguments, i301 = [], n210 = 0; n210 < arguments.length; n210++)i301[n210] = r403[n210];
            e547.workers -= 1, t.callback.apply(t, i301), null != i301[0] && e547.error(i301[0], t.data), e547.workers <= e547.concurrency - e547.buffer && e547.unsaturated(), e547.idle() && e547.drain(), e547.process();
        };
    }, t464.prototype.push = function(t, e548) {
        this._insert(t, !1, e548);
    }, t464.prototype.kill = function() {
        this.workers = 0, this.drain = fs, this.started = !1, this._tasks = [];
    }, t464.prototype.unshift = function(t, e549) {
        this._insert(t, !0, e549);
    }, t464.prototype.length = function() {
        return this._tasks.length;
    }, t464.prototype.running = function() {
        return this.workers;
    }, t464.prototype.idle = function() {
        return this._tasks.length + this.workers === 0;
    }, t464.prototype.pause = function() {
        !0 !== this.paused && (this.paused = !0);
    }, t464.prototype.resume = function() {
        if (!1 !== this.paused) {
            this.paused = !1;
            for(var t = 1; t <= this.concurrency; t++)this.process();
        }
    }, t464.eachSeries = function(t, e550, r404, i302) {
        var n211 = 0, o164 = t.length;
        !function s113(a92) {
            a92 || n211 === o164 ? r404 && r404(a92) : i302 ? setTimeout(function() {
                e550(t[n211++], s113);
            }, 1) : e550(t[n211++], s113);
        }();
    }, t464.queue = function(e551, r405) {
        return new t464(e551, r405);
    }, t464;
}(), vs = /(#[\w-]+)?$/, ys = function() {
    function t466(e552, r406) {
        var i303 = this;
        void 0 === e552 && (e552 = ""), void 0 === r406 && (r406 = 10), this._beforeMiddleware = [], this._afterMiddleware = [], this._resourcesParsing = [], this._boundLoadResource = function(t, e553) {
            return i303._loadResource(t, e553);
        }, this.resources = {
        }, this.baseUrl = e552, this.progress = 0, this.loading = !1, this.defaultQueryString = "", this._beforeMiddleware = [], this._afterMiddleware = [], this._resourcesParsing = [], this._boundLoadResource = function(t, e554) {
            return i303._loadResource(t, e554);
        }, this._queue = ms.queue(this._boundLoadResource, r406), this._queue.pause(), this.resources = {
        }, this.onProgress = new os, this.onError = new os, this.onLoad = new os, this.onStart = new os, this.onComplete = new os;
        for(var n212 = 0; n212 < t466._plugins.length; ++n212){
            var o165 = t466._plugins[n212], s114 = o165.pre, a93 = o165.use;
            s114 && this.pre(s114), a93 && this.use(a93);
        }
        this._protected = !1;
    }
    return t466.prototype._add = function(t, e555, r407, i304) {
        if (this.loading && (!r407 || !r407.parentResource)) throw new Error("Cannot add resources while the loader is running.");
        if (this.resources[t]) throw new Error('Resource named "' + t + '" already exists.');
        if (e555 = this._prepareUrl(e555), this.resources[t] = new ds(t, e555, r407), "function" == typeof i304 && this.resources[t].onAfterMiddleware.once(i304), this.loading) {
            for(var n213 = r407.parentResource, o166 = [], s115 = 0; s115 < n213.children.length; ++s115)n213.children[s115].isComplete || o166.push(n213.children[s115]);
            var a94 = n213.progressChunk * (o166.length + 1) / (o166.length + 2);
            for(n213.children.push(this.resources[t]), n213.progressChunk = a94, s115 = 0; s115 < o166.length; ++s115)o166[s115].progressChunk = a94;
            this.resources[t].progressChunk = a94;
        }
        return this._queue.push(this.resources[t]), this;
    }, t466.prototype.pre = function(t) {
        return this._beforeMiddleware.push(t), this;
    }, t466.prototype.use = function(t) {
        return this._afterMiddleware.push(t), this;
    }, t466.prototype.reset = function() {
        for(var t in this.progress = 0, this.loading = !1, this._queue.kill(), this._queue.pause(), this.resources){
            var e556 = this.resources[t];
            e556._onLoadBinding && e556._onLoadBinding.detach(), e556.isLoading && e556.abort("loader reset");
        }
        return this.resources = {
        }, this;
    }, t466.prototype.load = function(t) {
        if ("function" == typeof t && this.onComplete.once(t), this.loading) return this;
        if (this._queue.idle()) this._onStart(), this._onComplete();
        else {
            for(var e557 = 100 / this._queue._tasks.length, r408 = 0; r408 < this._queue._tasks.length; ++r408)this._queue._tasks[r408].data.progressChunk = e557;
            this._onStart(), this._queue.resume();
        }
        return this;
    }, Object.defineProperty(t466.prototype, "concurrency", {
        get: function() {
            return this._queue.concurrency;
        },
        set: function(t) {
            this._queue.concurrency = t;
        },
        enumerable: !1,
        configurable: !0
    }), t466.prototype._prepareUrl = function(t) {
        var e558, r409 = ss(t, {
            strictMode: !0
        });
        if (e558 = r409.protocol || !r409.path || 0 === t.indexOf("//") ? t : this.baseUrl.length && this.baseUrl.lastIndexOf("/") !== this.baseUrl.length - 1 && "/" !== t.charAt(0) ? this.baseUrl + "/" + t : this.baseUrl + t, this.defaultQueryString) {
            var i305 = vs.exec(e558)[0];
            -1 !== (e558 = e558.substr(0, e558.length - i305.length)).indexOf("?") ? e558 += "&" + this.defaultQueryString : e558 += "?" + this.defaultQueryString, e558 += i305;
        }
        return e558;
    }, t466.prototype._loadResource = function(t, e559) {
        var r410 = this;
        t._dequeue = e559, ms.eachSeries(this._beforeMiddleware, function(e560, i306) {
            e560.call(r410, t, function() {
                i306(t.isComplete ? {
                } : null);
            });
        }, function() {
            t.isComplete ? r410._onLoad(t) : (t._onLoadBinding = t.onComplete.once(r410._onLoad, r410), t.load());
        }, !0);
    }, t466.prototype._onStart = function() {
        this.progress = 0, this.loading = !0, this.onStart.dispatch(this);
    }, t466.prototype._onComplete = function() {
        this.progress = 100, this.loading = !1, this.onComplete.dispatch(this, this.resources);
    }, t466.prototype._onLoad = function(t) {
        var e561 = this;
        t._onLoadBinding = null, this._resourcesParsing.push(t), t._dequeue(), ms.eachSeries(this._afterMiddleware, function(r411, i307) {
            r411.call(e561, t, i307);
        }, function() {
            t.onAfterMiddleware.dispatch(t), e561.progress = Math.min(100, e561.progress + t.progressChunk), e561.onProgress.dispatch(e561, t), t.error ? e561.onError.dispatch(t.error, e561, t) : e561.onLoad.dispatch(e561, t), e561._resourcesParsing.splice(e561._resourcesParsing.indexOf(t), 1), e561._queue.idle() && 0 === e561._resourcesParsing.length && e561._onComplete();
        }, !0);
    }, t466.prototype.destroy = function() {
        this._protected || this.reset();
    }, Object.defineProperty(t466, "shared", {
        get: function() {
            var e562 = t466._shared;
            return e562 || ((e562 = new t466)._protected = !0, t466._shared = e562), e562;
        },
        enumerable: !1,
        configurable: !0
    }), t466.registerPlugin = function(e563) {
        return t466._plugins.push(e563), e563.add && e563.add(), t466;
    }, t466._plugins = [], t466;
}();
ys.prototype.add = function(t, e564, r412, i308) {
    if (Array.isArray(t)) {
        for(var n214 = 0; n214 < t.length; ++n214)this.add(t[n214]);
        return this;
    }
    if ("object" == typeof t && (r412 = t, i308 = e564 || r412.callback || r412.onComplete, e564 = r412.url, t = r412.name || r412.key || r412.url), "string" != typeof e564 && (i308 = r412, r412 = e564, e564 = t), "string" != typeof e564) throw new Error("No url passed to add resource to loader.");
    return "function" == typeof r412 && (i308 = r412, r412 = null), this._add(t, e564, r412, i308);
};
var gs, Es, Ts = function() {
    function t467() {
    }
    return t467.init = function(t) {
        t = Object.assign({
            sharedLoader: !1
        }, t), this.loader = t.sharedLoader ? ys.shared : new ys;
    }, t467.destroy = function() {
        this.loader && (this.loader.destroy(), this.loader = null);
    }, t467;
}(), bs = function() {
    function t468() {
    }
    return t468.add = function() {
        ds.setExtensionLoadType("svg", ds.LOAD_TYPE.XHR), ds.setExtensionXhrType("svg", ds.XHR_RESPONSE_TYPE.TEXT);
    }, t468.use = function(t, e565) {
        if (!t.data || t.type !== ds.TYPE.IMAGE && "svg" !== t.extension) e565();
        else {
            var r413 = t.data, i309 = t.url, n215 = t.name, o167 = t.metadata;
            ki.fromLoader(r413, i309, n215, o167).then(function(r414) {
                t.texture = r414, e565();
            }).catch(e565);
        }
    }, t468;
}(), xs = self.URL || self.webkitURL;
ys.registerPlugin({
    use: function(t469, e566) {
        if (t469.data) {
            if (t469.xhr && t469.xhrType === ds.XHR_RESPONSE_TYPE.BLOB) if (self.Blob && "string" != typeof t469.data) {
                if (0 === t469.data.type.indexOf("image")) {
                    var r415 = xs.createObjectURL(t469.data);
                    return t469.blob = t469.data, t469.data = new Image, t469.data.src = r415, t469.type = ds.TYPE.IMAGE, void (t469.data.onload = function() {
                        xs.revokeObjectURL(r415), t469.data.onload = null, e566();
                    });
                }
            } else {
                var i310 = t469.xhr.getResponseHeader("content-type");
                if (i310 && 0 === i310.indexOf("image")) return t469.data = new Image, t469.data.src = "data:" + i310 + ";base64," + (function(t) {
                    for(var e567 = "", r416 = 0; r416 < t.length;){
                        for(var i311 = [
                            0,
                            0,
                            0
                        ], n216 = [
                            0,
                            0,
                            0,
                            0
                        ], o168 = 0; o168 < i311.length; ++o168)r416 < t.length ? i311[o168] = 255 & t.charCodeAt(r416++) : i311[o168] = 0;
                        switch(n216[0] = i311[0] >> 2, n216[1] = (3 & i311[0]) << 4 | i311[1] >> 4, n216[2] = (15 & i311[1]) << 2 | i311[2] >> 6, n216[3] = 63 & i311[2], r416 - (t.length - 1)){
                            case 2:
                                n216[3] = 64, n216[2] = 64;
                                break;
                            case 1:
                                n216[3] = 64;
                        }
                        for(o168 = 0; o168 < n216.length; ++o168)e567 += "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=".charAt(n216[o168]);
                    }
                    return e567;
                })(t469.xhr.responseText), t469.type = ds.TYPE.IMAGE, void (t469.data.onload = function() {
                    t469.data.onload = null, e566();
                });
            }
            e566();
        } else e566();
    }
}), ys.registerPlugin(bs), (function(t) {
    t[t.COMPRESSED_RGB_S3TC_DXT1_EXT = 33776] = "COMPRESSED_RGB_S3TC_DXT1_EXT", t[t.COMPRESSED_RGBA_S3TC_DXT1_EXT = 33777] = "COMPRESSED_RGBA_S3TC_DXT1_EXT", t[t.COMPRESSED_RGBA_S3TC_DXT3_EXT = 33778] = "COMPRESSED_RGBA_S3TC_DXT3_EXT", t[t.COMPRESSED_RGBA_S3TC_DXT5_EXT = 33779] = "COMPRESSED_RGBA_S3TC_DXT5_EXT", t[t.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT = 35917] = "COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT", t[t.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT = 35918] = "COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT", t[t.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT = 35919] = "COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT", t[t.COMPRESSED_SRGB_S3TC_DXT1_EXT = 35916] = "COMPRESSED_SRGB_S3TC_DXT1_EXT", t[t.COMPRESSED_R11_EAC = 37488] = "COMPRESSED_R11_EAC", t[t.COMPRESSED_SIGNED_R11_EAC = 37489] = "COMPRESSED_SIGNED_R11_EAC", t[t.COMPRESSED_RG11_EAC = 37490] = "COMPRESSED_RG11_EAC", t[t.COMPRESSED_SIGNED_RG11_EAC = 37491] = "COMPRESSED_SIGNED_RG11_EAC", t[t.COMPRESSED_RGB8_ETC2 = 37492] = "COMPRESSED_RGB8_ETC2", t[t.COMPRESSED_RGBA8_ETC2_EAC = 37496] = "COMPRESSED_RGBA8_ETC2_EAC", t[t.COMPRESSED_SRGB8_ETC2 = 37493] = "COMPRESSED_SRGB8_ETC2", t[t.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC = 37497] = "COMPRESSED_SRGB8_ALPHA8_ETC2_EAC", t[t.COMPRESSED_RGB8_PUNCHTHROUGH_ALPHA1_ETC2 = 37494] = "COMPRESSED_RGB8_PUNCHTHROUGH_ALPHA1_ETC2", t[t.COMPRESSED_SRGB8_PUNCHTHROUGH_ALPHA1_ETC2 = 37495] = "COMPRESSED_SRGB8_PUNCHTHROUGH_ALPHA1_ETC2", t[t.COMPRESSED_RGB_PVRTC_4BPPV1_IMG = 35840] = "COMPRESSED_RGB_PVRTC_4BPPV1_IMG", t[t.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG = 35842] = "COMPRESSED_RGBA_PVRTC_4BPPV1_IMG", t[t.COMPRESSED_RGB_PVRTC_2BPPV1_IMG = 35841] = "COMPRESSED_RGB_PVRTC_2BPPV1_IMG", t[t.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG = 35843] = "COMPRESSED_RGBA_PVRTC_2BPPV1_IMG", t[t.COMPRESSED_RGB_ETC1_WEBGL = 36196] = "COMPRESSED_RGB_ETC1_WEBGL", t[t.COMPRESSED_RGB_ATC_WEBGL = 35986] = "COMPRESSED_RGB_ATC_WEBGL", t[t.COMPRESSED_RGBA_ATC_EXPLICIT_ALPHA_WEBGL = 35986] = "COMPRESSED_RGBA_ATC_EXPLICIT_ALPHA_WEBGL", t[t.COMPRESSED_RGBA_ATC_INTERPOLATED_ALPHA_WEBGL = 34798] = "COMPRESSED_RGBA_ATC_INTERPOLATED_ALPHA_WEBGL";
})(Es || (Es = {
}));
var Rs = ((gs = {
})[Es.COMPRESSED_RGB_S3TC_DXT1_EXT] = 0.5, gs[Es.COMPRESSED_RGBA_S3TC_DXT1_EXT] = 0.5, gs[Es.COMPRESSED_RGBA_S3TC_DXT3_EXT] = 1, gs[Es.COMPRESSED_RGBA_S3TC_DXT5_EXT] = 1, gs[Es.COMPRESSED_SRGB_S3TC_DXT1_EXT] = 0.5, gs[Es.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT] = 0.5, gs[Es.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT] = 1, gs[Es.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT] = 1, gs[Es.COMPRESSED_R11_EAC] = 0.5, gs[Es.COMPRESSED_SIGNED_R11_EAC] = 0.5, gs[Es.COMPRESSED_RG11_EAC] = 1, gs[Es.COMPRESSED_SIGNED_RG11_EAC] = 1, gs[Es.COMPRESSED_RGB8_ETC2] = 0.5, gs[Es.COMPRESSED_RGBA8_ETC2_EAC] = 1, gs[Es.COMPRESSED_SRGB8_ETC2] = 0.5, gs[Es.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC] = 1, gs[Es.COMPRESSED_RGB8_PUNCHTHROUGH_ALPHA1_ETC2] = 0.5, gs[Es.COMPRESSED_SRGB8_PUNCHTHROUGH_ALPHA1_ETC2] = 0.5, gs[Es.COMPRESSED_RGB_PVRTC_4BPPV1_IMG] = 0.5, gs[Es.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG] = 0.5, gs[Es.COMPRESSED_RGB_PVRTC_2BPPV1_IMG] = 0.25, gs[Es.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG] = 0.25, gs[Es.COMPRESSED_RGB_ETC1_WEBGL] = 0.5, gs[Es.COMPRESSED_RGB_ATC_WEBGL] = 0.5, gs[Es.COMPRESSED_RGBA_ATC_EXPLICIT_ALPHA_WEBGL] = 1, gs[Es.COMPRESSED_RGBA_ATC_INTERPOLATED_ALPHA_WEBGL] = 1, gs), As = function(t470, e568) {
    return (As = Object.setPrototypeOf || ({
        __proto__: []
    }) instanceof Array && function(t, e569) {
        t.__proto__ = e569;
    } || function(t, e570) {
        for(var r417 in e570)e570.hasOwnProperty(r417) && (t[r417] = e570[r417]);
    })(t470, e568);
};
function Os(t, e571) {
    function r418() {
        this.constructor = t;
    }
    As(t, e571), t.prototype = null === e571 ? Object.create(e571) : (r418.prototype = e571.prototype, new r418);
}
var Ss, Is, Ps = function(t471) {
    function e572(e573, r419) {
        void 0 === r419 && (r419 = {
            width: 1,
            height: 1,
            autoLoad: !0
        });
        var i312, n217, o169 = this;
        return "string" == typeof e573 ? (i312 = e573, n217 = new Uint8Array) : (i312 = null, n217 = e573), (o169 = t471.call(this, n217, r419) || this).origin = i312, o169.buffer = n217 ? new Xo(n217) : null, o169.origin && !1 !== r419.autoLoad && o169.load(), n217 && n217.length && (o169.loaded = !0, o169.onBlobLoaded(o169.buffer.rawBinaryData)), o169;
    }
    return Os(e572, t471), e572.prototype.onBlobLoaded = function(t) {
    }, e572.prototype.load = function() {
        return t472 = this, e574 = Promise, r420 = function() {
            var t473;
            return (function(t474, e575) {
                var r421, i313, n218, o170, s116 = {
                    label: 0,
                    sent: function() {
                        if (1 & n218[0]) throw n218[1];
                        return n218[1];
                    },
                    trys: [],
                    ops: []
                };
                return o170 = {
                    next: a95(0),
                    throw: a95(1),
                    return: a95(2)
                }, "function" == typeof Symbol && (o170[Symbol.iterator] = function() {
                    return this;
                }), o170;
                function a95(o171) {
                    return function(a96) {
                        return (function(o172) {
                            if (r421) throw new TypeError("Generator is already executing.");
                            for(; s116;)try {
                                if (r421 = 1, i313 && (n218 = 2 & o172[0] ? i313.return : o172[0] ? i313.throw || ((n218 = i313.return) && n218.call(i313), 0) : i313.next) && !(n218 = n218.call(i313, o172[1])).done) return n218;
                                switch(i313 = 0, n218 && (o172 = [
                                    2 & o172[0],
                                    n218.value
                                ]), o172[0]){
                                    case 0:
                                    case 1:
                                        n218 = o172;
                                        break;
                                    case 4:
                                        return s116.label++, {
                                            value: o172[1],
                                            done: !1
                                        };
                                    case 5:
                                        s116.label++, i313 = o172[1], o172 = [
                                            0
                                        ];
                                        continue;
                                    case 7:
                                        o172 = s116.ops.pop(), s116.trys.pop();
                                        continue;
                                    default:
                                        if (!(n218 = (n218 = s116.trys).length > 0 && n218[n218.length - 1]) && (6 === o172[0] || 2 === o172[0])) {
                                            s116 = 0;
                                            continue;
                                        }
                                        if (3 === o172[0] && (!n218 || o172[1] > n218[0] && o172[1] < n218[3])) {
                                            s116.label = o172[1];
                                            break;
                                        }
                                        if (6 === o172[0] && s116.label < n218[1]) {
                                            s116.label = n218[1], n218 = o172;
                                            break;
                                        }
                                        if (n218 && s116.label < n218[2]) {
                                            s116.label = n218[2], s116.ops.push(o172);
                                            break;
                                        }
                                        n218[2] && s116.ops.pop(), s116.trys.pop();
                                        continue;
                                }
                                o172 = e575.call(t474, s116);
                            } catch (t) {
                                o172 = [
                                    6,
                                    t
                                ], i313 = 0;
                            } finally{
                                r421 = n218 = 0;
                            }
                            if (5 & o172[0]) throw o172[1];
                            return {
                                value: o172[0] ? o172[1] : void 0,
                                done: !0
                            };
                        })([
                            o171,
                            a96
                        ]);
                    };
                }
            })(this, function(e576) {
                switch(e576.label){
                    case 0:
                        return [
                            4,
                            fetch(this.origin)
                        ];
                    case 1:
                        return [
                            4,
                            e576.sent().blob()
                        ];
                    case 2:
                        return [
                            4,
                            e576.sent().arrayBuffer()
                        ];
                    case 3:
                        return t473 = e576.sent(), this.data = new Uint32Array(t473), this.buffer = new Xo(t473), this.loaded = !0, this.onBlobLoaded(t473), this.update(), [
                            2,
                            this
                        ];
                }
            });
        }, new (e574 || (e574 = Promise))(function(i314, n219) {
            function o173(t) {
                try {
                    a97(r420.next(t));
                } catch (t475) {
                    n219(t475);
                }
            }
            function s117(t) {
                try {
                    a97(r420.throw(t));
                } catch (t476) {
                    n219(t476);
                }
            }
            function a97(t) {
                t.done ? i314(t.value) : new e574(function(e577) {
                    e577(t.value);
                }).then(o173, s117);
            }
            a97((r420 = r420.apply(t472, [])).next());
        });
        var t472, e574, r420;
    }, e572;
}(xi), Ns = function(t477) {
    function e578(r422, i315) {
        var n220 = t477.call(this, r422, i315) || this;
        return n220.format = i315.format, n220.levels = i315.levels || 1, n220._width = i315.width, n220._height = i315.height, n220._extension = e578._formatToExtension(n220.format), (i315.levelBuffers || n220.buffer) && (n220._levelBuffers = i315.levelBuffers || e578._createLevelBuffers(r422 instanceof Uint8Array ? r422 : n220.buffer.uint8View, n220.format, n220.levels, 4, 4, n220.width, n220.height)), n220;
    }
    return Os(e578, t477), e578.prototype.upload = function(t, e, r) {
        var i316 = t.gl;
        if (!t.context.extensions[this._extension]) throw new Error(this._extension + " textures are not supported on the current machine");
        if (!this._levelBuffers) return !1;
        for(var n221 = 0, o174 = this.levels; n221 < o174; n221++){
            var s118 = this._levelBuffers[n221], a98 = s118.levelID, h70 = s118.levelWidth, u57 = s118.levelHeight, l43 = s118.levelBuffer;
            i316.compressedTexImage2D(i316.TEXTURE_2D, a98, this.format, h70, u57, 0, l43);
        }
        return !0;
    }, e578.prototype.onBlobLoaded = function() {
        this._levelBuffers = e578._createLevelBuffers(this.buffer.uint8View, this.format, this.levels, 4, 4, this.width, this.height);
    }, e578._formatToExtension = function(t) {
        if (t >= 33776 && t <= 33779) return "s3tc";
        if (t >= 37488 && t <= 37497) return "etc";
        if (t >= 35840 && t <= 35843) return "pvrtc";
        if (t >= 36196) return "etc1";
        if (t >= 35986 && t <= 34798) return "atc";
        throw new Error("Invalid (compressed) texture format given!");
    }, e578._createLevelBuffers = function(t, e, r423, i317, n222, o175, s119) {
        for(var a99 = new Array(r423), h71 = t.byteOffset, u58 = o175, l44 = s119, c32 = u58 + i317 - 1 & ~(i317 - 1), d32 = l44 + n222 - 1 & ~(n222 - 1), f24 = c32 * d32 * Rs[e], p = 0; p < r423; p++)a99[p] = {
            levelID: p,
            levelWidth: r423 > 1 ? u58 : c32,
            levelHeight: r423 > 1 ? l44 : d32,
            levelBuffer: new Uint8Array(t.buffer, h71, f24)
        }, h71 += f24, f24 = (c32 = (u58 = u58 >> 1 || 1) + i317 - 1 & ~(i317 - 1)) * (d32 = (l44 = l44 >> 1 || 1) + n222 - 1 & ~(n222 - 1)) * Rs[e];
        return a99;
    }, e578;
}(Ps), Ms = function() {
    function t478() {
    }
    return t478.use = function(e579, r424) {
        var i318 = e579.data;
        if (e579.type === ds.TYPE.JSON && i318 && i318.cacheID && i318.textures) {
            for(var n223 = i318.textures, o176 = void 0, s120 = void 0, a100 = 0, h72 = n223.length; a100 < h72; a100++){
                var u59 = n223[a100], l45 = u59.src, c33 = u59.format;
                if (c33 || (s120 = l45), t478.textureFormats[c33]) {
                    o176 = l45;
                    break;
                }
            }
            if (!(o176 = o176 || s120)) return void r424(new Error("Cannot load compressed-textures in " + e579.url + ", make sure you provide a fallback"));
            if (o176 === e579.url) return void r424(new Error("URL of compressed texture cannot be the same as the manifest's URL"));
            var d33 = {
                crossOrigin: e579.crossOrigin,
                metadata: e579.metadata.imageMetadata,
                parentResource: e579
            }, f25 = be.resolve(e579.url.replace(this.baseUrl, ""), o176), p = i318.cacheID;
            this.add(p, f25, d33, function(t) {
                if (t.error) r424(t.error);
                else {
                    var i319 = t.texture, n224 = void 0 === i319 ? null : i319, o177 = t.textures, s121 = void 0 === o177 ? {
                    } : o177;
                    Object.assign(e579, {
                        texture: n224,
                        textures: s121
                    }), r424();
                }
            });
        } else r424();
    }, t478.add = function() {
        var e580 = document.createElement("canvas").getContext("webgl");
        if (e580) {
            var r425 = {
                s3tc: e580.getExtension("WEBGL_compressed_texture_s3tc"),
                s3tc_sRGB: e580.getExtension("WEBGL_compressed_texture_s3tc_srgb"),
                etc: e580.getExtension("WEBGL_compressed_texture_etc"),
                etc1: e580.getExtension("WEBGL_compressed_texture_etc1"),
                pvrtc: e580.getExtension("WEBGL_compressed_texture_pvrtc") || e580.getExtension("WEBKIT_WEBGL_compressed_texture_pvrtc"),
                atc: e580.getExtension("WEBGL_compressed_texture_atc"),
                astc: e580.getExtension("WEBGL_compressed_texture_astc")
            };
            for(var i in t478.textureExtensions = r425, t478.textureFormats = {
            }, r425){
                var n225 = r425[i];
                n225 && Object.assign(t478.textureFormats, Object.getPrototypeOf(n225));
            }
        }
    }, t478;
}();
function Ds(t479, e581, r426) {
    var i320 = {
        textures: {
        },
        texture: null
    };
    return e581 ? (e581.map(function(t) {
        return new ki(new Ai(t, Object.assign({
            mipmap: pe.OFF,
            alphaMode: _e.NO_PREMULTIPLIED_ALPHA
        }, r426)));
    }).forEach(function(e582, r427) {
        var n226 = e582.baseTexture, o178 = t479 + "-" + (r427 + 1);
        Ai.addToCache(n226, o178), ki.addToCache(e582, o178), 0 === r427 && (Ai.addToCache(n226, t479), ki.addToCache(e582, t479), i320.texture = e582), i320.textures[o178] = e582;
    }), i320) : i320;
}
ds.setExtensionXhrType("dds", ds.XHR_RESPONSE_TYPE.BUFFER);
var Cs, ws;
!function(t) {
    t[t.DXGI_FORMAT_UNKNOWN = 0] = "DXGI_FORMAT_UNKNOWN", t[t.DXGI_FORMAT_R32G32B32A32_TYPELESS = 1] = "DXGI_FORMAT_R32G32B32A32_TYPELESS", t[t.DXGI_FORMAT_R32G32B32A32_FLOAT = 2] = "DXGI_FORMAT_R32G32B32A32_FLOAT", t[t.DXGI_FORMAT_R32G32B32A32_UINT = 3] = "DXGI_FORMAT_R32G32B32A32_UINT", t[t.DXGI_FORMAT_R32G32B32A32_SINT = 4] = "DXGI_FORMAT_R32G32B32A32_SINT", t[t.DXGI_FORMAT_R32G32B32_TYPELESS = 5] = "DXGI_FORMAT_R32G32B32_TYPELESS", t[t.DXGI_FORMAT_R32G32B32_FLOAT = 6] = "DXGI_FORMAT_R32G32B32_FLOAT", t[t.DXGI_FORMAT_R32G32B32_UINT = 7] = "DXGI_FORMAT_R32G32B32_UINT", t[t.DXGI_FORMAT_R32G32B32_SINT = 8] = "DXGI_FORMAT_R32G32B32_SINT", t[t.DXGI_FORMAT_R16G16B16A16_TYPELESS = 9] = "DXGI_FORMAT_R16G16B16A16_TYPELESS", t[t.DXGI_FORMAT_R16G16B16A16_FLOAT = 10] = "DXGI_FORMAT_R16G16B16A16_FLOAT", t[t.DXGI_FORMAT_R16G16B16A16_UNORM = 11] = "DXGI_FORMAT_R16G16B16A16_UNORM", t[t.DXGI_FORMAT_R16G16B16A16_UINT = 12] = "DXGI_FORMAT_R16G16B16A16_UINT", t[t.DXGI_FORMAT_R16G16B16A16_SNORM = 13] = "DXGI_FORMAT_R16G16B16A16_SNORM", t[t.DXGI_FORMAT_R16G16B16A16_SINT = 14] = "DXGI_FORMAT_R16G16B16A16_SINT", t[t.DXGI_FORMAT_R32G32_TYPELESS = 15] = "DXGI_FORMAT_R32G32_TYPELESS", t[t.DXGI_FORMAT_R32G32_FLOAT = 16] = "DXGI_FORMAT_R32G32_FLOAT", t[t.DXGI_FORMAT_R32G32_UINT = 17] = "DXGI_FORMAT_R32G32_UINT", t[t.DXGI_FORMAT_R32G32_SINT = 18] = "DXGI_FORMAT_R32G32_SINT", t[t.DXGI_FORMAT_R32G8X24_TYPELESS = 19] = "DXGI_FORMAT_R32G8X24_TYPELESS", t[t.DXGI_FORMAT_D32_FLOAT_S8X24_UINT = 20] = "DXGI_FORMAT_D32_FLOAT_S8X24_UINT", t[t.DXGI_FORMAT_R32_FLOAT_X8X24_TYPELESS = 21] = "DXGI_FORMAT_R32_FLOAT_X8X24_TYPELESS", t[t.DXGI_FORMAT_X32_TYPELESS_G8X24_UINT = 22] = "DXGI_FORMAT_X32_TYPELESS_G8X24_UINT", t[t.DXGI_FORMAT_R10G10B10A2_TYPELESS = 23] = "DXGI_FORMAT_R10G10B10A2_TYPELESS", t[t.DXGI_FORMAT_R10G10B10A2_UNORM = 24] = "DXGI_FORMAT_R10G10B10A2_UNORM", t[t.DXGI_FORMAT_R10G10B10A2_UINT = 25] = "DXGI_FORMAT_R10G10B10A2_UINT", t[t.DXGI_FORMAT_R11G11B10_FLOAT = 26] = "DXGI_FORMAT_R11G11B10_FLOAT", t[t.DXGI_FORMAT_R8G8B8A8_TYPELESS = 27] = "DXGI_FORMAT_R8G8B8A8_TYPELESS", t[t.DXGI_FORMAT_R8G8B8A8_UNORM = 28] = "DXGI_FORMAT_R8G8B8A8_UNORM", t[t.DXGI_FORMAT_R8G8B8A8_UNORM_SRGB = 29] = "DXGI_FORMAT_R8G8B8A8_UNORM_SRGB", t[t.DXGI_FORMAT_R8G8B8A8_UINT = 30] = "DXGI_FORMAT_R8G8B8A8_UINT", t[t.DXGI_FORMAT_R8G8B8A8_SNORM = 31] = "DXGI_FORMAT_R8G8B8A8_SNORM", t[t.DXGI_FORMAT_R8G8B8A8_SINT = 32] = "DXGI_FORMAT_R8G8B8A8_SINT", t[t.DXGI_FORMAT_R16G16_TYPELESS = 33] = "DXGI_FORMAT_R16G16_TYPELESS", t[t.DXGI_FORMAT_R16G16_FLOAT = 34] = "DXGI_FORMAT_R16G16_FLOAT", t[t.DXGI_FORMAT_R16G16_UNORM = 35] = "DXGI_FORMAT_R16G16_UNORM", t[t.DXGI_FORMAT_R16G16_UINT = 36] = "DXGI_FORMAT_R16G16_UINT", t[t.DXGI_FORMAT_R16G16_SNORM = 37] = "DXGI_FORMAT_R16G16_SNORM", t[t.DXGI_FORMAT_R16G16_SINT = 38] = "DXGI_FORMAT_R16G16_SINT", t[t.DXGI_FORMAT_R32_TYPELESS = 39] = "DXGI_FORMAT_R32_TYPELESS", t[t.DXGI_FORMAT_D32_FLOAT = 40] = "DXGI_FORMAT_D32_FLOAT", t[t.DXGI_FORMAT_R32_FLOAT = 41] = "DXGI_FORMAT_R32_FLOAT", t[t.DXGI_FORMAT_R32_UINT = 42] = "DXGI_FORMAT_R32_UINT", t[t.DXGI_FORMAT_R32_SINT = 43] = "DXGI_FORMAT_R32_SINT", t[t.DXGI_FORMAT_R24G8_TYPELESS = 44] = "DXGI_FORMAT_R24G8_TYPELESS", t[t.DXGI_FORMAT_D24_UNORM_S8_UINT = 45] = "DXGI_FORMAT_D24_UNORM_S8_UINT", t[t.DXGI_FORMAT_R24_UNORM_X8_TYPELESS = 46] = "DXGI_FORMAT_R24_UNORM_X8_TYPELESS", t[t.DXGI_FORMAT_X24_TYPELESS_G8_UINT = 47] = "DXGI_FORMAT_X24_TYPELESS_G8_UINT", t[t.DXGI_FORMAT_R8G8_TYPELESS = 48] = "DXGI_FORMAT_R8G8_TYPELESS", t[t.DXGI_FORMAT_R8G8_UNORM = 49] = "DXGI_FORMAT_R8G8_UNORM", t[t.DXGI_FORMAT_R8G8_UINT = 50] = "DXGI_FORMAT_R8G8_UINT", t[t.DXGI_FORMAT_R8G8_SNORM = 51] = "DXGI_FORMAT_R8G8_SNORM", t[t.DXGI_FORMAT_R8G8_SINT = 52] = "DXGI_FORMAT_R8G8_SINT", t[t.DXGI_FORMAT_R16_TYPELESS = 53] = "DXGI_FORMAT_R16_TYPELESS", t[t.DXGI_FORMAT_R16_FLOAT = 54] = "DXGI_FORMAT_R16_FLOAT", t[t.DXGI_FORMAT_D16_UNORM = 55] = "DXGI_FORMAT_D16_UNORM", t[t.DXGI_FORMAT_R16_UNORM = 56] = "DXGI_FORMAT_R16_UNORM", t[t.DXGI_FORMAT_R16_UINT = 57] = "DXGI_FORMAT_R16_UINT", t[t.DXGI_FORMAT_R16_SNORM = 58] = "DXGI_FORMAT_R16_SNORM", t[t.DXGI_FORMAT_R16_SINT = 59] = "DXGI_FORMAT_R16_SINT", t[t.DXGI_FORMAT_R8_TYPELESS = 60] = "DXGI_FORMAT_R8_TYPELESS", t[t.DXGI_FORMAT_R8_UNORM = 61] = "DXGI_FORMAT_R8_UNORM", t[t.DXGI_FORMAT_R8_UINT = 62] = "DXGI_FORMAT_R8_UINT", t[t.DXGI_FORMAT_R8_SNORM = 63] = "DXGI_FORMAT_R8_SNORM", t[t.DXGI_FORMAT_R8_SINT = 64] = "DXGI_FORMAT_R8_SINT", t[t.DXGI_FORMAT_A8_UNORM = 65] = "DXGI_FORMAT_A8_UNORM", t[t.DXGI_FORMAT_R1_UNORM = 66] = "DXGI_FORMAT_R1_UNORM", t[t.DXGI_FORMAT_R9G9B9E5_SHAREDEXP = 67] = "DXGI_FORMAT_R9G9B9E5_SHAREDEXP", t[t.DXGI_FORMAT_R8G8_B8G8_UNORM = 68] = "DXGI_FORMAT_R8G8_B8G8_UNORM", t[t.DXGI_FORMAT_G8R8_G8B8_UNORM = 69] = "DXGI_FORMAT_G8R8_G8B8_UNORM", t[t.DXGI_FORMAT_BC1_TYPELESS = 70] = "DXGI_FORMAT_BC1_TYPELESS", t[t.DXGI_FORMAT_BC1_UNORM = 71] = "DXGI_FORMAT_BC1_UNORM", t[t.DXGI_FORMAT_BC1_UNORM_SRGB = 72] = "DXGI_FORMAT_BC1_UNORM_SRGB", t[t.DXGI_FORMAT_BC2_TYPELESS = 73] = "DXGI_FORMAT_BC2_TYPELESS", t[t.DXGI_FORMAT_BC2_UNORM = 74] = "DXGI_FORMAT_BC2_UNORM", t[t.DXGI_FORMAT_BC2_UNORM_SRGB = 75] = "DXGI_FORMAT_BC2_UNORM_SRGB", t[t.DXGI_FORMAT_BC3_TYPELESS = 76] = "DXGI_FORMAT_BC3_TYPELESS", t[t.DXGI_FORMAT_BC3_UNORM = 77] = "DXGI_FORMAT_BC3_UNORM", t[t.DXGI_FORMAT_BC3_UNORM_SRGB = 78] = "DXGI_FORMAT_BC3_UNORM_SRGB", t[t.DXGI_FORMAT_BC4_TYPELESS = 79] = "DXGI_FORMAT_BC4_TYPELESS", t[t.DXGI_FORMAT_BC4_UNORM = 80] = "DXGI_FORMAT_BC4_UNORM", t[t.DXGI_FORMAT_BC4_SNORM = 81] = "DXGI_FORMAT_BC4_SNORM", t[t.DXGI_FORMAT_BC5_TYPELESS = 82] = "DXGI_FORMAT_BC5_TYPELESS", t[t.DXGI_FORMAT_BC5_UNORM = 83] = "DXGI_FORMAT_BC5_UNORM", t[t.DXGI_FORMAT_BC5_SNORM = 84] = "DXGI_FORMAT_BC5_SNORM", t[t.DXGI_FORMAT_B5G6R5_UNORM = 85] = "DXGI_FORMAT_B5G6R5_UNORM", t[t.DXGI_FORMAT_B5G5R5A1_UNORM = 86] = "DXGI_FORMAT_B5G5R5A1_UNORM", t[t.DXGI_FORMAT_B8G8R8A8_UNORM = 87] = "DXGI_FORMAT_B8G8R8A8_UNORM", t[t.DXGI_FORMAT_B8G8R8X8_UNORM = 88] = "DXGI_FORMAT_B8G8R8X8_UNORM", t[t.DXGI_FORMAT_R10G10B10_XR_BIAS_A2_UNORM = 89] = "DXGI_FORMAT_R10G10B10_XR_BIAS_A2_UNORM", t[t.DXGI_FORMAT_B8G8R8A8_TYPELESS = 90] = "DXGI_FORMAT_B8G8R8A8_TYPELESS", t[t.DXGI_FORMAT_B8G8R8A8_UNORM_SRGB = 91] = "DXGI_FORMAT_B8G8R8A8_UNORM_SRGB", t[t.DXGI_FORMAT_B8G8R8X8_TYPELESS = 92] = "DXGI_FORMAT_B8G8R8X8_TYPELESS", t[t.DXGI_FORMAT_B8G8R8X8_UNORM_SRGB = 93] = "DXGI_FORMAT_B8G8R8X8_UNORM_SRGB", t[t.DXGI_FORMAT_BC6H_TYPELESS = 94] = "DXGI_FORMAT_BC6H_TYPELESS", t[t.DXGI_FORMAT_BC6H_UF16 = 95] = "DXGI_FORMAT_BC6H_UF16", t[t.DXGI_FORMAT_BC6H_SF16 = 96] = "DXGI_FORMAT_BC6H_SF16", t[t.DXGI_FORMAT_BC7_TYPELESS = 97] = "DXGI_FORMAT_BC7_TYPELESS", t[t.DXGI_FORMAT_BC7_UNORM = 98] = "DXGI_FORMAT_BC7_UNORM", t[t.DXGI_FORMAT_BC7_UNORM_SRGB = 99] = "DXGI_FORMAT_BC7_UNORM_SRGB", t[t.DXGI_FORMAT_AYUV = 100] = "DXGI_FORMAT_AYUV", t[t.DXGI_FORMAT_Y410 = 101] = "DXGI_FORMAT_Y410", t[t.DXGI_FORMAT_Y416 = 102] = "DXGI_FORMAT_Y416", t[t.DXGI_FORMAT_NV12 = 103] = "DXGI_FORMAT_NV12", t[t.DXGI_FORMAT_P010 = 104] = "DXGI_FORMAT_P010", t[t.DXGI_FORMAT_P016 = 105] = "DXGI_FORMAT_P016", t[t.DXGI_FORMAT_420_OPAQUE = 106] = "DXGI_FORMAT_420_OPAQUE", t[t.DXGI_FORMAT_YUY2 = 107] = "DXGI_FORMAT_YUY2", t[t.DXGI_FORMAT_Y210 = 108] = "DXGI_FORMAT_Y210", t[t.DXGI_FORMAT_Y216 = 109] = "DXGI_FORMAT_Y216", t[t.DXGI_FORMAT_NV11 = 110] = "DXGI_FORMAT_NV11", t[t.DXGI_FORMAT_AI44 = 111] = "DXGI_FORMAT_AI44", t[t.DXGI_FORMAT_IA44 = 112] = "DXGI_FORMAT_IA44", t[t.DXGI_FORMAT_P8 = 113] = "DXGI_FORMAT_P8", t[t.DXGI_FORMAT_A8P8 = 114] = "DXGI_FORMAT_A8P8", t[t.DXGI_FORMAT_B4G4R4A4_UNORM = 115] = "DXGI_FORMAT_B4G4R4A4_UNORM", t[t.DXGI_FORMAT_P208 = 116] = "DXGI_FORMAT_P208", t[t.DXGI_FORMAT_V208 = 117] = "DXGI_FORMAT_V208", t[t.DXGI_FORMAT_V408 = 118] = "DXGI_FORMAT_V408", t[t.DXGI_FORMAT_SAMPLER_FEEDBACK_MIN_MIP_OPAQUE = 119] = "DXGI_FORMAT_SAMPLER_FEEDBACK_MIN_MIP_OPAQUE", t[t.DXGI_FORMAT_SAMPLER_FEEDBACK_MIP_REGION_USED_OPAQUE = 120] = "DXGI_FORMAT_SAMPLER_FEEDBACK_MIP_REGION_USED_OPAQUE", t[t.DXGI_FORMAT_FORCE_UINT = 121] = "DXGI_FORMAT_FORCE_UINT";
}(Cs || (Cs = {
})), (function(t) {
    t[t.DDS_DIMENSION_TEXTURE1D = 2] = "DDS_DIMENSION_TEXTURE1D", t[t.DDS_DIMENSION_TEXTURE2D = 3] = "DDS_DIMENSION_TEXTURE2D", t[t.DDS_DIMENSION_TEXTURE3D = 6] = "DDS_DIMENSION_TEXTURE3D";
})(ws || (ws = {
}));
var Ls, Fs, Us, Gs = ((Ss = {
})[827611204] = Es.COMPRESSED_RGBA_S3TC_DXT1_EXT, Ss[861165636] = Es.COMPRESSED_RGBA_S3TC_DXT3_EXT, Ss[894720068] = Es.COMPRESSED_RGBA_S3TC_DXT5_EXT, Ss), Bs = ((Is = {
})[Cs.DXGI_FORMAT_BC1_TYPELESS] = Es.COMPRESSED_RGBA_S3TC_DXT1_EXT, Is[Cs.DXGI_FORMAT_BC1_UNORM] = Es.COMPRESSED_RGBA_S3TC_DXT1_EXT, Is[Cs.DXGI_FORMAT_BC2_TYPELESS] = Es.COMPRESSED_RGBA_S3TC_DXT3_EXT, Is[Cs.DXGI_FORMAT_BC2_UNORM] = Es.COMPRESSED_RGBA_S3TC_DXT3_EXT, Is[Cs.DXGI_FORMAT_BC3_TYPELESS] = Es.COMPRESSED_RGBA_S3TC_DXT5_EXT, Is[Cs.DXGI_FORMAT_BC3_UNORM] = Es.COMPRESSED_RGBA_S3TC_DXT5_EXT, Is[Cs.DXGI_FORMAT_BC1_UNORM_SRGB] = Es.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT, Is[Cs.DXGI_FORMAT_BC2_UNORM_SRGB] = Es.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT, Is[Cs.DXGI_FORMAT_BC3_UNORM_SRGB] = Es.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT, Is), Xs = function() {
    function t480() {
    }
    return t480.use = function(e583, r428) {
        if ("dds" === e583.extension && e583.data) try {
            Object.assign(e583, Ds(e583.name || e583.url, t480.parse(e583.data), e583.metadata));
        } catch (t) {
            return void r428(t);
        }
        r428();
    }, t480.parse = function(t481) {
        var e584 = new Uint32Array(t481);
        if (542327876 !== e584[0]) throw new Error("Invalid DDS file magic word");
        var r429 = new Uint32Array(t481, 0, 124 / Uint32Array.BYTES_PER_ELEMENT), i321 = r429[3], n227 = r429[4], o179 = r429[7], s122 = new Uint32Array(t481, 19 * Uint32Array.BYTES_PER_ELEMENT, 32 / Uint32Array.BYTES_PER_ELEMENT), a101 = s122[1];
        if (4 & a101) {
            var h73 = s122[2];
            if (808540228 !== h73) {
                var u60 = Gs[h73], l46 = new Uint8Array(t481, 128);
                return [
                    new Ns(l46, {
                        format: u60,
                        width: n227,
                        height: i321,
                        levels: o179
                    })
                ];
            }
            var c34 = new Uint32Array(e584.buffer, 128, 20 / Uint32Array.BYTES_PER_ELEMENT), d34 = c34[0], f26 = c34[1], p = c34[2], _11 = c34[3], m11 = Bs[d34];
            if (void 0 === m11) throw new Error("DDSLoader cannot parse texture data with DXGI format " + d34);
            if (4 === p) throw new Error("DDSLoader does not support cubemap textures");
            if (f26 === ws.DDS_DIMENSION_TEXTURE3D) throw new Error("DDSLoader does not supported 3D texture data");
            var v10 = new Array;
            if (1 === _11) v10.push(new Uint8Array(t481, 148));
            else {
                for(var y = Rs[m11], g8 = 0, E8 = n227, T7 = i321, b5 = 0; b5 < o179; b5++)g8 += Math.max(1, E8 + 3 & -4) * Math.max(1, T7 + 3 & -4) * y, E8 >>>= 1, T7 >>>= 1;
                var x6 = 148;
                for(b5 = 0; b5 < _11; b5++)v10.push(new Uint8Array(t481, x6, g8)), x6 += g8;
            }
            return v10.map(function(t) {
                return new Ns(t, {
                    format: m11,
                    width: n227,
                    height: i321,
                    levels: o179
                });
            });
        }
        if (64 & a101) throw new Error("DDSLoader does not support uncompressed texture data.");
        if (512 & a101) throw new Error("DDSLoader does not supported YUV uncompressed texture data.");
        if (131072 & a101) throw new Error("DDSLoader does not support single-channel (lumninance) texture data!");
        if (2 & a101) throw new Error("DDSLoader does not support single-channel (alpha) texture data!");
        throw new Error("DDSLoader failed to load a texture file due to an unknown reason!");
    }, t480;
}();
ds.setExtensionXhrType("ktx", ds.XHR_RESPONSE_TYPE.BUFFER);
var ks = [
    171,
    75,
    84,
    88,
    32,
    49,
    49,
    187,
    13,
    10,
    26,
    10
], Hs = ((Ls = {
})[le.UNSIGNED_BYTE] = 1, Ls[le.UNSIGNED_SHORT] = 2, Ls[le.FLOAT] = 4, Ls[le.HALF_FLOAT] = 8, Ls), js = ((Fs = {
})[he.RGBA] = 4, Fs[he.RGB] = 3, Fs[he.LUMINANCE] = 1, Fs[he.LUMINANCE_ALPHA] = 2, Fs[he.ALPHA] = 1, Fs), Ys = ((Us = {
})[le.UNSIGNED_SHORT_4_4_4_4] = 2, Us[le.UNSIGNED_SHORT_5_5_5_1] = 2, Us[le.UNSIGNED_SHORT_5_6_5] = 2, Us), Vs = function() {
    function t482() {
    }
    return t482.use = function(e585, r430) {
        if ("ktx" === e585.extension && e585.data) try {
            var i322 = e585.name || e585.url;
            Object.assign(e585, Ds(i322, t482.parse(i322, e585.data), e585.metadata));
        } catch (t) {
            return void r430(t);
        }
        r430();
    }, t482.parse = function(e586, r431) {
        var i323 = new DataView(r431);
        if (!t482.validate(e586, i323)) return null;
        var n228 = 67305985 === i323.getUint32(12, !0), o180 = i323.getUint32(16, n228), s = i323.getUint32(24, n228), a102 = i323.getUint32(28, n228), h74 = i323.getUint32(36, n228), u61 = i323.getUint32(40, n228) || 1, l47 = i323.getUint32(44, n228) || 1, c35 = i323.getUint32(48, n228) || 1, d35 = i323.getUint32(52, n228), f27 = i323.getUint32(56, n228), p = i323.getUint32(60, n228);
        if (0 === u61 || 1 !== l47) throw new Error("Only 2D textures are supported");
        if (1 !== d35) throw new Error("CubeTextures are not supported by KTXLoader yet!");
        if (1 !== c35) throw new Error("WebGL does not support array textures");
        var _12, m12 = h74 + 3 & -4, v11 = u61 + 3 & -4, y = new Array(c35), g9 = h74 * u61;
        if (0 === o180 && (g9 = m12 * v11), void 0 === (_12 = 0 !== o180 ? Hs[o180] ? Hs[o180] * js[s] : Ys[o180] : Rs[a102])) throw new Error("Unable to resolve the pixel format stored in the *.ktx file!");
        for(var E9 = g9 * _12, T8 = h74, b6 = u61, x7 = m12, R4 = v11, A6 = 64 + p, O5 = 0; O5 < f27; O5++){
            for(var S3 = i323.getUint32(A6, n228), I3 = A6 + 4, P3 = 0; P3 < c35; P3++){
                var N3 = y[P3];
                N3 || (N3 = y[P3] = new Array(f27)), N3[O5] = {
                    levelID: O5,
                    levelWidth: f27 > 1 ? T8 : x7,
                    levelHeight: f27 > 1 ? b6 : R4,
                    levelBuffer: new Uint8Array(r431, I3, E9)
                }, I3 += E9;
            }
            A6 = (A6 += S3 + 4) % 4 != 0 ? A6 + 4 - A6 % 4 : A6, E9 = (x7 = (T8 = T8 >> 1 || 1) + 4 - 1 & -4) * (R4 = (b6 = b6 >> 1 || 1) + 4 - 1 & -4) * _12;
        }
        if (0 !== o180) throw new Error("TODO: Uncompressed");
        return y.map(function(t) {
            return new Ns(null, {
                format: a102,
                width: h74,
                height: u61,
                levels: f27,
                levelBuffers: t
            });
        });
    }, t482.validate = function(t, e587) {
        for(var r432 = 0; r432 < ks.length; r432++)if (e587.getUint8(r432) !== ks[r432]) return !1;
        return !0;
    }, t482;
}(), Ws = function(t483, e588) {
    return (Ws = Object.setPrototypeOf || ({
        __proto__: []
    }) instanceof Array && function(t, e589) {
        t.__proto__ = e589;
    } || function(t, e590) {
        for(var r433 in e590)e590.hasOwnProperty(r433) && (t[r433] = e590[r433]);
    })(t483, e588);
};
function zs(t, e591) {
    function r434() {
        this.constructor = t;
    }
    Ws(t, e591), t.prototype = null === e591 ? Object.create(e591) : (r434.prototype = e591.prototype, new r434);
}
var qs, Ks, Zs = function(t484) {
    function e592(e593, r435, i324, n229) {
        void 0 === e593 && (e593 = 1500), void 0 === i324 && (i324 = 16384), void 0 === n229 && (n229 = !1);
        var o181 = t484.call(this) || this;
        return i324 > 16384 && (i324 = 16384), o181._properties = [
            !1,
            !0,
            !1,
            !1,
            !1
        ], o181._maxSize = e593, o181._batchSize = i324, o181._buffers = null, o181._bufferUpdateIDs = [], o181._updateID = 0, o181.interactiveChildren = !1, o181.blendMode = se.NORMAL, o181.autoResize = n229, o181.roundPixels = !0, o181.baseTexture = null, o181.setProperties(r435), o181._tint = 0, o181.tintRgb = new Float32Array(4), o181.tint = 16777215, o181;
    }
    return zs(e592, t484), e592.prototype.setProperties = function(t) {
        t && (this._properties[0] = "vertices" in t || "scale" in t ? !!t.vertices || !!t.scale : this._properties[0], this._properties[1] = "position" in t ? !!t.position : this._properties[1], this._properties[2] = "rotation" in t ? !!t.rotation : this._properties[2], this._properties[3] = "uvs" in t ? !!t.uvs : this._properties[3], this._properties[4] = "tint" in t || "alpha" in t ? !!t.tint || !!t.alpha : this._properties[4]);
    }, e592.prototype.updateTransform = function() {
        this.displayObjectUpdateTransform();
    }, Object.defineProperty(e592.prototype, "tint", {
        get: function() {
            return this._tint;
        },
        set: function(t) {
            this._tint = t, Pe(t, this.tintRgb);
        },
        enumerable: !1,
        configurable: !0
    }), e592.prototype.render = function(t) {
        var e594 = this;
        this.visible && !(this.worldAlpha <= 0) && this.children.length && this.renderable && (this.baseTexture || (this.baseTexture = this.children[0]._texture.baseTexture, this.baseTexture.valid || this.baseTexture.once("update", function() {
            return e594.onChildrenChange(0);
        })), t.batch.setObjectRenderer(t.plugins.particle), t.plugins.particle.render(this));
    }, e592.prototype.onChildrenChange = function(t) {
        for(var e595 = Math.floor(t / this._batchSize); this._bufferUpdateIDs.length < e595;)this._bufferUpdateIDs.push(0);
        this._bufferUpdateIDs[e595] = ++this._updateID;
    }, e592.prototype.dispose = function() {
        if (this._buffers) {
            for(var t = 0; t < this._buffers.length; ++t)this._buffers[t].destroy();
            this._buffers = null;
        }
    }, e592.prototype.destroy = function(e596) {
        t484.prototype.destroy.call(this, e596), this.dispose(), this._properties = null, this._buffers = null, this._bufferUpdateIDs = null;
    }, e592;
}(Zr), Js = function() {
    function t485(t, e597, r436) {
        this.geometry = new Qi, this.indexBuffer = null, this.size = r436, this.dynamicProperties = [], this.staticProperties = [];
        for(var i325 = 0; i325 < t.length; ++i325){
            var n230 = t[i325];
            n230 = {
                attributeName: n230.attributeName,
                size: n230.size,
                uploadFunction: n230.uploadFunction,
                type: n230.type || le.FLOAT,
                offset: n230.offset
            }, e597[i325] ? this.dynamicProperties.push(n230) : this.staticProperties.push(n230);
        }
        this.staticStride = 0, this.staticBuffer = null, this.staticData = null, this.staticDataUint32 = null, this.dynamicStride = 0, this.dynamicBuffer = null, this.dynamicData = null, this.dynamicDataUint32 = null, this._updateID = 0, this.initBuffers();
    }
    return t485.prototype.initBuffers = function() {
        var t = this.geometry, e598 = 0;
        this.indexBuffer = new zi(Ue(this.size), !0, !0), t.addIndex(this.indexBuffer), this.dynamicStride = 0;
        for(var r437 = 0; r437 < this.dynamicProperties.length; ++r437)(s123 = this.dynamicProperties[r437]).offset = e598, e598 += s123.size, this.dynamicStride += s123.size;
        var i326 = new ArrayBuffer(this.size * this.dynamicStride * 4 * 4);
        this.dynamicData = new Float32Array(i326), this.dynamicDataUint32 = new Uint32Array(i326), this.dynamicBuffer = new zi(this.dynamicData, !1, !1);
        var n231 = 0;
        for(this.staticStride = 0, r437 = 0; r437 < this.staticProperties.length; ++r437)(s123 = this.staticProperties[r437]).offset = n231, n231 += s123.size, this.staticStride += s123.size;
        var o182 = new ArrayBuffer(this.size * this.staticStride * 4 * 4);
        for(this.staticData = new Float32Array(o182), this.staticDataUint32 = new Uint32Array(o182), this.staticBuffer = new zi(this.staticData, !0, !1), r437 = 0; r437 < this.dynamicProperties.length; ++r437){
            var s123 = this.dynamicProperties[r437];
            t.addAttribute(s123.attributeName, this.dynamicBuffer, 0, s123.type === le.UNSIGNED_BYTE, s123.type, 4 * this.dynamicStride, 4 * s123.offset);
        }
        for(r437 = 0; r437 < this.staticProperties.length; ++r437)s123 = this.staticProperties[r437], t.addAttribute(s123.attributeName, this.staticBuffer, 0, s123.type === le.UNSIGNED_BYTE, s123.type, 4 * this.staticStride, 4 * s123.offset);
    }, t485.prototype.uploadDynamic = function(t, e599, r438) {
        for(var i327 = 0; i327 < this.dynamicProperties.length; i327++){
            var n232 = this.dynamicProperties[i327];
            n232.uploadFunction(t, e599, r438, n232.type === le.UNSIGNED_BYTE ? this.dynamicDataUint32 : this.dynamicData, this.dynamicStride, n232.offset);
        }
        this.dynamicBuffer._updateID++;
    }, t485.prototype.uploadStatic = function(t, e600, r439) {
        for(var i328 = 0; i328 < this.staticProperties.length; i328++){
            var n233 = this.staticProperties[i328];
            n233.uploadFunction(t, e600, r439, n233.type === le.UNSIGNED_BYTE ? this.staticDataUint32 : this.staticData, this.staticStride, n233.offset);
        }
        this.staticBuffer._updateID++;
    }, t485.prototype.destroy = function() {
        this.indexBuffer = null, this.dynamicProperties = null, this.dynamicBuffer = null, this.dynamicData = null, this.dynamicDataUint32 = null, this.staticProperties = null, this.staticBuffer = null, this.staticData = null, this.staticDataUint32 = null, this.geometry.destroy();
    }, t485;
}(), Qs = "varying vec2 vTextureCoord;\nvarying vec4 vColor;\n\nuniform sampler2D uSampler;\n\nvoid main(void){\n    vec4 color = texture2D(uSampler, vTextureCoord) * vColor;\n    gl_FragColor = color;\n}", $s = "attribute vec2 aVertexPosition;\nattribute vec2 aTextureCoord;\nattribute vec4 aColor;\n\nattribute vec2 aPositionCoord;\nattribute float aRotation;\n\nuniform mat3 translationMatrix;\nuniform vec4 uColor;\n\nvarying vec2 vTextureCoord;\nvarying vec4 vColor;\n\nvoid main(void){\n    float x = (aVertexPosition.x) * cos(aRotation) - (aVertexPosition.y) * sin(aRotation);\n    float y = (aVertexPosition.x) * sin(aRotation) + (aVertexPosition.y) * cos(aRotation);\n\n    vec2 v = vec2(x, y);\n    v = v + aPositionCoord;\n\n    gl_Position = vec4((translationMatrix * vec3(v, 1.0)).xy, 0.0, 1.0);\n\n    vTextureCoord = aTextureCoord;\n    vColor = aColor * uColor;\n}\n", ta = function(t486) {
    function e601(e602) {
        var r440 = t486.call(this, e602) || this;
        return r440.shader = null, r440.properties = null, r440.tempMatrix = new _r, r440.properties = [
            {
                attributeName: "aVertexPosition",
                size: 2,
                uploadFunction: r440.uploadVertices,
                offset: 0
            },
            {
                attributeName: "aPositionCoord",
                size: 2,
                uploadFunction: r440.uploadPosition,
                offset: 0
            },
            {
                attributeName: "aRotation",
                size: 1,
                uploadFunction: r440.uploadRotation,
                offset: 0
            },
            {
                attributeName: "aTextureCoord",
                size: 2,
                uploadFunction: r440.uploadUvs,
                offset: 0
            },
            {
                attributeName: "aColor",
                size: 1,
                type: le.UNSIGNED_BYTE,
                uploadFunction: r440.uploadTint,
                offset: 0
            }
        ], r440.shader = Hn.from($s, Qs, {
        }), r440.state = jn.for2d(), r440;
    }
    return zs(e601, t486), e601.prototype.render = function(t) {
        var e603 = t.children, r441 = t._maxSize, i329 = t._batchSize, n234 = this.renderer, o183 = e603.length;
        if (0 !== o183) {
            o183 > r441 && !t.autoResize && (o183 = r441);
            var s124 = t._buffers;
            s124 || (s124 = t._buffers = this.generateBuffers(t));
            var a103 = e603[0]._texture.baseTexture;
            this.state.blendMode = Ce(t.blendMode, a103.alphaMode), n234.state.set(this.state);
            var h75 = n234.gl, u62 = t.worldTransform.copyTo(this.tempMatrix);
            u62.prepend(n234.globalUniforms.uniforms.projectionMatrix), this.shader.uniforms.translationMatrix = u62.toArray(!0), this.shader.uniforms.uColor = we(t.tintRgb, t.worldAlpha, this.shader.uniforms.uColor, a103.alphaMode), this.shader.uniforms.uSampler = a103, this.renderer.shader.bind(this.shader);
            for(var l48 = !1, c36 = 0, d36 = 0; c36 < o183; c36 += i329, d36 += 1){
                var f28 = o183 - c36;
                f28 > i329 && (f28 = i329), d36 >= s124.length && s124.push(this._generateOneMoreBuffer(t));
                var p = s124[d36];
                p.uploadDynamic(e603, c36, f28);
                var _13 = t._bufferUpdateIDs[d36] || 0;
                (l48 = l48 || p._updateID < _13) && (p._updateID = t._updateID, p.uploadStatic(e603, c36, f28)), n234.geometry.bind(p.geometry), h75.drawElements(h75.TRIANGLES, 6 * f28, h75.UNSIGNED_SHORT, 0);
            }
        }
    }, e601.prototype.generateBuffers = function(t) {
        for(var e604 = [], r442 = t._maxSize, i330 = t._batchSize, n235 = t._properties, o184 = 0; o184 < r442; o184 += i330)e604.push(new Js(this.properties, n235, i330));
        return e604;
    }, e601.prototype._generateOneMoreBuffer = function(t) {
        var e605 = t._batchSize, r443 = t._properties;
        return new Js(this.properties, r443, e605);
    }, e601.prototype.uploadVertices = function(t, e, r444, i331, n236, o185) {
        for(var s125 = 0, a104 = 0, h76 = 0, u63 = 0, l49 = 0; l49 < r444; ++l49){
            var c37 = t[e + l49], d37 = c37._texture, f29 = c37.scale.x, p = c37.scale.y, _14 = d37.trim, m13 = d37.orig;
            _14 ? (s125 = (a104 = _14.x - c37.anchor.x * m13.width) + _14.width, h76 = (u63 = _14.y - c37.anchor.y * m13.height) + _14.height) : (s125 = m13.width * (1 - c37.anchor.x), a104 = m13.width * -c37.anchor.x, h76 = m13.height * (1 - c37.anchor.y), u63 = m13.height * -c37.anchor.y), i331[o185] = a104 * f29, i331[o185 + 1] = u63 * p, i331[o185 + n236] = s125 * f29, i331[o185 + n236 + 1] = u63 * p, i331[o185 + 2 * n236] = s125 * f29, i331[o185 + 2 * n236 + 1] = h76 * p, i331[o185 + 3 * n236] = a104 * f29, i331[o185 + 3 * n236 + 1] = h76 * p, o185 += 4 * n236;
        }
    }, e601.prototype.uploadPosition = function(t, e, r445, i332, n237, o186) {
        for(var s126 = 0; s126 < r445; s126++){
            var a105 = t[e + s126].position;
            i332[o186] = a105.x, i332[o186 + 1] = a105.y, i332[o186 + n237] = a105.x, i332[o186 + n237 + 1] = a105.y, i332[o186 + 2 * n237] = a105.x, i332[o186 + 2 * n237 + 1] = a105.y, i332[o186 + 3 * n237] = a105.x, i332[o186 + 3 * n237 + 1] = a105.y, o186 += 4 * n237;
        }
    }, e601.prototype.uploadRotation = function(t, e, r446, i333, n238, o187) {
        for(var s127 = 0; s127 < r446; s127++){
            var a106 = t[e + s127].rotation;
            i333[o187] = a106, i333[o187 + n238] = a106, i333[o187 + 2 * n238] = a106, i333[o187 + 3 * n238] = a106, o187 += 4 * n238;
        }
    }, e601.prototype.uploadUvs = function(t, e, r447, i334, n239, o188) {
        for(var s128 = 0; s128 < r447; ++s128){
            var a107 = t[e + s128]._texture._uvs;
            a107 ? (i334[o188] = a107.x0, i334[o188 + 1] = a107.y0, i334[o188 + n239] = a107.x1, i334[o188 + n239 + 1] = a107.y1, i334[o188 + 2 * n239] = a107.x2, i334[o188 + 2 * n239 + 1] = a107.y2, i334[o188 + 3 * n239] = a107.x3, i334[o188 + 3 * n239 + 1] = a107.y3, o188 += 4 * n239) : (i334[o188] = 0, i334[o188 + 1] = 0, i334[o188 + n239] = 0, i334[o188 + n239 + 1] = 0, i334[o188 + 2 * n239] = 0, i334[o188 + 2 * n239 + 1] = 0, i334[o188 + 3 * n239] = 0, i334[o188 + 3 * n239 + 1] = 0, o188 += 4 * n239);
        }
    }, e601.prototype.uploadTint = function(t, e, r448, i335, n240, o189) {
        for(var s129 = 0; s129 < r448; ++s129){
            var a108 = t[e + s129], h77 = a108._texture.baseTexture.alphaMode > 0, u64 = a108.alpha, l50 = u64 < 1 && h77 ? Le(a108._tintRGB, u64) : a108._tintRGB + (255 * u64 << 24);
            i335[o189] = l50, i335[o189 + n240] = l50, i335[o189 + 2 * n240] = l50, i335[o189 + 3 * n240] = l50, o189 += 4 * n240;
        }
    }, e601.prototype.destroy = function() {
        t486.prototype.destroy.call(this), this.shader && (this.shader.destroy(), this.shader = null), this.tempMatrix = null;
    }, e601;
}(hn);
!function(t) {
    t.MITER = "miter", t.BEVEL = "bevel", t.ROUND = "round";
}(qs || (qs = {
})), (function(t) {
    t.BUTT = "butt", t.ROUND = "round", t.SQUARE = "square";
})(Ks || (Ks = {
}));
var ea = {
    adaptive: !0,
    maxLength: 10,
    minSegments: 8,
    maxSegments: 2048,
    epsilon: 0.0001,
    _segmentsCount: function(t, e606) {
        if (void 0 === e606 && (e606 = 20), !this.adaptive || !t || isNaN(t)) return e606;
        var r449 = Math.ceil(t / this.maxLength);
        return r449 < this.minSegments ? r449 = this.minSegments : r449 > this.maxSegments && (r449 = this.maxSegments), r449;
    }
}, ra = function() {
    function t() {
        this.color = 16777215, this.alpha = 1, this.texture = ki.WHITE, this.matrix = null, this.visible = !1, this.reset();
    }
    return t.prototype.clone = function() {
        var e607 = new t;
        return e607.color = this.color, e607.alpha = this.alpha, e607.texture = this.texture, e607.matrix = this.matrix, e607.visible = this.visible, e607;
    }, t.prototype.reset = function() {
        this.color = 16777215, this.alpha = 1, this.texture = ki.WHITE, this.matrix = null, this.visible = !1;
    }, t.prototype.destroy = function() {
        this.texture = null, this.matrix = null;
    }, t;
}(), ia = function(t487, e608) {
    return (ia = Object.setPrototypeOf || ({
        __proto__: []
    }) instanceof Array && function(t, e609) {
        t.__proto__ = e609;
    } || function(t, e610) {
        for(var r450 in e610)e610.hasOwnProperty(r450) && (t[r450] = e610[r450]);
    })(t487, e608);
};
function na(t, e611) {
    function r451() {
        this.constructor = t;
    }
    ia(t, e611), t.prototype = null === e611 ? Object.create(e611) : (r451.prototype = e611.prototype, new r451);
}
var oa = {
    build: function(t) {
        t.points = t.shape.points.slice();
    },
    triangulate: function(t, e612) {
        var r452 = t.points, i336 = t.holes, n241 = e612.points, o190 = e612.indices;
        if (r452.length >= 6) {
            for(var s130 = [], a109 = 0; a109 < i336.length; a109++){
                var h78 = i336[a109];
                s130.push(r452.length / 2), r452 = r452.concat(h78.points);
            }
            var u65 = ot(r452, s130, 2);
            if (!u65) return;
            var l51 = n241.length / 2;
            for(a109 = 0; a109 < u65.length; a109 += 3)o190.push(u65[a109] + l51), o190.push(u65[a109 + 1] + l51), o190.push(u65[a109 + 2] + l51);
            for(a109 = 0; a109 < r452.length; a109++)n241.push(r452[a109]);
        }
    }
}, sa = {
    build: function(t) {
        var e613, r453, i337 = t.shape, n242 = t.points, o191 = i337.x, s131 = i337.y;
        if (n242.length = 0, t.type === ir.CIRC) e613 = i337.radius, r453 = i337.radius;
        else {
            var a110 = t.shape;
            e613 = a110.width, r453 = a110.height;
        }
        if (0 !== e613 && 0 !== r453) {
            var h79 = Math.floor(30 * Math.sqrt(i337.radius)) || Math.floor(15 * Math.sqrt(e613 + r453));
            h79 /= 2.3;
            for(var u66 = 2 * Math.PI / h79, l52 = 0; l52 < h79 - 0.5; l52++)n242.push(o191 + Math.sin(-u66 * l52) * e613, s131 + Math.cos(-u66 * l52) * r453);
            n242.push(n242[0], n242[1]);
        }
    },
    triangulate: function(t, e614) {
        var r454 = t.points, i338 = e614.points, n243 = e614.indices, o192 = i338.length / 2, s132 = o192, a111 = t.shape, h80 = t.matrix, u67 = a111.x, l53 = a111.y;
        i338.push(t.matrix ? h80.a * u67 + h80.c * l53 + h80.tx : u67, t.matrix ? h80.b * u67 + h80.d * l53 + h80.ty : l53);
        for(var c38 = 0; c38 < r454.length; c38 += 2)i338.push(r454[c38], r454[c38 + 1]), n243.push(o192++, s132, o192);
    }
}, aa = {
    build: function(t) {
        var e615 = t.shape, r455 = e615.x, i339 = e615.y, n244 = e615.width, o193 = e615.height, s133 = t.points;
        s133.length = 0, s133.push(r455, i339, r455 + n244, i339, r455 + n244, i339 + o193, r455, i339 + o193);
    },
    triangulate: function(t, e616) {
        var r456 = t.points, i340 = e616.points, n245 = i340.length / 2;
        i340.push(r456[0], r456[1], r456[2], r456[3], r456[6], r456[7], r456[4], r456[5]), e616.indices.push(n245, n245 + 1, n245 + 2, n245 + 1, n245 + 2, n245 + 3);
    }
};
function ha(t, e617, r457) {
    return t + (e617 - t) * r457;
}
function ua(t, e618, r458, i341, n246, o194, s134) {
    void 0 === s134 && (s134 = []);
    for(var a112 = s134, h81 = 0, u68 = 0, l54 = 0, c39 = 0, d38 = 0, f30 = 0, p = 0, _15 = 0; p <= 20; ++p)h81 = ha(t, r458, _15 = p / 20), u68 = ha(e618, i341, _15), l54 = ha(r458, n246, _15), c39 = ha(i341, o194, _15), d38 = ha(h81, l54, _15), f30 = ha(u68, c39, _15), 0 === p && a112[a112.length - 2] === d38 && a112[a112.length - 1] === f30 || a112.push(d38, f30);
    return a112;
}
var la = {
    build: function(t) {
        var e619 = t.shape, r459 = t.points, i342 = e619.x, n247 = e619.y, o195 = e619.width, s135 = e619.height, a113 = Math.max(0, Math.min(e619.radius, Math.min(o195, s135) / 2));
        r459.length = 0, a113 ? (ua(i342, n247 + a113, i342, n247, i342 + a113, n247, r459), ua(i342 + o195 - a113, n247, i342 + o195, n247, i342 + o195, n247 + a113, r459), ua(i342 + o195, n247 + s135 - a113, i342 + o195, n247 + s135, i342 + o195 - a113, n247 + s135, r459), ua(i342 + a113, n247 + s135, i342, n247 + s135, i342, n247 + s135 - a113, r459)) : r459.push(i342, n247, i342 + o195, n247, i342 + o195, n247 + s135, i342, n247 + s135);
    },
    triangulate: function(t, e620) {
        for(var r460 = t.points, i343 = e620.points, n248 = e620.indices, o196 = i343.length / 2, s136 = ot(r460, null, 2), a114 = 0, h82 = s136.length; a114 < h82; a114 += 3)n248.push(s136[a114] + o196), n248.push(s136[a114 + 1] + o196), n248.push(s136[a114 + 2] + o196);
        for(a114 = 0, h82 = r460.length; a114 < h82; a114++)i343.push(r460[a114], r460[++a114]);
    }
};
function ca(t, e621, r461, i344, n249, o197, s137, a115) {
    var h83, u69;
    s137 ? (h83 = i344, u69 = -r461) : (h83 = -i344, u69 = r461);
    var l55 = t - r461 * n249 + h83, c40 = e621 - i344 * n249 + u69, d39 = t + r461 * o197 + h83, f31 = e621 + i344 * o197 + u69;
    return a115.push(l55, c40), a115.push(d39, f31), 2;
}
function da(t, e622, r462, i345, n250, o198, s138, a116) {
    var h84 = r462 - t, u70 = i345 - e622, l56 = Math.atan2(h84, u70), c41 = Math.atan2(n250 - t, o198 - e622);
    a116 && l56 < c41 ? l56 += 2 * Math.PI : !a116 && l56 > c41 && (c41 += 2 * Math.PI);
    var d40 = l56, f32 = c41 - l56, p = Math.abs(f32), _16 = Math.sqrt(h84 * h84 + u70 * u70), m14 = 1 + (15 * p * Math.sqrt(_16) / Math.PI >> 0), v12 = f32 / m14;
    if (d40 += v12, a116) {
        s138.push(t, e622), s138.push(r462, i345);
        for(var y = 1, g10 = d40; y < m14; y++, g10 += v12)s138.push(t, e622), s138.push(t + Math.sin(g10) * _16, e622 + Math.cos(g10) * _16);
        s138.push(t, e622), s138.push(n250, o198);
    } else {
        for(s138.push(r462, i345), s138.push(t, e622), y = 1, g10 = d40; y < m14; y++, g10 += v12)s138.push(t + Math.sin(g10) * _16, e622 + Math.cos(g10) * _16), s138.push(t, e622);
        s138.push(n250, o198), s138.push(t, e622);
    }
    return 2 * m14;
}
function fa(t488, e623) {
    t488.lineStyle.native ? (function(t, e624) {
        var r463 = 0, i346 = t.shape, n251 = t.points || i346.points, o199 = i346.type !== ir.POLY || i346.closeStroke;
        if (0 !== n251.length) {
            var s139 = e624.points, a117 = e624.indices, h85 = n251.length / 2, u71 = s139.length / 2, l57 = u71;
            for(s139.push(n251[0], n251[1]), r463 = 1; r463 < h85; r463++)s139.push(n251[2 * r463], n251[2 * r463 + 1]), a117.push(l57, l57 + 1), l57++;
            o199 && a117.push(l57, u71);
        }
    })(t488, e623) : (function(t, e625) {
        var r464 = t.shape, i347 = t.points || r464.points.slice(), n252 = e625.closePointEps;
        if (0 !== i347.length) {
            var o200 = t.lineStyle, s140 = new fr(i347[0], i347[1]), a118 = new fr(i347[i347.length - 2], i347[i347.length - 1]), h86 = r464.type !== ir.POLY || r464.closeStroke, u72 = Math.abs(s140.x - a118.x) < n252 && Math.abs(s140.y - a118.y) < n252;
            if (h86) {
                i347 = i347.slice(), u72 && (i347.pop(), i347.pop(), a118.set(i347[i347.length - 2], i347[i347.length - 1]));
                var l58 = 0.5 * (s140.x + a118.x), c42 = 0.5 * (a118.y + s140.y);
                i347.unshift(l58, c42), i347.push(l58, c42);
            }
            var d41 = e625.points, f33 = i347.length / 2, p = i347.length, _17 = d41.length / 2, m15 = o200.width / 2, v13 = m15 * m15, y = o200.miterLimit * o200.miterLimit, g11 = i347[0], E10 = i347[1], T9 = i347[2], b7 = i347[3], x8 = 0, R5 = 0, A7 = -(E10 - b7), O6 = g11 - T9, S4 = 0, I4 = 0, P4 = Math.sqrt(A7 * A7 + O6 * O6);
            A7 /= P4, O6 /= P4, A7 *= m15, O6 *= m15;
            var N4 = o200.alignment, M3 = 2 * (1 - N4), D3 = 2 * N4;
            h86 || (o200.cap === Ks.ROUND ? p += da(g11 - A7 * (M3 - D3) * 0.5, E10 - O6 * (M3 - D3) * 0.5, g11 - A7 * M3, E10 - O6 * M3, g11 + A7 * D3, E10 + O6 * D3, d41, !0) + 2 : o200.cap === Ks.SQUARE && (p += ca(g11, E10, A7, O6, M3, D3, !0, d41))), d41.push(g11 - A7 * M3, E10 - O6 * M3), d41.push(g11 + A7 * D3, E10 + O6 * D3);
            for(var C1 = 1; C1 < f33 - 1; ++C1){
                g11 = i347[2 * (C1 - 1)], E10 = i347[2 * (C1 - 1) + 1], T9 = i347[2 * C1], b7 = i347[2 * C1 + 1], x8 = i347[2 * (C1 + 1)], R5 = i347[2 * (C1 + 1) + 1], A7 = -(E10 - b7), O6 = g11 - T9, A7 /= P4 = Math.sqrt(A7 * A7 + O6 * O6), O6 /= P4, A7 *= m15, O6 *= m15, S4 = -(b7 - R5), I4 = T9 - x8, S4 /= P4 = Math.sqrt(S4 * S4 + I4 * I4), I4 /= P4, S4 *= m15, I4 *= m15;
                var w1 = T9 - g11, L1 = E10 - b7, F1 = T9 - x8, U1 = R5 - b7, G1 = L1 * F1 - U1 * w1, B1 = G1 < 0;
                if (Math.abs(G1) < 0.1) d41.push(T9 - A7 * M3, b7 - O6 * M3), d41.push(T9 + A7 * D3, b7 + O6 * D3);
                else {
                    var X1 = (-A7 + g11) * (-O6 + b7) - (-A7 + T9) * (-O6 + E10), k1 = (-S4 + x8) * (-I4 + b7) - (-S4 + T9) * (-I4 + R5), H1 = (w1 * k1 - F1 * X1) / G1, j1 = (U1 * X1 - L1 * k1) / G1, Y1 = (H1 - T9) * (H1 - T9) + (j1 - b7) * (j1 - b7), V1 = T9 + (H1 - T9) * M3, W1 = b7 + (j1 - b7) * M3, z1 = T9 - (H1 - T9) * D3, q1 = b7 - (j1 - b7) * D3, K1 = B1 ? M3 : D3;
                    Y1 <= Math.min(w1 * w1 + L1 * L1, F1 * F1 + U1 * U1) + K1 * K1 * v13 ? o200.join === qs.BEVEL || Y1 / v13 > y ? (B1 ? (d41.push(V1, W1), d41.push(T9 + A7 * D3, b7 + O6 * D3), d41.push(V1, W1), d41.push(T9 + S4 * D3, b7 + I4 * D3)) : (d41.push(T9 - A7 * M3, b7 - O6 * M3), d41.push(z1, q1), d41.push(T9 - S4 * M3, b7 - I4 * M3), d41.push(z1, q1)), p += 2) : o200.join === qs.ROUND ? B1 ? (d41.push(V1, W1), d41.push(T9 + A7 * D3, b7 + O6 * D3), p += da(T9, b7, T9 + A7 * D3, b7 + O6 * D3, T9 + S4 * D3, b7 + I4 * D3, d41, !0) + 4, d41.push(V1, W1), d41.push(T9 + S4 * D3, b7 + I4 * D3)) : (d41.push(T9 - A7 * M3, b7 - O6 * M3), d41.push(z1, q1), p += da(T9, b7, T9 - A7 * M3, b7 - O6 * M3, T9 - S4 * M3, b7 - I4 * M3, d41, !1) + 4, d41.push(T9 - S4 * M3, b7 - I4 * M3), d41.push(z1, q1)) : (d41.push(V1, W1), d41.push(z1, q1)) : (d41.push(T9 - A7 * M3, b7 - O6 * M3), d41.push(T9 + A7 * D3, b7 + O6 * D3), o200.join === qs.BEVEL || Y1 / v13 > y || (o200.join === qs.ROUND ? p += B1 ? da(T9, b7, T9 + A7 * D3, b7 + O6 * D3, T9 + S4 * D3, b7 + I4 * D3, d41, !0) + 2 : da(T9, b7, T9 - A7 * M3, b7 - O6 * M3, T9 - S4 * M3, b7 - I4 * M3, d41, !1) + 2 : (B1 ? (d41.push(z1, q1), d41.push(z1, q1)) : (d41.push(V1, W1), d41.push(V1, W1)), p += 2)), d41.push(T9 - S4 * M3, b7 - I4 * M3), d41.push(T9 + S4 * D3, b7 + I4 * D3), p += 2);
                }
            }
            g11 = i347[2 * (f33 - 2)], E10 = i347[2 * (f33 - 2) + 1], T9 = i347[2 * (f33 - 1)], A7 = -(E10 - (b7 = i347[2 * (f33 - 1) + 1])), O6 = g11 - T9, A7 /= P4 = Math.sqrt(A7 * A7 + O6 * O6), O6 /= P4, A7 *= m15, O6 *= m15, d41.push(T9 - A7 * M3, b7 - O6 * M3), d41.push(T9 + A7 * D3, b7 + O6 * D3), h86 || (o200.cap === Ks.ROUND ? p += da(T9 - A7 * (M3 - D3) * 0.5, b7 - O6 * (M3 - D3) * 0.5, T9 - A7 * M3, b7 - O6 * M3, T9 + A7 * D3, b7 + O6 * D3, d41, !1) + 2 : o200.cap === Ks.SQUARE && (p += ca(T9, b7, A7, O6, M3, D3, !1, d41)));
            var Z1 = e625.indices, J1 = ea.epsilon * ea.epsilon;
            for(C1 = _17; C1 < p + _17 - 2; ++C1)g11 = d41[2 * C1], E10 = d41[2 * C1 + 1], T9 = d41[2 * (C1 + 1)], b7 = d41[2 * (C1 + 1) + 1], x8 = d41[2 * (C1 + 2)], R5 = d41[2 * (C1 + 2) + 1], Math.abs(g11 * (b7 - R5) + T9 * (R5 - E10) + x8 * (E10 - b7)) < J1 || Z1.push(C1, C1 + 1, C1 + 2);
        }
    })(t488, e623);
}
var pa, _a = function() {
    function t489() {
    }
    return t489.curveTo = function(t, e626, r465, i348, n253, o201) {
        var s141 = o201[o201.length - 2], a119 = o201[o201.length - 1] - e626, h87 = s141 - t, u73 = i348 - e626, l59 = r465 - t, c43 = Math.abs(a119 * l59 - h87 * u73);
        if (c43 < 0.00000001 || 0 === n253) return o201[o201.length - 2] === t && o201[o201.length - 1] === e626 || o201.push(t, e626), null;
        var d42 = a119 * a119 + h87 * h87, f34 = u73 * u73 + l59 * l59, p = a119 * u73 + h87 * l59, _18 = n253 * Math.sqrt(d42) / c43, m16 = n253 * Math.sqrt(f34) / c43, v14 = _18 * p / d42, y = m16 * p / f34, g12 = _18 * l59 + m16 * h87, E11 = _18 * u73 + m16 * a119, T10 = h87 * (m16 + v14), b8 = a119 * (m16 + v14), x9 = l59 * (_18 + y), R6 = u73 * (_18 + y);
        return {
            cx: g12 + t,
            cy: E11 + e626,
            radius: n253,
            startAngle: Math.atan2(b8 - E11, T10 - g12),
            endAngle: Math.atan2(R6 - E11, x9 - g12),
            anticlockwise: h87 * u73 > l59 * a119
        };
    }, t489.arc = function(t, e, r466, i349, n254, o202, s142, a, h88) {
        for(var u74 = s142 - o202, l60 = ea._segmentsCount(Math.abs(u74) * n254, 40 * Math.ceil(Math.abs(u74) / or)), c44 = u74 / (2 * l60), d43 = 2 * c44, f35 = Math.cos(c44), p = Math.sin(c44), _19 = l60 - 1, m17 = _19 % 1 / _19, v15 = 0; v15 <= _19; ++v15){
            var y = c44 + o202 + d43 * (v15 + m17 * v15), g13 = Math.cos(y), E12 = -Math.sin(y);
            h88.push((f35 * g13 + p * E12) * n254 + r466, (f35 * -E12 + p * g13) * n254 + i349);
        }
    }, t489;
}(), ma = function() {
    function t490() {
    }
    return t490.curveLength = function(t, e627, r467, i350, n255, o203, s143, a120) {
        for(var h89 = 0, u75 = 0, l61 = 0, c45 = 0, d44 = 0, f36 = 0, p = 0, _20 = 0, m18 = 0, v16 = 0, y = 0, g14 = t, E13 = e627, T11 = 1; T11 <= 10; ++T11)v16 = g14 - (_20 = (p = (f36 = (d44 = 1 - (u75 = T11 / 10)) * d44) * d44) * t + 3 * f36 * u75 * r467 + 3 * d44 * (l61 = u75 * u75) * n255 + (c45 = l61 * u75) * s143), y = E13 - (m18 = p * e627 + 3 * f36 * u75 * i350 + 3 * d44 * l61 * o203 + c45 * a120), g14 = _20, E13 = m18, h89 += Math.sqrt(v16 * v16 + y * y);
        return h89;
    }, t490.curveTo = function(e628, r468, i351, n256, o204, s144, a121) {
        var h90 = a121[a121.length - 2], u76 = a121[a121.length - 1];
        a121.length -= 2;
        var l62 = ea._segmentsCount(t490.curveLength(h90, u76, e628, r468, i351, n256, o204, s144)), c46 = 0, d45 = 0, f37 = 0, p = 0, _21 = 0;
        a121.push(h90, u76);
        for(var m19 = 1, v17 = 0; m19 <= l62; ++m19)f37 = (d45 = (c46 = 1 - (v17 = m19 / l62)) * c46) * c46, _21 = (p = v17 * v17) * v17, a121.push(f37 * h90 + 3 * d45 * v17 * e628 + 3 * c46 * p * i351 + _21 * o204, f37 * u76 + 3 * d45 * v17 * r468 + 3 * c46 * p * n256 + _21 * s144);
    }, t490;
}(), va = function() {
    function t491() {
    }
    return t491.curveLength = function(t, e629, r469, i352, n257, o205) {
        var s145 = t - 2 * r469 + n257, a122 = e629 - 2 * i352 + o205, h91 = 2 * r469 - 2 * t, u77 = 2 * i352 - 2 * e629, l63 = 4 * (s145 * s145 + a122 * a122), c47 = 4 * (s145 * h91 + a122 * u77), d46 = h91 * h91 + u77 * u77, f38 = 2 * Math.sqrt(l63 + c47 + d46), p = Math.sqrt(l63), _22 = 2 * l63 * p, m20 = 2 * Math.sqrt(d46), v18 = c47 / p;
        return (_22 * f38 + p * c47 * (f38 - m20) + (4 * d46 * l63 - c47 * c47) * Math.log((2 * p + v18 + f38) / (v18 + m20))) / (4 * _22);
    }, t491.curveTo = function(e630, r470, i353, n258, o206) {
        for(var s146 = o206[o206.length - 2], a123 = o206[o206.length - 1], h92 = ea._segmentsCount(t491.curveLength(s146, a123, e630, r470, i353, n258)), u78 = 0, l64 = 0, c48 = 1; c48 <= h92; ++c48){
            var d47 = c48 / h92;
            u78 = s146 + (e630 - s146) * d47, l64 = a123 + (r470 - a123) * d47, o206.push(u78 + (e630 + (i353 - e630) * d47 - u78) * d47, l64 + (r470 + (n258 - r470) * d47 - l64) * d47);
        }
    }, t491;
}(), ya = function() {
    function t492() {
        this.reset();
    }
    return t492.prototype.begin = function(t, e631, r471) {
        this.reset(), this.style = t, this.start = e631, this.attribStart = r471;
    }, t492.prototype.end = function(t, e632) {
        this.attribSize = e632 - this.attribStart, this.size = t - this.start;
    }, t492.prototype.reset = function() {
        this.style = null, this.size = 0, this.start = 0, this.attribStart = 0, this.attribSize = 0;
    }, t492;
}(), ga = ((pa = {
})[ir.POLY] = oa, pa[ir.CIRC] = sa, pa[ir.ELIP] = sa, pa[ir.RECT] = aa, pa[ir.RREC] = la, pa), Ea = [], Ta = [];
function ba(t) {
    for(var e633 = t.points, r472 = 0, i354 = 0; i354 < e633.length - 2; i354 += 2)r472 += (e633[i354 + 2] - e633[i354]) * (e633[i354 + 3] + e633[i354 + 1]);
    return r472 > 0;
}
var xa, Ra = function() {
    function t493(t, e634, r473, i355) {
        void 0 === e634 && (e634 = null), void 0 === r473 && (r473 = null), void 0 === i355 && (i355 = null), this.points = [], this.holes = [], this.shape = t, this.lineStyle = r473, this.fillStyle = e634, this.matrix = i355, this.type = t.type;
    }
    return t493.prototype.clone = function() {
        return new t493(this.shape, this.fillStyle, this.lineStyle, this.matrix);
    }, t493.prototype.destroy = function() {
        this.shape = null, this.holes.length = 0, this.holes = null, this.points.length = 0, this.points = null, this.lineStyle = null, this.fillStyle = null;
    }, t493;
}(), Aa = new fr, Oa = new Ar, Sa = function(t494) {
    function e635() {
        var e636 = t494.call(this) || this;
        return e636.closePointEps = 0.0001, e636.boundsPadding = 0, e636.uvsFloat32 = null, e636.indicesUint16 = null, e636.batchable = !1, e636.points = [], e636.colors = [], e636.uvs = [], e636.indices = [], e636.textureIds = [], e636.graphicsData = [], e636.drawCalls = [], e636.batchDirty = -1, e636.batches = [], e636.dirty = 0, e636.cacheDirty = -1, e636.clearDirty = 0, e636.shapeIndex = 0, e636._bounds = new Ar, e636.boundsDirty = -1, e636;
    }
    return na(e635, t494), Object.defineProperty(e635.prototype, "bounds", {
        get: function() {
            return this.boundsDirty !== this.dirty && (this.boundsDirty = this.dirty, this.calculateBounds()), this._bounds;
        },
        enumerable: !1,
        configurable: !0
    }), e635.prototype.invalidate = function() {
        this.boundsDirty = -1, this.dirty++, this.batchDirty++, this.shapeIndex = 0, this.points.length = 0, this.colors.length = 0, this.uvs.length = 0, this.indices.length = 0, this.textureIds.length = 0;
        for(var t = 0; t < this.drawCalls.length; t++)this.drawCalls[t].texArray.clear(), Ta.push(this.drawCalls[t]);
        for(this.drawCalls.length = 0, t = 0; t < this.batches.length; t++){
            var e637 = this.batches[t];
            e637.reset(), Ea.push(e637);
        }
        this.batches.length = 0;
    }, e635.prototype.clear = function() {
        return this.graphicsData.length > 0 && (this.invalidate(), this.clearDirty++, this.graphicsData.length = 0), this;
    }, e635.prototype.drawShape = function(t, e638, r474, i356) {
        void 0 === e638 && (e638 = null), void 0 === r474 && (r474 = null), void 0 === i356 && (i356 = null);
        var n259 = new Ra(t, e638, r474, i356);
        return this.graphicsData.push(n259), this.dirty++, this;
    }, e635.prototype.drawHole = function(t, e639) {
        if (void 0 === e639 && (e639 = null), !this.graphicsData.length) return null;
        var r475 = new Ra(t, null, null, e639), i357 = this.graphicsData[this.graphicsData.length - 1];
        return r475.lineStyle = i357.lineStyle, i357.holes.push(r475), this.dirty++, this;
    }, e635.prototype.destroy = function() {
        t494.prototype.destroy.call(this);
        for(var e640 = 0; e640 < this.graphicsData.length; ++e640)this.graphicsData[e640].destroy();
        this.points.length = 0, this.points = null, this.colors.length = 0, this.colors = null, this.uvs.length = 0, this.uvs = null, this.indices.length = 0, this.indices = null, this.indexBuffer.destroy(), this.indexBuffer = null, this.graphicsData.length = 0, this.graphicsData = null, this.drawCalls.length = 0, this.drawCalls = null, this.batches.length = 0, this.batches = null, this._bounds = null;
    }, e635.prototype.containsPoint = function(t) {
        for(var e641 = this.graphicsData, r476 = 0; r476 < e641.length; ++r476){
            var i358 = e641[r476];
            if (i358.fillStyle.visible && i358.shape && (i358.matrix ? i358.matrix.applyInverse(t, Aa) : Aa.copyFrom(t), i358.shape.contains(Aa.x, Aa.y))) {
                var n260 = !1;
                if (i358.holes) {
                    for(var o207 = 0; o207 < i358.holes.length; o207++)if (i358.holes[o207].shape.contains(Aa.x, Aa.y)) {
                        n260 = !0;
                        break;
                    }
                }
                if (!n260) return !0;
            }
        }
        return !1;
    }, e635.prototype.updateBatches = function(t) {
        if (this.graphicsData.length) {
            if (this.validateBatching()) {
                this.cacheDirty = this.dirty;
                var e642 = this.uvs, r477 = this.graphicsData, i359 = null, n261 = null;
                this.batches.length > 0 && (n261 = (i359 = this.batches[this.batches.length - 1]).style);
                for(var o208 = this.shapeIndex; o208 < r477.length; o208++){
                    this.shapeIndex++;
                    var s147 = r477[o208], a124 = s147.fillStyle, h93 = s147.lineStyle;
                    ga[s147.type].build(s147), s147.matrix && this.transformPoints(s147.points, s147.matrix);
                    for(var u79 = 0; u79 < 2; u79++){
                        var l65 = 0 === u79 ? a124 : h93;
                        if (l65.visible) {
                            var c49 = l65.texture.baseTexture, d48 = this.indices.length, f39 = this.points.length / 2;
                            c49.wrapMode = fe.REPEAT, 0 === u79 ? this.processFill(s147) : this.processLine(s147);
                            var p = this.points.length / 2 - f39;
                            0 !== p && (i359 && !this._compareStyles(n261, l65) && (i359.end(d48, f39), i359 = null), i359 || ((i359 = Ea.pop() || new ya).begin(l65, d48, f39), this.batches.push(i359), n261 = l65), this.addUvs(this.points, e642, l65.texture, f39, p, l65.matrix));
                        }
                    }
                }
                var _23 = this.indices.length, m21 = this.points.length / 2;
                if (i359 && i359.end(_23, m21), 0 !== this.batches.length) {
                    if (this.indicesUint16 && this.indices.length === this.indicesUint16.length) this.indicesUint16.set(this.indices);
                    else {
                        var v19 = m21 > 65535 && t;
                        this.indicesUint16 = v19 ? new Uint32Array(this.indices) : new Uint16Array(this.indices);
                    }
                    this.batchable = this.isBatchable(), this.batchable ? this.packBatches() : this.buildDrawCalls();
                } else this.batchable = !0;
            }
        } else this.batchable = !0;
    }, e635.prototype._compareStyles = function(t, e643) {
        return !(!t || !e643) && t.texture.baseTexture === e643.texture.baseTexture && t.color + t.alpha === e643.color + e643.alpha && !!t.native == !!e643.native;
    }, e635.prototype.validateBatching = function() {
        if (this.dirty === this.cacheDirty || !this.graphicsData.length) return !1;
        for(var t = 0, e644 = this.graphicsData.length; t < e644; t++){
            var r478 = this.graphicsData[t], i360 = r478.fillStyle, n262 = r478.lineStyle;
            if (i360 && !i360.texture.baseTexture.valid) return !1;
            if (n262 && !n262.texture.baseTexture.valid) return !1;
        }
        return !0;
    }, e635.prototype.packBatches = function() {
        this.batchDirty++, this.uvsFloat32 = new Float32Array(this.uvs);
        for(var t = this.batches, e645 = 0, r479 = t.length; e645 < r479; e645++)for(var i361 = t[e645], n263 = 0; n263 < i361.size; n263++){
            var o = i361.start + n263;
            this.indicesUint16[o] = this.indicesUint16[o] - i361.attribStart;
        }
    }, e635.prototype.isBatchable = function() {
        if (this.points.length > 131070) return !1;
        for(var t = this.batches, r480 = 0; r480 < t.length; r480++)if (t[r480].style.native) return !1;
        return this.points.length < 2 * e635.BATCHABLE_SIZE;
    }, e635.prototype.buildDrawCalls = function() {
        for(var t = ++Ai._globalBatch, e646 = 0; e646 < this.drawCalls.length; e646++)this.drawCalls[e646].texArray.clear(), Ta.push(this.drawCalls[e646]);
        this.drawCalls.length = 0;
        var r481 = this.colors, i362 = this.textureIds, n264 = Ta.pop();
        n264 || ((n264 = new Go).texArray = new Bo), n264.texArray.count = 0, n264.start = 0, n264.size = 0, n264.type = ae.TRIANGLES;
        var o209 = 0, s148 = null, a125 = 0, h94 = !1, u80 = ae.TRIANGLES, l66 = 0;
        for(this.drawCalls.push(n264), e646 = 0; e646 < this.batches.length; e646++){
            var c50 = this.batches[e646], d49 = c50.style, f40 = d49.texture.baseTexture;
            h94 !== !!d49.native && (u80 = (h94 = !!d49.native) ? ae.LINES : ae.TRIANGLES, s148 = null, o209 = 8, t++), s148 !== f40 && (s148 = f40, f40._batchEnabled !== t && (8 === o209 && (t++, o209 = 0, n264.size > 0 && ((n264 = Ta.pop()) || ((n264 = new Go).texArray = new Bo), this.drawCalls.push(n264)), n264.start = l66, n264.size = 0, n264.texArray.count = 0, n264.type = u80), f40.touched = 1, f40._batchEnabled = t, f40._batchLocation = o209, f40.wrapMode = fe.REPEAT, n264.texArray.elements[n264.texArray.count++] = f40, o209++)), n264.size += c50.size, l66 += c50.size, a125 = f40._batchLocation, this.addColors(r481, d49.color, d49.alpha, c50.attribSize, c50.attribStart), this.addTextureIds(i362, a125, c50.attribSize, c50.attribStart);
        }
        Ai._globalBatch = t, this.packAttributes();
    }, e635.prototype.packAttributes = function() {
        for(var t = this.points, e647 = this.uvs, r482 = this.colors, i363 = this.textureIds, n265 = new ArrayBuffer(3 * t.length * 4), o210 = new Float32Array(n265), s149 = new Uint32Array(n265), a = 0, h95 = 0; h95 < t.length / 2; h95++)o210[a++] = t[2 * h95], o210[a++] = t[2 * h95 + 1], o210[a++] = e647[2 * h95], o210[a++] = e647[2 * h95 + 1], s149[a++] = r482[h95], o210[a++] = i363[h95];
        this._buffer.update(n265), this._indexBuffer.update(this.indicesUint16);
    }, e635.prototype.processFill = function(t) {
        t.holes.length ? (this.processHoles(t.holes), oa.triangulate(t, this)) : ga[t.type].triangulate(t, this);
    }, e635.prototype.processLine = function(t) {
        fa(t, this);
        for(var e648 = 0; e648 < t.holes.length; e648++)fa(t.holes[e648], this);
    }, e635.prototype.processHoles = function(t) {
        for(var e649 = 0; e649 < t.length; e649++){
            var r483 = t[e649];
            ga[r483.type].build(r483), r483.matrix && this.transformPoints(r483.points, r483.matrix);
        }
    }, e635.prototype.calculateBounds = function() {
        var t = this._bounds, e650 = Oa, r484 = _r.IDENTITY;
        this._bounds.clear(), e650.clear();
        for(var i364 = 0; i364 < this.graphicsData.length; i364++){
            var n266 = this.graphicsData[i364], o211 = n266.shape, s150 = n266.type, a126 = n266.lineStyle, h96 = n266.matrix || _r.IDENTITY, u81 = 0;
            if (a126 && a126.visible) {
                var l67 = a126.alignment;
                u81 = a126.width, s150 === ir.POLY ? ba(o211) ? u81 *= 1 - l67 : u81 *= l67 : u81 *= Math.max(0, l67);
            }
            if (r484 !== h96 && (e650.isEmpty() || (t.addBoundsMatrix(e650, r484), e650.clear()), r484 = h96), s150 === ir.RECT || s150 === ir.RREC) {
                var c51 = o211;
                e650.addFramePad(c51.x, c51.y, c51.x + c51.width, c51.y + c51.height, u81, u81);
            } else if (s150 === ir.CIRC) {
                var d50 = o211;
                e650.addFramePad(d50.x, d50.y, d50.x, d50.y, d50.radius + u81, d50.radius + u81);
            } else if (s150 === ir.ELIP) {
                var f41 = o211;
                e650.addFramePad(f41.x, f41.y, f41.x, f41.y, f41.width + u81, f41.height + u81);
            } else {
                var p = o211;
                t.addVerticesMatrix(r484, p.points, 0, p.points.length, u81, u81);
            }
        }
        e650.isEmpty() || t.addBoundsMatrix(e650, r484), t.pad(this.boundsPadding, this.boundsPadding);
    }, e635.prototype.transformPoints = function(t, e651) {
        for(var r485 = 0; r485 < t.length / 2; r485++){
            var i365 = t[2 * r485], n267 = t[2 * r485 + 1];
            t[2 * r485] = e651.a * i365 + e651.c * n267 + e651.tx, t[2 * r485 + 1] = e651.b * i365 + e651.d * n267 + e651.ty;
        }
    }, e635.prototype.addColors = function(t, e652, r486, i366, n268) {
        void 0 === n268 && (n268 = 0);
        var o212 = Le((e652 >> 16) + (65280 & e652) + ((255 & e652) << 16), r486);
        t.length = Math.max(t.length, n268 + i366);
        for(var s151 = 0; s151 < i366; s151++)t[n268 + s151] = o212;
    }, e635.prototype.addTextureIds = function(t, e653, r487, i367) {
        void 0 === i367 && (i367 = 0), t.length = Math.max(t.length, i367 + r487);
        for(var n269 = 0; n269 < r487; n269++)t[i367 + n269] = e653;
    }, e635.prototype.addUvs = function(t, e654, r488, i, n270, o213) {
        void 0 === o213 && (o213 = null);
        for(var s152 = 0, a127 = e654.length, h97 = r488.frame; s152 < n270;){
            var u82 = t[2 * (i + s152)], l68 = t[2 * (i + s152) + 1];
            if (o213) {
                var c52 = o213.a * u82 + o213.c * l68 + o213.tx;
                l68 = o213.b * u82 + o213.d * l68 + o213.ty, u82 = c52;
            }
            s152++, e654.push(u82 / h97.width, l68 / h97.height);
        }
        var d51 = r488.baseTexture;
        (h97.width < d51.width || h97.height < d51.height) && this.adjustUvs(e654, r488, a127, n270);
    }, e635.prototype.adjustUvs = function(t, e655, r489, i368) {
        for(var n271 = e655.baseTexture, o214 = r489 + 2 * i368, s153 = e655.frame, a128 = s153.width / n271.width, h98 = s153.height / n271.height, u83 = s153.x / s153.width, l69 = s153.y / s153.height, c53 = Math.floor(t[r489] + 0.000001), d52 = Math.floor(t[r489 + 1] + 0.000001), f42 = r489 + 2; f42 < o214; f42 += 2)c53 = Math.min(c53, Math.floor(t[f42] + 0.000001)), d52 = Math.min(d52, Math.floor(t[f42 + 1] + 0.000001));
        for(u83 -= c53, l69 -= d52, f42 = r489; f42 < o214; f42 += 2)t[f42] = (t[f42] + u83) * a128, t[f42 + 1] = (t[f42 + 1] + l69) * h98;
    }, e635.BATCHABLE_SIZE = 100, e635;
}(jo), Ia = function(t495) {
    function e656() {
        var e657 = null !== t495 && t495.apply(this, arguments) || this;
        return e657.width = 0, e657.alignment = 0.5, e657.native = !1, e657.cap = Ks.BUTT, e657.join = qs.MITER, e657.miterLimit = 10, e657;
    }
    return na(e656, t495), e656.prototype.clone = function() {
        var t = new e656;
        return t.color = this.color, t.alpha = this.alpha, t.texture = this.texture, t.matrix = this.matrix, t.visible = this.visible, t.width = this.width, t.alignment = this.alignment, t.native = this.native, t.cap = this.cap, t.join = this.join, t.miterLimit = this.miterLimit, t;
    }, e656.prototype.reset = function() {
        t495.prototype.reset.call(this), this.color = 0, this.alignment = 0.5, this.width = 0, this.native = !1;
    }, e656;
}(ra), Pa = new Float32Array(3), Na = {
}, Ma = function(t496) {
    function e658(e659) {
        void 0 === e659 && (e659 = null);
        var r490 = t496.call(this) || this;
        return r490.shader = null, r490.pluginName = "batch", r490.currentPath = null, r490.batches = [], r490.batchTint = -1, r490.batchDirty = -1, r490.vertexData = null, r490._fillStyle = new ra, r490._lineStyle = new Ia, r490._matrix = null, r490._holeMode = !1, r490.state = jn.for2d(), r490._geometry = e659 || new Sa, r490._geometry.refCount++, r490._transformID = -1, r490.tint = 16777215, r490.blendMode = se.NORMAL, r490;
    }
    return na(e658, t496), Object.defineProperty(e658.prototype, "geometry", {
        get: function() {
            return this._geometry;
        },
        enumerable: !1,
        configurable: !0
    }), e658.prototype.clone = function() {
        return this.finishPoly(), new e658(this._geometry);
    }, Object.defineProperty(e658.prototype, "blendMode", {
        get: function() {
            return this.state.blendMode;
        },
        set: function(t) {
            this.state.blendMode = t;
        },
        enumerable: !1,
        configurable: !0
    }), Object.defineProperty(e658.prototype, "tint", {
        get: function() {
            return this._tint;
        },
        set: function(t) {
            this._tint = t;
        },
        enumerable: !1,
        configurable: !0
    }), Object.defineProperty(e658.prototype, "fill", {
        get: function() {
            return this._fillStyle;
        },
        enumerable: !1,
        configurable: !0
    }), Object.defineProperty(e658.prototype, "line", {
        get: function() {
            return this._lineStyle;
        },
        enumerable: !1,
        configurable: !0
    }), e658.prototype.lineStyle = function(t, e660, r491, i369, n272) {
        return void 0 === t && (t = null), void 0 === e660 && (e660 = 0), void 0 === r491 && (r491 = 1), void 0 === i369 && (i369 = 0.5), void 0 === n272 && (n272 = !1), "number" == typeof t && (t = {
            width: t,
            color: e660,
            alpha: r491,
            alignment: i369,
            native: n272
        }), this.lineTextureStyle(t);
    }, e658.prototype.lineTextureStyle = function(t) {
        t = Object.assign({
            width: 0,
            texture: ki.WHITE,
            color: t && t.texture ? 16777215 : 0,
            alpha: 1,
            matrix: null,
            alignment: 0.5,
            native: !1,
            cap: Ks.BUTT,
            join: qs.MITER,
            miterLimit: 10
        }, t), this.currentPath && this.startPoly();
        var e661 = t.width > 0 && t.alpha > 0;
        return e661 ? (t.matrix && (t.matrix = t.matrix.clone(), t.matrix.invert()), Object.assign(this._lineStyle, {
            visible: e661
        }, t)) : this._lineStyle.reset(), this;
    }, e658.prototype.startPoly = function() {
        if (this.currentPath) {
            var t = this.currentPath.points, e662 = this.currentPath.points.length;
            e662 > 2 && (this.drawShape(this.currentPath), this.currentPath = new cr, this.currentPath.closeStroke = !1, this.currentPath.points.push(t[e662 - 2], t[e662 - 1]));
        } else this.currentPath = new cr, this.currentPath.closeStroke = !1;
    }, e658.prototype.finishPoly = function() {
        this.currentPath && (this.currentPath.points.length > 2 ? (this.drawShape(this.currentPath), this.currentPath = null) : this.currentPath.points.length = 0);
    }, e658.prototype.moveTo = function(t, e663) {
        return this.startPoly(), this.currentPath.points[0] = t, this.currentPath.points[1] = e663, this;
    }, e658.prototype.lineTo = function(t, e664) {
        this.currentPath || this.moveTo(0, 0);
        var r492 = this.currentPath.points, i370 = r492[r492.length - 2], n273 = r492[r492.length - 1];
        return i370 === t && n273 === e664 || r492.push(t, e664), this;
    }, e658.prototype._initCurve = function(t, e665) {
        void 0 === t && (t = 0), void 0 === e665 && (e665 = 0), this.currentPath ? 0 === this.currentPath.points.length && (this.currentPath.points = [
            t,
            e665
        ]) : this.moveTo(t, e665);
    }, e658.prototype.quadraticCurveTo = function(t, e666, r493, i371) {
        this._initCurve();
        var n274 = this.currentPath.points;
        return 0 === n274.length && this.moveTo(0, 0), va.curveTo(t, e666, r493, i371, n274), this;
    }, e658.prototype.bezierCurveTo = function(t, e667, r494, i372, n275, o215) {
        return this._initCurve(), ma.curveTo(t, e667, r494, i372, n275, o215, this.currentPath.points), this;
    }, e658.prototype.arcTo = function(t, e668, r495, i373, n276) {
        this._initCurve(t, e668);
        var o216 = this.currentPath.points, s154 = _a.curveTo(t, e668, r495, i373, n276, o216);
        if (s154) {
            var a129 = s154.cx, h99 = s154.cy, u84 = s154.radius, l70 = s154.startAngle, c54 = s154.endAngle, d53 = s154.anticlockwise;
            this.arc(a129, h99, u84, l70, c54, d53);
        }
        return this;
    }, e658.prototype.arc = function(t, e669, r496, i374, n277, o217) {
        if (void 0 === o217 && (o217 = !1), i374 === n277) return this;
        if (!o217 && n277 <= i374 ? n277 += or : o217 && i374 <= n277 && (i374 += or), 0 == n277 - i374) return this;
        var s155 = t + Math.cos(i374) * r496, a130 = e669 + Math.sin(i374) * r496, h100 = this._geometry.closePointEps, u85 = this.currentPath ? this.currentPath.points : null;
        if (u85) {
            var l71 = Math.abs(u85[u85.length - 2] - s155), c55 = Math.abs(u85[u85.length - 1] - a130);
            l71 < h100 && c55 < h100 || u85.push(s155, a130);
        } else this.moveTo(s155, a130), u85 = this.currentPath.points;
        return _a.arc(s155, a130, t, e669, r496, i374, n277, o217, u85), this;
    }, e658.prototype.beginFill = function(t, e670) {
        return void 0 === t && (t = 0), void 0 === e670 && (e670 = 1), this.beginTextureFill({
            texture: ki.WHITE,
            color: t,
            alpha: e670
        });
    }, e658.prototype.beginTextureFill = function(t) {
        t = Object.assign({
            texture: ki.WHITE,
            color: 16777215,
            alpha: 1,
            matrix: null
        }, t), this.currentPath && this.startPoly();
        var e671 = t.alpha > 0;
        return e671 ? (t.matrix && (t.matrix = t.matrix.clone(), t.matrix.invert()), Object.assign(this._fillStyle, {
            visible: e671
        }, t)) : this._fillStyle.reset(), this;
    }, e658.prototype.endFill = function() {
        return this.finishPoly(), this._fillStyle.reset(), this;
    }, e658.prototype.drawRect = function(t, e672, r497, i375) {
        return this.drawShape(new hr(t, e672, r497, i375));
    }, e658.prototype.drawRoundedRect = function(t, e673, r498, i376, n278) {
        return this.drawShape(new dr(t, e673, r498, i376, n278));
    }, e658.prototype.drawCircle = function(t, e674, r499) {
        return this.drawShape(new ur(t, e674, r499));
    }, e658.prototype.drawEllipse = function(t, e675, r500, i377) {
        return this.drawShape(new lr(t, e675, r500, i377));
    }, e658.prototype.drawPolygon = function() {
        for(var t, e676 = arguments, r501 = [], i378 = 0; i378 < arguments.length; i378++)r501[i378] = e676[i378];
        var n279 = !0, o218 = r501[0];
        o218.points ? (n279 = o218.closeStroke, t = o218.points) : t = Array.isArray(r501[0]) ? r501[0] : r501;
        var s156 = new cr(t);
        return s156.closeStroke = n279, this.drawShape(s156), this;
    }, e658.prototype.drawShape = function(t) {
        return this._holeMode ? this._geometry.drawHole(t, this._matrix) : this._geometry.drawShape(t, this._fillStyle.clone(), this._lineStyle.clone(), this._matrix), this;
    }, e658.prototype.clear = function() {
        return this._geometry.clear(), this._lineStyle.reset(), this._fillStyle.reset(), this._boundsID++, this._matrix = null, this._holeMode = !1, this.currentPath = null, this;
    }, e658.prototype.isFastRect = function() {
        var t = this._geometry.graphicsData;
        return !(1 !== t.length || t[0].shape.type !== ir.RECT || t[0].holes.length || t[0].lineStyle.visible && t[0].lineStyle.width);
    }, e658.prototype._render = function(t) {
        this.finishPoly();
        var e677 = this._geometry, r502 = t.context.supports.uint32Indices;
        e677.updateBatches(r502), e677.batchable ? (this.batchDirty !== e677.batchDirty && this._populateBatches(), this._renderBatched(t)) : (t.batch.flush(), this._renderDirect(t));
    }, e658.prototype._populateBatches = function() {
        var t = this._geometry, e678 = this.blendMode, r503 = t.batches.length;
        this.batchTint = -1, this._transformID = -1, this.batchDirty = t.batchDirty, this.batches.length = r503, this.vertexData = new Float32Array(t.points);
        for(var i379 = 0; i379 < r503; i379++){
            var n280 = t.batches[i379], o219 = n280.style.color, s157 = new Float32Array(this.vertexData.buffer, 4 * n280.attribStart * 2, 2 * n280.attribSize), a131 = new Float32Array(t.uvsFloat32.buffer, 4 * n280.attribStart * 2, 2 * n280.attribSize), h101 = {
                vertexData: s157,
                blendMode: e678,
                indices: new Uint16Array(t.indicesUint16.buffer, 2 * n280.start, n280.size),
                uvs: a131,
                _batchRGB: Pe(o219),
                _tintRGB: o219,
                _texture: n280.style.texture,
                alpha: n280.style.alpha,
                worldAlpha: 1
            };
            this.batches[i379] = h101;
        }
    }, e658.prototype._renderBatched = function(t) {
        if (this.batches.length) {
            t.batch.setObjectRenderer(t.plugins[this.pluginName]), this.calculateVertices(), this.calculateTints();
            for(var e679 = 0, r504 = this.batches.length; e679 < r504; e679++){
                var i380 = this.batches[e679];
                i380.worldAlpha = this.worldAlpha * i380.alpha, t.plugins[this.pluginName].render(i380);
            }
        }
    }, e658.prototype._renderDirect = function(t) {
        var e680 = this._resolveDirectShader(t), r505 = this._geometry, i381 = this.tint, n281 = this.worldAlpha, o220 = e680.uniforms, s158 = r505.drawCalls;
        o220.translationMatrix = this.transform.worldTransform, o220.tint[0] = (i381 >> 16 & 255) / 255 * n281, o220.tint[1] = (i381 >> 8 & 255) / 255 * n281, o220.tint[2] = (255 & i381) / 255 * n281, o220.tint[3] = n281, t.shader.bind(e680), t.geometry.bind(r505, e680), t.state.set(this.state);
        for(var a132 = 0, h102 = s158.length; a132 < h102; a132++)this._renderDrawCallDirect(t, r505.drawCalls[a132]);
    }, e658.prototype._renderDrawCallDirect = function(t, e681) {
        for(var r506 = e681.texArray, i382 = e681.type, n282 = e681.size, o221 = e681.start, s159 = r506.count, a133 = 0; a133 < s159; a133++)t.texture.bind(r506.elements[a133], a133);
        t.geometry.draw(i382, n282, o221);
    }, e658.prototype._resolveDirectShader = function(t) {
        var e682 = this.shader, r = this.pluginName;
        if (!e682) {
            if (!Na[r]) {
                for(var i383 = t.plugins.batch.MAX_TEXTURES, n283 = new Int32Array(i383), o222 = 0; o222 < i383; o222++)n283[o222] = o222;
                var s160 = {
                    tint: new Float32Array([
                        1,
                        1,
                        1,
                        1
                    ]),
                    translationMatrix: new _r,
                    default: rn.from({
                        uSamplers: n283
                    }, !0)
                }, a134 = t.plugins[r]._shader.program;
                Na[r] = new Hn(a134, s160);
            }
            e682 = Na[r];
        }
        return e682;
    }, e658.prototype._calculateBounds = function() {
        this.finishPoly();
        var t = this._geometry;
        if (t.graphicsData.length) {
            var e683 = t.bounds, r507 = e683.minX, i384 = e683.minY, n284 = e683.maxX, o223 = e683.maxY;
            this._bounds.addFrame(this.transform, r507, i384, n284, o223);
        }
    }, e658.prototype.containsPoint = function(t) {
        return this.worldTransform.applyInverse(t, e658._TEMP_POINT), this._geometry.containsPoint(e658._TEMP_POINT);
    }, e658.prototype.calculateTints = function() {
        if (this.batchTint !== this.tint) {
            this.batchTint = this.tint;
            for(var t = Pe(this.tint, Pa), e684 = 0; e684 < this.batches.length; e684++){
                var r508 = this.batches[e684], i385 = r508._batchRGB, n285 = (t[0] * i385[0] * 255 << 16) + (t[1] * i385[1] * 255 << 8) + (0 | t[2] * i385[2] * 255);
                r508._tintRGB = (n285 >> 16) + (65280 & n285) + ((255 & n285) << 16);
            }
        }
    }, e658.prototype.calculateVertices = function() {
        var t = this.transform._worldID;
        if (this._transformID !== t) {
            this._transformID = t;
            for(var e685 = this.transform.worldTransform, r509 = e685.a, i386 = e685.b, n286 = e685.c, o224 = e685.d, s161 = e685.tx, a135 = e685.ty, h103 = this._geometry.points, u86 = this.vertexData, l = 0, c56 = 0; c56 < h103.length; c56 += 2){
                var d54 = h103[c56], f43 = h103[c56 + 1];
                u86[l++] = r509 * d54 + n286 * f43 + s161, u86[l++] = o224 * f43 + i386 * d54 + a135;
            }
        }
    }, e658.prototype.closePath = function() {
        var t = this.currentPath;
        return t && (t.closeStroke = !0, this.finishPoly()), this;
    }, e658.prototype.setMatrix = function(t) {
        return this._matrix = t, this;
    }, e658.prototype.beginHole = function() {
        return this.finishPoly(), this._holeMode = !0, this;
    }, e658.prototype.endHole = function() {
        return this.finishPoly(), this._holeMode = !1, this;
    }, e658.prototype.destroy = function(e686) {
        this._geometry.refCount--, 0 === this._geometry.refCount && this._geometry.dispose(), this._matrix = null, this.currentPath = null, this._lineStyle.destroy(), this._lineStyle = null, this._fillStyle.destroy(), this._fillStyle = null, this._geometry = null, this.shader = null, this.vertexData = null, this.batches.length = 0, this.batches = null, t496.prototype.destroy.call(this, e686);
    }, e658._TEMP_POINT = new fr, e658;
}(Zr), Da = {
    buildPoly: oa,
    buildCircle: sa,
    buildRectangle: aa,
    buildRoundedRectangle: la,
    buildLine: fa,
    ArcUtils: _a,
    BezierUtils: ma,
    QuadraticUtils: va,
    BatchPart: ya,
    FILL_COMMANDS: ga,
    BATCH_POOL: Ea,
    DRAW_CALL_POOL: Ta
}, Ca = function(t497, e687) {
    return (Ca = Object.setPrototypeOf || ({
        __proto__: []
    }) instanceof Array && function(t, e688) {
        t.__proto__ = e688;
    } || function(t, e689) {
        for(var r510 in e689)e689.hasOwnProperty(r510) && (t[r510] = e689[r510]);
    })(t497, e687);
}, wa = new fr, La = new Uint16Array([
    0,
    1,
    2,
    0,
    2,
    3
]), Fa = function(t498) {
    function e690(e691) {
        var r511 = t498.call(this) || this;
        return r511._anchor = new pr(r511._onAnchorUpdate, r511, e691 ? e691.defaultAnchor.x : 0, e691 ? e691.defaultAnchor.y : 0), r511._texture = null, r511._width = 0, r511._height = 0, r511._tint = null, r511._tintRGB = null, r511.tint = 16777215, r511.blendMode = se.NORMAL, r511._cachedTint = 16777215, r511.uvs = null, r511.texture = e691 || ki.EMPTY, r511.vertexData = new Float32Array(8), r511.vertexTrimmedData = null, r511._transformID = -1, r511._textureID = -1, r511._transformTrimmedID = -1, r511._textureTrimmedID = -1, r511.indices = La, r511.pluginName = "batch", r511.isSprite = !0, r511._roundPixels = et.ROUND_PIXELS, r511;
    }
    return (function(t, e692) {
        function r512() {
            this.constructor = t;
        }
        Ca(t, e692), t.prototype = null === e692 ? Object.create(e692) : (r512.prototype = e692.prototype, new r512);
    })(e690, t498), e690.prototype._onTextureUpdate = function() {
        this._textureID = -1, this._textureTrimmedID = -1, this._cachedTint = 16777215, this._width && (this.scale.x = Ye(this.scale.x) * this._width / this._texture.orig.width), this._height && (this.scale.y = Ye(this.scale.y) * this._height / this._texture.orig.height);
    }, e690.prototype._onAnchorUpdate = function() {
        this._transformID = -1, this._transformTrimmedID = -1;
    }, e690.prototype.calculateVertices = function() {
        var t = this._texture;
        if (this._transformID !== this.transform._worldID || this._textureID !== t._updateID) {
            this._textureID !== t._updateID && (this.uvs = this._texture._uvs.uvsFloat32), this._transformID = this.transform._worldID, this._textureID = t._updateID;
            var e693 = this.transform.worldTransform, r513 = e693.a, i387 = e693.b, n287 = e693.c, o225 = e693.d, s162 = e693.tx, a136 = e693.ty, h104 = this.vertexData, u87 = t.trim, l72 = t.orig, c57 = this._anchor, d55 = 0, f44 = 0, p = 0, _24 = 0;
            if (u87 ? (d55 = (f44 = u87.x - c57._x * l72.width) + u87.width, p = (_24 = u87.y - c57._y * l72.height) + u87.height) : (d55 = (f44 = -c57._x * l72.width) + l72.width, p = (_24 = -c57._y * l72.height) + l72.height), h104[0] = r513 * f44 + n287 * _24 + s162, h104[1] = o225 * _24 + i387 * f44 + a136, h104[2] = r513 * d55 + n287 * _24 + s162, h104[3] = o225 * _24 + i387 * d55 + a136, h104[4] = r513 * d55 + n287 * p + s162, h104[5] = o225 * p + i387 * d55 + a136, h104[6] = r513 * f44 + n287 * p + s162, h104[7] = o225 * p + i387 * f44 + a136, this._roundPixels) for(var m22 = et.RESOLUTION, v20 = 0; v20 < h104.length; ++v20)h104[v20] = Math.round((h104[v20] * m22 | 0) / m22);
        }
    }, e690.prototype.calculateTrimmedVertices = function() {
        if (this.vertexTrimmedData) {
            if (this._transformTrimmedID === this.transform._worldID && this._textureTrimmedID === this._texture._updateID) return;
        } else this.vertexTrimmedData = new Float32Array(8);
        this._transformTrimmedID = this.transform._worldID, this._textureTrimmedID = this._texture._updateID;
        var t = this._texture, e694 = this.vertexTrimmedData, r514 = t.orig, i388 = this._anchor, n288 = this.transform.worldTransform, o226 = n288.a, s163 = n288.b, a137 = n288.c, h105 = n288.d, u88 = n288.tx, l73 = n288.ty, c58 = -i388._x * r514.width, d56 = c58 + r514.width, f45 = -i388._y * r514.height, p = f45 + r514.height;
        e694[0] = o226 * c58 + a137 * f45 + u88, e694[1] = h105 * f45 + s163 * c58 + l73, e694[2] = o226 * d56 + a137 * f45 + u88, e694[3] = h105 * f45 + s163 * d56 + l73, e694[4] = o226 * d56 + a137 * p + u88, e694[5] = h105 * p + s163 * d56 + l73, e694[6] = o226 * c58 + a137 * p + u88, e694[7] = h105 * p + s163 * c58 + l73;
    }, e690.prototype._render = function(t) {
        this.calculateVertices(), t.batch.setObjectRenderer(t.plugins[this.pluginName]), t.plugins[this.pluginName].render(this);
    }, e690.prototype._calculateBounds = function() {
        var t = this._texture.trim, e695 = this._texture.orig;
        !t || t.width === e695.width && t.height === e695.height ? (this.calculateVertices(), this._bounds.addQuad(this.vertexData)) : (this.calculateTrimmedVertices(), this._bounds.addQuad(this.vertexTrimmedData));
    }, e690.prototype.getLocalBounds = function(e696) {
        return 0 === this.children.length ? (this._bounds.minX = this._texture.orig.width * -this._anchor._x, this._bounds.minY = this._texture.orig.height * -this._anchor._y, this._bounds.maxX = this._texture.orig.width * (1 - this._anchor._x), this._bounds.maxY = this._texture.orig.height * (1 - this._anchor._y), e696 || (this._localBoundsRect || (this._localBoundsRect = new hr), e696 = this._localBoundsRect), this._bounds.getRectangle(e696)) : t498.prototype.getLocalBounds.call(this, e696);
    }, e690.prototype.containsPoint = function(t) {
        this.worldTransform.applyInverse(t, wa);
        var e697 = this._texture.orig.width, r515 = this._texture.orig.height, i389 = -e697 * this.anchor.x, n289 = 0;
        return wa.x >= i389 && wa.x < i389 + e697 && (n289 = -r515 * this.anchor.y, wa.y >= n289 && wa.y < n289 + r515);
    }, e690.prototype.destroy = function(e698) {
        if (t498.prototype.destroy.call(this, e698), this._texture.off("update", this._onTextureUpdate, this), this._anchor = null, "boolean" == typeof e698 ? e698 : e698 && e698.texture) {
            var r516 = "boolean" == typeof e698 ? e698 : e698 && e698.baseTexture;
            this._texture.destroy(!!r516);
        }
        this._texture = null;
    }, e690.from = function(t, r517) {
        return new e690(t instanceof ki ? t : ki.from(t, r517));
    }, Object.defineProperty(e690.prototype, "roundPixels", {
        get: function() {
            return this._roundPixels;
        },
        set: function(t) {
            this._roundPixels !== t && (this._transformID = -1), this._roundPixels = t;
        },
        enumerable: !1,
        configurable: !0
    }), Object.defineProperty(e690.prototype, "width", {
        get: function() {
            return Math.abs(this.scale.x) * this._texture.orig.width;
        },
        set: function(t) {
            var e699 = Ye(this.scale.x) || 1;
            this.scale.x = e699 * t / this._texture.orig.width, this._width = t;
        },
        enumerable: !1,
        configurable: !0
    }), Object.defineProperty(e690.prototype, "height", {
        get: function() {
            return Math.abs(this.scale.y) * this._texture.orig.height;
        },
        set: function(t) {
            var e700 = Ye(this.scale.y) || 1;
            this.scale.y = e700 * t / this._texture.orig.height, this._height = t;
        },
        enumerable: !1,
        configurable: !0
    }), Object.defineProperty(e690.prototype, "anchor", {
        get: function() {
            return this._anchor;
        },
        set: function(t) {
            this._anchor.copyFrom(t);
        },
        enumerable: !1,
        configurable: !0
    }), Object.defineProperty(e690.prototype, "tint", {
        get: function() {
            return this._tint;
        },
        set: function(t) {
            this._tint = t, this._tintRGB = (t >> 16) + (65280 & t) + ((255 & t) << 16);
        },
        enumerable: !1,
        configurable: !0
    }), Object.defineProperty(e690.prototype, "texture", {
        get: function() {
            return this._texture;
        },
        set: function(t) {
            this._texture !== t && (this._texture && this._texture.off("update", this._onTextureUpdate, this), this._texture = t || ki.EMPTY, this._cachedTint = 16777215, this._textureID = -1, this._textureTrimmedID = -1, t && (t.baseTexture.valid ? this._onTextureUpdate() : t.once("update", this._onTextureUpdate, this)));
        },
        enumerable: !1,
        configurable: !0
    }), e690;
}(Zr), Ua = function(t499, e701) {
    return (Ua = Object.setPrototypeOf || ({
        __proto__: []
    }) instanceof Array && function(t, e702) {
        t.__proto__ = e702;
    } || function(t, e703) {
        for(var r518 in e703)e703.hasOwnProperty(r518) && (t[r518] = e703[r518]);
    })(t499, e701);
};
!function(t) {
    t[t.LINEAR_VERTICAL = 0] = "LINEAR_VERTICAL", t[t.LINEAR_HORIZONTAL = 1] = "LINEAR_HORIZONTAL";
}(xa || (xa = {
}));
var Ga = {
    align: "left",
    breakWords: !1,
    dropShadow: !1,
    dropShadowAlpha: 1,
    dropShadowAngle: Math.PI / 6,
    dropShadowBlur: 0,
    dropShadowColor: "black",
    dropShadowDistance: 5,
    fill: "black",
    fillGradientType: xa.LINEAR_VERTICAL,
    fillGradientStops: [],
    fontFamily: "Arial",
    fontSize: 26,
    fontStyle: "normal",
    fontVariant: "normal",
    fontWeight: "normal",
    letterSpacing: 0,
    lineHeight: 0,
    lineJoin: "miter",
    miterLimit: 10,
    padding: 0,
    stroke: "black",
    strokeThickness: 0,
    textBaseline: "alphabetic",
    trim: !1,
    whiteSpace: "pre",
    wordWrap: !1,
    wordWrapWidth: 100,
    leading: 0
}, Ba = [
    "serif",
    "sans-serif",
    "monospace",
    "cursive",
    "fantasy",
    "system-ui"
], Xa = function() {
    function t500(t) {
        this.styleID = 0, this.reset(), ja(this, t, t);
    }
    return t500.prototype.clone = function() {
        var e704 = {
        };
        return ja(e704, this, Ga), new t500(e704);
    }, t500.prototype.reset = function() {
        ja(this, Ga, Ga);
    }, Object.defineProperty(t500.prototype, "align", {
        get: function() {
            return this._align;
        },
        set: function(t) {
            this._align !== t && (this._align = t, this.styleID++);
        },
        enumerable: !1,
        configurable: !0
    }), Object.defineProperty(t500.prototype, "breakWords", {
        get: function() {
            return this._breakWords;
        },
        set: function(t) {
            this._breakWords !== t && (this._breakWords = t, this.styleID++);
        },
        enumerable: !1,
        configurable: !0
    }), Object.defineProperty(t500.prototype, "dropShadow", {
        get: function() {
            return this._dropShadow;
        },
        set: function(t) {
            this._dropShadow !== t && (this._dropShadow = t, this.styleID++);
        },
        enumerable: !1,
        configurable: !0
    }), Object.defineProperty(t500.prototype, "dropShadowAlpha", {
        get: function() {
            return this._dropShadowAlpha;
        },
        set: function(t) {
            this._dropShadowAlpha !== t && (this._dropShadowAlpha = t, this.styleID++);
        },
        enumerable: !1,
        configurable: !0
    }), Object.defineProperty(t500.prototype, "dropShadowAngle", {
        get: function() {
            return this._dropShadowAngle;
        },
        set: function(t) {
            this._dropShadowAngle !== t && (this._dropShadowAngle = t, this.styleID++);
        },
        enumerable: !1,
        configurable: !0
    }), Object.defineProperty(t500.prototype, "dropShadowBlur", {
        get: function() {
            return this._dropShadowBlur;
        },
        set: function(t) {
            this._dropShadowBlur !== t && (this._dropShadowBlur = t, this.styleID++);
        },
        enumerable: !1,
        configurable: !0
    }), Object.defineProperty(t500.prototype, "dropShadowColor", {
        get: function() {
            return this._dropShadowColor;
        },
        set: function(t) {
            var e705 = Ha(t);
            this._dropShadowColor !== e705 && (this._dropShadowColor = e705, this.styleID++);
        },
        enumerable: !1,
        configurable: !0
    }), Object.defineProperty(t500.prototype, "dropShadowDistance", {
        get: function() {
            return this._dropShadowDistance;
        },
        set: function(t) {
            this._dropShadowDistance !== t && (this._dropShadowDistance = t, this.styleID++);
        },
        enumerable: !1,
        configurable: !0
    }), Object.defineProperty(t500.prototype, "fill", {
        get: function() {
            return this._fill;
        },
        set: function(t) {
            var e706 = Ha(t);
            this._fill !== e706 && (this._fill = e706, this.styleID++);
        },
        enumerable: !1,
        configurable: !0
    }), Object.defineProperty(t500.prototype, "fillGradientType", {
        get: function() {
            return this._fillGradientType;
        },
        set: function(t) {
            this._fillGradientType !== t && (this._fillGradientType = t, this.styleID++);
        },
        enumerable: !1,
        configurable: !0
    }), Object.defineProperty(t500.prototype, "fillGradientStops", {
        get: function() {
            return this._fillGradientStops;
        },
        set: function(t501) {
            (function(t, e707) {
                if (!Array.isArray(t) || !Array.isArray(e707)) return !1;
                if (t.length !== e707.length) return !1;
                for(var r519 = 0; r519 < t.length; ++r519)if (t[r519] !== e707[r519]) return !1;
                return !0;
            })(this._fillGradientStops, t501) || (this._fillGradientStops = t501, this.styleID++);
        },
        enumerable: !1,
        configurable: !0
    }), Object.defineProperty(t500.prototype, "fontFamily", {
        get: function() {
            return this._fontFamily;
        },
        set: function(t) {
            this.fontFamily !== t && (this._fontFamily = t, this.styleID++);
        },
        enumerable: !1,
        configurable: !0
    }), Object.defineProperty(t500.prototype, "fontSize", {
        get: function() {
            return this._fontSize;
        },
        set: function(t) {
            this._fontSize !== t && (this._fontSize = t, this.styleID++);
        },
        enumerable: !1,
        configurable: !0
    }), Object.defineProperty(t500.prototype, "fontStyle", {
        get: function() {
            return this._fontStyle;
        },
        set: function(t) {
            this._fontStyle !== t && (this._fontStyle = t, this.styleID++);
        },
        enumerable: !1,
        configurable: !0
    }), Object.defineProperty(t500.prototype, "fontVariant", {
        get: function() {
            return this._fontVariant;
        },
        set: function(t) {
            this._fontVariant !== t && (this._fontVariant = t, this.styleID++);
        },
        enumerable: !1,
        configurable: !0
    }), Object.defineProperty(t500.prototype, "fontWeight", {
        get: function() {
            return this._fontWeight;
        },
        set: function(t) {
            this._fontWeight !== t && (this._fontWeight = t, this.styleID++);
        },
        enumerable: !1,
        configurable: !0
    }), Object.defineProperty(t500.prototype, "letterSpacing", {
        get: function() {
            return this._letterSpacing;
        },
        set: function(t) {
            this._letterSpacing !== t && (this._letterSpacing = t, this.styleID++);
        },
        enumerable: !1,
        configurable: !0
    }), Object.defineProperty(t500.prototype, "lineHeight", {
        get: function() {
            return this._lineHeight;
        },
        set: function(t) {
            this._lineHeight !== t && (this._lineHeight = t, this.styleID++);
        },
        enumerable: !1,
        configurable: !0
    }), Object.defineProperty(t500.prototype, "leading", {
        get: function() {
            return this._leading;
        },
        set: function(t) {
            this._leading !== t && (this._leading = t, this.styleID++);
        },
        enumerable: !1,
        configurable: !0
    }), Object.defineProperty(t500.prototype, "lineJoin", {
        get: function() {
            return this._lineJoin;
        },
        set: function(t) {
            this._lineJoin !== t && (this._lineJoin = t, this.styleID++);
        },
        enumerable: !1,
        configurable: !0
    }), Object.defineProperty(t500.prototype, "miterLimit", {
        get: function() {
            return this._miterLimit;
        },
        set: function(t) {
            this._miterLimit !== t && (this._miterLimit = t, this.styleID++);
        },
        enumerable: !1,
        configurable: !0
    }), Object.defineProperty(t500.prototype, "padding", {
        get: function() {
            return this._padding;
        },
        set: function(t) {
            this._padding !== t && (this._padding = t, this.styleID++);
        },
        enumerable: !1,
        configurable: !0
    }), Object.defineProperty(t500.prototype, "stroke", {
        get: function() {
            return this._stroke;
        },
        set: function(t) {
            var e708 = Ha(t);
            this._stroke !== e708 && (this._stroke = e708, this.styleID++);
        },
        enumerable: !1,
        configurable: !0
    }), Object.defineProperty(t500.prototype, "strokeThickness", {
        get: function() {
            return this._strokeThickness;
        },
        set: function(t) {
            this._strokeThickness !== t && (this._strokeThickness = t, this.styleID++);
        },
        enumerable: !1,
        configurable: !0
    }), Object.defineProperty(t500.prototype, "textBaseline", {
        get: function() {
            return this._textBaseline;
        },
        set: function(t) {
            this._textBaseline !== t && (this._textBaseline = t, this.styleID++);
        },
        enumerable: !1,
        configurable: !0
    }), Object.defineProperty(t500.prototype, "trim", {
        get: function() {
            return this._trim;
        },
        set: function(t) {
            this._trim !== t && (this._trim = t, this.styleID++);
        },
        enumerable: !1,
        configurable: !0
    }), Object.defineProperty(t500.prototype, "whiteSpace", {
        get: function() {
            return this._whiteSpace;
        },
        set: function(t) {
            this._whiteSpace !== t && (this._whiteSpace = t, this.styleID++);
        },
        enumerable: !1,
        configurable: !0
    }), Object.defineProperty(t500.prototype, "wordWrap", {
        get: function() {
            return this._wordWrap;
        },
        set: function(t) {
            this._wordWrap !== t && (this._wordWrap = t, this.styleID++);
        },
        enumerable: !1,
        configurable: !0
    }), Object.defineProperty(t500.prototype, "wordWrapWidth", {
        get: function() {
            return this._wordWrapWidth;
        },
        set: function(t) {
            this._wordWrapWidth !== t && (this._wordWrapWidth = t, this.styleID++);
        },
        enumerable: !1,
        configurable: !0
    }), t500.prototype.toFontString = function() {
        var t = "number" == typeof this.fontSize ? this.fontSize + "px" : this.fontSize, e709 = this.fontFamily;
        Array.isArray(this.fontFamily) || (e709 = this.fontFamily.split(","));
        for(var r520 = e709.length - 1; r520 >= 0; r520--){
            var i390 = e709[r520].trim();
            !/([\"\'])[^\'\"]+\1/.test(i390) && Ba.indexOf(i390) < 0 && (i390 = '"' + i390 + '"'), e709[r520] = i390;
        }
        return this.fontStyle + " " + this.fontVariant + " " + this.fontWeight + " " + t + " " + e709.join(",");
    }, t500;
}();
function ka(t) {
    return "number" == typeof t ? Ne(t) : ("string" == typeof t && 0 === t.indexOf("0x") && (t = t.replace("0x", "#")), t);
}
function Ha(t) {
    if (Array.isArray(t)) {
        for(var e710 = 0; e710 < t.length; ++e710)t[e710] = ka(t[e710]);
        return t;
    }
    return ka(t);
}
function ja(t, e711, r521) {
    for(var i in r521)Array.isArray(e711[i]) ? t[i] = e711[i].slice() : t[i] = e711[i];
}
var Ya = function() {
    function t502(t, e712, r522, i391, n290, o227, s164, a138, h106) {
        this.text = t, this.style = e712, this.width = r522, this.height = i391, this.lines = n290, this.lineWidths = o227, this.lineHeight = s164, this.maxLineWidth = a138, this.fontProperties = h106;
    }
    return t502.measureText = function(e713, r523, i392, n291) {
        void 0 === n291 && (n291 = t502._canvas), i392 = null == i392 ? r523.wordWrap : i392;
        var o228 = r523.toFontString(), s165 = t502.measureFont(o228);
        0 === s165.fontSize && (s165.fontSize = r523.fontSize, s165.ascent = r523.fontSize);
        var a139 = n291.getContext("2d");
        a139.font = o228;
        for(var h107 = (i392 ? t502.wordWrap(e713, r523, n291) : e713).split(/(?:\r\n|\r|\n)/), u89 = new Array(h107.length), l74 = 0, c59 = 0; c59 < h107.length; c59++){
            var d57 = a139.measureText(h107[c59]).width + (h107[c59].length - 1) * r523.letterSpacing;
            u89[c59] = d57, l74 = Math.max(l74, d57);
        }
        var f46 = l74 + r523.strokeThickness;
        r523.dropShadow && (f46 += r523.dropShadowDistance);
        var p = r523.lineHeight || s165.fontSize + r523.strokeThickness, _25 = Math.max(p, s165.fontSize + r523.strokeThickness) + (h107.length - 1) * (p + r523.leading);
        return r523.dropShadow && (_25 += r523.dropShadowDistance), new t502(e713, r523, f46, _25, h107, u89, p + r523.leading, l74, s165);
    }, t502.wordWrap = function(e714, r524, i393) {
        void 0 === i393 && (i393 = t502._canvas);
        for(var n292 = i393.getContext("2d"), o229 = 0, s166 = "", a140 = "", h108 = Object.create(null), u90 = r524.letterSpacing, l75 = r524.whiteSpace, c60 = t502.collapseSpaces(l75), d58 = t502.collapseNewlines(l75), f47 = !c60, p = r524.wordWrapWidth + u90, _26 = t502.tokenize(e714), m23 = 0; m23 < _26.length; m23++){
            var v21 = _26[m23];
            if (t502.isNewline(v21)) {
                if (!d58) {
                    a140 += t502.addLine(s166), f47 = !c60, s166 = "", o229 = 0;
                    continue;
                }
                v21 = " ";
            }
            if (c60) {
                var y = t502.isBreakingSpace(v21), g15 = t502.isBreakingSpace(s166[s166.length - 1]);
                if (y && g15) continue;
            }
            var E14 = t502.getFromCache(v21, u90, h108, n292);
            if (E14 > p) if ("" !== s166 && (a140 += t502.addLine(s166), s166 = "", o229 = 0), t502.canBreakWords(v21, r524.breakWords)) for(var T12 = t502.wordWrapSplit(v21), b9 = 0; b9 < T12.length; b9++){
                for(var x10 = T12[b9], R7 = 1; T12[b9 + R7];){
                    var A8 = T12[b9 + R7], O7 = x10[x10.length - 1];
                    if (t502.canBreakChars(O7, A8, v21, b9, r524.breakWords)) break;
                    x10 += A8, R7++;
                }
                b9 += x10.length - 1;
                var S5 = t502.getFromCache(x10, u90, h108, n292);
                S5 + o229 > p && (a140 += t502.addLine(s166), f47 = !1, s166 = "", o229 = 0), s166 += x10, o229 += S5;
            }
            else {
                s166.length > 0 && (a140 += t502.addLine(s166), s166 = "", o229 = 0);
                var I5 = m23 === _26.length - 1;
                a140 += t502.addLine(v21, !I5), f47 = !1, s166 = "", o229 = 0;
            }
            else E14 + o229 > p && (f47 = !1, a140 += t502.addLine(s166), s166 = "", o229 = 0), (s166.length > 0 || !t502.isBreakingSpace(v21) || f47) && (s166 += v21, o229 += E14);
        }
        return a140 + t502.addLine(s166, !1);
    }, t502.addLine = function(e715, r525) {
        return void 0 === r525 && (r525 = !0), e715 = t502.trimRight(e715), r525 ? e715 + "\n" : e715;
    }, t502.getFromCache = function(t, e716, r526, i394) {
        var n293 = r526[t];
        if ("number" != typeof n293) {
            var o230 = t.length * e716;
            n293 = i394.measureText(t).width + o230, r526[t] = n293;
        }
        return n293;
    }, t502.collapseSpaces = function(t) {
        return "normal" === t || "pre-line" === t;
    }, t502.collapseNewlines = function(t) {
        return "normal" === t;
    }, t502.trimRight = function(e717) {
        if ("string" != typeof e717) return "";
        for(var r527 = e717.length - 1; r527 >= 0; r527--){
            var i395 = e717[r527];
            if (!t502.isBreakingSpace(i395)) break;
            e717 = e717.slice(0, -1);
        }
        return e717;
    }, t502.isNewline = function(e718) {
        return "string" == typeof e718 && t502._newlines.indexOf(e718.charCodeAt(0)) >= 0;
    }, t502.isBreakingSpace = function(e719, r) {
        return "string" == typeof e719 && t502._breakingSpaces.indexOf(e719.charCodeAt(0)) >= 0;
    }, t502.tokenize = function(e720) {
        var r528 = [], i396 = "";
        if ("string" != typeof e720) return r528;
        for(var n294 = 0; n294 < e720.length; n294++){
            var o231 = e720[n294], s167 = e720[n294 + 1];
            t502.isBreakingSpace(o231, s167) || t502.isNewline(o231) ? ("" !== i396 && (r528.push(i396), i396 = ""), r528.push(o231)) : i396 += o231;
        }
        return "" !== i396 && r528.push(i396), r528;
    }, t502.canBreakWords = function(t, e721) {
        return e721;
    }, t502.canBreakChars = function(t, e, r, i, n) {
        return !0;
    }, t502.wordWrapSplit = function(t) {
        return t.split("");
    }, t502.measureFont = function(e722) {
        if (t502._fonts[e722]) return t502._fonts[e722];
        var r529 = {
            ascent: 0,
            descent: 0,
            fontSize: 0
        }, i397 = t502._canvas, n295 = t502._context;
        n295.font = e722;
        var o232 = t502.METRICS_STRING + t502.BASELINE_SYMBOL, s168 = Math.ceil(n295.measureText(o232).width), a141 = Math.ceil(n295.measureText(t502.BASELINE_SYMBOL).width), h109 = Math.ceil(t502.HEIGHT_MULTIPLIER * a141);
        a141 = a141 * t502.BASELINE_MULTIPLIER | 0, i397.width = s168, i397.height = h109, n295.fillStyle = "#f00", n295.fillRect(0, 0, s168, h109), n295.font = e722, n295.textBaseline = "alphabetic", n295.fillStyle = "#000", n295.fillText(o232, 0, a141);
        var u91 = n295.getImageData(0, 0, s168, h109).data, l76 = u91.length, c61 = 4 * s168, d59 = 0, f48 = 0, p = !1;
        for(d59 = 0; d59 < a141; ++d59){
            for(var _27 = 0; _27 < c61; _27 += 4)if (255 !== u91[f48 + _27]) {
                p = !0;
                break;
            }
            if (p) break;
            f48 += c61;
        }
        for(r529.ascent = a141 - d59, f48 = l76 - c61, p = !1, d59 = h109; d59 > a141; --d59){
            for(_27 = 0; _27 < c61; _27 += 4)if (255 !== u91[f48 + _27]) {
                p = !0;
                break;
            }
            if (p) break;
            f48 -= c61;
        }
        return r529.descent = d59 - a141, r529.fontSize = r529.ascent + r529.descent, t502._fonts[e722] = r529, r529;
    }, t502.clearMetrics = function(e723) {
        void 0 === e723 && (e723 = ""), e723 ? delete t502._fonts[e723] : t502._fonts = {
        };
    }, t502;
}(), Va = function() {
    try {
        var t = new OffscreenCanvas(0, 0), e724 = t.getContext("2d");
        return e724 && e724.measureText ? t : document.createElement("canvas");
    } catch (t) {
        return document.createElement("canvas");
    }
}();
Va.width = Va.height = 10, Ya._canvas = Va, Ya._context = Va.getContext("2d"), Ya._fonts = {
}, Ya.METRICS_STRING = "|ÉqÅ", Ya.BASELINE_SYMBOL = "M", Ya.BASELINE_MULTIPLIER = 1.4, Ya.HEIGHT_MULTIPLIER = 2, Ya._newlines = [
    10,
    13
], Ya._breakingSpaces = [
    9,
    32,
    8192,
    8193,
    8194,
    8195,
    8196,
    8197,
    8198,
    8200,
    8201,
    8202,
    8287,
    12288
];
var Wa = {
    texture: !0,
    children: !1,
    baseTexture: !0
}, za = "letterSpacing" in CanvasRenderingContext2D.prototype || "textLetterSpacing" in CanvasRenderingContext2D.prototype, qa = function(t503) {
    function e725(e726, r530, i398) {
        var n296 = this, o233 = !1;
        i398 || (i398 = document.createElement("canvas"), o233 = !0), i398.width = 3, i398.height = 3;
        var s169 = ki.from(i398);
        return s169.orig = new hr, s169.trim = new hr, (n296 = t503.call(this, s169) || this)._ownCanvas = o233, n296.canvas = i398, n296.context = n296.canvas.getContext("2d"), n296._resolution = et.RESOLUTION, n296._autoResolution = !0, n296._text = null, n296._style = null, n296._styleListener = null, n296._font = "", n296.text = e726, n296.style = r530, n296.localStyleID = -1, n296;
    }
    return (function(t, e727) {
        function r531() {
            this.constructor = t;
        }
        Ua(t, e727), t.prototype = null === e727 ? Object.create(e727) : (r531.prototype = e727.prototype, new r531);
    })(e725, t503), e725.prototype.updateText = function(t) {
        var r532 = this._style;
        if (this.localStyleID !== r532.styleID && (this.dirty = !0, this.localStyleID = r532.styleID), this.dirty || !t) {
            this._font = this._style.toFontString();
            var i399, n297, o234 = this.context, s170 = Ya.measureText(this._text || " ", this._style, this._style.wordWrap, this.canvas), a142 = s170.width, h110 = s170.height, u92 = s170.lines, l77 = s170.lineHeight, c62 = s170.lineWidths, d60 = s170.maxLineWidth, f49 = s170.fontProperties;
            this.canvas.width = Math.ceil(Math.ceil(Math.max(1, a142) + 2 * r532.padding) * this._resolution), this.canvas.height = Math.ceil(Math.ceil(Math.max(1, h110) + 2 * r532.padding) * this._resolution), o234.scale(this._resolution, this._resolution), o234.clearRect(0, 0, this.canvas.width, this.canvas.height), o234.font = this._font, o234.lineWidth = r532.strokeThickness, o234.textBaseline = r532.textBaseline, o234.lineJoin = r532.lineJoin, o234.miterLimit = r532.miterLimit;
            for(var p = r532.dropShadow ? 2 : 1, _28 = 0; _28 < p; ++_28){
                var m24 = r532.dropShadow && 0 === _28, v22 = m24 ? Math.ceil(Math.max(1, h110) + 2 * r532.padding) : 0, y = v22 * this._resolution;
                if (m24) {
                    o234.fillStyle = "black", o234.strokeStyle = "black";
                    var g16 = r532.dropShadowColor, E15 = Pe("number" == typeof g16 ? g16 : Me(g16));
                    o234.shadowColor = "rgba(" + 255 * E15[0] + "," + 255 * E15[1] + "," + 255 * E15[2] + "," + r532.dropShadowAlpha + ")", o234.shadowBlur = r532.dropShadowBlur, o234.shadowOffsetX = Math.cos(r532.dropShadowAngle) * r532.dropShadowDistance, o234.shadowOffsetY = Math.sin(r532.dropShadowAngle) * r532.dropShadowDistance + y;
                } else o234.fillStyle = this._generateFillStyle(r532, u92, s170), o234.strokeStyle = r532.stroke, o234.shadowColor = "black", o234.shadowBlur = 0, o234.shadowOffsetX = 0, o234.shadowOffsetY = 0;
                var T13 = (l77 - f49.fontSize) / 2;
                (!e725.nextLineHeightBehavior || l77 - f49.fontSize < 0) && (T13 = 0);
                for(var b10 = 0; b10 < u92.length; b10++)i399 = r532.strokeThickness / 2, n297 = r532.strokeThickness / 2 + b10 * l77 + f49.ascent + T13, "right" === r532.align ? i399 += d60 - c62[b10] : "center" === r532.align && (i399 += (d60 - c62[b10]) / 2), r532.stroke && r532.strokeThickness && this.drawLetterSpacing(u92[b10], i399 + r532.padding, n297 + r532.padding - v22, !0), r532.fill && this.drawLetterSpacing(u92[b10], i399 + r532.padding, n297 + r532.padding - v22);
            }
            this.updateTexture();
        }
    }, e725.prototype.drawLetterSpacing = function(t, e728, r533, i400) {
        void 0 === i400 && (i400 = !1);
        var n298 = this._style.letterSpacing;
        if (0 === n298 || za) return za && (this.context.letterSpacing = n298, this.context.textLetterSpacing = n298), void (i400 ? this.context.strokeText(t, e728, r533) : this.context.fillText(t, e728, r533));
        for(var o235 = e728, s171 = Array.from ? Array.from(t) : t.split(""), a143 = this.context.measureText(t).width, h111 = 0, u93 = 0; u93 < s171.length; ++u93){
            var l78 = s171[u93];
            i400 ? this.context.strokeText(l78, o235, r533) : this.context.fillText(l78, o235, r533), o235 += a143 - (h111 = this.context.measureText(t.substring(u93 + 1)).width) + n298, a143 = h111;
        }
    }, e725.prototype.updateTexture = function() {
        var t = this.canvas;
        if (this._style.trim) {
            var e729 = Qe(t);
            e729.data && (t.width = e729.width, t.height = e729.height, this.context.putImageData(e729.data, 0, 0));
        }
        var r534 = this._texture, i401 = this._style, n299 = i401.trim ? 0 : i401.padding, o236 = r534.baseTexture;
        r534.trim.width = r534._frame.width = t.width / this._resolution, r534.trim.height = r534._frame.height = t.height / this._resolution, r534.trim.x = -n299, r534.trim.y = -n299, r534.orig.width = r534._frame.width - 2 * n299, r534.orig.height = r534._frame.height - 2 * n299, this._onTextureUpdate(), o236.setRealSize(t.width, t.height, this._resolution), r534.updateUvs(), this._recursivePostUpdateTransform(), this.dirty = !1;
    }, e725.prototype._render = function(e730) {
        this._autoResolution && this._resolution !== e730.resolution && (this._resolution = e730.resolution, this.dirty = !0), this.updateText(!0), t503.prototype._render.call(this, e730);
    }, e725.prototype.getLocalBounds = function(e731) {
        return this.updateText(!0), t503.prototype.getLocalBounds.call(this, e731);
    }, e725.prototype._calculateBounds = function() {
        this.updateText(!0), this.calculateVertices(), this._bounds.addQuad(this.vertexData);
    }, e725.prototype._generateFillStyle = function(t, e732, r535) {
        var i402, n300 = t.fill;
        if (!Array.isArray(n300)) return n300;
        if (1 === n300.length) return n300[0];
        var o237 = t.dropShadow ? t.dropShadowDistance : 0, s172 = t.padding || 0, a144 = this.canvas.width / this._resolution - o237 - 2 * s172, h112 = this.canvas.height / this._resolution - o237 - 2 * s172, u94 = n300.slice(), l79 = t.fillGradientStops.slice();
        if (!l79.length) for(var c63 = u94.length + 1, d61 = 1; d61 < c63; ++d61)l79.push(d61 / c63);
        if (u94.unshift(n300[0]), l79.unshift(0), u94.push(n300[n300.length - 1]), l79.push(1), t.fillGradientType === xa.LINEAR_VERTICAL) {
            i402 = this.context.createLinearGradient(a144 / 2, s172, a144 / 2, h112 + s172);
            var f50 = r535.fontProperties.fontSize + t.strokeThickness;
            for(d61 = 0; d61 < e732.length; d61++){
                var p = r535.lineHeight * (d61 - 1) + f50, _29 = r535.lineHeight * d61, m25 = _29;
                d61 > 0 && p > _29 && (m25 = (_29 + p) / 2);
                var v23 = _29 + f50, y = r535.lineHeight * (d61 + 1), g17 = v23;
                d61 + 1 < e732.length && y < v23 && (g17 = (v23 + y) / 2);
                for(var E16 = (g17 - m25) / h112, T14 = 0; T14 < u94.length; T14++){
                    var b11;
                    b11 = "number" == typeof l79[T14] ? l79[T14] : T14 / u94.length;
                    var x11 = Math.min(1, Math.max(0, m25 / h112 + b11 * E16));
                    x11 = Number(x11.toFixed(5)), i402.addColorStop(x11, u94[T14]);
                }
            }
        } else {
            i402 = this.context.createLinearGradient(s172, h112 / 2, a144 + s172, h112 / 2);
            var R8 = u94.length + 1, A9 = 1;
            for(d61 = 0; d61 < u94.length; d61++){
                var O8;
                O8 = "number" == typeof l79[d61] ? l79[d61] : A9 / R8, i402.addColorStop(O8, u94[d61]), A9++;
            }
        }
        return i402;
    }, e725.prototype.destroy = function(e733) {
        "boolean" == typeof e733 && (e733 = {
            children: e733
        }), e733 = Object.assign({
        }, Wa, e733), t503.prototype.destroy.call(this, e733), this._ownCanvas && (this.canvas.height = this.canvas.width = 0), this.context = null, this.canvas = null, this._style = null;
    }, Object.defineProperty(e725.prototype, "width", {
        get: function() {
            return this.updateText(!0), Math.abs(this.scale.x) * this._texture.orig.width;
        },
        set: function(t) {
            this.updateText(!0);
            var e734 = Ye(this.scale.x) || 1;
            this.scale.x = e734 * t / this._texture.orig.width, this._width = t;
        },
        enumerable: !1,
        configurable: !0
    }), Object.defineProperty(e725.prototype, "height", {
        get: function() {
            return this.updateText(!0), Math.abs(this.scale.y) * this._texture.orig.height;
        },
        set: function(t) {
            this.updateText(!0);
            var e735 = Ye(this.scale.y) || 1;
            this.scale.y = e735 * t / this._texture.orig.height, this._height = t;
        },
        enumerable: !1,
        configurable: !0
    }), Object.defineProperty(e725.prototype, "style", {
        get: function() {
            return this._style;
        },
        set: function(t) {
            t = t || {
            }, this._style = t instanceof Xa ? t : new Xa(t), this.localStyleID = -1, this.dirty = !0;
        },
        enumerable: !1,
        configurable: !0
    }), Object.defineProperty(e725.prototype, "text", {
        get: function() {
            return this._text;
        },
        set: function(t) {
            t = String(null == t ? "" : t), this._text !== t && (this._text = t, this.dirty = !0);
        },
        enumerable: !1,
        configurable: !0
    }), Object.defineProperty(e725.prototype, "resolution", {
        get: function() {
            return this._resolution;
        },
        set: function(t) {
            this._autoResolution = !1, this._resolution !== t && (this._resolution = t, this.dirty = !0);
        },
        enumerable: !1,
        configurable: !0
    }), e725.nextLineHeightBehavior = !1, e725;
}(Fa);
et.UPLOADS_PER_FRAME = 4;
var Ka = function(t504, e736) {
    return (Ka = Object.setPrototypeOf || ({
        __proto__: []
    }) instanceof Array && function(t, e737) {
        t.__proto__ = e737;
    } || function(t, e738) {
        for(var r536 in e738)e738.hasOwnProperty(r536) && (t[r536] = e738[r536]);
    })(t504, e736);
}, Za = function() {
    function t505(t) {
        this.maxItemsPerFrame = t, this.itemsLeft = 0;
    }
    return t505.prototype.beginFrame = function() {
        this.itemsLeft = this.maxItemsPerFrame;
    }, t505.prototype.allowedToUpload = function() {
        return this.itemsLeft-- > 0;
    }, t505;
}();
function Ja(t, e739) {
    var r537 = !1;
    if (t && t._textures && t._textures.length) {
        for(var i403 = 0; i403 < t._textures.length; i403++)if (t._textures[i403] instanceof ki) {
            var n301 = t._textures[i403].baseTexture;
            -1 === e739.indexOf(n301) && (e739.push(n301), r537 = !0);
        }
    }
    return r537;
}
function Qa(t, e740) {
    if (t.baseTexture instanceof Ai) {
        var r538 = t.baseTexture;
        return -1 === e740.indexOf(r538) && e740.push(r538), !0;
    }
    return !1;
}
function $a(t, e741) {
    if (t._texture && t._texture instanceof ki) {
        var r539 = t._texture.baseTexture;
        return -1 === e741.indexOf(r539) && e741.push(r539), !0;
    }
    return !1;
}
function th(t, e742) {
    return e742 instanceof qa && (e742.updateText(!0), !0);
}
function eh(t, e743) {
    if (e743 instanceof Xa) {
        var r540 = e743.toFontString();
        return Ya.measureFont(r540), !0;
    }
    return !1;
}
function rh(t, e744) {
    if (t instanceof qa) {
        -1 === e744.indexOf(t.style) && e744.push(t.style), -1 === e744.indexOf(t) && e744.push(t);
        var r541 = t._texture.baseTexture;
        return -1 === e744.indexOf(r541) && e744.push(r541), !0;
    }
    return !1;
}
function ih(t, e745) {
    return t instanceof Xa && (-1 === e745.indexOf(t) && e745.push(t), !0);
}
var nh = function() {
    function t506(t) {
        var e746 = this;
        this.limiter = new Za(et.UPLOADS_PER_FRAME), this.renderer = t, this.uploadHookHelper = null, this.queue = [], this.addHooks = [], this.uploadHooks = [], this.completes = [], this.ticking = !1, this.delayedTick = function() {
            e746.queue && e746.prepareItems();
        }, this.registerFindHook(rh), this.registerFindHook(ih), this.registerFindHook(Ja), this.registerFindHook(Qa), this.registerFindHook($a), this.registerUploadHook(th), this.registerUploadHook(eh);
    }
    return t506.prototype.upload = function(t, e747) {
        "function" == typeof t && (e747 = t, t = null), t && this.add(t), this.queue.length ? (e747 && this.completes.push(e747), this.ticking || (this.ticking = !0, oi.system.addOnce(this.tick, this, Qr.UTILITY))) : e747 && e747();
    }, t506.prototype.tick = function() {
        setTimeout(this.delayedTick, 0);
    }, t506.prototype.prepareItems = function() {
        for(this.limiter.beginFrame(); this.queue.length && this.limiter.allowedToUpload();){
            var t = this.queue[0], e748 = !1;
            if (t && !t._destroyed) {
                for(var r542 = 0, i404 = this.uploadHooks.length; r542 < i404; r542++)if (this.uploadHooks[r542](this.uploadHookHelper, t)) {
                    this.queue.shift(), e748 = !0;
                    break;
                }
            }
            e748 || this.queue.shift();
        }
        if (this.queue.length) oi.system.addOnce(this.tick, this, Qr.UTILITY);
        else {
            this.ticking = !1;
            var n302 = this.completes.slice(0);
            for(this.completes.length = 0, r542 = 0, i404 = n302.length; r542 < i404; r542++)n302[r542]();
        }
    }, t506.prototype.registerFindHook = function(t) {
        return t && this.addHooks.push(t), this;
    }, t506.prototype.registerUploadHook = function(t) {
        return t && this.uploadHooks.push(t), this;
    }, t506.prototype.add = function(t) {
        for(var e749 = 0, r543 = this.addHooks.length; e749 < r543 && !this.addHooks[e749](t, this.queue); e749++);
        if (t instanceof Zr) for(e749 = t.children.length - 1; e749 >= 0; e749--)this.add(t.children[e749]);
        return this;
    }, t506.prototype.destroy = function() {
        this.ticking && oi.system.remove(this.tick, this), this.ticking = !1, this.addHooks = null, this.uploadHooks = null, this.renderer = null, this.completes = null, this.queue = null, this.limiter = null, this.uploadHookHelper = null;
    }, t506;
}();
function oh(t, e750) {
    return e750 instanceof Ai && (e750._glTextures[t.CONTEXT_UID] || t.texture.bind(e750), !0);
}
function sh(t, e751) {
    if (!(e751 instanceof Ma)) return !1;
    var r544 = e751.geometry;
    e751.finishPoly(), r544.updateBatches();
    for(var i405 = r544.batches, n303 = 0; n303 < i405.length; n303++){
        var o238 = i405[n303].style.texture;
        o238 && oh(t, o238.baseTexture);
    }
    return r544.batchable || t.geometry.bind(r544, e751._resolveDirectShader(t)), !0;
}
function ah(t, e752) {
    return t instanceof Ma && (e752.push(t), !0);
}
var hh = function(t507) {
    function e753(e754) {
        var r545 = t507.call(this, e754) || this;
        return r545.uploadHookHelper = r545.renderer, r545.registerFindHook(ah), r545.registerUploadHook(oh), r545.registerUploadHook(sh), r545;
    }
    return (function(t, e755) {
        function r546() {
            this.constructor = t;
        }
        Ka(t, e755), t.prototype = null === e755 ? Object.create(e755) : (r546.prototype = e755.prototype, new r546);
    })(e753, t507), e753;
}(nh), uh = function() {
    function t508(t) {
        this.maxMilliseconds = t, this.frameStart = 0;
    }
    return t508.prototype.beginFrame = function() {
        this.frameStart = Date.now();
    }, t508.prototype.allowedToUpload = function() {
        return Date.now() - this.frameStart < this.maxMilliseconds;
    }, t508;
}(), lh = function() {
    function t509(t, e756, r547) {
        void 0 === r547 && (r547 = null), this._texture = t instanceof ki ? t : null, this.baseTexture = t instanceof Ai ? t : this._texture.baseTexture, this.textures = {
        }, this.animations = {
        }, this.data = e756;
        var i406 = this.baseTexture.resource;
        this.resolution = this._updateResolution(r547 || (i406 ? i406.url : null)), this._frames = this.data.frames, this._frameKeys = Object.keys(this._frames), this._batchIndex = 0, this._callback = null;
    }
    return t509.prototype._updateResolution = function(t) {
        void 0 === t && (t = null);
        var e757 = this.data.meta.scale, r548 = rr(t, null);
        return null === r548 && (r548 = void 0 !== e757 ? parseFloat(e757) : 1), 1 !== r548 && this.baseTexture.setResolution(r548), r548;
    }, t509.prototype.parse = function(e758) {
        this._batchIndex = 0, this._callback = e758, this._frameKeys.length <= t509.BATCH_SIZE ? (this._processFrames(0), this._processAnimations(), this._parseComplete()) : this._nextBatch();
    }, t509.prototype._processFrames = function(e759) {
        for(var r549 = e759, i407 = t509.BATCH_SIZE; r549 - e759 < i407 && r549 < this._frameKeys.length;){
            var n304 = this._frameKeys[r549], o239 = this._frames[n304], s173 = o239.frame;
            if (s173) {
                var a145, h113 = null, u95 = !1 !== o239.trimmed && o239.sourceSize ? o239.sourceSize : o239.frame, l80 = new hr(0, 0, Math.floor(u95.w) / this.resolution, Math.floor(u95.h) / this.resolution);
                a145 = o239.rotated ? new hr(Math.floor(s173.x) / this.resolution, Math.floor(s173.y) / this.resolution, Math.floor(s173.h) / this.resolution, Math.floor(s173.w) / this.resolution) : new hr(Math.floor(s173.x) / this.resolution, Math.floor(s173.y) / this.resolution, Math.floor(s173.w) / this.resolution, Math.floor(s173.h) / this.resolution), !1 !== o239.trimmed && o239.spriteSourceSize && (h113 = new hr(Math.floor(o239.spriteSourceSize.x) / this.resolution, Math.floor(o239.spriteSourceSize.y) / this.resolution, Math.floor(s173.w) / this.resolution, Math.floor(s173.h) / this.resolution)), this.textures[n304] = new ki(this.baseTexture, a145, l80, h113, o239.rotated ? 2 : 0, o239.anchor), ki.addToCache(this.textures[n304], n304);
            }
            r549++;
        }
    }, t509.prototype._processAnimations = function() {
        var t = this.data.animations || {
        };
        for(var e in t){
            this.animations[e] = [];
            for(var r550 = 0; r550 < t[e].length; r550++){
                var i = t[e][r550];
                this.animations[e].push(this.textures[i]);
            }
        }
    }, t509.prototype._parseComplete = function() {
        var t = this._callback;
        this._callback = null, this._batchIndex = 0, t.call(this, this.textures);
    }, t509.prototype._nextBatch = function() {
        var e760 = this;
        this._processFrames(this._batchIndex * t509.BATCH_SIZE), this._batchIndex++, setTimeout(function() {
            e760._batchIndex * t509.BATCH_SIZE < e760._frameKeys.length ? e760._nextBatch() : (e760._processAnimations(), e760._parseComplete());
        }, 0);
    }, t509.prototype.destroy = function(t) {
        var e761;
        for(var r in void 0 === t && (t = !1), this.textures)this.textures[r].destroy();
        this._frames = null, this._frameKeys = null, this.data = null, this.textures = null, t && (null === (e761 = this._texture) || void 0 === e761 || e761.destroy(), this.baseTexture.destroy()), this._texture = null, this.baseTexture = null;
    }, t509.BATCH_SIZE = 1000, t509;
}(), ch = function() {
    function t510() {
    }
    return t510.use = function(e762, r551) {
        var i408, n305, o240 = this, s174 = e762.name + "_image";
        if (e762.data && e762.type === ds.TYPE.JSON && e762.data.frames && !o240.resources[s174]) {
            var a146 = null === (n305 = null === (i408 = e762.data) || void 0 === i408 ? void 0 : i408.meta) || void 0 === n305 ? void 0 : n305.related_multi_packs;
            if (Array.isArray(a146)) for(var h114 = function(t511) {
                if ("string" != typeof t511) return "continue";
                var r552 = t511.replace(".json", ""), i409 = be.resolve(e762.url.replace(o240.baseUrl, ""), t511);
                if (o240.resources[r552] || Object.values(o240.resources).some(function(t) {
                    return be.format(be.parse(t.url)) === i409;
                })) return "continue";
                var n306 = {
                    crossOrigin: e762.crossOrigin,
                    loadType: ds.LOAD_TYPE.XHR,
                    xhrType: ds.XHR_RESPONSE_TYPE.JSON,
                    parentResource: e762,
                    metadata: e762.metadata
                };
                o240.add(r552, i409, n306);
            }, u96 = 0, l81 = a146; u96 < l81.length; u96++)h114(l81[u96]);
            var c64 = {
                crossOrigin: e762.crossOrigin,
                metadata: e762.metadata.imageMetadata,
                parentResource: e762
            }, d62 = t510.getResourcePath(e762, o240.baseUrl);
            o240.add(s174, d62, c64, function(t) {
                if (t.error) r551(t.error);
                else {
                    var i410 = new lh(t.texture, e762.data, e762.url);
                    i410.parse(function() {
                        e762.spritesheet = i410, e762.textures = i410.textures, r551();
                    });
                }
            });
        } else r551();
    }, t510.getResourcePath = function(t, e763) {
        return t.isDataUrl ? t.data.meta.image : be.resolve(t.url.replace(e763, ""), t.data.meta.image);
    }, t510;
}(), dh = function(t512, e764) {
    return (dh = Object.setPrototypeOf || ({
        __proto__: []
    }) instanceof Array && function(t, e765) {
        t.__proto__ = e765;
    } || function(t, e766) {
        for(var r553 in e766)e766.hasOwnProperty(r553) && (t[r553] = e766[r553]);
    })(t512, e764);
};
function fh(t, e767) {
    function r554() {
        this.constructor = t;
    }
    dh(t, e767), t.prototype = null === e767 ? Object.create(e767) : (r554.prototype = e767.prototype, new r554);
}
var ph = new fr, _h = function(t513) {
    function e768(e769, r555, i411) {
        void 0 === r555 && (r555 = 100), void 0 === i411 && (i411 = 100);
        var n307 = t513.call(this, e769) || this;
        return n307.tileTransform = new Rr, n307._width = r555, n307._height = i411, n307.uvMatrix = n307.texture.uvMatrix || new qn(e769), n307.pluginName = "tilingSprite", n307.uvRespectAnchor = !1, n307;
    }
    return fh(e768, t513), Object.defineProperty(e768.prototype, "clampMargin", {
        get: function() {
            return this.uvMatrix.clampMargin;
        },
        set: function(t) {
            this.uvMatrix.clampMargin = t, this.uvMatrix.update(!0);
        },
        enumerable: !1,
        configurable: !0
    }), Object.defineProperty(e768.prototype, "tileScale", {
        get: function() {
            return this.tileTransform.scale;
        },
        set: function(t) {
            this.tileTransform.scale.copyFrom(t);
        },
        enumerable: !1,
        configurable: !0
    }), Object.defineProperty(e768.prototype, "tilePosition", {
        get: function() {
            return this.tileTransform.position;
        },
        set: function(t) {
            this.tileTransform.position.copyFrom(t);
        },
        enumerable: !1,
        configurable: !0
    }), e768.prototype._onTextureUpdate = function() {
        this.uvMatrix && (this.uvMatrix.texture = this._texture), this._cachedTint = 16777215;
    }, e768.prototype._render = function(t) {
        var e770 = this._texture;
        e770 && e770.valid && (this.tileTransform.updateLocalTransform(), this.uvMatrix.update(), t.batch.setObjectRenderer(t.plugins[this.pluginName]), t.plugins[this.pluginName].render(this));
    }, e768.prototype._calculateBounds = function() {
        var t = this._width * -this._anchor._x, e771 = this._height * -this._anchor._y, r556 = this._width * (1 - this._anchor._x), i412 = this._height * (1 - this._anchor._y);
        this._bounds.addFrame(this.transform, t, e771, r556, i412);
    }, e768.prototype.getLocalBounds = function(e772) {
        return 0 === this.children.length ? (this._bounds.minX = this._width * -this._anchor._x, this._bounds.minY = this._height * -this._anchor._y, this._bounds.maxX = this._width * (1 - this._anchor._x), this._bounds.maxY = this._height * (1 - this._anchor._y), e772 || (this._localBoundsRect || (this._localBoundsRect = new hr), e772 = this._localBoundsRect), this._bounds.getRectangle(e772)) : t513.prototype.getLocalBounds.call(this, e772);
    }, e768.prototype.containsPoint = function(t) {
        this.worldTransform.applyInverse(t, ph);
        var e773 = this._width, r557 = this._height, i413 = -e773 * this.anchor._x;
        if (ph.x >= i413 && ph.x < i413 + e773) {
            var n308 = -r557 * this.anchor._y;
            if (ph.y >= n308 && ph.y < n308 + r557) return !0;
        }
        return !1;
    }, e768.prototype.destroy = function(e774) {
        t513.prototype.destroy.call(this, e774), this.tileTransform = null, this.uvMatrix = null;
    }, e768.from = function(t, r558) {
        return new e768(t instanceof ki ? t : ki.from(t, r558), r558.width, r558.height);
    }, Object.defineProperty(e768.prototype, "width", {
        get: function() {
            return this._width;
        },
        set: function(t) {
            this._width = t;
        },
        enumerable: !1,
        configurable: !0
    }), Object.defineProperty(e768.prototype, "height", {
        get: function() {
            return this._height;
        },
        set: function(t) {
            this._height = t;
        },
        enumerable: !1,
        configurable: !0
    }), e768;
}(Fa), mh = "#version 100\n#define SHADER_NAME Tiling-Sprite-100\n\nprecision lowp float;\n\nattribute vec2 aVertexPosition;\nattribute vec2 aTextureCoord;\n\nuniform mat3 projectionMatrix;\nuniform mat3 translationMatrix;\nuniform mat3 uTransform;\n\nvarying vec2 vTextureCoord;\n\nvoid main(void)\n{\n    gl_Position = vec4((projectionMatrix * translationMatrix * vec3(aVertexPosition, 1.0)).xy, 0.0, 1.0);\n\n    vTextureCoord = (uTransform * vec3(aTextureCoord, 1.0)).xy;\n}\n", vh = new _r, yh = function(t514) {
    function e775(e776) {
        var r559 = t514.call(this, e776) || this;
        return e776.runners.contextChange.add(r559), r559.quad = new tn, r559.state = jn.for2d(), r559;
    }
    return fh(e775, t514), e775.prototype.contextChange = function() {
        var t = this.renderer, e777 = {
            globals: t.globalUniforms
        };
        this.simpleShader = Hn.from(mh, "#version 100\n#define SHADER_NAME Tiling-Sprite-Simple-100\n\nprecision lowp float;\n\nvarying vec2 vTextureCoord;\n\nuniform sampler2D uSampler;\nuniform vec4 uColor;\n\nvoid main(void)\n{\n    vec4 texSample = texture2D(uSampler, vTextureCoord);\n    gl_FragColor = texSample * uColor;\n}\n", e777), this.shader = t.context.webGLVersion > 1 ? Hn.from("#version 300 es\n#define SHADER_NAME Tiling-Sprite-300\n\nprecision lowp float;\n\nin vec2 aVertexPosition;\nin vec2 aTextureCoord;\n\nuniform mat3 projectionMatrix;\nuniform mat3 translationMatrix;\nuniform mat3 uTransform;\n\nout vec2 vTextureCoord;\n\nvoid main(void)\n{\n    gl_Position = vec4((projectionMatrix * translationMatrix * vec3(aVertexPosition, 1.0)).xy, 0.0, 1.0);\n\n    vTextureCoord = (uTransform * vec3(aTextureCoord, 1.0)).xy;\n}\n", "#version 300 es\n#define SHADER_NAME Tiling-Sprite-100\n\nprecision lowp float;\n\nin vec2 vTextureCoord;\n\nout vec4 fragmentColor;\n\nuniform sampler2D uSampler;\nuniform vec4 uColor;\nuniform mat3 uMapCoord;\nuniform vec4 uClampFrame;\nuniform vec2 uClampOffset;\n\nvoid main(void)\n{\n    vec2 coord = vTextureCoord + ceil(uClampOffset - vTextureCoord);\n    coord = (uMapCoord * vec3(coord, 1.0)).xy;\n    vec2 unclamped = coord;\n    coord = clamp(coord, uClampFrame.xy, uClampFrame.zw);\n\n    vec4 texSample = texture(uSampler, coord, unclamped == coord ? 0.0f : -32.0f);// lod-bias very negative to force lod 0\n\n    fragmentColor = texSample * uColor;\n}\n", e777) : Hn.from(mh, "#version 100\n#ifdef GL_EXT_shader_texture_lod\n    #extension GL_EXT_shader_texture_lod : enable\n#endif\n#define SHADER_NAME Tiling-Sprite-100\n\nprecision lowp float;\n\nvarying vec2 vTextureCoord;\n\nuniform sampler2D uSampler;\nuniform vec4 uColor;\nuniform mat3 uMapCoord;\nuniform vec4 uClampFrame;\nuniform vec2 uClampOffset;\n\nvoid main(void)\n{\n    vec2 coord = vTextureCoord + ceil(uClampOffset - vTextureCoord);\n    coord = (uMapCoord * vec3(coord, 1.0)).xy;\n    vec2 unclamped = coord;\n    coord = clamp(coord, uClampFrame.xy, uClampFrame.zw);\n\n    #ifdef GL_EXT_shader_texture_lod\n        vec4 texSample = unclamped == coord\n            ? texture2D(uSampler, coord) \n            : texture2DLodEXT(uSampler, coord, 0);\n    #else\n        vec4 texSample = texture2D(uSampler, coord);\n    #endif\n\n    gl_FragColor = texSample * uColor;\n}\n", e777);
    }, e775.prototype.render = function(t) {
        var e778 = this.renderer, r560 = this.quad, i414 = r560.vertices;
        i414[0] = i414[6] = t._width * -t.anchor.x, i414[1] = i414[3] = t._height * -t.anchor.y, i414[2] = i414[4] = t._width * (1 - t.anchor.x), i414[5] = i414[7] = t._height * (1 - t.anchor.y);
        var n309 = t.uvRespectAnchor ? t.anchor.x : 0, o241 = t.uvRespectAnchor ? t.anchor.y : 0;
        (i414 = r560.uvs)[0] = i414[6] = -n309, i414[1] = i414[3] = -o241, i414[2] = i414[4] = 1 - n309, i414[5] = i414[7] = 1 - o241, r560.invalidate();
        var s175 = t._texture, a147 = s175.baseTexture, h115 = t.tileTransform.localTransform, u97 = t.uvMatrix, l82 = a147.isPowerOfTwo && s175.frame.width === a147.width && s175.frame.height === a147.height;
        l82 && (a147._glTextures[e778.CONTEXT_UID] ? l82 = a147.wrapMode !== fe.CLAMP : a147.wrapMode === fe.CLAMP && (a147.wrapMode = fe.REPEAT));
        var c65 = l82 ? this.simpleShader : this.shader, d63 = s175.width, f51 = s175.height, p = t._width, _30 = t._height;
        vh.set(h115.a * d63 / p, h115.b * d63 / _30, h115.c * f51 / p, h115.d * f51 / _30, h115.tx / p, h115.ty / _30), vh.invert(), l82 ? vh.prepend(u97.mapCoord) : (c65.uniforms.uMapCoord = u97.mapCoord.toArray(!0), c65.uniforms.uClampFrame = u97.uClampFrame, c65.uniforms.uClampOffset = u97.uClampOffset), c65.uniforms.uTransform = vh.toArray(!0), c65.uniforms.uColor = Fe(t.tint, t.worldAlpha, c65.uniforms.uColor, a147.alphaMode), c65.uniforms.translationMatrix = t.transform.worldTransform.toArray(!0), c65.uniforms.uSampler = s175, e778.shader.bind(c65), e778.geometry.bind(r560), this.state.blendMode = Ce(t.blendMode, a147.alphaMode), e778.state.set(this.state), e778.geometry.draw(this.renderer.gl.TRIANGLES, 6, 0);
    }, e775;
}(hn), gh = function(t515, e779) {
    return (gh = Object.setPrototypeOf || ({
        __proto__: []
    }) instanceof Array && function(t, e780) {
        t.__proto__ = e780;
    } || function(t, e781) {
        for(var r561 in e781)e781.hasOwnProperty(r561) && (t[r561] = e781[r561]);
    })(t515, e779);
};
function Eh(t, e782) {
    function r562() {
        this.constructor = t;
    }
    gh(t, e782), t.prototype = null === e782 ? Object.create(e782) : (r562.prototype = e782.prototype, new r562);
}
var Th = function() {
    function t516(t, e783) {
        this.uvBuffer = t, this.uvMatrix = e783, this.data = null, this._bufferUpdateId = -1, this._textureUpdateId = -1, this._updateID = 0;
    }
    return t516.prototype.update = function(t) {
        if (t || this._bufferUpdateId !== this.uvBuffer._updateID || this._textureUpdateId !== this.uvMatrix._updateID) {
            this._bufferUpdateId = this.uvBuffer._updateID, this._textureUpdateId = this.uvMatrix._updateID;
            var e784 = this.uvBuffer.data;
            this.data && this.data.length === e784.length || (this.data = new Float32Array(e784.length)), this.uvMatrix.multiplyUvs(e784, this.data), this._updateID++;
        }
    }, t516;
}(), bh = new fr, xh = new cr, Rh = function(t517) {
    function e785(e786, r563, i415, n310) {
        void 0 === n310 && (n310 = ae.TRIANGLES);
        var o242 = t517.call(this) || this;
        return o242.geometry = e786, o242.shader = r563, o242.state = i415 || jn.for2d(), o242.drawMode = n310, o242.start = 0, o242.size = 0, o242.uvs = null, o242.indices = null, o242.vertexData = new Float32Array(1), o242.vertexDirty = -1, o242._transformID = -1, o242._roundPixels = et.ROUND_PIXELS, o242.batchUvs = null, o242;
    }
    return Eh(e785, t517), Object.defineProperty(e785.prototype, "geometry", {
        get: function() {
            return this._geometry;
        },
        set: function(t) {
            this._geometry !== t && (this._geometry && (this._geometry.refCount--, 0 === this._geometry.refCount && this._geometry.dispose()), this._geometry = t, this._geometry && this._geometry.refCount++, this.vertexDirty = -1);
        },
        enumerable: !1,
        configurable: !0
    }), Object.defineProperty(e785.prototype, "uvBuffer", {
        get: function() {
            return this.geometry.buffers[1];
        },
        enumerable: !1,
        configurable: !0
    }), Object.defineProperty(e785.prototype, "verticesBuffer", {
        get: function() {
            return this.geometry.buffers[0];
        },
        enumerable: !1,
        configurable: !0
    }), Object.defineProperty(e785.prototype, "material", {
        get: function() {
            return this.shader;
        },
        set: function(t) {
            this.shader = t;
        },
        enumerable: !1,
        configurable: !0
    }), Object.defineProperty(e785.prototype, "blendMode", {
        get: function() {
            return this.state.blendMode;
        },
        set: function(t) {
            this.state.blendMode = t;
        },
        enumerable: !1,
        configurable: !0
    }), Object.defineProperty(e785.prototype, "roundPixels", {
        get: function() {
            return this._roundPixels;
        },
        set: function(t) {
            this._roundPixels !== t && (this._transformID = -1), this._roundPixels = t;
        },
        enumerable: !1,
        configurable: !0
    }), Object.defineProperty(e785.prototype, "tint", {
        get: function() {
            return "tint" in this.shader ? this.shader.tint : null;
        },
        set: function(t) {
            this.shader.tint = t;
        },
        enumerable: !1,
        configurable: !0
    }), Object.defineProperty(e785.prototype, "texture", {
        get: function() {
            return "texture" in this.shader ? this.shader.texture : null;
        },
        set: function(t) {
            this.shader.texture = t;
        },
        enumerable: !1,
        configurable: !0
    }), e785.prototype._render = function(t) {
        var r564 = this.geometry.buffers[0].data;
        this.shader.batchable && this.drawMode === ae.TRIANGLES && r564.length < 2 * e785.BATCHABLE_SIZE ? this._renderToBatch(t) : this._renderDefault(t);
    }, e785.prototype._renderDefault = function(t) {
        var e787 = this.shader;
        e787.alpha = this.worldAlpha, e787.update && e787.update(), t.batch.flush(), e787.uniforms.translationMatrix = this.transform.worldTransform.toArray(!0), t.shader.bind(e787), t.state.set(this.state), t.geometry.bind(this.geometry, e787), t.geometry.draw(this.drawMode, this.size, this.start, this.geometry.instanceCount);
    }, e785.prototype._renderToBatch = function(t) {
        var e788 = this.geometry, r565 = this.shader;
        r565.uvMatrix && (r565.uvMatrix.update(), this.calculateUvs()), this.calculateVertices(), this.indices = e788.indexBuffer.data, this._tintRGB = r565._tintRGB, this._texture = r565.texture;
        var i = this.material.pluginName;
        t.batch.setObjectRenderer(t.plugins[i]), t.plugins[i].render(this);
    }, e785.prototype.calculateVertices = function() {
        var t = this.geometry.buffers[0], e789 = t.data, r566 = t._updateID;
        if (r566 !== this.vertexDirty || this._transformID !== this.transform._worldID) {
            this._transformID = this.transform._worldID, this.vertexData.length !== e789.length && (this.vertexData = new Float32Array(e789.length));
            for(var i416 = this.transform.worldTransform, n311 = i416.a, o243 = i416.b, s176 = i416.c, a148 = i416.d, h116 = i416.tx, u98 = i416.ty, l83 = this.vertexData, c66 = 0; c66 < l83.length / 2; c66++){
                var d64 = e789[2 * c66], f52 = e789[2 * c66 + 1];
                l83[2 * c66] = n311 * d64 + s176 * f52 + h116, l83[2 * c66 + 1] = o243 * d64 + a148 * f52 + u98;
            }
            if (this._roundPixels) {
                var p = et.RESOLUTION;
                for(c66 = 0; c66 < l83.length; ++c66)l83[c66] = Math.round((l83[c66] * p | 0) / p);
            }
            this.vertexDirty = r566;
        }
    }, e785.prototype.calculateUvs = function() {
        var t = this.geometry.buffers[1], e790 = this.shader;
        e790.uvMatrix.isSimple ? this.uvs = t.data : (this.batchUvs || (this.batchUvs = new Th(t, e790.uvMatrix)), this.batchUvs.update(), this.uvs = this.batchUvs.data);
    }, e785.prototype._calculateBounds = function() {
        this.calculateVertices(), this._bounds.addVertexData(this.vertexData, 0, this.vertexData.length);
    }, e785.prototype.containsPoint = function(t) {
        if (!this.getBounds().contains(t.x, t.y)) return !1;
        this.worldTransform.applyInverse(t, bh);
        for(var e791 = this.geometry.getBuffer("aVertexPosition").data, r567 = xh.points, i417 = this.geometry.getIndex().data, n312 = i417.length, o244 = 4 === this.drawMode ? 3 : 1, s177 = 0; s177 + 2 < n312; s177 += o244){
            var a = 2 * i417[s177], h = 2 * i417[s177 + 1], u = 2 * i417[s177 + 2];
            if (r567[0] = e791[a], r567[1] = e791[a + 1], r567[2] = e791[h], r567[3] = e791[h + 1], r567[4] = e791[u], r567[5] = e791[u + 1], xh.contains(bh.x, bh.y)) return !0;
        }
        return !1;
    }, e785.prototype.destroy = function(e792) {
        t517.prototype.destroy.call(this, e792), this._cachedTexture && (this._cachedTexture.destroy(), this._cachedTexture = null), this.geometry = null, this.shader = null, this.state = null, this.uvs = null, this.indices = null, this.vertexData = null;
    }, e785.BATCHABLE_SIZE = 100, e785;
}(Zr), Ah = "varying vec2 vTextureCoord;\nuniform vec4 uColor;\n\nuniform sampler2D uSampler;\n\nvoid main(void)\n{\n    gl_FragColor = texture2D(uSampler, vTextureCoord) * uColor;\n}\n", Oh = "attribute vec2 aVertexPosition;\nattribute vec2 aTextureCoord;\n\nuniform mat3 projectionMatrix;\nuniform mat3 translationMatrix;\nuniform mat3 uTextureMatrix;\n\nvarying vec2 vTextureCoord;\n\nvoid main(void)\n{\n    gl_Position = vec4((projectionMatrix * translationMatrix * vec3(aVertexPosition, 1.0)).xy, 0.0, 1.0);\n\n    vTextureCoord = (uTextureMatrix * vec3(aTextureCoord, 1.0)).xy;\n}\n", Sh = function(t518) {
    function e793(e794, r568) {
        var i418 = this, n313 = {
            uSampler: e794,
            alpha: 1,
            uTextureMatrix: _r.IDENTITY,
            uColor: new Float32Array([
                1,
                1,
                1,
                1
            ])
        };
        return (r568 = Object.assign({
            tint: 16777215,
            alpha: 1,
            pluginName: "batch"
        }, r568)).uniforms && Object.assign(n313, r568.uniforms), (i418 = t518.call(this, r568.program || kn.from(Oh, Ah), n313) || this)._colorDirty = !1, i418.uvMatrix = new qn(e794), i418.batchable = void 0 === r568.program, i418.pluginName = r568.pluginName, i418.tint = r568.tint, i418.alpha = r568.alpha, i418;
    }
    return Eh(e793, t518), Object.defineProperty(e793.prototype, "texture", {
        get: function() {
            return this.uniforms.uSampler;
        },
        set: function(t) {
            this.uniforms.uSampler !== t && (this.uniforms.uSampler = t, this.uvMatrix.texture = t);
        },
        enumerable: !1,
        configurable: !0
    }), Object.defineProperty(e793.prototype, "alpha", {
        get: function() {
            return this._alpha;
        },
        set: function(t) {
            t !== this._alpha && (this._alpha = t, this._colorDirty = !0);
        },
        enumerable: !1,
        configurable: !0
    }), Object.defineProperty(e793.prototype, "tint", {
        get: function() {
            return this._tint;
        },
        set: function(t) {
            t !== this._tint && (this._tint = t, this._tintRGB = (t >> 16) + (65280 & t) + ((255 & t) << 16), this._colorDirty = !0);
        },
        enumerable: !1,
        configurable: !0
    }), e793.prototype.update = function() {
        if (this._colorDirty) {
            this._colorDirty = !1;
            var t = this.texture.baseTexture;
            Fe(this._tint, this._alpha, this.uniforms.uColor, t.alphaMode);
        }
        this.uvMatrix.update() && (this.uniforms.uTextureMatrix = this.uvMatrix.mapCoord);
    }, e793;
}(Hn), Ih = function(t) {
    function e795(e796, r569, i419) {
        var n314 = t.call(this) || this, o245 = new zi(e796), s178 = new zi(r569, !0), a149 = new zi(i419, !0, !0);
        return n314.addAttribute("aVertexPosition", o245, 2, !1, le.FLOAT).addAttribute("aTextureCoord", s178, 2, !1, le.FLOAT).addIndex(a149), n314._updateId = -1, n314;
    }
    return Eh(e795, t), Object.defineProperty(e795.prototype, "vertexDirtyId", {
        get: function() {
            return this.buffers[0]._updateID;
        },
        enumerable: !1,
        configurable: !0
    }), e795;
}(Qi), Ph = function(t519, e797) {
    return (Ph = Object.setPrototypeOf || ({
        __proto__: []
    }) instanceof Array && function(t, e798) {
        t.__proto__ = e798;
    } || function(t, e799) {
        for(var r570 in e799)e799.hasOwnProperty(r570) && (t[r570] = e799[r570]);
    })(t519, e797);
}, Nh = function() {
    this.info = [], this.common = [], this.page = [], this.char = [], this.kerning = [], this.distanceField = [];
}, Mh = function() {
    function t520() {
    }
    return t520.test = function(t) {
        return "string" == typeof t && 0 === t.indexOf("info face=");
    }, t520.parse = function(t521) {
        var e800 = t521.match(/^[a-z]+\s+.+$/gm), r571 = {
            info: [],
            common: [],
            page: [],
            char: [],
            chars: [],
            kerning: [],
            kernings: [],
            distanceField: []
        };
        for(var i in e800){
            var n = e800[i].match(/^[a-z]+/gm)[0], o246 = e800[i].match(/[a-zA-Z]+=([^\s"']+|"([^"]*)")/gm), s179 = {
            };
            for(var a in o246){
                var h117 = o246[a].split("="), u = h117[0], l84 = h117[1].replace(/"/gm, ""), c67 = parseFloat(l84), d65 = isNaN(c67) ? l84 : c67;
                s179[u] = d65;
            }
            r571[n].push(s179);
        }
        var f53 = new Nh;
        return r571.info.forEach(function(t) {
            return f53.info.push({
                face: t.face,
                size: parseInt(t.size, 10)
            });
        }), r571.common.forEach(function(t) {
            return f53.common.push({
                lineHeight: parseInt(t.lineHeight, 10)
            });
        }), r571.page.forEach(function(t) {
            return f53.page.push({
                id: parseInt(t.id, 10),
                file: t.file
            });
        }), r571.char.forEach(function(t) {
            return f53.char.push({
                id: parseInt(t.id, 10),
                page: parseInt(t.page, 10),
                x: parseInt(t.x, 10),
                y: parseInt(t.y, 10),
                width: parseInt(t.width, 10),
                height: parseInt(t.height, 10),
                xoffset: parseInt(t.xoffset, 10),
                yoffset: parseInt(t.yoffset, 10),
                xadvance: parseInt(t.xadvance, 10)
            });
        }), r571.kerning.forEach(function(t) {
            return f53.kerning.push({
                first: parseInt(t.first, 10),
                second: parseInt(t.second, 10),
                amount: parseInt(t.amount, 10)
            });
        }), r571.distanceField.forEach(function(t) {
            return f53.distanceField.push({
                distanceRange: parseInt(t.distanceRange, 10),
                fieldType: t.fieldType
            });
        }), f53;
    }, t520;
}(), Dh = function() {
    function t522() {
    }
    return t522.test = function(t) {
        return t instanceof XMLDocument && t.getElementsByTagName("page").length && null !== t.getElementsByTagName("info")[0].getAttribute("face");
    }, t522.parse = function(t) {
        for(var e801 = new Nh, r572 = t.getElementsByTagName("info"), i420 = t.getElementsByTagName("common"), n315 = t.getElementsByTagName("page"), o247 = t.getElementsByTagName("char"), s180 = t.getElementsByTagName("kerning"), a150 = t.getElementsByTagName("distanceField"), h118 = 0; h118 < r572.length; h118++)e801.info.push({
            face: r572[h118].getAttribute("face"),
            size: parseInt(r572[h118].getAttribute("size"), 10)
        });
        for(h118 = 0; h118 < i420.length; h118++)e801.common.push({
            lineHeight: parseInt(i420[h118].getAttribute("lineHeight"), 10)
        });
        for(h118 = 0; h118 < n315.length; h118++)e801.page.push({
            id: parseInt(n315[h118].getAttribute("id"), 10) || 0,
            file: n315[h118].getAttribute("file")
        });
        for(h118 = 0; h118 < o247.length; h118++){
            var u99 = o247[h118];
            e801.char.push({
                id: parseInt(u99.getAttribute("id"), 10),
                page: parseInt(u99.getAttribute("page"), 10) || 0,
                x: parseInt(u99.getAttribute("x"), 10),
                y: parseInt(u99.getAttribute("y"), 10),
                width: parseInt(u99.getAttribute("width"), 10),
                height: parseInt(u99.getAttribute("height"), 10),
                xoffset: parseInt(u99.getAttribute("xoffset"), 10),
                yoffset: parseInt(u99.getAttribute("yoffset"), 10),
                xadvance: parseInt(u99.getAttribute("xadvance"), 10)
            });
        }
        for(h118 = 0; h118 < s180.length; h118++)e801.kerning.push({
            first: parseInt(s180[h118].getAttribute("first"), 10),
            second: parseInt(s180[h118].getAttribute("second"), 10),
            amount: parseInt(s180[h118].getAttribute("amount"), 10)
        });
        for(h118 = 0; h118 < a150.length; h118++)e801.distanceField.push({
            fieldType: a150[h118].getAttribute("fieldType"),
            distanceRange: parseInt(a150[h118].getAttribute("distanceRange"), 10)
        });
        return e801;
    }, t522;
}(), Ch = function() {
    function t523() {
    }
    return t523.test = function(t) {
        if ("string" == typeof t && t.indexOf("<font>") > -1) {
            var e802 = (new self.DOMParser).parseFromString(t, "text/xml");
            return Dh.test(e802);
        }
        return !1;
    }, t523.parse = function(t) {
        var e803 = (new self.DOMParser).parseFromString(t, "text/xml");
        return Dh.parse(e803);
    }, t523;
}(), wh = [
    Mh,
    Dh,
    Ch
];
function Lh(t) {
    for(var e804 = 0; e804 < wh.length; e804++)if (wh[e804].test(t)) return wh[e804];
    return null;
}
function Fh(t524, e805, r573, i421, n316, o248, s181) {
    var a151 = r573.text, h119 = r573.fontProperties;
    e805.translate(i421, n316), e805.scale(o248, o248);
    var u100 = s181.strokeThickness / 2, l85 = -s181.strokeThickness / 2;
    e805.font = s181.toFontString(), e805.lineWidth = s181.strokeThickness, e805.textBaseline = s181.textBaseline, e805.lineJoin = s181.lineJoin, e805.miterLimit = s181.miterLimit, e805.fillStyle = (function(t, e806, r574, i422, n317, o249) {
        var s182, a152 = r574.fill;
        if (!Array.isArray(a152)) return a152;
        if (1 === a152.length) return a152[0];
        var h120 = r574.dropShadow ? r574.dropShadowDistance : 0, u101 = r574.padding || 0, l86 = t.width / i422 - h120 - 2 * u101, c69 = t.height / i422 - h120 - 2 * u101, d67 = a152.slice(), f54 = r574.fillGradientStops.slice();
        if (!f54.length) for(var p = d67.length + 1, _31 = 1; _31 < p; ++_31)f54.push(_31 / p);
        if (d67.unshift(a152[0]), f54.unshift(0), d67.push(a152[a152.length - 1]), f54.push(1), r574.fillGradientType === xa.LINEAR_VERTICAL) {
            s182 = e806.createLinearGradient(l86 / 2, u101, l86 / 2, c69 + u101);
            var m26 = 0, v24 = (o249.fontProperties.fontSize + r574.strokeThickness) / c69;
            for(_31 = 0; _31 < n317.length; _31++)for(var y = o249.lineHeight * _31, g18 = 0; g18 < d67.length; g18++){
                var E17 = y / c69 + ("number" == typeof f54[g18] ? f54[g18] : g18 / d67.length) * v24, T15 = Math.max(m26, E17);
                T15 = Math.min(T15, 1), s182.addColorStop(T15, d67[g18]), m26 = T15;
            }
        } else {
            s182 = e806.createLinearGradient(u101, c69 / 2, l86 + u101, c69 / 2);
            var b12 = d67.length + 1, x12 = 1;
            for(_31 = 0; _31 < d67.length; _31++){
                var R9;
                R9 = "number" == typeof f54[_31] ? f54[_31] : x12 / b12, s182.addColorStop(R9, d67[_31]), x12++;
            }
        }
        return s182;
    })(t524, e805, s181, o248, [
        a151
    ], r573), e805.strokeStyle = s181.stroke;
    var c68 = s181.dropShadowColor, d66 = Pe("number" == typeof c68 ? c68 : Me(c68));
    s181.dropShadow ? (e805.shadowColor = "rgba(" + 255 * d66[0] + "," + 255 * d66[1] + "," + 255 * d66[2] + "," + s181.dropShadowAlpha + ")", e805.shadowBlur = s181.dropShadowBlur, e805.shadowOffsetX = Math.cos(s181.dropShadowAngle) * s181.dropShadowDistance, e805.shadowOffsetY = Math.sin(s181.dropShadowAngle) * s181.dropShadowDistance) : (e805.shadowColor = "black", e805.shadowBlur = 0, e805.shadowOffsetX = 0, e805.shadowOffsetY = 0), s181.stroke && s181.strokeThickness && e805.strokeText(a151, u100, l85 + r573.lineHeight - h119.descent), s181.fill && e805.fillText(a151, u100, l85 + r573.lineHeight - h119.descent), e805.setTransform(1, 0, 0, 1, 0, 0), e805.fillStyle = "rgba(0, 0, 0, 0)";
}
function Uh(t) {
    return Array.from ? Array.from(t) : t.split("");
}
function Gh(t) {
    return t.codePointAt ? t.codePointAt(0) : t.charCodeAt(0);
}
var Bh = function() {
    function t525(t, e807, r575) {
        var i423, n318, o250 = t.info[0], s183 = t.common[0], a153 = t.page[0], h121 = t.distanceField[0], u102 = rr(a153.file), l87 = {
        };
        this._ownsTextures = r575, this.font = o250.face, this.size = o250.size, this.lineHeight = s183.lineHeight / u102, this.chars = {
        }, this.pageTextures = l87;
        for(var c70 = 0; c70 < t.page.length; c70++){
            var d68 = t.page[c70], f = d68.id, p = d68.file;
            l87[f] = e807 instanceof Array ? e807[c70] : e807[p], (null == h121 ? void 0 : h121.fieldType) && "none" !== h121.fieldType && (l87[f].baseTexture.alphaMode = _e.NO_PREMULTIPLIED_ALPHA);
        }
        for(c70 = 0; c70 < t.char.length; c70++){
            var _32 = t.char[c70], m27 = (f = _32.id, _32.page), v25 = t.char[c70], y = v25.x, g19 = v25.y, E18 = v25.width, T16 = v25.height, b13 = v25.xoffset, x13 = v25.yoffset, R10 = v25.xadvance;
            g19 /= u102, E18 /= u102, T16 /= u102, b13 /= u102, x13 /= u102, R10 /= u102;
            var A10 = new hr((y /= u102) + l87[m27].frame.x / u102, g19 + l87[m27].frame.y / u102, E18, T16);
            this.chars[f] = {
                xOffset: b13,
                yOffset: x13,
                xAdvance: R10,
                kerning: {
                },
                texture: new ki(l87[m27].baseTexture, A10),
                page: m27
            };
        }
        for(c70 = 0; c70 < t.kerning.length; c70++){
            var O9 = t.kerning[c70], S6 = O9.first, I6 = O9.second, P5 = O9.amount;
            S6 /= u102, I6 /= u102, P5 /= u102, this.chars[I6] && (this.chars[I6].kerning[S6] = P5);
        }
        this.distanceFieldRange = null == h121 ? void 0 : h121.distanceRange, this.distanceFieldType = null !== (n318 = null === (i423 = null == h121 ? void 0 : h121.fieldType) || void 0 === i423 ? void 0 : i423.toLowerCase()) && void 0 !== n318 ? n318 : "none";
    }
    return t525.prototype.destroy = function() {
        for(var t in this.chars)this.chars[t].texture.destroy(), this.chars[t].texture = null;
        for(var t in this.pageTextures)this._ownsTextures && this.pageTextures[t].destroy(!0), this.pageTextures[t] = null;
        this.chars = null, this.pageTextures = null;
    }, t525.install = function(e808, r576, i424) {
        var n319;
        if (e808 instanceof Nh) n319 = e808;
        else {
            var o251 = Lh(e808);
            if (!o251) throw new Error("Unrecognized data format for font.");
            n319 = o251.parse(e808);
        }
        r576 instanceof ki && (r576 = [
            r576
        ]);
        var s184 = new t525(n319, r576, i424);
        return t525.available[s184.font] = s184, s184;
    }, t525.uninstall = function(e809) {
        var r577 = t525.available[e809];
        if (!r577) throw new Error("No font found named '" + e809 + "'");
        r577.destroy(), delete t525.available[e809];
    }, t525.from = function(e810, r578, i425) {
        if (!e810) throw new Error("[BitmapFont] Property `name` is required.");
        var n320 = Object.assign({
        }, t525.defaultOptions, i425), o252 = n320.chars, s185 = n320.padding, a154 = n320.resolution, h122 = n320.textureWidth, u103 = n320.textureHeight, l88 = function(t) {
            "string" == typeof t && (t = [
                t
            ]);
            for(var e811 = [], r579 = 0, i426 = t.length; r579 < i426; r579++){
                var n321 = t[r579];
                if (Array.isArray(n321)) {
                    if (2 !== n321.length) throw new Error("[BitmapFont]: Invalid character range length, expecting 2 got " + n321.length + ".");
                    var o253 = n321[0].charCodeAt(0), s186 = n321[1].charCodeAt(0);
                    if (s186 < o253) throw new Error("[BitmapFont]: Invalid character range.");
                    for(var a155 = o253, h123 = s186; a155 <= h123; a155++)e811.push(String.fromCharCode(a155));
                } else e811.push.apply(e811, Uh(n321));
            }
            if (0 === e811.length) throw new Error("[BitmapFont]: Empty set when resolving characters.");
            return e811;
        }(o252), c71 = r578 instanceof Xa ? r578 : new Xa(r578), d69 = h122, f = new Nh;
        f.info[0] = {
            face: c71.fontFamily,
            size: c71.fontSize
        }, f.common[0] = {
            lineHeight: c71.fontSize
        };
        for(var p, _33, m28, v26 = 0, y = 0, g20 = 0, E19 = [], T17 = 0; T17 < l88.length; T17++){
            p || ((p = document.createElement("canvas")).width = h122, p.height = u103, _33 = p.getContext("2d"), m28 = new Ai(p, {
                resolution: a154
            }), E19.push(new ki(m28)), f.page.push({
                id: E19.length - 1,
                file: ""
            }));
            var b14 = Ya.measureText(l88[T17], c71, !1, p), x14 = b14.width, R11 = Math.ceil(b14.height), A11 = Math.ceil(("italic" === c71.fontStyle ? 2 : 1) * x14);
            if (y >= u103 - R11 * a154) {
                if (0 === y) throw new Error("[BitmapFont] textureHeight " + u103 + "px is too small for " + c71.fontSize + "px fonts");
                --T17, p = null, _33 = null, m28 = null, y = 0, v26 = 0, g20 = 0;
            } else if (g20 = Math.max(R11 + b14.fontProperties.descent, g20), A11 * a154 + v26 >= d69) --T17, y += g20 * a154, y = Math.ceil(y), v26 = 0, g20 = 0;
            else {
                Fh(p, _33, b14, v26, y, a154, c71);
                var O10 = Gh(b14.text);
                f.char.push({
                    id: O10,
                    page: E19.length - 1,
                    x: v26 / a154,
                    y: y / a154,
                    width: A11,
                    height: R11,
                    xoffset: 0,
                    yoffset: 0,
                    xadvance: Math.ceil(x14 - (c71.dropShadow ? c71.dropShadowDistance : 0) - (c71.stroke ? c71.strokeThickness : 0))
                }), v26 += (A11 + 2 * s185) * a154, v26 = Math.ceil(v26);
            }
        }
        T17 = 0;
        for(var S7 = l88.length; T17 < S7; T17++)for(var I7 = l88[T17], P6 = 0; P6 < S7; P6++){
            var N5 = l88[P6], M4 = _33.measureText(I7).width, D4 = _33.measureText(N5).width, C2 = _33.measureText(I7 + N5).width - (M4 + D4);
            C2 && f.kerning.push({
                first: Gh(I7),
                second: Gh(N5),
                amount: C2
            });
        }
        var w2 = new t525(f, E19, !0);
        return void 0 !== t525.available[e810] && t525.uninstall(e810), t525.available[e810] = w2, w2;
    }, t525.ALPHA = [
        [
            "a",
            "z"
        ],
        [
            "A",
            "Z"
        ],
        " "
    ], t525.NUMERIC = [
        [
            "0",
            "9"
        ]
    ], t525.ALPHANUMERIC = [
        [
            "a",
            "z"
        ],
        [
            "A",
            "Z"
        ],
        [
            "0",
            "9"
        ],
        " "
    ], t525.ASCII = [
        [
            " ",
            "~"
        ]
    ], t525.defaultOptions = {
        resolution: 1,
        textureWidth: 512,
        textureHeight: 512,
        padding: 4,
        chars: t525.ALPHANUMERIC
    }, t525.available = {
    }, t525;
}(), Xh = [], kh = [], Hh = [], jh = function(t526) {
    function e812(r580, i427) {
        void 0 === i427 && (i427 = {
        });
        var n322 = t526.call(this) || this;
        n322._tint = 16777215;
        var o254 = Object.assign({
        }, e812.styleDefaults, i427), s187 = o254.align, a156 = o254.tint, h124 = o254.maxWidth, u104 = o254.letterSpacing, l89 = o254.fontName, c72 = o254.fontSize;
        if (!Bh.available[l89]) throw new Error('Missing BitmapFont "' + l89 + '"');
        return n322._activePagesMeshData = [], n322._textWidth = 0, n322._textHeight = 0, n322._align = s187, n322._tint = a156, n322._fontName = l89, n322._fontSize = c72 || Bh.available[l89].size, n322._text = r580, n322._maxWidth = h124, n322._maxLineHeight = 0, n322._letterSpacing = u104, n322._anchor = new pr(function() {
            n322.dirty = !0;
        }, n322, 0, 0), n322._roundPixels = et.ROUND_PIXELS, n322.dirty = !0, n322._textureCache = {
        }, n322;
    }
    return (function(t, e813) {
        function r581() {
            this.constructor = t;
        }
        Ph(t, e813), t.prototype = null === e813 ? Object.create(e813) : (r581.prototype = e813.prototype, new r581);
    })(e812, t526), e812.prototype.updateText = function() {
        for(var t, e814 = Bh.available[this._fontName], r582 = this._fontSize / e814.size, i428 = new fr, n323 = [], o255 = [], s188 = [], a157 = Uh(this._text.replace(/(?:\r\n|\r)/g, "\n") || " "), h125 = this._maxWidth * e814.size / this._fontSize, u105 = "none" === e814.distanceFieldType ? Xh : kh, l90 = null, c73 = 0, d70 = 0, f = 0, p = -1, _34 = 0, m29 = 0, v27 = 0, y = 0, g21 = 0; g21 < a157.length; g21++){
            var E20 = Gh(X2 = a157[g21]);
            if (/(?:\s)/.test(X2) && (p = g21, _34 = c73, y++), "\r" !== X2 && "\n" !== X2) {
                var T18 = e814.chars[E20];
                if (T18) {
                    l90 && T18.kerning[l90] && (i428.x += T18.kerning[l90]);
                    var b15 = Hh.pop() || {
                        texture: ki.EMPTY,
                        line: 0,
                        charCode: 0,
                        prevSpaces: 0,
                        position: new fr
                    };
                    b15.texture = T18.texture, b15.line = f, b15.charCode = E20, b15.position.x = i428.x + T18.xOffset + this._letterSpacing / 2, b15.position.y = i428.y + T18.yOffset, b15.prevSpaces = y, n323.push(b15), c73 = b15.position.x + T18.texture.orig.width, i428.x += T18.xAdvance + this._letterSpacing, v27 = Math.max(v27, T18.yOffset + T18.texture.height), l90 = E20, -1 !== p && h125 > 0 && i428.x > h125 && (je(n323, 1 + p - ++m29, 1 + g21 - p), g21 = p, p = -1, o255.push(_34), s188.push(n323.length > 0 ? n323[n323.length - 1].prevSpaces : 0), d70 = Math.max(d70, _34), f++, i428.x = 0, i428.y += e814.lineHeight, l90 = null, y = 0);
                }
            } else o255.push(c73), s188.push(-1), d70 = Math.max(d70, c73), ++f, ++m29, i428.x = 0, i428.y += e814.lineHeight, l90 = null, y = 0;
        }
        var x15 = a157[a157.length - 1];
        "\r" !== x15 && "\n" !== x15 && (/(?:\s)/.test(x15) && (c73 = _34), o255.push(c73), d70 = Math.max(d70, c73), s188.push(-1));
        var R12 = [];
        for(g21 = 0; g21 <= f; g21++){
            var A12 = 0;
            "right" === this._align ? A12 = d70 - o255[g21] : "center" === this._align ? A12 = (d70 - o255[g21]) / 2 : "justify" === this._align && (A12 = s188[g21] < 0 ? 0 : (d70 - o255[g21]) / s188[g21]), R12.push(A12);
        }
        var O11 = n323.length, S8 = {
        }, I8 = [], P7 = this._activePagesMeshData;
        for(g21 = 0; g21 < P7.length; g21++)u105.push(P7[g21]);
        for(g21 = 0; g21 < O11; g21++){
            var N = (H2 = n323[g21].texture).baseTexture.uid;
            if (!S8[N]) {
                if (!(K2 = u105.pop())) {
                    var M5 = new Ih, D5 = void 0, C3 = void 0;
                    "none" === e814.distanceFieldType ? (D5 = new Sh(ki.EMPTY), C3 = se.NORMAL) : (D5 = new Sh(ki.EMPTY, {
                        program: kn.from("// Mesh material default fragment\r\nattribute vec2 aVertexPosition;\r\nattribute vec2 aTextureCoord;\r\n\r\nuniform mat3 projectionMatrix;\r\nuniform mat3 translationMatrix;\r\nuniform mat3 uTextureMatrix;\r\n\r\nvarying vec2 vTextureCoord;\r\n\r\nvoid main(void)\r\n{\r\n    gl_Position = vec4((projectionMatrix * translationMatrix * vec3(aVertexPosition, 1.0)).xy, 0.0, 1.0);\r\n\r\n    vTextureCoord = (uTextureMatrix * vec3(aTextureCoord, 1.0)).xy;\r\n}\r\n", "// Pixi texture info\r\nvarying vec2 vTextureCoord;\r\nuniform sampler2D uSampler;\r\n\r\n// Tint\r\nuniform vec4 uColor;\r\n\r\n// on 2D applications fwidth is screenScale / glyphAtlasScale * distanceFieldRange\r\nuniform float uFWidth;\r\n\r\nvoid main(void) {\r\n\r\n  // To stack MSDF and SDF we need a non-pre-multiplied-alpha texture.\r\n  vec4 texColor = texture2D(uSampler, vTextureCoord);\r\n\r\n  // MSDF\r\n  float median = texColor.r + texColor.g + texColor.b -\r\n                  min(texColor.r, min(texColor.g, texColor.b)) -\r\n                  max(texColor.r, max(texColor.g, texColor.b));\r\n  // SDF\r\n  median = min(median, texColor.a);\r\n\r\n  float screenPxDistance = uFWidth * (median - 0.5);\r\n  float alpha = clamp(screenPxDistance + 0.5, 0.0, 1.0);\r\n\r\n  // NPM Textures, NPM outputs\r\n  gl_FragColor = vec4(uColor.rgb, uColor.a * alpha);\r\n\r\n}\r\n"),
                        uniforms: {
                            uFWidth: 0
                        }
                    }), C3 = se.NORMAL_NPM);
                    var w3 = new Rh(M5, D5);
                    w3.blendMode = C3, K2 = {
                        index: 0,
                        indexCount: 0,
                        vertexCount: 0,
                        uvsCount: 0,
                        total: 0,
                        mesh: w3,
                        vertices: null,
                        uvs: null,
                        indices: null
                    };
                }
                K2.index = 0, K2.indexCount = 0, K2.vertexCount = 0, K2.uvsCount = 0, K2.total = 0;
                var L2 = this._textureCache;
                L2[N] = L2[N] || new ki(H2.baseTexture), K2.mesh.texture = L2[N], K2.mesh.tint = this._tint, I8.push(K2), S8[N] = K2;
            }
            S8[N].total++;
        }
        for(g21 = 0; g21 < P7.length; g21++)-1 === I8.indexOf(P7[g21]) && this.removeChild(P7[g21].mesh);
        for(g21 = 0; g21 < I8.length; g21++)I8[g21].mesh.parent !== this && this.addChild(I8[g21].mesh);
        for(var g21 in this._activePagesMeshData = I8, S8){
            var F2 = (K2 = S8[g21]).total;
            if (!((null === (t = K2.indices) || void 0 === t ? void 0 : t.length) > 6 * F2) || K2.vertices.length < 2 * Rh.BATCHABLE_SIZE) K2.vertices = new Float32Array(8 * F2), K2.uvs = new Float32Array(8 * F2), K2.indices = new Uint16Array(6 * F2);
            else for(var U2 = K2.total, G2 = K2.vertices, B2 = 4 * U2 * 2; B2 < G2.length; B2++)G2[B2] = 0;
            K2.mesh.size = 6 * F2;
        }
        for(g21 = 0; g21 < O11; g21++){
            var X2, k2 = (X2 = n323[g21]).position.x + R12[X2.line] * ("justify" === this._align ? X2.prevSpaces : 1);
            this._roundPixels && (k2 = Math.round(k2));
            var H2, j2 = k2 * r582, Y2 = X2.position.y * r582, V2 = S8[(H2 = X2.texture).baseTexture.uid], W2 = H2.frame, z2 = H2._uvs, q2 = V2.index++;
            V2.indices[6 * q2 + 0] = 0 + 4 * q2, V2.indices[6 * q2 + 1] = 1 + 4 * q2, V2.indices[6 * q2 + 2] = 2 + 4 * q2, V2.indices[6 * q2 + 3] = 0 + 4 * q2, V2.indices[6 * q2 + 4] = 2 + 4 * q2, V2.indices[6 * q2 + 5] = 3 + 4 * q2, V2.vertices[8 * q2 + 0] = j2, V2.vertices[8 * q2 + 1] = Y2, V2.vertices[8 * q2 + 2] = j2 + W2.width * r582, V2.vertices[8 * q2 + 3] = Y2, V2.vertices[8 * q2 + 4] = j2 + W2.width * r582, V2.vertices[8 * q2 + 5] = Y2 + W2.height * r582, V2.vertices[8 * q2 + 6] = j2, V2.vertices[8 * q2 + 7] = Y2 + W2.height * r582, V2.uvs[8 * q2 + 0] = z2.x0, V2.uvs[8 * q2 + 1] = z2.y0, V2.uvs[8 * q2 + 2] = z2.x1, V2.uvs[8 * q2 + 3] = z2.y1, V2.uvs[8 * q2 + 4] = z2.x2, V2.uvs[8 * q2 + 5] = z2.y2, V2.uvs[8 * q2 + 6] = z2.x3, V2.uvs[8 * q2 + 7] = z2.y3;
        }
        for(var g21 in this._textWidth = d70 * r582, this._textHeight = (i428.y + e814.lineHeight) * r582, S8){
            var K2 = S8[g21];
            if (0 !== this.anchor.x || 0 !== this.anchor.y) for(var Z = 0, J2 = this._textWidth * this.anchor.x, Q1 = this._textHeight * this.anchor.y, $1 = 0; $1 < K2.total; $1++)K2.vertices[Z++] -= J2, K2.vertices[Z++] -= Q1, K2.vertices[Z++] -= J2, K2.vertices[Z++] -= Q1, K2.vertices[Z++] -= J2, K2.vertices[Z++] -= Q1, K2.vertices[Z++] -= J2, K2.vertices[Z++] -= Q1;
            this._maxLineHeight = v27 * r582;
            var tt1 = K2.mesh.geometry.getBuffer("aVertexPosition"), et1 = K2.mesh.geometry.getBuffer("aTextureCoord"), rt1 = K2.mesh.geometry.getIndex();
            tt1.data = K2.vertices, et1.data = K2.uvs, rt1.data = K2.indices, tt1.update(), et1.update(), rt1.update();
        }
        for(g21 = 0; g21 < n323.length; g21++)Hh.push(n323[g21]);
    }, e812.prototype.updateTransform = function() {
        this.validate(), this.containerUpdateTransform();
    }, e812.prototype._render = function(e815) {
        var r583 = Bh.available[this._fontName], i429 = r583.distanceFieldRange, n324 = r583.distanceFieldType, o256 = r583.size;
        if ("none" !== n324) for(var s189 = this.worldTransform, a158 = s189.a, h126 = s189.b, u106 = s189.c, l91 = s189.d, c74 = Math.sqrt(a158 * a158 + h126 * h126), d71 = Math.sqrt(u106 * u106 + l91 * l91), f = (Math.abs(c74) + Math.abs(d71)) / 2, p = this._fontSize / o256, _35 = 0, m30 = this._activePagesMeshData; _35 < m30.length; _35++)m30[_35].mesh.shader.uniforms.uFWidth = f * i429 * p * e815.resolution;
        t526.prototype._render.call(this, e815);
    }, e812.prototype.getLocalBounds = function() {
        return this.validate(), t526.prototype.getLocalBounds.call(this);
    }, e812.prototype.validate = function() {
        this.dirty && (this.updateText(), this.dirty = !1);
    }, Object.defineProperty(e812.prototype, "tint", {
        get: function() {
            return this._tint;
        },
        set: function(t) {
            if (this._tint !== t) {
                this._tint = t;
                for(var e816 = 0; e816 < this._activePagesMeshData.length; e816++)this._activePagesMeshData[e816].mesh.tint = t;
            }
        },
        enumerable: !1,
        configurable: !0
    }), Object.defineProperty(e812.prototype, "align", {
        get: function() {
            return this._align;
        },
        set: function(t) {
            this._align !== t && (this._align = t, this.dirty = !0);
        },
        enumerable: !1,
        configurable: !0
    }), Object.defineProperty(e812.prototype, "fontName", {
        get: function() {
            return this._fontName;
        },
        set: function(t) {
            if (!Bh.available[t]) throw new Error('Missing BitmapFont "' + t + '"');
            this._fontName !== t && (this._fontName = t, this.dirty = !0);
        },
        enumerable: !1,
        configurable: !0
    }), Object.defineProperty(e812.prototype, "fontSize", {
        get: function() {
            return this._fontSize;
        },
        set: function(t) {
            this._fontSize !== t && (this._fontSize = t, this.dirty = !0);
        },
        enumerable: !1,
        configurable: !0
    }), Object.defineProperty(e812.prototype, "anchor", {
        get: function() {
            return this._anchor;
        },
        set: function(t) {
            "number" == typeof t ? this._anchor.set(t) : this._anchor.copyFrom(t);
        },
        enumerable: !1,
        configurable: !0
    }), Object.defineProperty(e812.prototype, "text", {
        get: function() {
            return this._text;
        },
        set: function(t) {
            t = String(null == t ? "" : t), this._text !== t && (this._text = t, this.dirty = !0);
        },
        enumerable: !1,
        configurable: !0
    }), Object.defineProperty(e812.prototype, "maxWidth", {
        get: function() {
            return this._maxWidth;
        },
        set: function(t) {
            this._maxWidth !== t && (this._maxWidth = t, this.dirty = !0);
        },
        enumerable: !1,
        configurable: !0
    }), Object.defineProperty(e812.prototype, "maxLineHeight", {
        get: function() {
            return this.validate(), this._maxLineHeight;
        },
        enumerable: !1,
        configurable: !0
    }), Object.defineProperty(e812.prototype, "textWidth", {
        get: function() {
            return this.validate(), this._textWidth;
        },
        enumerable: !1,
        configurable: !0
    }), Object.defineProperty(e812.prototype, "letterSpacing", {
        get: function() {
            return this._letterSpacing;
        },
        set: function(t) {
            this._letterSpacing !== t && (this._letterSpacing = t, this.dirty = !0);
        },
        enumerable: !1,
        configurable: !0
    }), Object.defineProperty(e812.prototype, "roundPixels", {
        get: function() {
            return this._roundPixels;
        },
        set: function(t) {
            t !== this._roundPixels && (this._roundPixels = t, this.dirty = !0);
        },
        enumerable: !1,
        configurable: !0
    }), Object.defineProperty(e812.prototype, "textHeight", {
        get: function() {
            return this.validate(), this._textHeight;
        },
        enumerable: !1,
        configurable: !0
    }), e812.prototype.destroy = function(e817) {
        var r584 = this._textureCache;
        for(var i in r584)r584[i].destroy(), delete r584[i];
        this._textureCache = null, t526.prototype.destroy.call(this, e817);
    }, e812.styleDefaults = {
        align: "left",
        tint: 16777215,
        maxWidth: 0,
        letterSpacing: 0
    }, e812;
}(Zr), Yh = function() {
    function t527() {
    }
    return t527.add = function() {
        ds.setExtensionXhrType("fnt", ds.XHR_RESPONSE_TYPE.TEXT);
    }, t527.use = function(e818, r585) {
        var i430 = Lh(e818.data);
        if (i430) for(var n325 = t527.getBaseUrl(this, e818), o257 = i430.parse(e818.data), s190 = {
        }, a159 = function(t) {
            s190[t.metadata.pageFile] = t.texture, Object.keys(s190).length === o257.page.length && (e818.bitmapFont = Bh.install(o257, s190, !0), r585());
        }, h127 = 0; h127 < o257.page.length; ++h127){
            var u107 = o257.page[h127].file, l92 = n325 + u107, c75 = !1;
            for(var d in this.resources){
                var f = this.resources[d];
                if (f.url === l92) {
                    f.metadata.pageFile = u107, f.texture ? a159(f) : f.onAfterMiddleware.add(a159), c75 = !0;
                    break;
                }
            }
            if (!c75) {
                var p = {
                    crossOrigin: e818.crossOrigin,
                    loadType: ds.LOAD_TYPE.IMAGE,
                    metadata: Object.assign({
                        pageFile: u107
                    }, e818.metadata.imageMetadata),
                    parentResource: e818
                };
                this.add(l92, p, a159);
            }
        }
        else r585();
    }, t527.getBaseUrl = function(e819, r586) {
        var i431 = r586.isDataUrl ? "" : t527.dirname(r586.url);
        return r586.isDataUrl && ("." === i431 && (i431 = ""), e819.baseUrl && i431 && "/" === e819.baseUrl.charAt(e819.baseUrl.length - 1) && (i431 += "/")), (i431 = i431.replace(e819.baseUrl, "")) && "/" !== i431.charAt(i431.length - 1) && (i431 += "/"), i431;
    }, t527.dirname = function(t) {
        var e820 = t.replace(/\\/g, "/").replace(/\/$/, "").replace(/\/[^\/]*$/, "");
        return e820 === t ? "." : "" === e820 ? "/" : e820;
    }, t527;
}(), Vh = function(t528, e821) {
    return (Vh = Object.setPrototypeOf || ({
        __proto__: []
    }) instanceof Array && function(t, e822) {
        t.__proto__ = e822;
    } || function(t, e823) {
        for(var r587 in e823)e823.hasOwnProperty(r587) && (t[r587] = e823[r587]);
    })(t528, e821);
}, Wh = "varying vec2 vTextureCoord;\n\nuniform sampler2D uSampler;\nuniform float uAlpha;\n\nvoid main(void)\n{\n   gl_FragColor = texture2D(uSampler, vTextureCoord) * uAlpha;\n}\n", zh = function(t529) {
    function e824(e825) {
        void 0 === e825 && (e825 = 1);
        var r588 = t529.call(this, Lo, Wh, {
            uAlpha: 1
        }) || this;
        return r588.alpha = e825, r588;
    }
    return (function(t, e826) {
        function r589() {
            this.constructor = t;
        }
        Vh(t, e826), t.prototype = null === e826 ? Object.create(e826) : (r589.prototype = e826.prototype, new r589);
    })(e824, t529), Object.defineProperty(e824.prototype, "alpha", {
        get: function() {
            return this.uniforms.uAlpha;
        },
        set: function(t) {
            this.uniforms.uAlpha = t;
        },
        enumerable: !1,
        configurable: !0
    }), e824;
}(Yn), qh = function(t530, e827) {
    return (qh = Object.setPrototypeOf || ({
        __proto__: []
    }) instanceof Array && function(t, e828) {
        t.__proto__ = e828;
    } || function(t, e829) {
        for(var r590 in e829)e829.hasOwnProperty(r590) && (t[r590] = e829[r590]);
    })(t530, e827);
};
function Kh(t, e830) {
    function r591() {
        this.constructor = t;
    }
    qh(t, e830), t.prototype = null === e830 ? Object.create(e830) : (r591.prototype = e830.prototype, new r591);
}
var Zh, Jh, Qh, $h, tu, eu, ru, iu, nu, ou, su, au, hu, uu, lu, cu, du, fu, pu, _u = "\n    attribute vec2 aVertexPosition;\n\n    uniform mat3 projectionMatrix;\n\n    uniform float strength;\n\n    varying vec2 vBlurTexCoords[%size%];\n\n    uniform vec4 inputSize;\n    uniform vec4 outputFrame;\n\n    vec4 filterVertexPosition( void )\n    {\n        vec2 position = aVertexPosition * max(outputFrame.zw, vec2(0.)) + outputFrame.xy;\n\n        return vec4((projectionMatrix * vec3(position, 1.0)).xy, 0.0, 1.0);\n    }\n\n    vec2 filterTextureCoord( void )\n    {\n        return aVertexPosition * (outputFrame.zw * inputSize.zw);\n    }\n\n    void main(void)\n    {\n        gl_Position = filterVertexPosition();\n\n        vec2 textureCoord = filterTextureCoord();\n        %blur%\n    }", mu = {
    5: [
        0.153388,
        0.221461,
        0.250301
    ],
    7: [
        0.071303,
        0.131514,
        0.189879,
        0.214607
    ],
    9: [
        0.028532,
        0.067234,
        0.124009,
        0.179044,
        0.20236
    ],
    11: [
        0.0093,
        0.028002,
        0.065984,
        0.121703,
        0.175713,
        0.198596
    ],
    13: [
        0.002406,
        0.009255,
        0.027867,
        0.065666,
        0.121117,
        0.174868,
        0.197641
    ],
    15: [
        0.000489,
        0.002403,
        0.009246,
        0.02784,
        0.065602,
        0.120999,
        0.174697,
        0.197448
    ]
}, vu = [
    "varying vec2 vBlurTexCoords[%size%];",
    "uniform sampler2D uSampler;",
    "void main(void)",
    "{",
    "    gl_FragColor = vec4(0.0);",
    "    %blur%",
    "}"
].join("\n");
!function(t) {
    t[t.WEBGL_LEGACY = 0] = "WEBGL_LEGACY", t[t.WEBGL = 1] = "WEBGL", t[t.WEBGL2 = 2] = "WEBGL2";
}(Zh || (Zh = {
})), (function(t) {
    t[t.UNKNOWN = 0] = "UNKNOWN", t[t.WEBGL = 1] = "WEBGL", t[t.CANVAS = 2] = "CANVAS";
})(Jh || (Jh = {
})), (function(t) {
    t[t.COLOR = 16384] = "COLOR", t[t.DEPTH = 256] = "DEPTH", t[t.STENCIL = 1024] = "STENCIL";
})(Qh || (Qh = {
})), (function(t) {
    t[t.NORMAL = 0] = "NORMAL", t[t.ADD = 1] = "ADD", t[t.MULTIPLY = 2] = "MULTIPLY", t[t.SCREEN = 3] = "SCREEN", t[t.OVERLAY = 4] = "OVERLAY", t[t.DARKEN = 5] = "DARKEN", t[t.LIGHTEN = 6] = "LIGHTEN", t[t.COLOR_DODGE = 7] = "COLOR_DODGE", t[t.COLOR_BURN = 8] = "COLOR_BURN", t[t.HARD_LIGHT = 9] = "HARD_LIGHT", t[t.SOFT_LIGHT = 10] = "SOFT_LIGHT", t[t.DIFFERENCE = 11] = "DIFFERENCE", t[t.EXCLUSION = 12] = "EXCLUSION", t[t.HUE = 13] = "HUE", t[t.SATURATION = 14] = "SATURATION", t[t.COLOR = 15] = "COLOR", t[t.LUMINOSITY = 16] = "LUMINOSITY", t[t.NORMAL_NPM = 17] = "NORMAL_NPM", t[t.ADD_NPM = 18] = "ADD_NPM", t[t.SCREEN_NPM = 19] = "SCREEN_NPM", t[t.NONE = 20] = "NONE", t[t.SRC_OVER = 0] = "SRC_OVER", t[t.SRC_IN = 21] = "SRC_IN", t[t.SRC_OUT = 22] = "SRC_OUT", t[t.SRC_ATOP = 23] = "SRC_ATOP", t[t.DST_OVER = 24] = "DST_OVER", t[t.DST_IN = 25] = "DST_IN", t[t.DST_OUT = 26] = "DST_OUT", t[t.DST_ATOP = 27] = "DST_ATOP", t[t.ERASE = 26] = "ERASE", t[t.SUBTRACT = 28] = "SUBTRACT", t[t.XOR = 29] = "XOR";
})($h || ($h = {
})), (function(t) {
    t[t.POINTS = 0] = "POINTS", t[t.LINES = 1] = "LINES", t[t.LINE_LOOP = 2] = "LINE_LOOP", t[t.LINE_STRIP = 3] = "LINE_STRIP", t[t.TRIANGLES = 4] = "TRIANGLES", t[t.TRIANGLE_STRIP = 5] = "TRIANGLE_STRIP", t[t.TRIANGLE_FAN = 6] = "TRIANGLE_FAN";
})(tu || (tu = {
})), (function(t) {
    t[t.RGBA = 6408] = "RGBA", t[t.RGB = 6407] = "RGB", t[t.RG = 33319] = "RG", t[t.RED = 6403] = "RED", t[t.RGBA_INTEGER = 36249] = "RGBA_INTEGER", t[t.RGB_INTEGER = 36248] = "RGB_INTEGER", t[t.RG_INTEGER = 33320] = "RG_INTEGER", t[t.RED_INTEGER = 36244] = "RED_INTEGER", t[t.ALPHA = 6406] = "ALPHA", t[t.LUMINANCE = 6409] = "LUMINANCE", t[t.LUMINANCE_ALPHA = 6410] = "LUMINANCE_ALPHA", t[t.DEPTH_COMPONENT = 6402] = "DEPTH_COMPONENT", t[t.DEPTH_STENCIL = 34041] = "DEPTH_STENCIL";
})(eu || (eu = {
})), (function(t) {
    t[t.TEXTURE_2D = 3553] = "TEXTURE_2D", t[t.TEXTURE_CUBE_MAP = 34067] = "TEXTURE_CUBE_MAP", t[t.TEXTURE_2D_ARRAY = 35866] = "TEXTURE_2D_ARRAY", t[t.TEXTURE_CUBE_MAP_POSITIVE_X = 34069] = "TEXTURE_CUBE_MAP_POSITIVE_X", t[t.TEXTURE_CUBE_MAP_NEGATIVE_X = 34070] = "TEXTURE_CUBE_MAP_NEGATIVE_X", t[t.TEXTURE_CUBE_MAP_POSITIVE_Y = 34071] = "TEXTURE_CUBE_MAP_POSITIVE_Y", t[t.TEXTURE_CUBE_MAP_NEGATIVE_Y = 34072] = "TEXTURE_CUBE_MAP_NEGATIVE_Y", t[t.TEXTURE_CUBE_MAP_POSITIVE_Z = 34073] = "TEXTURE_CUBE_MAP_POSITIVE_Z", t[t.TEXTURE_CUBE_MAP_NEGATIVE_Z = 34074] = "TEXTURE_CUBE_MAP_NEGATIVE_Z";
})(ru || (ru = {
})), (function(t) {
    t[t.UNSIGNED_BYTE = 5121] = "UNSIGNED_BYTE", t[t.UNSIGNED_SHORT = 5123] = "UNSIGNED_SHORT", t[t.UNSIGNED_SHORT_5_6_5 = 33635] = "UNSIGNED_SHORT_5_6_5", t[t.UNSIGNED_SHORT_4_4_4_4 = 32819] = "UNSIGNED_SHORT_4_4_4_4", t[t.UNSIGNED_SHORT_5_5_5_1 = 32820] = "UNSIGNED_SHORT_5_5_5_1", t[t.UNSIGNED_INT = 5125] = "UNSIGNED_INT", t[t.UNSIGNED_INT_10F_11F_11F_REV = 35899] = "UNSIGNED_INT_10F_11F_11F_REV", t[t.UNSIGNED_INT_2_10_10_10_REV = 33640] = "UNSIGNED_INT_2_10_10_10_REV", t[t.UNSIGNED_INT_24_8 = 34042] = "UNSIGNED_INT_24_8", t[t.UNSIGNED_INT_5_9_9_9_REV = 35902] = "UNSIGNED_INT_5_9_9_9_REV", t[t.BYTE = 5120] = "BYTE", t[t.SHORT = 5122] = "SHORT", t[t.INT = 5124] = "INT", t[t.FLOAT = 5126] = "FLOAT", t[t.FLOAT_32_UNSIGNED_INT_24_8_REV = 36269] = "FLOAT_32_UNSIGNED_INT_24_8_REV", t[t.HALF_FLOAT = 36193] = "HALF_FLOAT";
})(iu || (iu = {
})), (function(t) {
    t[t.FLOAT = 0] = "FLOAT", t[t.INT = 1] = "INT", t[t.UINT = 2] = "UINT";
})(nu || (nu = {
})), (function(t) {
    t[t.NEAREST = 0] = "NEAREST", t[t.LINEAR = 1] = "LINEAR";
})(ou || (ou = {
})), (function(t) {
    t[t.CLAMP = 33071] = "CLAMP", t[t.REPEAT = 10497] = "REPEAT", t[t.MIRRORED_REPEAT = 33648] = "MIRRORED_REPEAT";
})(su || (su = {
})), (function(t) {
    t[t.OFF = 0] = "OFF", t[t.POW2 = 1] = "POW2", t[t.ON = 2] = "ON", t[t.ON_MANUAL = 3] = "ON_MANUAL";
})(au || (au = {
})), (function(t) {
    t[t.NPM = 0] = "NPM", t[t.UNPACK = 1] = "UNPACK", t[t.PMA = 2] = "PMA", t[t.NO_PREMULTIPLIED_ALPHA = 0] = "NO_PREMULTIPLIED_ALPHA", t[t.PREMULTIPLY_ON_UPLOAD = 1] = "PREMULTIPLY_ON_UPLOAD", t[t.PREMULTIPLY_ALPHA = 2] = "PREMULTIPLY_ALPHA", t[t.PREMULTIPLIED_ALPHA = 2] = "PREMULTIPLIED_ALPHA";
})(hu || (hu = {
})), (function(t) {
    t[t.NO = 0] = "NO", t[t.YES = 1] = "YES", t[t.AUTO = 2] = "AUTO", t[t.BLEND = 0] = "BLEND", t[t.CLEAR = 1] = "CLEAR", t[t.BLIT = 2] = "BLIT";
})(uu || (uu = {
})), (function(t) {
    t[t.AUTO = 0] = "AUTO", t[t.MANUAL = 1] = "MANUAL";
})(lu || (lu = {
})), (function(t) {
    t.LOW = "lowp", t.MEDIUM = "mediump", t.HIGH = "highp";
})(cu || (cu = {
})), (function(t) {
    t[t.NONE = 0] = "NONE", t[t.SCISSOR = 1] = "SCISSOR", t[t.STENCIL = 2] = "STENCIL", t[t.SPRITE = 3] = "SPRITE";
})(du || (du = {
})), (function(t) {
    t[t.NONE = 0] = "NONE", t[t.LOW = 2] = "LOW", t[t.MEDIUM = 4] = "MEDIUM", t[t.HIGH = 8] = "HIGH";
})(fu || (fu = {
})), (function(t) {
    t[t.ELEMENT_ARRAY_BUFFER = 34963] = "ELEMENT_ARRAY_BUFFER", t[t.ARRAY_BUFFER = 34962] = "ARRAY_BUFFER", t[t.UNIFORM_BUFFER = 35345] = "UNIFORM_BUFFER";
})(pu || (pu = {
}));
var yu = function(t531) {
    function e831(e832, r592, i432, n326, o258) {
        void 0 === r592 && (r592 = 8), void 0 === i432 && (i432 = 4), void 0 === n326 && (n326 = et.FILTER_RESOLUTION), void 0 === o258 && (o258 = 5);
        var s191 = this, a160 = function(t, e833) {
            var r593, i433 = Math.ceil(t / 2), n327 = _u, o259 = "";
            r593 = e833 ? "vBlurTexCoords[%index%] =  textureCoord + vec2(%sampleIndex% * strength, 0.0);" : "vBlurTexCoords[%index%] =  textureCoord + vec2(0.0, %sampleIndex% * strength);";
            for(var s192 = 0; s192 < t; s192++){
                var a161 = r593.replace("%index%", s192.toString());
                o259 += a161 = a161.replace("%sampleIndex%", s192 - (i433 - 1) + ".0"), o259 += "\n";
            }
            return (n327 = n327.replace("%blur%", o259)).replace("%size%", t.toString());
        }(o258, e832), h128 = function(t) {
            for(var e834, r594 = mu[t], i434 = r594.length, n328 = vu, o260 = "", s193 = 0; s193 < t; s193++){
                var a162 = "gl_FragColor += texture2D(uSampler, vBlurTexCoords[%index%]) * %value%;".replace("%index%", s193.toString());
                e834 = s193, s193 >= i434 && (e834 = t - s193 - 1), o260 += a162 = a162.replace("%value%", r594[e834].toString()), o260 += "\n";
            }
            return (n328 = n328.replace("%blur%", o260)).replace("%size%", t.toString());
        }(o258);
        return (s191 = t531.call(this, a160, h128) || this).horizontal = e832, s191.resolution = n326, s191._quality = 0, s191.quality = i432, s191.blur = r592, s191;
    }
    return Kh(e831, t531), e831.prototype.apply = function(t, e835, r595, i435) {
        if (r595 ? this.horizontal ? this.uniforms.strength = 1 / r595.width * (r595.width / e835.width) : this.uniforms.strength = 1 / r595.height * (r595.height / e835.height) : this.horizontal ? this.uniforms.strength = 1 / t.renderer.width * (t.renderer.width / e835.width) : this.uniforms.strength = 1 / t.renderer.height * (t.renderer.height / e835.height), this.uniforms.strength *= this.strength, this.uniforms.strength /= this.passes, 1 === this.passes) t.applyFilter(this, e835, r595, i435);
        else {
            var n329 = t.getFilterTexture(), o261 = t.renderer, s194 = e835, a163 = n329;
            this.state.blend = !1, t.applyFilter(this, s194, a163, uu.CLEAR);
            for(var h129 = 1; h129 < this.passes - 1; h129++){
                t.bindAndClear(s194, uu.BLIT), this.uniforms.uSampler = a163;
                var u108 = a163;
                a163 = s194, s194 = u108, o261.shader.bind(this), o261.geometry.draw(5);
            }
            this.state.blend = !0, t.applyFilter(this, a163, r595, i435), t.returnFilterTexture(n329);
        }
    }, Object.defineProperty(e831.prototype, "blur", {
        get: function() {
            return this.strength;
        },
        set: function(t) {
            this.padding = 1 + 2 * Math.abs(t), this.strength = t;
        },
        enumerable: !1,
        configurable: !0
    }), Object.defineProperty(e831.prototype, "quality", {
        get: function() {
            return this._quality;
        },
        set: function(t) {
            this._quality = t, this.passes = t;
        },
        enumerable: !1,
        configurable: !0
    }), e831;
}(Yn), gu = function(t532) {
    function e836(e837, r596, i436, n330) {
        void 0 === e837 && (e837 = 8), void 0 === r596 && (r596 = 4), void 0 === i436 && (i436 = et.FILTER_RESOLUTION), void 0 === n330 && (n330 = 5);
        var o262 = t532.call(this) || this;
        return o262.blurXFilter = new yu(!0, e837, r596, i436, n330), o262.blurYFilter = new yu(!1, e837, r596, i436, n330), o262.resolution = i436, o262.quality = r596, o262.blur = e837, o262.repeatEdgePixels = !1, o262;
    }
    return Kh(e836, t532), e836.prototype.apply = function(t, e838, r597, i437) {
        var n331 = Math.abs(this.blurXFilter.strength), o263 = Math.abs(this.blurYFilter.strength);
        if (n331 && o263) {
            var s195 = t.getFilterTexture();
            this.blurXFilter.apply(t, e838, s195, uu.CLEAR), this.blurYFilter.apply(t, s195, r597, i437), t.returnFilterTexture(s195);
        } else o263 ? this.blurYFilter.apply(t, e838, r597, i437) : this.blurXFilter.apply(t, e838, r597, i437);
    }, e836.prototype.updatePadding = function() {
        this._repeatEdgePixels ? this.padding = 0 : this.padding = 2 * Math.max(Math.abs(this.blurXFilter.strength), Math.abs(this.blurYFilter.strength));
    }, Object.defineProperty(e836.prototype, "blur", {
        get: function() {
            return this.blurXFilter.blur;
        },
        set: function(t) {
            this.blurXFilter.blur = this.blurYFilter.blur = t, this.updatePadding();
        },
        enumerable: !1,
        configurable: !0
    }), Object.defineProperty(e836.prototype, "quality", {
        get: function() {
            return this.blurXFilter.quality;
        },
        set: function(t) {
            this.blurXFilter.quality = this.blurYFilter.quality = t;
        },
        enumerable: !1,
        configurable: !0
    }), Object.defineProperty(e836.prototype, "blurX", {
        get: function() {
            return this.blurXFilter.blur;
        },
        set: function(t) {
            this.blurXFilter.blur = t, this.updatePadding();
        },
        enumerable: !1,
        configurable: !0
    }), Object.defineProperty(e836.prototype, "blurY", {
        get: function() {
            return this.blurYFilter.blur;
        },
        set: function(t) {
            this.blurYFilter.blur = t, this.updatePadding();
        },
        enumerable: !1,
        configurable: !0
    }), Object.defineProperty(e836.prototype, "blendMode", {
        get: function() {
            return this.blurYFilter.blendMode;
        },
        set: function(t) {
            this.blurYFilter.blendMode = t;
        },
        enumerable: !1,
        configurable: !0
    }), Object.defineProperty(e836.prototype, "repeatEdgePixels", {
        get: function() {
            return this._repeatEdgePixels;
        },
        set: function(t) {
            this._repeatEdgePixels = t, this.updatePadding();
        },
        enumerable: !1,
        configurable: !0
    }), e836;
}(Yn), Eu = function(t533, e839) {
    return (Eu = Object.setPrototypeOf || ({
        __proto__: []
    }) instanceof Array && function(t, e840) {
        t.__proto__ = e840;
    } || function(t, e841) {
        for(var r598 in e841)e841.hasOwnProperty(r598) && (t[r598] = e841[r598]);
    })(t533, e839);
}, Tu = "varying vec2 vTextureCoord;\nuniform sampler2D uSampler;\nuniform float m[20];\nuniform float uAlpha;\n\nvoid main(void)\n{\n    vec4 c = texture2D(uSampler, vTextureCoord);\n\n    if (uAlpha == 0.0) {\n        gl_FragColor = c;\n        return;\n    }\n\n    // Un-premultiply alpha before applying the color matrix. See issue #3539.\n    if (c.a > 0.0) {\n      c.rgb /= c.a;\n    }\n\n    vec4 result;\n\n    result.r = (m[0] * c.r);\n        result.r += (m[1] * c.g);\n        result.r += (m[2] * c.b);\n        result.r += (m[3] * c.a);\n        result.r += m[4];\n\n    result.g = (m[5] * c.r);\n        result.g += (m[6] * c.g);\n        result.g += (m[7] * c.b);\n        result.g += (m[8] * c.a);\n        result.g += m[9];\n\n    result.b = (m[10] * c.r);\n       result.b += (m[11] * c.g);\n       result.b += (m[12] * c.b);\n       result.b += (m[13] * c.a);\n       result.b += m[14];\n\n    result.a = (m[15] * c.r);\n       result.a += (m[16] * c.g);\n       result.a += (m[17] * c.b);\n       result.a += (m[18] * c.a);\n       result.a += m[19];\n\n    vec3 rgb = mix(c.rgb, result.rgb, uAlpha);\n\n    // Premultiply alpha again.\n    rgb *= result.a;\n\n    gl_FragColor = vec4(rgb, result.a);\n}\n", bu = function(t534) {
    function e842() {
        var e843 = this, r599 = {
            m: new Float32Array([
                1,
                0,
                0,
                0,
                0,
                0,
                1,
                0,
                0,
                0,
                0,
                0,
                1,
                0,
                0,
                0,
                0,
                0,
                1,
                0
            ]),
            uAlpha: 1
        };
        return (e843 = t534.call(this, Fo, Tu, r599) || this).alpha = 1, e843;
    }
    return (function(t, e844) {
        function r600() {
            this.constructor = t;
        }
        Eu(t, e844), t.prototype = null === e844 ? Object.create(e844) : (r600.prototype = e844.prototype, new r600);
    })(e842, t534), e842.prototype._loadMatrix = function(t, e845) {
        void 0 === e845 && (e845 = !1);
        var r601 = t;
        e845 && (this._multiply(r601, this.uniforms.m, t), r601 = this._colorMatrix(r601)), this.uniforms.m = r601;
    }, e842.prototype._multiply = function(t, e846, r602) {
        return t[0] = e846[0] * r602[0] + e846[1] * r602[5] + e846[2] * r602[10] + e846[3] * r602[15], t[1] = e846[0] * r602[1] + e846[1] * r602[6] + e846[2] * r602[11] + e846[3] * r602[16], t[2] = e846[0] * r602[2] + e846[1] * r602[7] + e846[2] * r602[12] + e846[3] * r602[17], t[3] = e846[0] * r602[3] + e846[1] * r602[8] + e846[2] * r602[13] + e846[3] * r602[18], t[4] = e846[0] * r602[4] + e846[1] * r602[9] + e846[2] * r602[14] + e846[3] * r602[19] + e846[4], t[5] = e846[5] * r602[0] + e846[6] * r602[5] + e846[7] * r602[10] + e846[8] * r602[15], t[6] = e846[5] * r602[1] + e846[6] * r602[6] + e846[7] * r602[11] + e846[8] * r602[16], t[7] = e846[5] * r602[2] + e846[6] * r602[7] + e846[7] * r602[12] + e846[8] * r602[17], t[8] = e846[5] * r602[3] + e846[6] * r602[8] + e846[7] * r602[13] + e846[8] * r602[18], t[9] = e846[5] * r602[4] + e846[6] * r602[9] + e846[7] * r602[14] + e846[8] * r602[19] + e846[9], t[10] = e846[10] * r602[0] + e846[11] * r602[5] + e846[12] * r602[10] + e846[13] * r602[15], t[11] = e846[10] * r602[1] + e846[11] * r602[6] + e846[12] * r602[11] + e846[13] * r602[16], t[12] = e846[10] * r602[2] + e846[11] * r602[7] + e846[12] * r602[12] + e846[13] * r602[17], t[13] = e846[10] * r602[3] + e846[11] * r602[8] + e846[12] * r602[13] + e846[13] * r602[18], t[14] = e846[10] * r602[4] + e846[11] * r602[9] + e846[12] * r602[14] + e846[13] * r602[19] + e846[14], t[15] = e846[15] * r602[0] + e846[16] * r602[5] + e846[17] * r602[10] + e846[18] * r602[15], t[16] = e846[15] * r602[1] + e846[16] * r602[6] + e846[17] * r602[11] + e846[18] * r602[16], t[17] = e846[15] * r602[2] + e846[16] * r602[7] + e846[17] * r602[12] + e846[18] * r602[17], t[18] = e846[15] * r602[3] + e846[16] * r602[8] + e846[17] * r602[13] + e846[18] * r602[18], t[19] = e846[15] * r602[4] + e846[16] * r602[9] + e846[17] * r602[14] + e846[18] * r602[19] + e846[19], t;
    }, e842.prototype._colorMatrix = function(t) {
        var e847 = new Float32Array(t);
        return e847[4] /= 255, e847[9] /= 255, e847[14] /= 255, e847[19] /= 255, e847;
    }, e842.prototype.brightness = function(t, e848) {
        var r603 = [
            t,
            0,
            0,
            0,
            0,
            0,
            t,
            0,
            0,
            0,
            0,
            0,
            t,
            0,
            0,
            0,
            0,
            0,
            1,
            0
        ];
        this._loadMatrix(r603, e848);
    }, e842.prototype.tint = function(t, e849) {
        var r604 = [
            (t >> 16 & 255) / 255,
            0,
            0,
            0,
            0,
            0,
            (t >> 8 & 255) / 255,
            0,
            0,
            0,
            0,
            0,
            (255 & t) / 255,
            0,
            0,
            0,
            0,
            0,
            1,
            0
        ];
        this._loadMatrix(r604, e849);
    }, e842.prototype.greyscale = function(t, e850) {
        var r605 = [
            t,
            t,
            t,
            0,
            0,
            t,
            t,
            t,
            0,
            0,
            t,
            t,
            t,
            0,
            0,
            0,
            0,
            0,
            1,
            0
        ];
        this._loadMatrix(r605, e850);
    }, e842.prototype.blackAndWhite = function(t) {
        this._loadMatrix([
            0.3,
            0.6,
            0.1,
            0,
            0,
            0.3,
            0.6,
            0.1,
            0,
            0,
            0.3,
            0.6,
            0.1,
            0,
            0,
            0,
            0,
            0,
            1,
            0
        ], t);
    }, e842.prototype.hue = function(t, e851) {
        t = (t || 0) / 180 * Math.PI;
        var r606 = Math.cos(t), i438 = Math.sin(t), n332 = 1 / 3, o264 = (0, Math.sqrt)(n332), s196 = [
            r606 + (1 - r606) * n332,
            n332 * (1 - r606) - o264 * i438,
            n332 * (1 - r606) + o264 * i438,
            0,
            0,
            n332 * (1 - r606) + o264 * i438,
            r606 + n332 * (1 - r606),
            n332 * (1 - r606) - o264 * i438,
            0,
            0,
            n332 * (1 - r606) - o264 * i438,
            n332 * (1 - r606) + o264 * i438,
            r606 + n332 * (1 - r606),
            0,
            0,
            0,
            0,
            0,
            1,
            0
        ];
        this._loadMatrix(s196, e851);
    }, e842.prototype.contrast = function(t, e852) {
        var r607 = (t || 0) + 1, i439 = -0.5 * (r607 - 1), n333 = [
            r607,
            0,
            0,
            0,
            i439,
            0,
            r607,
            0,
            0,
            i439,
            0,
            0,
            r607,
            0,
            i439,
            0,
            0,
            0,
            1,
            0
        ];
        this._loadMatrix(n333, e852);
    }, e842.prototype.saturate = function(t, e853) {
        void 0 === t && (t = 0);
        var r608 = 2 * t / 3 + 1, i440 = -0.5 * (r608 - 1), n334 = [
            r608,
            i440,
            i440,
            0,
            0,
            i440,
            r608,
            i440,
            0,
            0,
            i440,
            i440,
            r608,
            0,
            0,
            0,
            0,
            0,
            1,
            0
        ];
        this._loadMatrix(n334, e853);
    }, e842.prototype.desaturate = function() {
        this.saturate(-1);
    }, e842.prototype.negative = function(t) {
        this._loadMatrix([
            -1,
            0,
            0,
            1,
            0,
            0,
            -1,
            0,
            1,
            0,
            0,
            0,
            -1,
            1,
            0,
            0,
            0,
            0,
            1,
            0
        ], t);
    }, e842.prototype.sepia = function(t) {
        this._loadMatrix([
            0.393,
            0.7689999,
            0.18899999,
            0,
            0,
            0.349,
            0.6859999,
            0.16799999,
            0,
            0,
            0.272,
            0.5339999,
            0.13099999,
            0,
            0,
            0,
            0,
            0,
            1,
            0
        ], t);
    }, e842.prototype.technicolor = function(t) {
        this._loadMatrix([
            1.9125277891456083,
            -0.8545344976951645,
            -0.09155508482755585,
            0,
            11.793603434377337,
            -0.3087833385928097,
            1.7658908555458428,
            -0.10601743074722245,
            0,
            -70.35205161461398,
            -0.231103377548616,
            -0.7501899197440212,
            1.847597816108189,
            0,
            30.950940869491138,
            0,
            0,
            0,
            1,
            0
        ], t);
    }, e842.prototype.polaroid = function(t) {
        this._loadMatrix([
            1.438,
            -0.062,
            -0.062,
            0,
            0,
            -0.122,
            1.378,
            -0.122,
            0,
            0,
            -0.016,
            -0.016,
            1.483,
            0,
            0,
            0,
            0,
            0,
            1,
            0
        ], t);
    }, e842.prototype.toBGR = function(t) {
        this._loadMatrix([
            0,
            0,
            1,
            0,
            0,
            0,
            1,
            0,
            0,
            0,
            1,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            1,
            0
        ], t);
    }, e842.prototype.kodachrome = function(t) {
        this._loadMatrix([
            1.1285582396593525,
            -0.3967382283601348,
            -0.03992559172921793,
            0,
            63.72958762196502,
            -0.16404339962244616,
            1.0835251566291304,
            -0.05498805115633132,
            0,
            24.732407896706203,
            -0.16786010706155763,
            -0.5603416277695248,
            1.6014850761964943,
            0,
            35.62982807460946,
            0,
            0,
            0,
            1,
            0
        ], t);
    }, e842.prototype.browni = function(t) {
        this._loadMatrix([
            0.5997023498159715,
            0.34553243048391263,
            -0.2708298674538042,
            0,
            47.43192855600873,
            -0.037703249837783157,
            0.8609577587992641,
            0.15059552388459913,
            0,
            -36.96841498319127,
            0.24113635128153335,
            -0.07441037908422492,
            0.44972182064877153,
            0,
            -7.562075277591283,
            0,
            0,
            0,
            1,
            0
        ], t);
    }, e842.prototype.vintage = function(t) {
        this._loadMatrix([
            0.6279345635605994,
            0.3202183420819367,
            -0.03965408211312453,
            0,
            9.651285835294123,
            0.02578397704808868,
            0.6441188644374771,
            0.03259127616149294,
            0,
            7.462829176470591,
            0.0466055556782719,
            -0.0851232987247891,
            0.5241648018700465,
            0,
            5.159190588235296,
            0,
            0,
            0,
            1,
            0
        ], t);
    }, e842.prototype.colorTone = function(t, e854, r609, i441, n335) {
        var o265 = ((r609 = r609 || 16770432) >> 16 & 255) / 255, s197 = (r609 >> 8 & 255) / 255, a164 = (255 & r609) / 255, h130 = ((i441 = i441 || 3375104) >> 16 & 255) / 255, u109 = (i441 >> 8 & 255) / 255, l93 = (255 & i441) / 255, c76 = [
            0.3,
            0.59,
            0.11,
            0,
            0,
            o265,
            s197,
            a164,
            t = t || 0.2,
            0,
            h130,
            u109,
            l93,
            e854 = e854 || 0.15,
            0,
            o265 - h130,
            s197 - u109,
            a164 - l93,
            0,
            0
        ];
        this._loadMatrix(c76, n335);
    }, e842.prototype.night = function(t, e855) {
        var r610 = [
            -2 * (t = t || 0.1),
            -t,
            0,
            0,
            0,
            -t,
            0,
            t,
            0,
            0,
            0,
            t,
            2 * t,
            0,
            0,
            0,
            0,
            0,
            1,
            0
        ];
        this._loadMatrix(r610, e855);
    }, e842.prototype.predator = function(t, e856) {
        var r611 = [
            11.224130630493164 * t,
            -4.794486999511719 * t,
            -2.8746118545532227 * t,
            0 * t,
            0.40342438220977783 * t,
            -3.6330697536468506 * t,
            9.193157196044922 * t,
            -2.951810836791992 * t,
            0 * t,
            -1.316135048866272 * t,
            -3.2184197902679443 * t,
            -4.2375030517578125 * t,
            7.476448059082031 * t,
            0 * t,
            0.8044459223747253 * t,
            0,
            0,
            0,
            1,
            0
        ];
        this._loadMatrix(r611, e856);
    }, e842.prototype.lsd = function(t) {
        this._loadMatrix([
            2,
            -0.4,
            0.5,
            0,
            0,
            -0.5,
            2,
            -0.4,
            0,
            0,
            -0.4,
            -0.5,
            3,
            0,
            0,
            0,
            0,
            0,
            1,
            0
        ], t);
    }, e842.prototype.reset = function() {
        this._loadMatrix([
            1,
            0,
            0,
            0,
            0,
            0,
            1,
            0,
            0,
            0,
            0,
            0,
            1,
            0,
            0,
            0,
            0,
            0,
            1,
            0
        ], !1);
    }, Object.defineProperty(e842.prototype, "matrix", {
        get: function() {
            return this.uniforms.m;
        },
        set: function(t) {
            this.uniforms.m = t;
        },
        enumerable: !1,
        configurable: !0
    }), Object.defineProperty(e842.prototype, "alpha", {
        get: function() {
            return this.uniforms.uAlpha;
        },
        set: function(t) {
            this.uniforms.uAlpha = t;
        },
        enumerable: !1,
        configurable: !0
    }), e842;
}(Yn);
bu.prototype.grayscale = bu.prototype.greyscale;
var xu, Ru, Au, Ou, Su, Iu, Pu, Nu, Mu, Du, Cu, wu, Lu, Fu, Uu, Gu, Bu, Xu, ku, Hu = function(t535, e857) {
    return (Hu = Object.setPrototypeOf || ({
        __proto__: []
    }) instanceof Array && function(t, e858) {
        t.__proto__ = e858;
    } || function(t, e859) {
        for(var r612 in e859)e859.hasOwnProperty(r612) && (t[r612] = e859[r612]);
    })(t535, e857);
}, ju = "varying vec2 vFilterCoord;\nvarying vec2 vTextureCoord;\n\nuniform vec2 scale;\nuniform mat2 rotation;\nuniform sampler2D uSampler;\nuniform sampler2D mapSampler;\n\nuniform highp vec4 inputSize;\nuniform vec4 inputClamp;\n\nvoid main(void)\n{\n  vec4 map =  texture2D(mapSampler, vFilterCoord);\n\n  map -= 0.5;\n  map.xy = scale * inputSize.zw * (rotation * map.xy);\n\n  gl_FragColor = texture2D(uSampler, clamp(vec2(vTextureCoord.x + map.x, vTextureCoord.y + map.y), inputClamp.xy, inputClamp.zw));\n}\n", Yu = "attribute vec2 aVertexPosition;\n\nuniform mat3 projectionMatrix;\nuniform mat3 filterMatrix;\n\nvarying vec2 vTextureCoord;\nvarying vec2 vFilterCoord;\n\nuniform vec4 inputSize;\nuniform vec4 outputFrame;\n\nvec4 filterVertexPosition( void )\n{\n    vec2 position = aVertexPosition * max(outputFrame.zw, vec2(0.)) + outputFrame.xy;\n\n    return vec4((projectionMatrix * vec3(position, 1.0)).xy, 0.0, 1.0);\n}\n\nvec2 filterTextureCoord( void )\n{\n    return aVertexPosition * (outputFrame.zw * inputSize.zw);\n}\n\nvoid main(void)\n{\n\tgl_Position = filterVertexPosition();\n\tvTextureCoord = filterTextureCoord();\n\tvFilterCoord = ( filterMatrix * vec3( vTextureCoord, 1.0)  ).xy;\n}\n", Vu = function(t536) {
    function e860(e861, r613) {
        var i442 = this, n336 = new _r;
        return e861.renderable = !1, (i442 = t536.call(this, Yu, ju, {
            mapSampler: e861._texture,
            filterMatrix: n336,
            scale: {
                x: 1,
                y: 1
            },
            rotation: new Float32Array([
                1,
                0,
                0,
                1
            ])
        }) || this).maskSprite = e861, i442.maskMatrix = n336, null == r613 && (r613 = 20), i442.scale = new fr(r613, r613), i442;
    }
    return (function(t, e862) {
        function r614() {
            this.constructor = t;
        }
        Hu(t, e862), t.prototype = null === e862 ? Object.create(e862) : (r614.prototype = e862.prototype, new r614);
    })(e860, t536), e860.prototype.apply = function(t, e863, r615, i443) {
        this.uniforms.filterMatrix = t.calculateSpriteMatrix(this.maskMatrix, this.maskSprite), this.uniforms.scale.x = this.scale.x, this.uniforms.scale.y = this.scale.y;
        var n337 = this.maskSprite.worldTransform, o266 = Math.sqrt(n337.a * n337.a + n337.b * n337.b), s198 = Math.sqrt(n337.c * n337.c + n337.d * n337.d);
        0 !== o266 && 0 !== s198 && (this.uniforms.rotation[0] = n337.a / o266, this.uniforms.rotation[1] = n337.b / o266, this.uniforms.rotation[2] = n337.c / s198, this.uniforms.rotation[3] = n337.d / s198), t.applyFilter(this, e863, r615, i443);
    }, Object.defineProperty(e860.prototype, "map", {
        get: function() {
            return this.uniforms.mapSampler;
        },
        set: function(t) {
            this.uniforms.mapSampler = t;
        },
        enumerable: !1,
        configurable: !0
    }), e860;
}(Yn), Wu = function(t537, e864) {
    return (Wu = Object.setPrototypeOf || ({
        __proto__: []
    }) instanceof Array && function(t, e865) {
        t.__proto__ = e865;
    } || function(t, e866) {
        for(var r616 in e866)e866.hasOwnProperty(r616) && (t[r616] = e866[r616]);
    })(t537, e864);
}, zu = "\nattribute vec2 aVertexPosition;\n\nuniform mat3 projectionMatrix;\n\nvarying vec2 v_rgbNW;\nvarying vec2 v_rgbNE;\nvarying vec2 v_rgbSW;\nvarying vec2 v_rgbSE;\nvarying vec2 v_rgbM;\n\nvarying vec2 vFragCoord;\n\nuniform vec4 inputSize;\nuniform vec4 outputFrame;\n\nvec4 filterVertexPosition( void )\n{\n    vec2 position = aVertexPosition * max(outputFrame.zw, vec2(0.)) + outputFrame.xy;\n\n    return vec4((projectionMatrix * vec3(position, 1.0)).xy, 0.0, 1.0);\n}\n\nvoid texcoords(vec2 fragCoord, vec2 inverseVP,\n               out vec2 v_rgbNW, out vec2 v_rgbNE,\n               out vec2 v_rgbSW, out vec2 v_rgbSE,\n               out vec2 v_rgbM) {\n    v_rgbNW = (fragCoord + vec2(-1.0, -1.0)) * inverseVP;\n    v_rgbNE = (fragCoord + vec2(1.0, -1.0)) * inverseVP;\n    v_rgbSW = (fragCoord + vec2(-1.0, 1.0)) * inverseVP;\n    v_rgbSE = (fragCoord + vec2(1.0, 1.0)) * inverseVP;\n    v_rgbM = vec2(fragCoord * inverseVP);\n}\n\nvoid main(void) {\n\n   gl_Position = filterVertexPosition();\n\n   vFragCoord = aVertexPosition * outputFrame.zw;\n\n   texcoords(vFragCoord, inputSize.zw, v_rgbNW, v_rgbNE, v_rgbSW, v_rgbSE, v_rgbM);\n}\n", qu = 'varying vec2 v_rgbNW;\nvarying vec2 v_rgbNE;\nvarying vec2 v_rgbSW;\nvarying vec2 v_rgbSE;\nvarying vec2 v_rgbM;\n\nvarying vec2 vFragCoord;\nuniform sampler2D uSampler;\nuniform highp vec4 inputSize;\n\n\n/**\n Basic FXAA implementation based on the code on geeks3d.com with the\n modification that the texture2DLod stuff was removed since it\'s\n unsupported by WebGL.\n\n --\n\n From:\n https://github.com/mitsuhiko/webgl-meincraft\n\n Copyright (c) 2011 by Armin Ronacher.\n\n Some rights reserved.\n\n Redistribution and use in source and binary forms, with or without\n modification, are permitted provided that the following conditions are\n met:\n\n * Redistributions of source code must retain the above copyright\n notice, this list of conditions and the following disclaimer.\n\n * Redistributions in binary form must reproduce the above\n copyright notice, this list of conditions and the following\n disclaimer in the documentation and/or other materials provided\n with the distribution.\n\n * The names of the contributors may not be used to endorse or\n promote products derived from this software without specific\n prior written permission.\n\n THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS\n "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT\n LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR\n A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT\n OWNER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL,\n SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT\n LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE,\n DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY\n THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT\n (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE\n OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.\n */\n\n#ifndef FXAA_REDUCE_MIN\n#define FXAA_REDUCE_MIN   (1.0/ 128.0)\n#endif\n#ifndef FXAA_REDUCE_MUL\n#define FXAA_REDUCE_MUL   (1.0 / 8.0)\n#endif\n#ifndef FXAA_SPAN_MAX\n#define FXAA_SPAN_MAX     8.0\n#endif\n\n//optimized version for mobile, where dependent\n//texture reads can be a bottleneck\nvec4 fxaa(sampler2D tex, vec2 fragCoord, vec2 inverseVP,\n          vec2 v_rgbNW, vec2 v_rgbNE,\n          vec2 v_rgbSW, vec2 v_rgbSE,\n          vec2 v_rgbM) {\n    vec4 color;\n    vec3 rgbNW = texture2D(tex, v_rgbNW).xyz;\n    vec3 rgbNE = texture2D(tex, v_rgbNE).xyz;\n    vec3 rgbSW = texture2D(tex, v_rgbSW).xyz;\n    vec3 rgbSE = texture2D(tex, v_rgbSE).xyz;\n    vec4 texColor = texture2D(tex, v_rgbM);\n    vec3 rgbM  = texColor.xyz;\n    vec3 luma = vec3(0.299, 0.587, 0.114);\n    float lumaNW = dot(rgbNW, luma);\n    float lumaNE = dot(rgbNE, luma);\n    float lumaSW = dot(rgbSW, luma);\n    float lumaSE = dot(rgbSE, luma);\n    float lumaM  = dot(rgbM,  luma);\n    float lumaMin = min(lumaM, min(min(lumaNW, lumaNE), min(lumaSW, lumaSE)));\n    float lumaMax = max(lumaM, max(max(lumaNW, lumaNE), max(lumaSW, lumaSE)));\n\n    mediump vec2 dir;\n    dir.x = -((lumaNW + lumaNE) - (lumaSW + lumaSE));\n    dir.y =  ((lumaNW + lumaSW) - (lumaNE + lumaSE));\n\n    float dirReduce = max((lumaNW + lumaNE + lumaSW + lumaSE) *\n                          (0.25 * FXAA_REDUCE_MUL), FXAA_REDUCE_MIN);\n\n    float rcpDirMin = 1.0 / (min(abs(dir.x), abs(dir.y)) + dirReduce);\n    dir = min(vec2(FXAA_SPAN_MAX, FXAA_SPAN_MAX),\n              max(vec2(-FXAA_SPAN_MAX, -FXAA_SPAN_MAX),\n                  dir * rcpDirMin)) * inverseVP;\n\n    vec3 rgbA = 0.5 * (\n                       texture2D(tex, fragCoord * inverseVP + dir * (1.0 / 3.0 - 0.5)).xyz +\n                       texture2D(tex, fragCoord * inverseVP + dir * (2.0 / 3.0 - 0.5)).xyz);\n    vec3 rgbB = rgbA * 0.5 + 0.25 * (\n                                     texture2D(tex, fragCoord * inverseVP + dir * -0.5).xyz +\n                                     texture2D(tex, fragCoord * inverseVP + dir * 0.5).xyz);\n\n    float lumaB = dot(rgbB, luma);\n    if ((lumaB < lumaMin) || (lumaB > lumaMax))\n        color = vec4(rgbA, texColor.a);\n    else\n        color = vec4(rgbB, texColor.a);\n    return color;\n}\n\nvoid main() {\n\n      vec4 color;\n\n      color = fxaa(uSampler, vFragCoord, inputSize.zw, v_rgbNW, v_rgbNE, v_rgbSW, v_rgbSE, v_rgbM);\n\n      gl_FragColor = color;\n}\n', Ku = function(t538) {
    function e867() {
        return t538.call(this, zu, qu) || this;
    }
    return (function(t, e868) {
        function r617() {
            this.constructor = t;
        }
        Wu(t, e868), t.prototype = null === e868 ? Object.create(e868) : (r617.prototype = e868.prototype, new r617);
    })(e867, t538), e867;
}(Yn), Zu = function(t539, e869) {
    return (Zu = Object.setPrototypeOf || ({
        __proto__: []
    }) instanceof Array && function(t, e870) {
        t.__proto__ = e870;
    } || function(t, e871) {
        for(var r618 in e871)e871.hasOwnProperty(r618) && (t[r618] = e871[r618]);
    })(t539, e869);
}, Ju = "precision highp float;\n\nvarying vec2 vTextureCoord;\nvarying vec4 vColor;\n\nuniform float uNoise;\nuniform float uSeed;\nuniform sampler2D uSampler;\n\nfloat rand(vec2 co)\n{\n    return fract(sin(dot(co.xy, vec2(12.9898, 78.233))) * 43758.5453);\n}\n\nvoid main()\n{\n    vec4 color = texture2D(uSampler, vTextureCoord);\n    float randomValue = rand(gl_FragCoord.xy * uSeed);\n    float diff = (randomValue - 0.5) * uNoise;\n\n    // Un-premultiply alpha before applying the color matrix. See issue #3539.\n    if (color.a > 0.0) {\n        color.rgb /= color.a;\n    }\n\n    color.r += diff;\n    color.g += diff;\n    color.b += diff;\n\n    // Premultiply alpha again.\n    color.rgb *= color.a;\n\n    gl_FragColor = color;\n}\n", Qu = function(t540) {
    function e872(e873, r619) {
        void 0 === e873 && (e873 = 0.5), void 0 === r619 && (r619 = Math.random());
        var i444 = t540.call(this, Fo, Ju, {
            uNoise: 0,
            uSeed: 0
        }) || this;
        return i444.noise = e873, i444.seed = r619, i444;
    }
    return (function(t, e874) {
        function r620() {
            this.constructor = t;
        }
        Zu(t, e874), t.prototype = null === e874 ? Object.create(e874) : (r620.prototype = e874.prototype, new r620);
    })(e872, t540), Object.defineProperty(e872.prototype, "noise", {
        get: function() {
            return this.uniforms.uNoise;
        },
        set: function(t) {
            this.uniforms.uNoise = t;
        },
        enumerable: !1,
        configurable: !0
    }), Object.defineProperty(e872.prototype, "seed", {
        get: function() {
            return this.uniforms.uSeed;
        },
        set: function(t) {
            this.uniforms.uSeed = t;
        },
        enumerable: !1,
        configurable: !0
    }), e872;
}(Yn);
!function(t) {
    t[t.WEBGL_LEGACY = 0] = "WEBGL_LEGACY", t[t.WEBGL = 1] = "WEBGL", t[t.WEBGL2 = 2] = "WEBGL2";
}(xu || (xu = {
})), (function(t) {
    t[t.UNKNOWN = 0] = "UNKNOWN", t[t.WEBGL = 1] = "WEBGL", t[t.CANVAS = 2] = "CANVAS";
})(Ru || (Ru = {
})), (function(t) {
    t[t.COLOR = 16384] = "COLOR", t[t.DEPTH = 256] = "DEPTH", t[t.STENCIL = 1024] = "STENCIL";
})(Au || (Au = {
})), (function(t) {
    t[t.NORMAL = 0] = "NORMAL", t[t.ADD = 1] = "ADD", t[t.MULTIPLY = 2] = "MULTIPLY", t[t.SCREEN = 3] = "SCREEN", t[t.OVERLAY = 4] = "OVERLAY", t[t.DARKEN = 5] = "DARKEN", t[t.LIGHTEN = 6] = "LIGHTEN", t[t.COLOR_DODGE = 7] = "COLOR_DODGE", t[t.COLOR_BURN = 8] = "COLOR_BURN", t[t.HARD_LIGHT = 9] = "HARD_LIGHT", t[t.SOFT_LIGHT = 10] = "SOFT_LIGHT", t[t.DIFFERENCE = 11] = "DIFFERENCE", t[t.EXCLUSION = 12] = "EXCLUSION", t[t.HUE = 13] = "HUE", t[t.SATURATION = 14] = "SATURATION", t[t.COLOR = 15] = "COLOR", t[t.LUMINOSITY = 16] = "LUMINOSITY", t[t.NORMAL_NPM = 17] = "NORMAL_NPM", t[t.ADD_NPM = 18] = "ADD_NPM", t[t.SCREEN_NPM = 19] = "SCREEN_NPM", t[t.NONE = 20] = "NONE", t[t.SRC_OVER = 0] = "SRC_OVER", t[t.SRC_IN = 21] = "SRC_IN", t[t.SRC_OUT = 22] = "SRC_OUT", t[t.SRC_ATOP = 23] = "SRC_ATOP", t[t.DST_OVER = 24] = "DST_OVER", t[t.DST_IN = 25] = "DST_IN", t[t.DST_OUT = 26] = "DST_OUT", t[t.DST_ATOP = 27] = "DST_ATOP", t[t.ERASE = 26] = "ERASE", t[t.SUBTRACT = 28] = "SUBTRACT", t[t.XOR = 29] = "XOR";
})(Ou || (Ou = {
})), (function(t) {
    t[t.POINTS = 0] = "POINTS", t[t.LINES = 1] = "LINES", t[t.LINE_LOOP = 2] = "LINE_LOOP", t[t.LINE_STRIP = 3] = "LINE_STRIP", t[t.TRIANGLES = 4] = "TRIANGLES", t[t.TRIANGLE_STRIP = 5] = "TRIANGLE_STRIP", t[t.TRIANGLE_FAN = 6] = "TRIANGLE_FAN";
})(Su || (Su = {
})), (function(t) {
    t[t.RGBA = 6408] = "RGBA", t[t.RGB = 6407] = "RGB", t[t.RG = 33319] = "RG", t[t.RED = 6403] = "RED", t[t.RGBA_INTEGER = 36249] = "RGBA_INTEGER", t[t.RGB_INTEGER = 36248] = "RGB_INTEGER", t[t.RG_INTEGER = 33320] = "RG_INTEGER", t[t.RED_INTEGER = 36244] = "RED_INTEGER", t[t.ALPHA = 6406] = "ALPHA", t[t.LUMINANCE = 6409] = "LUMINANCE", t[t.LUMINANCE_ALPHA = 6410] = "LUMINANCE_ALPHA", t[t.DEPTH_COMPONENT = 6402] = "DEPTH_COMPONENT", t[t.DEPTH_STENCIL = 34041] = "DEPTH_STENCIL";
})(Iu || (Iu = {
})), (function(t) {
    t[t.TEXTURE_2D = 3553] = "TEXTURE_2D", t[t.TEXTURE_CUBE_MAP = 34067] = "TEXTURE_CUBE_MAP", t[t.TEXTURE_2D_ARRAY = 35866] = "TEXTURE_2D_ARRAY", t[t.TEXTURE_CUBE_MAP_POSITIVE_X = 34069] = "TEXTURE_CUBE_MAP_POSITIVE_X", t[t.TEXTURE_CUBE_MAP_NEGATIVE_X = 34070] = "TEXTURE_CUBE_MAP_NEGATIVE_X", t[t.TEXTURE_CUBE_MAP_POSITIVE_Y = 34071] = "TEXTURE_CUBE_MAP_POSITIVE_Y", t[t.TEXTURE_CUBE_MAP_NEGATIVE_Y = 34072] = "TEXTURE_CUBE_MAP_NEGATIVE_Y", t[t.TEXTURE_CUBE_MAP_POSITIVE_Z = 34073] = "TEXTURE_CUBE_MAP_POSITIVE_Z", t[t.TEXTURE_CUBE_MAP_NEGATIVE_Z = 34074] = "TEXTURE_CUBE_MAP_NEGATIVE_Z";
})(Pu || (Pu = {
})), (function(t) {
    t[t.UNSIGNED_BYTE = 5121] = "UNSIGNED_BYTE", t[t.UNSIGNED_SHORT = 5123] = "UNSIGNED_SHORT", t[t.UNSIGNED_SHORT_5_6_5 = 33635] = "UNSIGNED_SHORT_5_6_5", t[t.UNSIGNED_SHORT_4_4_4_4 = 32819] = "UNSIGNED_SHORT_4_4_4_4", t[t.UNSIGNED_SHORT_5_5_5_1 = 32820] = "UNSIGNED_SHORT_5_5_5_1", t[t.UNSIGNED_INT = 5125] = "UNSIGNED_INT", t[t.UNSIGNED_INT_10F_11F_11F_REV = 35899] = "UNSIGNED_INT_10F_11F_11F_REV", t[t.UNSIGNED_INT_2_10_10_10_REV = 33640] = "UNSIGNED_INT_2_10_10_10_REV", t[t.UNSIGNED_INT_24_8 = 34042] = "UNSIGNED_INT_24_8", t[t.UNSIGNED_INT_5_9_9_9_REV = 35902] = "UNSIGNED_INT_5_9_9_9_REV", t[t.BYTE = 5120] = "BYTE", t[t.SHORT = 5122] = "SHORT", t[t.INT = 5124] = "INT", t[t.FLOAT = 5126] = "FLOAT", t[t.FLOAT_32_UNSIGNED_INT_24_8_REV = 36269] = "FLOAT_32_UNSIGNED_INT_24_8_REV", t[t.HALF_FLOAT = 36193] = "HALF_FLOAT";
})(Nu || (Nu = {
})), (function(t) {
    t[t.FLOAT = 0] = "FLOAT", t[t.INT = 1] = "INT", t[t.UINT = 2] = "UINT";
})(Mu || (Mu = {
})), (function(t) {
    t[t.NEAREST = 0] = "NEAREST", t[t.LINEAR = 1] = "LINEAR";
})(Du || (Du = {
})), (function(t) {
    t[t.CLAMP = 33071] = "CLAMP", t[t.REPEAT = 10497] = "REPEAT", t[t.MIRRORED_REPEAT = 33648] = "MIRRORED_REPEAT";
})(Cu || (Cu = {
})), (function(t) {
    t[t.OFF = 0] = "OFF", t[t.POW2 = 1] = "POW2", t[t.ON = 2] = "ON", t[t.ON_MANUAL = 3] = "ON_MANUAL";
})(wu || (wu = {
})), (function(t) {
    t[t.NPM = 0] = "NPM", t[t.UNPACK = 1] = "UNPACK", t[t.PMA = 2] = "PMA", t[t.NO_PREMULTIPLIED_ALPHA = 0] = "NO_PREMULTIPLIED_ALPHA", t[t.PREMULTIPLY_ON_UPLOAD = 1] = "PREMULTIPLY_ON_UPLOAD", t[t.PREMULTIPLY_ALPHA = 2] = "PREMULTIPLY_ALPHA", t[t.PREMULTIPLIED_ALPHA = 2] = "PREMULTIPLIED_ALPHA";
})(Lu || (Lu = {
})), (function(t) {
    t[t.NO = 0] = "NO", t[t.YES = 1] = "YES", t[t.AUTO = 2] = "AUTO", t[t.BLEND = 0] = "BLEND", t[t.CLEAR = 1] = "CLEAR", t[t.BLIT = 2] = "BLIT";
})(Fu || (Fu = {
})), (function(t) {
    t[t.AUTO = 0] = "AUTO", t[t.MANUAL = 1] = "MANUAL";
})(Uu || (Uu = {
})), (function(t) {
    t.LOW = "lowp", t.MEDIUM = "mediump", t.HIGH = "highp";
})(Gu || (Gu = {
})), (function(t) {
    t[t.NONE = 0] = "NONE", t[t.SCISSOR = 1] = "SCISSOR", t[t.STENCIL = 2] = "STENCIL", t[t.SPRITE = 3] = "SPRITE";
})(Bu || (Bu = {
})), (function(t) {
    t[t.NONE = 0] = "NONE", t[t.LOW = 2] = "LOW", t[t.MEDIUM = 4] = "MEDIUM", t[t.HIGH = 8] = "HIGH";
})(Xu || (Xu = {
})), (function(t) {
    t[t.ELEMENT_ARRAY_BUFFER = 34963] = "ELEMENT_ARRAY_BUFFER", t[t.ARRAY_BUFFER = 34962] = "ARRAY_BUFFER", t[t.UNIFORM_BUFFER = 35345] = "UNIFORM_BUFFER";
})(ku || (ku = {
}));
var $u = new _r;
zr.prototype._cacheAsBitmap = !1, zr.prototype._cacheData = null, zr.prototype._cacheAsBitmapResolution = null, zr.prototype._cacheAsBitmapMultisample = Xu.NONE;
var tl = function() {
    this.textureCacheId = null, this.originalRender = null, this.originalRenderCanvas = null, this.originalCalculateBounds = null, this.originalGetLocalBounds = null, this.originalUpdateTransform = null, this.originalDestroy = null, this.originalMask = null, this.originalFilterArea = null, this.originalContainsPoint = null, this.sprite = null;
};
Object.defineProperties(zr.prototype, {
    cacheAsBitmapResolution: {
        get: function() {
            return this._cacheAsBitmapResolution;
        },
        set: function(t) {
            t !== this._cacheAsBitmapResolution && (this._cacheAsBitmapResolution = t, this.cacheAsBitmap && (this.cacheAsBitmap = !1, this.cacheAsBitmap = !0));
        }
    },
    cacheAsBitmapMultisample: {
        get: function() {
            return this._cacheAsBitmapMultisample;
        },
        set: function(t) {
            t !== this._cacheAsBitmapMultisample && (this._cacheAsBitmapMultisample = t, this.cacheAsBitmap && (this.cacheAsBitmap = !1, this.cacheAsBitmap = !0));
        }
    },
    cacheAsBitmap: {
        get: function() {
            return this._cacheAsBitmap;
        },
        set: function(t) {
            var e875;
            this._cacheAsBitmap !== t && (this._cacheAsBitmap = t, t ? (this._cacheData || (this._cacheData = new tl), (e875 = this._cacheData).originalRender = this.render, e875.originalRenderCanvas = this.renderCanvas, e875.originalUpdateTransform = this.updateTransform, e875.originalCalculateBounds = this.calculateBounds, e875.originalGetLocalBounds = this.getLocalBounds, e875.originalDestroy = this.destroy, e875.originalContainsPoint = this.containsPoint, e875.originalMask = this._mask, e875.originalFilterArea = this.filterArea, this.render = this._renderCached, this.renderCanvas = this._renderCachedCanvas, this.destroy = this._cacheAsBitmapDestroy) : ((e875 = this._cacheData).sprite && this._destroyCachedDisplayObject(), this.render = e875.originalRender, this.renderCanvas = e875.originalRenderCanvas, this.calculateBounds = e875.originalCalculateBounds, this.getLocalBounds = e875.originalGetLocalBounds, this.destroy = e875.originalDestroy, this.updateTransform = e875.originalUpdateTransform, this.containsPoint = e875.originalContainsPoint, this._mask = e875.originalMask, this.filterArea = e875.originalFilterArea));
        }
    }
}), zr.prototype._renderCached = function(t) {
    !this.visible || this.worldAlpha <= 0 || !this.renderable || (this._initCachedDisplayObject(t), this._cacheData.sprite.transform._worldID = this.transform._worldID, this._cacheData.sprite.worldAlpha = this.worldAlpha, this._cacheData.sprite._render(t));
}, zr.prototype._initCachedDisplayObject = function(t) {
    var e876;
    if (!this._cacheData || !this._cacheData.sprite) {
        var r621 = this.alpha;
        this.alpha = 1, t.batch.flush();
        var i445 = this.getLocalBounds(null, !0).clone();
        if (this.filters) {
            var n338 = this.filters[0].padding;
            i445.pad(n338);
        }
        i445.ceil(et.RESOLUTION);
        var o267 = t.renderTexture.current, s199 = t.renderTexture.sourceFrame.clone(), a165 = t.renderTexture.destinationFrame.clone(), h131 = t.projection.transform, u110 = ji.create({
            width: i445.width,
            height: i445.height,
            resolution: this.cacheAsBitmapResolution || t.resolution,
            multisample: null !== (e876 = this.cacheAsBitmapMultisample) && void 0 !== e876 ? e876 : t.multisample
        }), l94 = "cacheAsBitmap_" + We();
        this._cacheData.textureCacheId = l94, Ai.addToCache(u110.baseTexture, l94), ki.addToCache(u110, l94);
        var c77 = this.transform.localTransform.copyTo($u).invert().translate(-i445.x, -i445.y);
        this.render = this._cacheData.originalRender, t.render(this, {
            renderTexture: u110,
            clear: !0,
            transform: c77,
            skipUpdateTransform: !1
        }), t.framebuffer.blit(), t.projection.transform = h131, t.renderTexture.bind(o267, s199, a165), this.render = this._renderCached, this.updateTransform = this.displayObjectUpdateTransform, this.calculateBounds = this._calculateCachedBounds, this.getLocalBounds = this._getCachedLocalBounds, this._mask = null, this.filterArea = null, this.alpha = r621;
        var d72 = new Fa(u110);
        d72.transform.worldTransform = this.transform.worldTransform, d72.anchor.x = -i445.x / i445.width, d72.anchor.y = -i445.y / i445.height, d72.alpha = r621, d72._bounds = this._bounds, this._cacheData.sprite = d72, this.transform._parentID = -1, this.parent ? this.updateTransform() : (this.enableTempParent(), this.updateTransform(), this.disableTempParent(null)), this.containsPoint = d72.containsPoint.bind(d72);
    }
}, zr.prototype._renderCachedCanvas = function(t) {
    !this.visible || this.worldAlpha <= 0 || !this.renderable || (this._initCachedDisplayObjectCanvas(t), this._cacheData.sprite.worldAlpha = this.worldAlpha, this._cacheData.sprite._renderCanvas(t));
}, zr.prototype._initCachedDisplayObjectCanvas = function(t) {
    if (!this._cacheData || !this._cacheData.sprite) {
        var e877 = this.getLocalBounds(null, !0), r622 = this.alpha;
        this.alpha = 1;
        var i446 = t.context, n339 = t._projTransform;
        e877.ceil(et.RESOLUTION);
        var o268 = ji.create({
            width: e877.width,
            height: e877.height
        }), s200 = "cacheAsBitmap_" + We();
        this._cacheData.textureCacheId = s200, Ai.addToCache(o268.baseTexture, s200), ki.addToCache(o268, s200);
        var a166 = $u;
        this.transform.localTransform.copyTo(a166), a166.invert(), a166.tx -= e877.x, a166.ty -= e877.y, this.renderCanvas = this._cacheData.originalRenderCanvas, t.render(this, {
            renderTexture: o268,
            clear: !0,
            transform: a166,
            skipUpdateTransform: !1
        }), t.context = i446, t._projTransform = n339, this.renderCanvas = this._renderCachedCanvas, this.updateTransform = this.displayObjectUpdateTransform, this.calculateBounds = this._calculateCachedBounds, this.getLocalBounds = this._getCachedLocalBounds, this._mask = null, this.filterArea = null, this.alpha = r622;
        var h132 = new Fa(o268);
        h132.transform.worldTransform = this.transform.worldTransform, h132.anchor.x = -e877.x / e877.width, h132.anchor.y = -e877.y / e877.height, h132.alpha = r622, h132._bounds = this._bounds, this._cacheData.sprite = h132, this.transform._parentID = -1, this.parent ? this.updateTransform() : (this.parent = t._tempDisplayObjectParent, this.updateTransform(), this.parent = null), this.containsPoint = h132.containsPoint.bind(h132);
    }
}, zr.prototype._calculateCachedBounds = function() {
    this._bounds.clear(), this._cacheData.sprite.transform._worldID = this.transform._worldID, this._cacheData.sprite._calculateBounds(), this._bounds.updateID = this._boundsID;
}, zr.prototype._getCachedLocalBounds = function() {
    return this._cacheData.sprite.getLocalBounds(null);
}, zr.prototype._destroyCachedDisplayObject = function() {
    this._cacheData.sprite._texture.destroy(!0), this._cacheData.sprite = null, Ai.removeFromCache(this._cacheData.textureCacheId), ki.removeFromCache(this._cacheData.textureCacheId), this._cacheData.textureCacheId = null;
}, zr.prototype._cacheAsBitmapDestroy = function(t) {
    this.cacheAsBitmap = !1, this.destroy(t);
}, zr.prototype.name = null, Zr.prototype.getChildByName = function(t, e878) {
    for(var r623 = 0, i447 = this.children.length; r623 < i447; r623++)if (this.children[r623].name === t) return this.children[r623];
    if (e878) {
        for(r623 = 0, i447 = this.children.length; r623 < i447; r623++)if (this.children[r623].getChildByName) {
            var n340 = this.children[r623].getChildByName(t, !0);
            if (n340) return n340;
        }
    }
    return null;
}, zr.prototype.getGlobalPosition = function(t, e879) {
    return void 0 === t && (t = new fr), void 0 === e879 && (e879 = !1), this.parent ? this.parent.toGlobal(this.position, t, e879) : (t.x = this.position.x, t.y = this.position.y), t;
};
var el = function(t541, e880) {
    return (el = Object.setPrototypeOf || ({
        __proto__: []
    }) instanceof Array && function(t, e881) {
        t.__proto__ = e881;
    } || function(t, e882) {
        for(var r624 in e882)e882.hasOwnProperty(r624) && (t[r624] = e882[r624]);
    })(t541, e880);
};
function rl(t, e883) {
    function r625() {
        this.constructor = t;
    }
    el(t, e883), t.prototype = null === e883 ? Object.create(e883) : (r625.prototype = e883.prototype, new r625);
}
var il = function(t542) {
    function e884(e885, r626, i448, n341) {
        void 0 === e885 && (e885 = 100), void 0 === r626 && (r626 = 100), void 0 === i448 && (i448 = 10), void 0 === n341 && (n341 = 10);
        var o269 = t542.call(this) || this;
        return o269.segWidth = i448, o269.segHeight = n341, o269.width = e885, o269.height = r626, o269.build(), o269;
    }
    return rl(e884, t542), e884.prototype.build = function() {
        for(var t = this.segWidth * this.segHeight, e886 = [], r627 = [], i449 = [], n342 = this.segWidth - 1, o270 = this.segHeight - 1, s201 = this.width / n342, a167 = this.height / o270, h133 = 0; h133 < t; h133++){
            var u111 = h133 % this.segWidth, l95 = h133 / this.segWidth | 0;
            e886.push(u111 * s201, l95 * a167), r627.push(u111 / n342, l95 / o270);
        }
        var c78 = n342 * o270;
        for(h133 = 0; h133 < c78; h133++){
            var d73 = h133 % n342, f = h133 / n342 | 0, p = f * this.segWidth + d73, _36 = f * this.segWidth + d73 + 1, m31 = (f + 1) * this.segWidth + d73, v28 = (f + 1) * this.segWidth + d73 + 1;
            i449.push(p, _36, m31, _36, v28, m31);
        }
        this.buffers[0].data = new Float32Array(e886), this.buffers[1].data = new Float32Array(r627), this.indexBuffer.data = new Uint16Array(i449), this.buffers[0].update(), this.buffers[1].update(), this.indexBuffer.update();
    }, e884;
}(Ih), nl = function(t543) {
    function e887(e888, r628, i450) {
        void 0 === e888 && (e888 = 200), void 0 === i450 && (i450 = 0);
        var n343 = t543.call(this, new Float32Array(4 * r628.length), new Float32Array(4 * r628.length), new Uint16Array(6 * (r628.length - 1))) || this;
        return n343.points = r628, n343._width = e888, n343.textureScale = i450, n343.build(), n343;
    }
    return rl(e887, t543), Object.defineProperty(e887.prototype, "width", {
        get: function() {
            return this._width;
        },
        enumerable: !1,
        configurable: !0
    }), e887.prototype.build = function() {
        var t = this.points;
        if (t) {
            var e889 = this.getBuffer("aVertexPosition"), r629 = this.getBuffer("aTextureCoord"), i451 = this.getIndex();
            if (!(t.length < 1)) {
                e889.data.length / 4 !== t.length && (e889.data = new Float32Array(4 * t.length), r629.data = new Float32Array(4 * t.length), i451.data = new Uint16Array(6 * (t.length - 1)));
                var n344 = r629.data, o271 = i451.data;
                n344[0] = 0, n344[1] = 0, n344[2] = 0, n344[3] = 1;
                for(var s202 = 0, a168 = t[0], h134 = this._width * this.textureScale, u112 = t.length, l96 = 0; l96 < u112; l96++){
                    var c = 4 * l96;
                    if (this.textureScale > 0) {
                        var d74 = a168.x - t[l96].x, f = a168.y - t[l96].y, p = Math.sqrt(d74 * d74 + f * f);
                        a168 = t[l96], s202 += p / h134;
                    } else s202 = l96 / (u112 - 1);
                    n344[c] = s202, n344[c + 1] = 0, n344[c + 2] = s202, n344[c + 3] = 1;
                }
                var _ = 0;
                for(l96 = 0; l96 < u112 - 1; l96++)c = 2 * l96, o271[_++] = c, o271[_++] = c + 1, o271[_++] = c + 2, o271[_++] = c + 2, o271[_++] = c + 1, o271[_++] = c + 3;
                r629.update(), i451.update(), this.updateVertices();
            }
        }
    }, e887.prototype.updateVertices = function() {
        var t = this.points;
        if (!(t.length < 1)) {
            for(var e890, r630 = t[0], i452 = 0, n345 = 0, o272 = this.buffers[0].data, s203 = t.length, a169 = 0; a169 < s203; a169++){
                var h135 = t[a169], u = 4 * a169;
                n345 = -((e890 = a169 < t.length - 1 ? t[a169 + 1] : h135).x - r630.x), i452 = e890.y - r630.y;
                var l97 = Math.sqrt(i452 * i452 + n345 * n345), c = this.textureScale > 0 ? this.textureScale * this._width / 2 : this._width / 2;
                i452 /= l97, n345 /= l97, i452 *= c, n345 *= c, o272[u] = h135.x + i452, o272[u + 1] = h135.y + n345, o272[u + 2] = h135.x - i452, o272[u + 3] = h135.y - n345, r630 = h135;
            }
            this.buffers[0].update();
        }
    }, e887.prototype.update = function() {
        this.textureScale > 0 ? this.build() : this.updateVertices();
    }, e887;
}(Ih), ol = function(t) {
    function e891(e892, r631, i453) {
        void 0 === i453 && (i453 = 0);
        var n346 = this, o273 = new nl(e892.height, r631, i453), s204 = new Sh(e892);
        return i453 > 0 && (e892.baseTexture.wrapMode = fe.REPEAT), (n346 = t.call(this, o273, s204) || this).autoUpdate = !0, n346;
    }
    return rl(e891, t), e891.prototype._render = function(e893) {
        var r632 = this.geometry;
        (this.autoUpdate || r632._width !== this.shader.texture.height) && (r632._width = this.shader.texture.height, r632.update()), t.prototype._render.call(this, e893);
    }, e891;
}(Rh), sl = function(t544) {
    function e894(e895, r633, i454) {
        var n347 = this, o274 = new il(e895.width, e895.height, r633, i454), s205 = new Sh(ki.WHITE);
        return (n347 = t544.call(this, o274, s205) || this).texture = e895, n347.autoResize = !0, n347;
    }
    return rl(e894, t544), e894.prototype.textureUpdated = function() {
        this._textureID = this.shader.texture._updateID;
        var t = this.geometry, e896 = this.shader.texture, r634 = e896.width, i455 = e896.height;
        !this.autoResize || t.width === r634 && t.height === i455 || (t.width = this.shader.texture.width, t.height = this.shader.texture.height, t.build());
    }, Object.defineProperty(e894.prototype, "texture", {
        get: function() {
            return this.shader.texture;
        },
        set: function(t) {
            this.shader.texture !== t && (this.shader.texture = t, this._textureID = -1, t.baseTexture.valid ? this.textureUpdated() : t.once("update", this.textureUpdated, this));
        },
        enumerable: !1,
        configurable: !0
    }), e894.prototype._render = function(e897) {
        this._textureID !== this.shader.texture._updateID && this.textureUpdated(), t544.prototype._render.call(this, e897);
    }, e894.prototype.destroy = function(e898) {
        this.shader.texture.off("update", this.textureUpdated, this), t544.prototype.destroy.call(this, e898);
    }, e894;
}(Rh), al = function(t545) {
    function e899(e900, r635, i456, n348, o275) {
        void 0 === e900 && (e900 = ki.EMPTY);
        var s206 = this, a170 = new Ih(r635, i456, n348);
        a170.getBuffer("aVertexPosition").static = !1;
        var h136 = new Sh(e900);
        return (s206 = t545.call(this, a170, h136, null, o275) || this).autoUpdate = !0, s206;
    }
    return rl(e899, t545), Object.defineProperty(e899.prototype, "vertices", {
        get: function() {
            return this.geometry.getBuffer("aVertexPosition").data;
        },
        set: function(t) {
            this.geometry.getBuffer("aVertexPosition").data = t;
        },
        enumerable: !1,
        configurable: !0
    }), e899.prototype._render = function(e901) {
        this.autoUpdate && this.geometry.getBuffer("aVertexPosition").update(), t545.prototype._render.call(this, e901);
    }, e899;
}(Rh), hl = 10, ul = function(t546) {
    function e902(e903, r636, i457, n349, o276) {
        void 0 === r636 && (r636 = hl), void 0 === i457 && (i457 = hl), void 0 === n349 && (n349 = hl), void 0 === o276 && (o276 = hl);
        var s207 = t546.call(this, ki.WHITE, 4, 4) || this;
        return s207._origWidth = e903.orig.width, s207._origHeight = e903.orig.height, s207._width = s207._origWidth, s207._height = s207._origHeight, s207._leftWidth = r636, s207._rightWidth = n349, s207._topHeight = i457, s207._bottomHeight = o276, s207.texture = e903, s207;
    }
    return rl(e902, t546), e902.prototype.textureUpdated = function() {
        this._textureID = this.shader.texture._updateID, this._refresh();
    }, Object.defineProperty(e902.prototype, "vertices", {
        get: function() {
            return this.geometry.getBuffer("aVertexPosition").data;
        },
        set: function(t) {
            this.geometry.getBuffer("aVertexPosition").data = t;
        },
        enumerable: !1,
        configurable: !0
    }), e902.prototype.updateHorizontalVertices = function() {
        var t = this.vertices, e904 = this._getMinScale();
        t[9] = t[11] = t[13] = t[15] = this._topHeight * e904, t[17] = t[19] = t[21] = t[23] = this._height - this._bottomHeight * e904, t[25] = t[27] = t[29] = t[31] = this._height;
    }, e902.prototype.updateVerticalVertices = function() {
        var t = this.vertices, e905 = this._getMinScale();
        t[2] = t[10] = t[18] = t[26] = this._leftWidth * e905, t[4] = t[12] = t[20] = t[28] = this._width - this._rightWidth * e905, t[6] = t[14] = t[22] = t[30] = this._width;
    }, e902.prototype._getMinScale = function() {
        var t = this._leftWidth + this._rightWidth, e906 = this._width > t ? 1 : this._width / t, r637 = this._topHeight + this._bottomHeight, i458 = this._height > r637 ? 1 : this._height / r637;
        return Math.min(e906, i458);
    }, Object.defineProperty(e902.prototype, "width", {
        get: function() {
            return this._width;
        },
        set: function(t) {
            this._width = t, this._refresh();
        },
        enumerable: !1,
        configurable: !0
    }), Object.defineProperty(e902.prototype, "height", {
        get: function() {
            return this._height;
        },
        set: function(t) {
            this._height = t, this._refresh();
        },
        enumerable: !1,
        configurable: !0
    }), Object.defineProperty(e902.prototype, "leftWidth", {
        get: function() {
            return this._leftWidth;
        },
        set: function(t) {
            this._leftWidth = t, this._refresh();
        },
        enumerable: !1,
        configurable: !0
    }), Object.defineProperty(e902.prototype, "rightWidth", {
        get: function() {
            return this._rightWidth;
        },
        set: function(t) {
            this._rightWidth = t, this._refresh();
        },
        enumerable: !1,
        configurable: !0
    }), Object.defineProperty(e902.prototype, "topHeight", {
        get: function() {
            return this._topHeight;
        },
        set: function(t) {
            this._topHeight = t, this._refresh();
        },
        enumerable: !1,
        configurable: !0
    }), Object.defineProperty(e902.prototype, "bottomHeight", {
        get: function() {
            return this._bottomHeight;
        },
        set: function(t) {
            this._bottomHeight = t, this._refresh();
        },
        enumerable: !1,
        configurable: !0
    }), e902.prototype._refresh = function() {
        var t = this.texture, e907 = this.geometry.buffers[1].data;
        this._origWidth = t.orig.width, this._origHeight = t.orig.height;
        var r638 = 1 / this._origWidth, i459 = 1 / this._origHeight;
        e907[0] = e907[8] = e907[16] = e907[24] = 0, e907[1] = e907[3] = e907[5] = e907[7] = 0, e907[6] = e907[14] = e907[22] = e907[30] = 1, e907[25] = e907[27] = e907[29] = e907[31] = 1, e907[2] = e907[10] = e907[18] = e907[26] = r638 * this._leftWidth, e907[4] = e907[12] = e907[20] = e907[28] = 1 - r638 * this._rightWidth, e907[9] = e907[11] = e907[13] = e907[15] = i459 * this._topHeight, e907[17] = e907[19] = e907[21] = e907[23] = 1 - i459 * this._bottomHeight, this.updateHorizontalVertices(), this.updateVerticalVertices(), this.geometry.buffers[0].update(), this.geometry.buffers[1].update();
    }, e902;
}(sl), ll = function(t547, e908) {
    return (ll = Object.setPrototypeOf || ({
        __proto__: []
    }) instanceof Array && function(t, e909) {
        t.__proto__ = e909;
    } || function(t, e910) {
        for(var r639 in e910)e910.hasOwnProperty(r639) && (t[r639] = e910[r639]);
    })(t547, e908);
}, cl = function(t548) {
    function e911(e912, r640) {
        void 0 === r640 && (r640 = !0);
        var i460 = t548.call(this, e912[0] instanceof ki ? e912[0] : e912[0].texture) || this;
        return i460._textures = null, i460._durations = null, i460._autoUpdate = r640, i460._isConnectedToTicker = !1, i460.animationSpeed = 1, i460.loop = !0, i460.updateAnchor = !1, i460.onComplete = null, i460.onFrameChange = null, i460.onLoop = null, i460._currentTime = 0, i460._playing = !1, i460._previousFrame = null, i460.textures = e912, i460;
    }
    return (function(t, e913) {
        function r641() {
            this.constructor = t;
        }
        ll(t, e913), t.prototype = null === e913 ? Object.create(e913) : (r641.prototype = e913.prototype, new r641);
    })(e911, t548), e911.prototype.stop = function() {
        this._playing && (this._playing = !1, this._autoUpdate && this._isConnectedToTicker && (oi.shared.remove(this.update, this), this._isConnectedToTicker = !1));
    }, e911.prototype.play = function() {
        this._playing || (this._playing = !0, this._autoUpdate && !this._isConnectedToTicker && (oi.shared.add(this.update, this, Qr.HIGH), this._isConnectedToTicker = !0));
    }, e911.prototype.gotoAndStop = function(t) {
        this.stop();
        var e914 = this.currentFrame;
        this._currentTime = t, e914 !== this.currentFrame && this.updateTexture();
    }, e911.prototype.gotoAndPlay = function(t) {
        var e915 = this.currentFrame;
        this._currentTime = t, e915 !== this.currentFrame && this.updateTexture(), this.play();
    }, e911.prototype.update = function(t) {
        if (this._playing) {
            var e916 = this.animationSpeed * t, r642 = this.currentFrame;
            if (null !== this._durations) {
                var i461 = this._currentTime % 1 * this._durations[this.currentFrame];
                for(i461 += e916 / 60 * 1000; i461 < 0;)this._currentTime--, i461 += this._durations[this.currentFrame];
                var n350 = Math.sign(this.animationSpeed * t);
                for(this._currentTime = Math.floor(this._currentTime); i461 >= this._durations[this.currentFrame];)i461 -= this._durations[this.currentFrame] * n350, this._currentTime += n350;
                this._currentTime += i461 / this._durations[this.currentFrame];
            } else this._currentTime += e916;
            this._currentTime < 0 && !this.loop ? (this.gotoAndStop(0), this.onComplete && this.onComplete()) : this._currentTime >= this._textures.length && !this.loop ? (this.gotoAndStop(this._textures.length - 1), this.onComplete && this.onComplete()) : r642 !== this.currentFrame && (this.loop && this.onLoop && (this.animationSpeed > 0 && this.currentFrame < r642 ? this.onLoop() : this.animationSpeed < 0 && this.currentFrame > r642 && this.onLoop()), this.updateTexture());
        }
    }, e911.prototype.updateTexture = function() {
        var t = this.currentFrame;
        this._previousFrame !== t && (this._previousFrame = t, this._texture = this._textures[t], this._textureID = -1, this._textureTrimmedID = -1, this._cachedTint = 16777215, this.uvs = this._texture._uvs.uvsFloat32, this.updateAnchor && this._anchor.copyFrom(this._texture.defaultAnchor), this.onFrameChange && this.onFrameChange(this.currentFrame));
    }, e911.prototype.destroy = function(e917) {
        this.stop(), t548.prototype.destroy.call(this, e917), this.onComplete = null, this.onFrameChange = null, this.onLoop = null;
    }, e911.fromFrames = function(t) {
        for(var r643 = [], i462 = 0; i462 < t.length; ++i462)r643.push(ki.from(t[i462]));
        return new e911(r643);
    }, e911.fromImages = function(t) {
        for(var r644 = [], i463 = 0; i463 < t.length; ++i463)r644.push(ki.from(t[i463]));
        return new e911(r644);
    }, Object.defineProperty(e911.prototype, "totalFrames", {
        get: function() {
            return this._textures.length;
        },
        enumerable: !1,
        configurable: !0
    }), Object.defineProperty(e911.prototype, "textures", {
        get: function() {
            return this._textures;
        },
        set: function(t) {
            if (t[0] instanceof ki) this._textures = t, this._durations = null;
            else {
                this._textures = [], this._durations = [];
                for(var e918 = 0; e918 < t.length; e918++)this._textures.push(t[e918].texture), this._durations.push(t[e918].time);
            }
            this._previousFrame = null, this.gotoAndStop(0), this.updateTexture();
        },
        enumerable: !1,
        configurable: !0
    }), Object.defineProperty(e911.prototype, "currentFrame", {
        get: function() {
            var t = Math.floor(this._currentTime) % this._textures.length;
            return t < 0 && (t += this._textures.length), t;
        },
        enumerable: !1,
        configurable: !0
    }), Object.defineProperty(e911.prototype, "playing", {
        get: function() {
            return this._playing;
        },
        enumerable: !1,
        configurable: !0
    }), Object.defineProperty(e911.prototype, "autoUpdate", {
        get: function() {
            return this._autoUpdate;
        },
        set: function(t) {
            t !== this._autoUpdate && (this._autoUpdate = t, !this._autoUpdate && this._isConnectedToTicker ? (oi.shared.remove(this.update, this), this._isConnectedToTicker = !1) : this._autoUpdate && !this._isConnectedToTicker && this._playing && (oi.shared.add(this.update, this), this._isConnectedToTicker = !0));
        },
        enumerable: !1,
        configurable: !0
    }), e911;
}(Fa);
Co.registerPlugin("accessibility", ii), Co.registerPlugin("extract", rs), Co.registerPlugin("interaction", _i), Co.registerPlugin("particle", ta), Co.registerPlugin("prepare", hh), Co.registerPlugin("batch", zo), Co.registerPlugin("tilingSprite", yh), ys.registerPlugin(Yh), ys.registerPlugin(Ms), ys.registerPlugin(Xs), ys.registerPlugin(Vs), ys.registerPlugin(ch), $o.registerPlugin(si), $o.registerPlugin(Ts);
var dl = "6.2.0", fl = {
    AlphaFilter: zh,
    BlurFilter: gu,
    BlurFilterPass: yu,
    ColorMatrixFilter: bu,
    DisplacementFilter: Vu,
    FXAAFilter: Ku,
    NoiseFilter: Qu
};
const mod = {
    ALPHA_MODES: _e,
    AbstractBatchRenderer: ko,
    AbstractMultiResource: Oi,
    AbstractRenderer: No,
    AccessibilityManager: ii,
    AnimatedSprite: cl,
    AppLoaderPlugin: Ts,
    Application: $o,
    ArrayResource: Si,
    Attribute: Vi,
    BLEND_MODES: se,
    BUFFER_BITS: oe,
    BUFFER_TYPE: Te,
    BaseImageResource: Ii,
    BasePrepare: nh,
    BaseRenderTexture: Gi,
    BaseTexture: Ai,
    BatchDrawCall: Go,
    BatchGeometry: jo,
    BatchPluginFactory: Wo,
    BatchRenderer: zo,
    BatchShaderGenerator: Ho,
    BatchSystem: un,
    BatchTextureArray: Bo,
    BitmapFont: Bh,
    BitmapFontData: Nh,
    BitmapFontLoader: Yh,
    BitmapText: jh,
    BlobResource: Ps,
    Bounds: Ar,
    Buffer: zi,
    BufferResource: xi,
    CLEAR_MODES: me,
    CanvasResource: Pi,
    Circle: ur,
    CompressedTextureLoader: Ms,
    CompressedTextureResource: Ns,
    Container: Zr,
    ContextSystem: cn,
    CountLimiter: Za,
    CubeResource: Ni,
    DDSLoader: Xs,
    DEG_TO_RAD: ar,
    DRAW_MODES: ae,
    DisplayObject: zr,
    ENV: ie,
    Ellipse: lr,
    Extract: rs,
    FORMATS: he,
    FORMATS_TO_COMPONENTS: js,
    FillStyle: ra,
    Filter: Yn,
    FilterState: nn,
    FilterSystem: an,
    Framebuffer: Ui,
    FramebufferSystem: pn,
    GC_MODES: ve,
    GLFramebuffer: dn,
    GLProgram: fo,
    GLTexture: Oo,
    GRAPHICS_CURVES: ea,
    Geometry: Qi,
    GeometrySystem: mn,
    Graphics: Ma,
    GraphicsData: Ra,
    GraphicsGeometry: Sa,
    IGLUniformData: co,
    INSTALLED: vi,
    INTERNAL_FORMATS: Es,
    INTERNAL_FORMAT_TO_BYTES_PER_PIXEL: Rs,
    ImageBitmapResource: wi,
    ImageResource: Mi,
    InteractionData: ai,
    InteractionEvent: ui,
    InteractionManager: _i,
    InteractionTrackingData: li,
    KTXLoader: Vs,
    LINE_CAP: Ks,
    LINE_JOIN: qs,
    LineStyle: Ia,
    Loader: ys,
    LoaderResource: ds,
    MASK_TYPES: ge,
    MIPMAP_MODES: pe,
    MSAA_QUALITY: Ee,
    MaskData: vn,
    MaskSystem: Zn,
    Matrix: _r,
    Mesh: Rh,
    MeshBatchUvs: Th,
    MeshGeometry: Ih,
    MeshMaterial: Sh,
    NineSlicePlane: ul,
    ObjectRenderer: hn,
    ObservablePoint: pr,
    PI_2: or,
    PRECISION: ye,
    ParticleContainer: Zs,
    ParticleRenderer: ta,
    PlaneGeometry: il,
    Point: fr,
    Polygon: cr,
    Prepare: hh,
    Program: kn,
    ProjectionSystem: eo,
    Quad: $i,
    QuadUv: tn,
    RAD_TO_DEG: sr,
    RENDERER_TYPE: ne,
    Rectangle: hr,
    RenderTexture: ji,
    RenderTexturePool: Yi,
    RenderTextureSystem: no,
    Renderer: Co,
    Resource: bi,
    RopeGeometry: nl,
    RoundedRectangle: dr,
    Runner: mi,
    SAMPLER_TYPES: ce,
    SCALE_MODES: de,
    SHAPES: ir,
    SVGResource: Di,
    ScissorSystem: $n,
    Shader: Hn,
    ShaderSystem: vo,
    SimpleMesh: al,
    SimplePlane: sl,
    SimpleRope: ol,
    Sprite: Fa,
    SpriteMaskFilter: Kn,
    Spritesheet: lh,
    SpritesheetLoader: ch,
    State: jn,
    StateSystem: Ro,
    StencilSystem: to,
    System: Uo,
    TARGETS: ue,
    TEXT_GRADIENT: xa,
    TYPES: le,
    TYPES_TO_BYTES_PER_COMPONENT: Hs,
    TYPES_TO_BYTES_PER_PIXEL: Ys,
    TemporaryDisplayObject: qr,
    Text: qa,
    TextMetrics: Ya,
    TextStyle: Xa,
    Texture: ki,
    TextureGCSystem: Ao,
    TextureLoader: bs,
    TextureMatrix: qn,
    TextureSystem: So,
    TextureUvs: Bi,
    Ticker: oi,
    TickerPlugin: si,
    TilingSprite: _h,
    TilingSpriteRenderer: yh,
    TimeLimiter: uh,
    Transform: Rr,
    UPDATE_PRIORITY: Qr,
    UniformGroup: rn,
    VERSION: dl,
    VideoResource: Ci,
    ViewableBuffer: Xo,
    WRAP_MODES: fe,
    accessibleTarget: Jr,
    autoDetectRenderer: wo,
    autoDetectResource: yi,
    checkMaxIfStatementsInShader: Gn,
    createUBOElements: ho,
    defaultFilterVertex: Fo,
    defaultVertex: Lo,
    filters: fl,
    generateProgram: po,
    generateUniformBufferSync: lo,
    getTestContext: An,
    getUBOData: uo,
    graphicsUtils: Da,
    groupD8: xr,
    interactiveTarget: di,
    isMobile: tt,
    resources: qo,
    settings: et,
    systems: Jo,
    uniformParsers: Cn,
    utils: nr
};
class Render {
    static engine;
    static instance;
    static async setup({ app  }) {
        Object.assign(this, {
            engine: mod,
            cache: mod.utils.TextureCache
        });
        this.engine.settings.SCALE_MODE = this.engine.SCALE_MODES.NEAREST;
        this.engine.settings.ROUND_PIXELS = true;
        const pending = [];
        const loader = Render.engine.Loader.shared;
        for (const texture of [
            "tileset",
            "npcs",
            "creatures"
        ]){
            loader.add(`/textures/${app.config.style}/${texture}.json?sha=${app.sha}`);
        }
        loader.onProgress.add((_, { url =""  })=>app.loaded(`loaded ${new URL(url, global1.location).pathname}`)
        );
        loader.onComplete.add(()=>app.loaded("all textures successfully loaded")
        );
        pending.push(new Promise((solve)=>loader.load(()=>solve(null)
            )
        ));
        pending.push(new Promise(async (solve)=>{
            const tileset = await fetch("/api/textures/tilesets/tileset").then((response)=>response.json()
            );
            app.loaded(`loaded tileset metadata`);
            Object.assign(this, {
                tileset
            });
            solve();
        }));
        pending.push(new Promise(async (solve)=>{
            const effects = await fetch("/api/textures/effects").then((response)=>response.json()
            );
            app.loaded(`loaded textures effects`);
            Object.assign(this, {
                effects
            });
            solve();
        }));
        Object.assign(this, {
            instance: new Render.engine.Application({
                width: global1.document.body.clientWidth,
                height: global1.document.body.clientHeight,
                backgroundAlpha: 0
            })
        });
        this.instance.resizeTo = global1.window;
        global1.document.querySelector("body").appendChild(this.instance.view);
        await Promise.all(pending);
        app.loaded("render engine ready");
    }
    static registered = new WeakMap();
    static register(renderable) {
        this.registered.set(renderable, (dt1)=>renderable.update({
                t: Date.now(),
                dt: dt1
            })
        );
        Render.engine.Ticker.shared.add(this.registered.get(renderable));
        return this;
    }
    static unregister(renderable) {
        Render.engine.Ticker.shared.remove(this.registered.get(renderable));
        this.registered.delete(renderable);
        return this;
    }
    static get fps() {
        return Render.engine.Ticker.shared.FPS;
    }
    static tileset;
    static effects;
    static cache;
    static Texture(frame = null) {
        if (`${frame}` in Render.cache) {
            return Render.engine.Texture.from(`${frame}`);
        }
        return Render.engine.Texture.EMPTY;
    }
    static ColorFilter({ brightness =NaN , saturate =NaN , tint =NaN  } = {
    }) {
        const filter = new Render.engine.filters.ColorMatrixFilter();
        if (!Number.isNaN(brightness)) {
            filter.brightness(brightness);
        }
        if (!Number.isNaN(saturate)) {
            filter.saturate(saturate);
        }
        if (!Number.isNaN(tint)) {
            filter.tint(tint);
        }
        return [
            filter
        ];
    }
    static Polygon(points = []) {
        return new Render.engine.Polygon(...points.map((n1)=>n1 * 16
        ));
    }
    static Rectangle(points = []) {
        return new Render.engine.Rectangle(...points.map((n2)=>n2 * 16
        ));
    }
    static Container({ x: x1 = 0 , y =0 , z: z1 = NaN , sorted =false , visible: visible1 = true  } = {
    }) {
        const container = new Render.engine.Container();
        if (sorted) {
            container.sortableChildren = true;
        }
        container.position.set(x1 * 16, y * 16);
        if (!Number.isNaN(z1)) {
            container.zIndex = z1;
        }
        container.visible = visible1;
        return container;
    }
    static TilingSprite({ frame =null , x: x2 = 0 , y =0 , z: z2 = NaN , width =0 , height =0  } = {
    }) {
        const sprite = new Render.engine.TilingSprite(Render.Texture(frame), width * 16, height * 16);
        sprite.position.set(x2 * 16, y * 16);
        if (!Number.isNaN(z2)) {
            sprite.zIndex = z2;
        }
        return sprite;
    }
    static Sprite({ frame =null , x: x3 = 0 , y =0 , z: z3 = NaN , anchor , scale  } = {
    }) {
        let sprite;
        if (`${frame}` in this.tileset.animated) {
            const { frames , speed  } = this.tileset.animated[frame];
            sprite = new Render.engine.AnimatedSprite.fromFrames(frames);
            sprite.animationSpeed = speed;
            sprite.play();
        } else {
            sprite = new Render.engine.Sprite(Render.Texture(frame));
        }
        sprite.position.set(x3 * 16, y * 16);
        if (anchor) {
            sprite.anchor.set(...anchor);
        }
        if (scale) {
            sprite.scale.set(...scale);
        }
        if (!Number.isNaN(z3)) {
            sprite.zIndex = z3;
        }
        return sprite;
    }
    static Graphics({ z: z4 = NaN , stroke , fill , text , textStyle , textPosition , textAnchor =[
        0.5,
        0.5
    ] , rect , circle , ellipse , polygon  } = {
    }) {
        const graphics = new Render.engine.Graphics();
        if (stroke) {
            graphics.lineStyle(...stroke);
        }
        if (fill) {
            graphics.beginFill(...fill);
        }
        if (rect) {
            graphics.drawRect(...rect.map((n3)=>n3 * 16
            ));
        }
        if (circle) {
            graphics.drawCircle(...circle.map((n4)=>n4 * 16
            ));
        }
        if (ellipse) {
            graphics.drawEllipse(...ellipse.map((n5)=>n5 * 16
            ));
        }
        if (polygon) {
            if (polygon instanceof Render.engine.Polygon) {
                graphics.drawPolygon(polygon);
            } else {
                graphics.drawPolygon(...polygon.map((n6)=>n6 * 16
                ));
            }
        }
        graphics.endFill();
        if (text) {
            const textSprite = graphics.addChild(new Render.engine.Text(text, textStyle));
            textSprite.anchor.set(...textAnchor);
            if (textPosition) {
                textSprite.position.set(textPosition.x * 16, textPosition.y * 16);
            }
        }
        if (!Number.isNaN(z4)) {
            graphics.zIndex = z4;
        }
        return graphics;
    }
}
mod.Rectangle.prototype.intersects = function intersects(other) {
    const x0 = this.x < other.x ? other.x : this.x;
    const x1 = this.right > other.right ? other.right : this.right;
    if (x1 <= x0) {
        return false;
    }
    const y0 = this.y < other.y ? other.y : this.y;
    const y1 = this.bottom > other.bottom ? other.bottom : this.bottom;
    return y1 > y0;
};
function debounce(fn1, wait) {
    let timeout = null;
    let flush = null;
    const debounced = (...args)=>{
        debounced.clear();
        flush = ()=>{
            debounced.clear();
            fn1.call(debounced, ...args);
        };
        timeout = setTimeout(flush, wait);
    };
    debounced.clear = ()=>{
        if (typeof timeout === "number") {
            clearTimeout(timeout);
            timeout = null;
            flush = null;
        }
    };
    debounced.flush = ()=>{
        flush?.();
    };
    Object.defineProperty(debounced, "pending", {
        get: ()=>typeof timeout === "number"
    });
    return debounced;
}
function deferred() {
    let methods;
    let state = "pending";
    const promise = new Promise((resolve, reject)=>{
        methods = {
            async resolve (value) {
                await value;
                state = "fulfilled";
                resolve(value);
            },
            reject (reason) {
                state = "rejected";
                reject(reason);
            }
        };
    });
    Object.defineProperty(promise, "state", {
        get: ()=>state
    });
    return Object.assign(promise, methods);
}
class Renderable {
    id;
    constructor({ id , x: x4 = 0 , y =0 , z: z5 = 0 , visible: visible2 = true  }){
        this.id = id;
        this.sprite = Render.Container({
            x: x4,
            y,
            z: z5,
            visible: visible2
        });
        this.debug = Render.Container({
            x: x4,
            y,
            z: z5
        });
        Object.defineProperty(this.debug, "visible", {
            get () {
                return App.config.debug;
            }
        });
        this.debug.bounds = this.debug.addChild(Render.Container());
        Render.register(this);
    }
    destroyed = false;
    destructor() {
        Render.unregister(this);
        this.sprite.parent?.removeChild(this.sprite);
        this.debug.parent?.removeChild(this.debug);
        this.debug.bounds.parent?.removeChild(this.debug.bounds);
        this.sprite.destroy({
            children: true
        });
        this.debug.destroy({
            children: true
        });
        this.debug.bounds.destroy({
            children: true
        });
        Object.assign(this, {
            destroyed: true
        });
        if (App.config.debug) {
            console.debug(`destroyed: ${this.constructor.name}#${this.id}`);
        }
    }
    ready = deferred();
    async init({ parent =null  } = {
    }) {
        if (parent === App.rendering.stage) {
            App.rendering.stage.addChild(this.sprite);
            App.rendering.stage.addChild(this.debug);
        } else if (parent) {
            if (this.destroyed || parent.destroyed) {
                if (App.config.debug) {
                    console.debug(`creation aborted: ${this.constructor.name}#${this.id} (sprite already destroyed)`);
                }
                return this.destructor();
            }
            parent.sprite.addChild(this.sprite);
            parent.debug.addChild(this.debug);
        }
        if (App.config.debug) {
            console.debug(`created: ${this.constructor.name}#${this.id}`);
        }
        this.ready.resolve();
    }
    sprite;
    debug;
    show() {
        this.sprite.visible = true;
    }
    hide() {
        this.sprite.visible = false;
    }
    async update({ debug =this.debug.visible  }) {
        if (this.destroyed) {
            return;
        }
        if (debug) {
            if (this.dirty) {
                const { width , height  } = this.sprite._bounds.getRectangle();
                this.debug.bounds.removeChildren();
                this.debug.bounds.addChild(Render.Graphics({
                    text: `${this.id}`,
                    rect: [
                        0,
                        0,
                        width / 16,
                        height / 16
                    ],
                    ...Renderable.debug,
                    ...this.constructor.debug
                }));
            }
            this.debug.position.set(this.sprite.x, this.sprite.y);
        }
    }
    get dirty() {
        if (this.destroyed) {
            return false;
        }
        const { x: x5 , y , width , height  } = this.sprite.getBounds(true);
        const hash = `${x5}/${y}/${width}/${height}`;
        const dirty = this.#dirty === hash;
        this.#dirty = hash;
        return dirty;
    }
    #dirty = "";
    static debug = {
        stroke: [
            1,
            255,
            0.5
        ],
        fill: [
            65280,
            0.125
        ],
        textStyle: {
            fontSize: 10,
            fill: "white",
            fontFamily: "monospace"
        },
        textPosition: {
            x: 0.25,
            y: 0.25
        },
        textAnchor: [
            0,
            0
        ]
    };
}
var Direction;
(function(Direction1) {
    Direction1[Direction1["none"] = 0] = "none";
    Direction1[Direction1["up"] = 1] = "up";
    Direction1[Direction1["right"] = 2] = "right";
    Direction1[Direction1["down"] = 3] = "down";
    Direction1[Direction1["left"] = 4] = "left";
})(Direction || (Direction = {
}));
class NPC extends Renderable {
    area;
    name = "";
    constructor({ area  }){
        super({
            id: ""
        });
        this.area = area;
    }
    destructor() {
        this.area.npcs.delete(this);
        return super.destructor();
    }
    async init({ frame , random =false  } = {
    }) {
        let [x6, y] = this.area.data.points;
        for (const dx of [
            1,
            0,
            -1
        ]){
            for (const dy of [
                1,
                0,
                -1
            ]){
                if (!dx && !dy) {
                    continue;
                }
                if (this.area.contains({
                    x: x6 + dx,
                    y: y + dy
                })) {
                    x6 += dx;
                    y += dy;
                    break;
                }
            }
        }
        if (random) {
            let xm = Infinity, xM = -Infinity, ym = Infinity, yM = -Infinity;
            this.area.data.points.forEach((v1, i2)=>{
                if (i2 % 2) {
                    ym = Math.min(ym, v1);
                    yM = Math.max(yM, v1);
                } else {
                    xm = Math.min(xm, v1);
                    xM = Math.max(xM, v1);
                }
            });
            for(let i1 = 0; i1 < 20; i1++){
                const tx = Math.round(xm + xM * Math.random());
                const ty = Math.round(ym + yM * Math.random());
                if (this.area.contains({
                    x: tx,
                    y: ty
                })) {
                    x6 = tx;
                    y = ty;
                    break;
                }
            }
        }
        this.x = x6;
        this.y = y;
        this.#tx = x6;
        this.#ty = y;
        this.area.section.sprite.addChild(this.sprite);
        this.area.debug.addChild(this.debug);
        this.#texture = this.sprite.addChild(Render.Sprite({
            frame,
            anchor: [
                0.5,
                1
            ],
            y: 1
        }));
        this.sprite.interactive = true;
        this.sprite.cursor = "pointer";
        this.sprite.mouseover = ()=>{
            if (!this.sprite.filters) {
                this.sprite.filters = Render.ColorFilter({
                    brightness: 1.5
                });
            }
        };
        this.sprite.mouseout = ()=>this.sprite.filters = null
        ;
        return super.init();
    }
    async update({ debug =this.debug.visible , t , dt: dt2  }) {
        if (this.destroyed) {
            return;
        }
        this.refresh();
        if (debug && this.dirty) {
            this.debug.bounds.removeChildren();
            this.debug.bounds.addChild(Render.Graphics({
                text: this.tracker,
                rect: [
                    -0.5,
                    0,
                    1,
                    1
                ],
                ...this.constructor.debug
            }));
            this.debug.position.set(this.sprite.x, this.sprite.y);
        }
        return super.update({
            debug: false,
            t,
            dt: dt2
        });
    }
    set x(value) {
        this.sprite.position.x = value * 16 + 8;
    }
    get x() {
        return (this.sprite.position.x - 8) / 16;
    }
    #tx = 0;
    set y(value) {
        this.sprite.position.y = value * 16;
    }
    get y() {
        return this.sprite.position.y / 16;
    }
    #ty = 0;
    #tt = 0;
    get moving() {
        return this.#tx !== this.x || this.#ty !== this.y || this.#tt;
    }
    refresh() {
        if (this.moving) {
            this.move();
        } else {
            this.action();
        }
    }
    action() {
    }
    wander() {
        this.direction({
            direction: [
                Direction.none,
                Direction.left,
                Direction.right,
                Direction.up,
                Direction.down,
                Direction.none
            ][Math.floor(Math.random() * 6)],
            move: true
        });
    }
    move({ delta =1 / 2 ** 4  } = {
    }) {
        switch(this.#direction){
            case Direction.none:
                {
                    if (this.#tt) {
                        this.#tt = Math.max(0, this.#tt - delta);
                    }
                    break;
                }
            case Direction.left:
                {
                    this.x -= delta;
                    if (this.x <= this.#tx) {
                        this.x = this.#tx;
                        this.#direction = Direction.none;
                    }
                    break;
                }
            case Direction.right:
                {
                    this.x += delta;
                    if (this.x >= this.#tx) {
                        this.x = this.#tx;
                        this.#direction = Direction.none;
                    }
                    break;
                }
            case Direction.up:
                {
                    this.y -= delta;
                    if (this.y <= this.#ty) {
                        this.y = this.#ty;
                        this.#direction = Direction.none;
                    }
                    break;
                }
            case Direction.down:
                {
                    this.y += delta;
                    if (this.y >= this.#ty) {
                        this.y = this.#ty;
                        this.#direction = Direction.none;
                    }
                    break;
                }
        }
    }
    #direction = Direction.none;
    direction({ direction , move =false  }) {
        if (this.moving) {
            return;
        }
        if (move) {
            switch(direction){
                case Direction.none:
                    {
                        this.#tt = 1;
                        break;
                    }
                case Direction.left:
                    {
                        if (this.area.contains({
                            x: this.x - 1.5,
                            y: this.y
                        })) {
                            this.texture({
                                suffix: "_left_0",
                                fallback: +1
                            });
                            this.#tx = this.x - 1;
                        }
                        break;
                    }
                case Direction.right:
                    {
                        if (this.area.contains({
                            x: this.x + 1.5,
                            y: this.y
                        })) {
                            this.texture({
                                suffix: "_right_0",
                                fallback: -1
                            });
                            this.#tx = this.x + 1;
                        }
                        break;
                    }
                case Direction.up:
                    {
                        if (this.area.contains({
                            x: this.x,
                            y: this.y - 1.5
                        })) {
                            this.texture({
                                suffix: "_up_0"
                            });
                            this.#ty = this.y - 1;
                        }
                        break;
                    }
                case Direction.down:
                    {
                        if (this.area.contains({
                            x: this.x,
                            y: this.y + 1.5
                        })) {
                            this.texture({
                                suffix: "_down_0"
                            });
                            this.#ty = this.y + 1;
                        }
                        break;
                    }
            }
        }
        this.#direction = direction;
    }
    #texture;
    texture({ suffix ="" , fallback =0  } = {
    }) {
        const frame = `${this.name}${suffix}`;
        if (frame in Render.cache) {
            this.#texture.texture = Render.Texture(frame);
        } else if (fallback) {
            this.#texture.scale.x = Math.sign(fallback);
        }
    }
    #effects = {
        fly: null,
        swim: null
    };
    effects(...effects) {
        if (effects.includes("fly")) {
            this.#effects.fly = this.sprite.addChildAt(Render.Graphics({
                fill: [
                    0,
                    0.5
                ],
                ellipse: [
                    0,
                    0.5,
                    2 / 3,
                    2 / 4
                ]
            }), 0);
            this.#effects.fly.cacheAsBitmap = true;
            this.#texture.position.y = 1.5;
        } else if (this.#effects.fly) {
            this.sprite.removeChild(this.#effects.fly);
            this.#effects.fly.destroy({
                children: true
            });
            this.#effects.fly = null;
            this.#texture.position.y = 1;
        }
        if (effects.includes("swim")) {
            const mask = Render.Graphics({
                rect: [
                    -2,
                    -2,
                    4,
                    2.4
                ],
                fill: [
                    0,
                    0
                ]
            });
            this.#effects.swim = mask;
            this.#effects.swim.cacheAsBitmap = true;
            this.sprite.addChild(mask);
            this.#texture.mask = mask;
        } else if (this.#effects.swim) {
            this.sprite.removeChild(this.#effects.swim);
            this.#effects.swim.destroy({
                children: true
            });
            this.#effects.swim = null;
            this.#texture.mask = null;
        }
    }
    static debug = {
        fill: [
            7999,
            0.25
        ],
        textPosition: {
            x: 0,
            y: 1
        },
        textStyle: {
            fill: "white",
            fontSize: 10,
            fontFamily: "monospace"
        }
    };
}
class Human extends NPC {
    name = "";
    constructor({ area  }){
        super({
            area
        });
        this.name = this.area.data.name;
        this.init();
    }
    #directions = [];
    #track = [];
    #index = 0;
    #pattern = Pattern.fixed;
    async init() {
        if (this.#pattern === Pattern.lookaround) {
            this.#directions.push(...this.area.data.properties.directions ?? []);
        }
        if (this.#pattern === Pattern.loop || this.#pattern === Pattern.patrol) {
            const points = this.area.polygon.points.map((n7)=>n7 / 16
            );
            points.push(points[0], points[1]);
            this.#track.push(points[0], points[1]);
            for(let i3 = 2; i3 < points.length; i3 += 2){
                let [x7, y, nx, ny] = [
                    points[i3 - 2],
                    points[i3 - 1],
                    points[i3],
                    points[i3 + 1]
                ];
                const dx = nx - x7;
                const dy = ny - y;
                for(let j2 = 0; j2 < Math.abs(dx); j2++){
                    this.#track.push(x7 += Math.sign(dx), y);
                }
                for(let j1 = 0; j1 < Math.abs(dy); j1++){
                    this.#track.push(x7, y += Math.sign(dy));
                }
            }
            for(let i1 = 0; i1 < this.#track.length; i1 += 2){
                const [x8, y] = [
                    this.#track[i1],
                    this.#track[i1 + 1]
                ];
                if (!this.area.contains({
                    x: x8,
                    y
                })) {
                    this.#track[i1] = this.#track[i1 + 1] = NaN;
                }
            }
            this.#track = this.#track.filter(Number.isFinite);
            if (this.#pattern === Pattern.patrol) {
                const points = this.#track.slice();
                for(let i4 = points.length - 4; i4 > 0; i4 -= 2){
                    this.#track.push(points[i4], points[i4 + 1]);
                }
            }
            if (this.#pattern === Pattern.loop && this.#track.at(0) === this.#track.at(-2) && this.#track.at(1) === this.#track.at(-1)) {
                this.#track.pop();
                this.#track.pop();
            }
        }
        return super.init();
    }
    get tracker() {
        return this.#index;
    }
    action() {
        this.wander();
    }
}
class App {
    world;
    static async setup() {
        this.loaded("loaded /js/app.js", null, {
            update: true
        });
        const { x: x9 = 5 , y =-55  } = Object.fromEntries(new URLSearchParams(window.location.search).entries());
        await Render.setup({
            app: this
        });
        const world = new World();
        new Controller({
            target: world
        });
        Object.assign(this, {
            world
        });
        this.ready.resolve();
        world.camera.place({
            x: Number(x9) || 0,
            y: Number(y) || 0
        });
        this.loaded("waiting for first rendering");
        global1.document.querySelector(".loader").remove();
        return App;
    }
    static ready = deferred();
    static get rendering() {
        return Render.instance;
    }
    static get loaded() {
        return global1.gracidea.loaded;
    }
    static get sha() {
        return global1.gracidea.sha;
    }
    static config = {
        style: "rse",
        debug: false,
        creatures: {
            display: true,
            shiny: 1 / 8
        }
    };
}
const visible = {
    x: 16 * 4,
    y: 16 * 3
};
const loaded = {
    x: 16 * 5,
    y: 16 * 4
};
class Camera extends Renderable {
    #world;
    constructor({ world  }){
        super({
            id: "camera",
            visible: false
        });
        this.#world = world;
        this.#world.debug.addChild(this.debug);
        this.#visible = Render.Rectangle([
            0,
            0,
            visible.x / 16,
            visible.y / 16
        ]);
        this.#loaded = Render.Rectangle([
            0,
            0,
            loaded.x / 16,
            loaded.y / 16
        ]);
    }
    #visible;
    #loaded;
    async update({ debug =this.debug.visible , t , dt: dt3  }) {
        const { x: x10 , y  } = this;
        this.#visible.x = x10 - this.#visible.width / 2;
        this.#visible.y = y - this.#visible.height / 2;
        this.#loaded.x = x10 - this.#loaded.width / 2;
        this.#loaded.y = y - this.#loaded.height / 2;
        this.#world.regions.forEach((region)=>{
            for (const [id, bounds] of region.loadable){
                if (this.intersects(bounds) > Intersection.NONE) {
                    region.load(id);
                }
            }
            for (const [_, section] of region.sections){
                const i1 = this.intersects(section.bounds);
                if (i1 < Intersection.LOADED) {
                    section.destructor();
                } else if (i1 < Intersection.VISIBLE) {
                    section.hide();
                } else {
                    section.show();
                }
            }
        });
        if (debug) {
            this.debug.bounds.removeChildren();
            this.debug.bounds.addChild(Render.Graphics({
                rect: [
                    this.#loaded.x,
                    this.#loaded.y,
                    this.#loaded.width,
                    this.#loaded.height
                ],
                fill: [
                    11184810,
                    0.125
                ]
            }));
            this.debug.bounds.addChild(Render.Graphics({
                text: [
                    `x: ${x10}`,
                    `y: ${y}`,
                    `visible.x: ${this.#visible.x} to ${this.#visible.x + this.#visible.width}`,
                    `visible.y: ${this.#visible.y} to ${this.#visible.y + this.#visible.height}`,
                    `loaded.x: ${this.#loaded.x} to ${this.#loaded.x + this.#loaded.width}`,
                    `loaded.y: ${this.#loaded.y} to ${this.#loaded.y + this.#loaded.height}`, 
                ].join("\n"),
                textPosition: {
                    x: x10,
                    y
                },
                textAnchor: [
                    0.5,
                    0.5
                ],
                textStyle: {
                    fontSize: 12,
                    fontFamily: "monospace"
                },
                rect: [
                    this.#visible.x,
                    this.#visible.y,
                    this.#visible.width,
                    this.#visible.height
                ],
                fill: [
                    14540253,
                    0.125
                ]
            }));
        }
        return super.update({
            t,
            dt: dt3,
            debug: false
        });
    }
    intersects(rectangle) {
        if (!this.#loaded.intersects(rectangle)) {
            return Intersection.NONE;
        } else if (!this.#visible.intersects(rectangle)) {
            return Intersection.LOADED;
        }
        return Intersection.VISIBLE;
    }
    place({ x: x11 , y  }) {
        this.#world.sprite.position.set(-x11 * 16 + global1.document.body.clientWidth / 2, -y * 16 + global1.document.body.clientHeight / 2);
    }
    get x() {
        return Math.floor((-this.#world.sprite.position.x + global1.document.body.clientWidth / 2) / 16);
    }
    get y() {
        return Math.floor((-this.#world.sprite.position.y + global1.document.body.clientHeight / 2) / 16);
    }
}
class Region extends Renderable {
    world;
    sections = new Map();
    constructor({ world , id , x: x12 , y  }){
        super({
            id
        });
        this.sprite.position.set(x12, y);
        this.world = world;
        this.init();
    }
    destructor() {
        this.world.regions.delete(this.id);
        return super.destructor();
    }
    async init() {
        const { sections  } = await fetch(`/api/maps/${this.id}`).then((res)=>res.json()
        );
        for (const { id ="" , x: x13 = 0 , y =0 , width =0 , height =0  } of sections){
            this.loadable.set(id, Render.Rectangle([
                x13 / 16,
                y / 16,
                width / 16,
                height / 16
            ]));
        }
        return super.init({
            parent: this.world
        });
    }
    loadable = new Map();
    async load(id) {
        if (!this.sections.has(id)) {
            this.sections.set(id, new Section({
                region: this,
                id,
                bounds: this.loadable.get(id)
            }));
        }
    }
}
class World extends Renderable {
    regions = new Map();
    camera;
    constructor(){
        super({
            id: "gracidea"
        });
        this.camera = new Camera({
            world: this
        });
        this.init();
    }
    async init() {
        const { regions  } = await fetch("/api/maps").then((res)=>res.json()
        );
        for (const { id ="" , x: x14 = 0 , y =0  } of regions){
            this.regions.set(id, new Region({
                world: this,
                id,
                x: x14,
                y
            }));
        }
        this.#sea.sprite = this.sprite.addChild(Render.TilingSprite());
        return super.init({
            parent: App.rendering.stage
        });
    }
    #sea = {
        sprite: null,
        frame: 0,
        dt: 0,
        resize: true
    };
    async update({ t , dt: dt4  }) {
        if (this.#sea.sprite) {
            const { frames , speed  } = Render.tileset.animated[2374];
            this.#sea.dt += speed * dt4;
            if (this.#sea.dt > 2) {
                this.#sea.frame = (this.#sea.frame + 1) % frames.length;
                this.#sea.sprite.texture = Render.Texture(frames[this.#sea.frame]);
                this.#sea.dt = 0;
            }
            if (this.#sea.resize) {
                this.#sea.sprite.width = Math.round(2 + App.rendering.screen.width / 16) * 16;
                this.#sea.sprite.height = Math.round(2 + App.rendering.screen.height / 16) * 16;
                this.#sea.resize = false;
            }
            this.#sea.sprite.position.set(-Math.floor(1 + this.sprite.position.x / 16) * 16, -Math.floor(1 + this.sprite.position.y / 16) * 16);
        }
        return super.update({
            t,
            dt: dt4,
            debug: false
        });
    }
    static debug = {
        text: ""
    };
}
class Section extends Renderable {
    region;
    bounds = Render.Rectangle();
    areas = new Set();
    constructor({ region , id , bounds  }){
        super({
            id,
            visible: false
        });
        const { x: x15 , y  } = bounds;
        this.sprite.position.set(x15 * 16, y * 16);
        this.sprite.sortableChildren = true;
        this.region = region;
        Object.assign(this.bounds, bounds);
        this.init();
    }
    destructor() {
        this.region.sections.delete(this.id);
        this.areas.forEach((area)=>area.destructor()
        );
        return super.destructor();
    }
    data;
    async init() {
        Object.assign(this, {
            data: await fetch(`/api/maps/${this.id}`).then((res)=>res.json()
            )
        });
        return super.init({
            parent: this.region
        });
    }
    #loaded = false;
    async load() {
        if (this.#loaded) {
            return;
        }
        this.#loaded = true;
        await this.ready;
        const { chunks , areas  } = this.data;
        this.debug.addChild(Render.Graphics({
            rect: [
                0,
                0,
                this.bounds.width,
                this.bounds.height
            ],
            stroke: [
                1,
                4036976,
                0.5
            ],
            fill: [
                4036976,
                0.125
            ]
        }));
        for (const { x: X1 , y: Y1 , tiles  } of chunks){
            for(let i5 = 0; i5 < tiles.length; i5++){
                const frame = tiles[i5];
                if (frame) {
                    const x16 = X1 + i5 % 16, y = Y1 + Math.floor(i5 / 16);
                    if (frame) {
                        this.sprite.addChild(Render.Sprite({
                            frame,
                            x: x16,
                            y,
                            z: Render.tileset.zindex[`${frame}`] ?? 0
                        }));
                    }
                }
            }
        }
        for (const area of areas){
            this.areas.add(new Area({
                section: this,
                data: area
            }));
        }
        if (App.config.debug) {
            console.debug(`loaded: ${this.constructor.name}#${this.id}`);
        }
    }
    show() {
        this.load();
        this.sprite.visible = true;
    }
}
class Area extends Renderable {
    section;
    data;
    polygon;
    npcs = new Set();
    constructor({ section , data  }){
        super({
            id: data.name
        });
        this.section = section;
        this.data = data;
        this.polygon = Render.Polygon(this.data.points);
        this.section.debug.addChild(this.debug);
    }
    destructor() {
        this.section.areas.delete(this);
        this.npcs.forEach((npc)=>npc.destructor()
        );
        return super.destructor();
    }
    contains({ x: x17 , y  }) {
        return this.polygon.contains(x17 * 16, y * 16);
    }
    get encounters() {
        return this.section.data.encounters?.[this.id] ?? null;
    }
    async update({ debug =this.debug.visible , t , dt: dt5  }) {
        if (this.data.type === "creatures") {
            if (App.config.creatures.display && this.npcs.size < 1) {
                if (this.encounters) {
                    this.npcs.add(new Creature({
                        area: this
                    }));
                }
            }
        }
        if (this.data.type === "people") {
            if (this.npcs.size < 1) {
                this.npcs.add(new Human({
                    area: this
                }));
            }
        }
        if (debug && this.dirty) {
            this.debug.bounds.removeChildren();
            this.debug.bounds.addChild(Render.Graphics({
                text: `${this.id}`,
                polygon: this.polygon,
                ...Renderable.debug,
                ...this.constructor.debug,
                textPosition: {
                    x: this.polygon.points[0] / 16,
                    y: this.polygon.points[1] / 16
                },
                ...this.contains(Controller.instance.cursor) ? {
                    stroke: [
                        3,
                        16777215,
                        0.5
                    ]
                } : {
                }
            }));
        }
        return super.update({
            t,
            dt: dt5,
            debug: false
        });
    }
    static debug = {
        stroke: [
            1,
            8721483,
            0.5
        ],
        fill: [
            8721483,
            0.125
        ],
        textStyle: {
            align: "center",
            fontSize: 10,
            fill: "#85144B",
            fontFamily: "monospace"
        }
    };
}
class Creature extends NPC {
    name = "";
    constructor({ area  }){
        super({
            area
        });
        let random = Math.random();
        for(const name in this.area.encounters){
            const rate = this.area.encounters[name];
            if (random <= rate) {
                this.name = name;
                break;
            }
            random -= rate;
        }
        this.sprite.alpha = 0;
        this.#lifetime = Math.floor(100 + Math.random() * 200);
        this.init({
            frame: `${Math.random() < App.config.creatures.shiny ? "shiny" : "regular"}/${this.name}`,
            random: true
        });
        const effects = [];
        if (this.area.data.name in Render.effects.creature.area) {
            effects.push(Render.effects.creature.area[this.area.data.name]);
        }
        if (this.name in Render.effects.creature.name) {
            effects.push(Render.effects.creature.name[this.name]);
        }
        if (effects.length) {
            this.effects(...effects);
        }
    }
    #lifetime = Infinity;
    get tracker() {
        return this.#lifetime;
    }
    refresh() {
        this.#lifetime--;
        if (this.#lifetime <= 0) {
            if (this.sprite.alpha > 0.1) {
                this.sprite.alpha *= 0.9;
            } else {
                return this.destructor();
            }
        } else if (this.sprite.alpha < 1) {
            this.sprite.alpha = Math.min(1, this.sprite.alpha * 1.2);
            if (!this.sprite.alpha) {
                this.sprite.alpha = 0.1;
            }
        }
        return super.refresh();
    }
    action() {
        this.wander();
    }
}
class Controller {
    static instance = null;
    constructor({ target  }){
        this.#scrollers();
        this.target = target;
        this.focus(target);
        Controller.instance = this;
    }
    focus(element) {
        this.#focus = element;
    }
    #focus = null;
    target;
     #scrollers() {
        let click = {
            x: 0,
            y: 0,
            active: false
        };
        let touch = {
            x: 0,
            y: 0
        };
        const sync = debounce(()=>this.#sync()
        , 50);
        App.rendering.view.addEventListener("touchstart", (event)=>{
            touch = {
                x: event.touches[0].pageX,
                y: event.touches[0].pageY
            };
        });
        App.rendering.view.addEventListener("mousedown", (event)=>{
            click = {
                x: event.pageX,
                y: event.pageY,
                active: true
            };
        });
        App.rendering.view.addEventListener("touchmove", (event)=>{
            const delta = {
                x: touch.x - event.touches[0].pageX,
                y: touch.y - event.touches[0].pageY
            };
            touch = {
                x: event.touches[0].pageX,
                y: event.touches[0].pageY
            };
            this.#update({
                delta
            });
        });
        global1.document.addEventListener("mousemove", (event)=>{
            if (click.active) {
                if (event.buttons === 0) {
                    click.active = false;
                    return;
                }
                const delta = {
                    x: click.x - event.pageX,
                    y: click.y - event.pageY
                };
                click = {
                    x: event.pageX,
                    y: event.pageY,
                    active: true
                };
                this.#update({
                    delta
                });
            }
            this.#cursor = {
                x: event.clientX,
                y: event.clientY
            };
            sync();
        });
        App.rendering.view.addEventListener("wheel", (event)=>{
            event.preventDefault();
            this.#update({
                delta: {
                    x: event.deltaX,
                    y: event.deltaY
                }
            });
        });
    }
     #update({ delta  }) {
        if (this.#focus) {
            if (delta) {
                this.#focus.sprite.position.set(Math.round(this.#focus.sprite.position.x - delta.x), Math.round(this.#focus.sprite.position.y - delta.y));
            }
        }
    }
     #sync() {
        const { x , y  } = this.cursor;
        global1.document.querySelector("#cursor-x").innerText = x;
        global1.document.querySelector("#cursor-y").innerText = y;
    }
    get camera() {
        return {
            x: Math.floor((-this.target.sprite.position.x + global1.document.body.clientWidth / 2) / 16),
            y: Math.floor((-this.target.sprite.position.y + global1.document.body.clientHeight / 2) / 16)
        };
    }
    #cursor = {
        x: 0,
        y: 0
    };
    get cursor() {
        return {
            x: Math.floor((-this.target.sprite.position.x + this.#cursor.x) / 16),
            y: Math.floor((-this.target.sprite.position.y + this.#cursor.y) / 16)
        };
    }
}
var Pattern;
(function(Pattern1) {
    Pattern1["patrol"] = "patrol";
    Pattern1["loop"] = "loop";
    Pattern1["wander"] = "wander";
    Pattern1["fixed"] = "fixed";
    Pattern1["lookaround"] = "lookaround";
})(Pattern || (Pattern = {
}));
var Type;
(function(Type1) {
    Type1["people"] = "people";
    Type1["creatures"] = "creatures";
    Type1["regions"] = "regions";
    Type1["locations"] = "locations";
})(Type || (Type = {
}));
var Intersection;
(function(Intersection1) {
    Intersection1[Intersection1["NONE"] = 0] = "NONE";
    Intersection1[Intersection1["LOADED"] = 1] = "LOADED";
    Intersection1[Intersection1["VISIBLE"] = 2] = "VISIBLE";
})(Intersection || (Intersection = {
}));
global1.gracidea.app = await App.setup();
