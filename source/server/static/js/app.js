const global1 = globalThis;
const TILE_SIZE = 16;
const CHUNK_SIZE = 32;
const ANIMATED = {
    2266: {
        frames: [
            2266,
            2267,
            2268,
            2269
        ].map((frame)=>`${frame}`
        ),
        speed: 0.025
    },
    2374: {
        frames: [
            2374,
            2375,
            2376,
            2377,
            2378,
            2379,
            2380,
            2381
        ].map((frame)=>`${frame}`
        ),
        speed: 0.075
    },
    658: {
        frames: [
            658,
            659,
            660,
            659
        ].map((frame)=>`${frame}`
        ),
        speed: 0.05
    },
    661: {
        frames: [
            661,
            662,
            663,
            664,
            663,
            664,
            663,
            664,
            663,
            664,
            662,
            661,
            661,
            661
        ].map((frame)=>`${frame}`
        ),
        speed: 0.05
    },
    774: {
        frames: [
            774,
            775,
            776,
            777,
            776,
            777,
            776,
            777,
            776,
            777,
            775,
            774,
            774,
            774
        ].map((frame)=>`${frame}`
        ),
        speed: 0.05
    }
};
var t11 = setTimeout;
function e30(t1) {
    return Boolean(t1 && (void 0) !== t1.length);
}
function r49() {
}
function i(t1) {
    if (!(this instanceof i)) throw new TypeError("Promises must be constructed via new");
    if ("function" != typeof t1) throw new TypeError("not a function");
    this._state = 0, this._handled = !1, this._value = void 0, this._deferreds = [], u(t1, this);
}
function n1(t1, e1) {
    for(; 3 === t1._state;)t1 = t1._value;
    0 !== t1._state ? (t1._handled = !0, i._immediateFn(function() {
        var r1 = 1 === t1._state ? e1.onFulfilled : e1.onRejected;
        if (null !== r1) {
            var i1;
            try {
                i1 = r1(t1._value);
            } catch (t2) {
                return void s37(e1.promise, t2);
            }
            o1(e1.promise, i1);
        } else (1 === t1._state ? o1 : s37)(e1.promise, t1._value);
    })) : t1._deferreds.push(e1);
}
function o1(t1, e1) {
    try {
        if (e1 === t1) throw new TypeError("A promise cannot be resolved with itself.");
        if (e1 && ("object" == typeof e1 || "function" == typeof e1)) {
            var r1 = e1.then;
            if (e1 instanceof i) return t1._state = 3, t1._value = e1, void a32(t1);
            if ("function" == typeof r1) return void u((n2 = r1, o2 = e1, function() {
                n2.apply(o2, arguments);
            }), t1);
        }
        t1._state = 1, t1._value = e1, a32(t1);
    } catch (e2) {
        s37(t1, e2);
    }
    var n2, o2;
}
function s37(t1, e1) {
    t1._state = 2, t1._value = e1, a32(t1);
}
function a32(t1) {
    2 === t1._state && 0 === t1._deferreds.length && i._immediateFn(function() {
        t1._handled || i._unhandledRejectionFn(t1._value);
    });
    for(var e1 = 0, r2 = t1._deferreds.length; e1 < r2; e1++)n1(t1, t1._deferreds[e1]);
    t1._deferreds = null;
}
function h(t1, e1, r2) {
    this.onFulfilled = "function" == typeof t1 ? t1 : null, this.onRejected = "function" == typeof e1 ? e1 : null, this.promise = r2;
}
function u(t1, e1) {
    var r2 = !1;
    try {
        t1(function(t2) {
            r2 || (r2 = !0, o1(e1, t2));
        }, function(t2) {
            r2 || (r2 = !0, s37(e1, t2));
        });
    } catch (t2) {
        if (r2) return;
        r2 = !0, s37(e1, t2);
    }
}
i.prototype.catch = function(t1) {
    return this.then(null, t1);
}, i.prototype.then = function(t1, e1) {
    var i2 = new this.constructor(r49);
    return n1(this, new h(t1, e1, i2)), i2;
}, i.prototype.finally = function(t1) {
    var e1 = this.constructor;
    return this.then(function(r2) {
        return e1.resolve(t1()).then(function() {
            return r2;
        });
    }, function(r2) {
        return e1.resolve(t1()).then(function() {
            return e1.reject(r2);
        });
    });
}, i.all = function(t1) {
    return new i(function(r2, i2) {
        if (!e30(t1)) return i2(new TypeError("Promise.all accepts an array"));
        var n2 = Array.prototype.slice.call(t1);
        if (0 === n2.length) return r2([]);
        var o2 = n2.length;
        function s1(t2, e1) {
            try {
                if (e1 && ("object" == typeof e1 || "function" == typeof e1)) {
                    var a1 = e1.then;
                    if ("function" == typeof a1) return void a1.call(e1, function(e2) {
                        s1(t2, e2);
                    }, i2);
                }
                n2[t2] = e1, 0 == --o2 && r2(n2);
            } catch (t3) {
                i2(t3);
            }
        }
        for(var a2 = 0; a2 < n2.length; a2++)s1(a2, n2[a2]);
    });
}, i.allSettled = function(t1) {
    return new this(function(e1, r2) {
        if (!t1 || (void 0) === t1.length) return r2(new TypeError(typeof t1 + " " + t1 + " is not iterable(cannot read property Symbol(Symbol.iterator))"));
        var i2 = Array.prototype.slice.call(t1);
        if (0 === i2.length) return e1([]);
        var n2 = i2.length;
        function o2(t2, r3) {
            if (r3 && ("object" == typeof r3 || "function" == typeof r3)) {
                var s1 = r3.then;
                if ("function" == typeof s1) return void s1.call(r3, function(e2) {
                    o2(t2, e2);
                }, function(r4) {
                    i2[t2] = {
                        status: "rejected",
                        reason: r4
                    }, 0 == --n2 && e1(i2);
                });
            }
            i2[t2] = {
                status: "fulfilled",
                value: r3
            }, 0 == --n2 && e1(i2);
        }
        for(var s2 = 0; s2 < i2.length; s2++)o2(s2, i2[s2]);
    });
}, i.resolve = function(t1) {
    return t1 && "object" == typeof t1 && t1.constructor === i ? t1 : new i(function(e1) {
        e1(t1);
    });
}, i.reject = function(t1) {
    return new i(function(e1, r2) {
        r2(t1);
    });
}, i.race = function(t1) {
    return new i(function(r2, n2) {
        if (!e30(t1)) return n2(new TypeError("Promise.race accepts an array"));
        for(var o2 = 0, s2 = t1.length; o2 < s2; o2++)i.resolve(t1[o2]).then(r2, n2);
    });
}, i._immediateFn = "function" == typeof setImmediate && function(t1) {
    setImmediate(t1);
} || function(e1) {
    t11(e1, 0);
}, i._unhandledRejectionFn = function(t1) {
    "undefined" != typeof console && console && console.warn("Possible Unhandled Promise Rejection:", t1);
};
var l = Object.getOwnPropertySymbols, c = Object.prototype.hasOwnProperty, d = Object.prototype.propertyIsEnumerable;
var f = function() {
    try {
        if (!Object.assign) return !1;
        var t1 = new String("abc");
        if (t1[5] = "de", "5" === Object.getOwnPropertyNames(t1)[0]) return !1;
        for(var e1 = {
        }, r2 = 0; r2 < 10; r2++)e1["_" + String.fromCharCode(r2)] = r2;
        if ("0123456789" !== Object.getOwnPropertyNames(e1).map(function(t2) {
            return e1[t2];
        }).join("")) return !1;
        var i2 = {
        };
        return "abcdefghijklmnopqrst".split("").forEach(function(t2) {
            i2[t2] = t2;
        }), "abcdefghijklmnopqrst" === Object.keys(Object.assign({
        }, i2)).join("");
    } catch (t2) {
        return !1;
    }
}() ? Object.assign : function(t1, e1) {
    for(var r2, i2, n2 = arguments, o2 = function(t2) {
        if (null == t2) throw new TypeError("Object.assign cannot be called with null or undefined");
        return Object(t2);
    }(t1), s2 = 1; s2 < arguments.length; s2++){
        for(var a2 in r2 = Object(n2[s2]))c.call(r2, a2) && (o2[a2] = r2[a2]);
        if (l) {
            i2 = l(r2);
            for(var h1 = 0; h1 < i2.length; h1++)d.call(r2, i2[h1]) && (o2[i2[h1]] = r2[i2[h1]]);
        }
    }
    return o2;
};
if (self.Promise || (self.Promise = i), Object.assign || (Object.assign = f), Date.now && Date.prototype.getTime || (Date.now = function() {
    return (new Date).getTime();
}), !self.performance || !self.performance.now) {
    var p = Date.now();
    self.performance || (self.performance = {
    }), self.performance.now = function() {
        return Date.now() - p;
    };
}
for(var _1 = Date.now(), m = [
    "ms",
    "moz",
    "webkit",
    "o"
], v = 0; v < m.length && !self.requestAnimationFrame; ++v){
    var y = m[v];
    self.requestAnimationFrame = self[y + "RequestAnimationFrame"], self.cancelAnimationFrame = self[y + "CancelAnimationFrame"] || self[y + "CancelRequestAnimationFrame"];
}
self.requestAnimationFrame || (self.requestAnimationFrame = function(t1) {
    if ("function" != typeof t1) throw new TypeError(t1 + "is not a function");
    var e1 = Date.now(), r2 = 16 + _1 - e1;
    return r2 < 0 && (r2 = 0), _1 = e1, self.setTimeout(function() {
        _1 = Date.now(), t1(performance.now());
    }, r2);
}), self.cancelAnimationFrame || (self.cancelAnimationFrame = function(t1) {
    return clearTimeout(t1);
}), Math.sign || (Math.sign = function(t1) {
    return 0 === (t1 = Number(t1)) || isNaN(t1) ? t1 : t1 > 0 ? 1 : -1;
}), Number.isInteger || (Number.isInteger = function(t1) {
    return "number" == typeof t1 && isFinite(t1) && Math.floor(t1) === t1;
}), self.ArrayBuffer || (self.ArrayBuffer = Array), self.Float32Array || (self.Float32Array = Array), self.Uint32Array || (self.Uint32Array = Array), self.Uint16Array || (self.Uint16Array = Array), self.Uint8Array || (self.Uint8Array = Array), self.Int32Array || (self.Int32Array = Array);
var g = /iPhone/i, b = /iPod/i, x9 = /iPad/i, T = /\biOS-universal(?:.+)Mac\b/i, E = /\bAndroid(?:.+)Mobile\b/i, A = /Android/i, S2 = /(?:SD4930UR|\bSilk(?:.+)Mobile\b)/i, O = /Silk/i, R = /Windows Phone/i, w = /\bWindows(?:.+)ARM\b/i, P = /BlackBerry/i, I = /BB10/i, M = /Opera Mini/i, D = /\b(CriOS|Chrome)(?:.+)Mobile/i, C = /Mobile(?:.+)Firefox\b/i, N = function(t1) {
    return (void 0) !== t1 && "MacIntel" === t1.platform && "number" == typeof t1.maxTouchPoints && t1.maxTouchPoints > 1 && "undefined" == typeof MSStream;
};
var L = function(t1) {
    var e1 = {
        userAgent: "",
        platform: "",
        maxTouchPoints: 0
    };
    t1 || "undefined" == typeof navigator ? "string" == typeof t1 ? e1.userAgent = t1 : t1 && t1.userAgent && (e1 = {
        userAgent: t1.userAgent,
        platform: t1.platform,
        maxTouchPoints: t1.maxTouchPoints || 0
    }) : e1 = {
        userAgent: navigator.userAgent,
        platform: navigator.platform,
        maxTouchPoints: navigator.maxTouchPoints || 0
    };
    var r2 = e1.userAgent, i2 = r2.split("[FBAN");
    (void 0) !== i2[1] && (r2 = i2[0]), (void 0) !== (i2 = r2.split("Twitter"))[1] && (r2 = i2[0]);
    var n2 = function(t2) {
        return function(e2) {
            return e2.test(t2);
        };
    }(r2), o2 = {
        apple: {
            phone: n2(g) && !n2(R),
            ipod: n2(b),
            tablet: !n2(g) && (n2(x9) || N(e1)) && !n2(R),
            universal: n2(T),
            device: (n2(g) || n2(b) || n2(x9) || n2(T) || N(e1)) && !n2(R)
        },
        amazon: {
            phone: n2(S2),
            tablet: !n2(S2) && n2(O),
            device: n2(S2) || n2(O)
        },
        android: {
            phone: !n2(R) && n2(S2) || !n2(R) && n2(E),
            tablet: !n2(R) && !n2(S2) && !n2(E) && (n2(O) || n2(A)),
            device: !n2(R) && (n2(S2) || n2(O) || n2(E) || n2(A)) || n2(/\bokhttp\b/i)
        },
        windows: {
            phone: n2(R),
            tablet: n2(w),
            device: n2(R) || n2(w)
        },
        other: {
            blackberry: n2(P),
            blackberry10: n2(I),
            opera: n2(M),
            firefox: n2(C),
            chrome: n2(D),
            device: n2(P) || n2(I) || n2(M) || n2(C) || n2(D)
        },
        any: !1,
        phone: !1,
        tablet: !1
    };
    return o2.any = o2.apple.device || o2.android.device || o2.windows.device || o2.other.device, o2.phone = o2.apple.phone || o2.android.phone || o2.windows.phone, o2.tablet = o2.apple.tablet || o2.android.tablet || o2.windows.tablet, o2;
}(self.navigator), F = {
    MIPMAP_TEXTURES: 1,
    ANISOTROPIC_LEVEL: 0,
    RESOLUTION: 1,
    FILTER_RESOLUTION: 1,
    SPRITE_MAX_TEXTURES: function(t1) {
        var e1, r2 = !0;
        (L.tablet || L.phone) && (L.apple.device && (e1 = navigator.userAgent.match(/OS (\d+)_(\d+)?/)) && parseInt(e1[1], 10) < 11 && (r2 = !1), L.android.device && (e1 = navigator.userAgent.match(/Android\s([0-9.]*)/)) && parseInt(e1[1], 10) < 7 && (r2 = !1));
        return r2 ? 32 : 4;
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
    GC_MODE: 0,
    GC_MAX_IDLE: 3600,
    GC_MAX_CHECK_COUNT: 600,
    WRAP_MODE: 33071,
    SCALE_MODE: 1,
    PRECISION_VERTEX: "highp",
    PRECISION_FRAGMENT: L.apple.device ? "highp" : "mediump",
    CAN_UPLOAD_SAME_BUFFER: !L.apple.device,
    CREATE_IMAGE_BITMAP: !1,
    ROUND_PIXELS: !1
}, B = "undefined" != typeof globalThis ? globalThis : "undefined" != typeof window ? window : "undefined" != typeof global ? global : "undefined" != typeof self ? self : {
};
function U(t1) {
    return t1 && t1.__esModule && Object.prototype.hasOwnProperty.call(t1, "default") ? t1.default : t1;
}
function G(t1, e1, r2) {
    return t1(r2 = {
        path: e1,
        exports: {
        },
        require: function(t2, e2) {
            return (function() {
                throw new Error("Dynamic requires are not currently supported by @rollup/plugin-commonjs");
            })(null == e2 && r2.path);
        }
    }, r2.exports), r2.exports;
}
var X2 = G(function(t1) {
    var e1 = Object.prototype.hasOwnProperty, r2 = "~";
    function i2() {
    }
    function n2(t2, e2, r3) {
        this.fn = t2, this.context = e2, this.once = r3 || !1;
    }
    function o2(t2, e2, i3, o3, s2) {
        if ("function" != typeof i3) throw new TypeError("The listener must be a function");
        var a3 = new n2(i3, o3 || t2, s2), h2 = r2 ? r2 + e2 : e2;
        return t2._events[h2] ? t2._events[h2].fn ? t2._events[h2] = [
            t2._events[h2],
            a3
        ] : t2._events[h2].push(a3) : (t2._events[h2] = a3, t2._eventsCount++), t2;
    }
    function s2(t2, e2) {
        0 == --t2._eventsCount ? t2._events = new i2 : delete t2._events[e2];
    }
    function a3() {
        this._events = new i2, this._eventsCount = 0;
    }
    Object.create && (i2.prototype = Object.create(null), (new i2).__proto__ || (r2 = !1)), a3.prototype.eventNames = function() {
        var t2, i3, n3 = [];
        if (0 === this._eventsCount) return n3;
        for(i3 in t2 = this._events)e1.call(t2, i3) && n3.push(r2 ? i3.slice(1) : i3);
        return Object.getOwnPropertySymbols ? n3.concat(Object.getOwnPropertySymbols(t2)) : n3;
    }, a3.prototype.listeners = function(t2) {
        var e2 = r2 ? r2 + t2 : t2, i3 = this._events[e2];
        if (!i3) return [];
        if (i3.fn) return [
            i3.fn
        ];
        for(var n3 = 0, o3 = i3.length, s3 = new Array(o3); n3 < o3; n3++)s3[n3] = i3[n3].fn;
        return s3;
    }, a3.prototype.listenerCount = function(t2) {
        var e2 = r2 ? r2 + t2 : t2, i3 = this._events[e2];
        return i3 ? i3.fn ? 1 : i3.length : 0;
    }, a3.prototype.emit = function(t2, e2, i3, n3, o3, s3) {
        var a4 = arguments, h2 = r2 ? r2 + t2 : t2;
        if (!this._events[h2]) return !1;
        var u1, l1, c1 = this._events[h2], d1 = arguments.length;
        if (c1.fn) {
            switch(c1.once && this.removeListener(t2, c1.fn, void 0, !0), d1){
                case 1:
                    return c1.fn.call(c1.context), !0;
                case 2:
                    return c1.fn.call(c1.context, e2), !0;
                case 3:
                    return c1.fn.call(c1.context, e2, i3), !0;
                case 4:
                    return c1.fn.call(c1.context, e2, i3, n3), !0;
                case 5:
                    return c1.fn.call(c1.context, e2, i3, n3, o3), !0;
                case 6:
                    return c1.fn.call(c1.context, e2, i3, n3, o3, s3), !0;
            }
            for(l1 = 1, u1 = new Array(d1 - 1); l1 < d1; l1++)u1[l1 - 1] = a4[l1];
            c1.fn.apply(c1.context, u1);
        } else {
            var f1, p = c1.length;
            for(l1 = 0; l1 < p; l1++)switch(c1[l1].once && this.removeListener(t2, c1[l1].fn, void 0, !0), d1){
                case 1:
                    c1[l1].fn.call(c1[l1].context);
                    break;
                case 2:
                    c1[l1].fn.call(c1[l1].context, e2);
                    break;
                case 3:
                    c1[l1].fn.call(c1[l1].context, e2, i3);
                    break;
                case 4:
                    c1[l1].fn.call(c1[l1].context, e2, i3, n3);
                    break;
                default:
                    if (!u1) for(f1 = 1, u1 = new Array(d1 - 1); f1 < d1; f1++)u1[f1 - 1] = a4[f1];
                    c1[l1].fn.apply(c1[l1].context, u1);
            }
        }
        return !0;
    }, a3.prototype.on = function(t2, e2, r3) {
        return o2(this, t2, e2, r3, !1);
    }, a3.prototype.once = function(t2, e2, r3) {
        return o2(this, t2, e2, r3, !0);
    }, a3.prototype.removeListener = function(t2, e2, i3, n3) {
        var o3 = r2 ? r2 + t2 : t2;
        if (!this._events[o3]) return this;
        if (!e2) return s2(this, o3), this;
        var a4 = this._events[o3];
        if (a4.fn) a4.fn !== e2 || n3 && !a4.once || i3 && a4.context !== i3 || s2(this, o3);
        else {
            for(var h2 = 0, u1 = [], l1 = a4.length; h2 < l1; h2++)(a4[h2].fn !== e2 || n3 && !a4[h2].once || i3 && a4[h2].context !== i3) && u1.push(a4[h2]);
            u1.length ? this._events[o3] = 1 === u1.length ? u1[0] : u1 : s2(this, o3);
        }
        return this;
    }, a3.prototype.removeAllListeners = function(t2) {
        var e2;
        return t2 ? (e2 = r2 ? r2 + t2 : t2, this._events[e2] && s2(this, e2)) : (this._events = new i2, this._eventsCount = 0), this;
    }, a3.prototype.off = a3.prototype.removeListener, a3.prototype.addListener = a3.prototype.on, a3.prefixed = r2, a3.EventEmitter = a3, t1.exports = a3;
}), k = H, j = H;
function H(t1, e1, r2) {
    r2 = r2 || 2;
    var i2, n2, o2, s2, a3, h3, u2, l2 = e1 && e1.length, c1 = l2 ? e1[0] * r2 : t1.length, d1 = Y(t1, 0, c1, r2, !0), f2 = [];
    if (!d1 || d1.next === d1.prev) return f2;
    if (l2 && (d1 = (function(t2, e2, r3, i3) {
        var n3, o3, s3, a4, h4, u3 = [];
        for(n3 = 0, o3 = e2.length; n3 < o3; n3++)s3 = e2[n3] * i3, a4 = n3 < o3 - 1 ? e2[n3 + 1] * i3 : t2.length, (h4 = Y(t2, s3, a4, i3, !1)) === h4.next && (h4.steiner = !0), u3.push(et(h4));
        for(u3.sort(J), n3 = 0; n3 < u3.length; n3++)Q(u3[n3], r3), r3 = V(r3, r3.next);
        return r3;
    })(t1, e1, d1, r2)), t1.length > 80 * r2) {
        i2 = o2 = t1[0], n2 = s2 = t1[1];
        for(var p = r2; p < c1; p += r2)(a3 = t1[p]) < i2 && (i2 = a3), (h3 = t1[p + 1]) < n2 && (n2 = h3), a3 > o2 && (o2 = a3), h3 > s2 && (s2 = h3);
        u2 = 0 !== (u2 = Math.max(o2 - i2, s2 - n2)) ? 1 / u2 : 0;
    }
    return z3(d1, f2, r2, i2, n2, u2), f2;
}
function Y(t1, e1, r2, i2, n2) {
    var o2, s2;
    if (n2 === pt(t1, e1, r2, i2) > 0) for(o2 = e1; o2 < r2; o2 += i2)s2 = ct(o2, t1[o2], t1[o2 + 1], s2);
    else for(o2 = r2 - i2; o2 >= e1; o2 -= i2)s2 = ct(o2, t1[o2], t1[o2 + 1], s2);
    return s2 && ot(s2, s2.next) && (dt(s2), s2 = s2.next), s2;
}
function V(t1, e1) {
    if (!t1) return t1;
    e1 || (e1 = t1);
    var r2, i2 = t1;
    do {
        if (r2 = !1, i2.steiner || !ot(i2, i2.next) && 0 !== nt(i2.prev, i2, i2.next)) i2 = i2.next;
        else {
            if (dt(i2), (i2 = e1 = i2.prev) === i2.next) break;
            r2 = !0;
        }
    }while (r2 || i2 !== e1)
    return e1;
}
function z3(t1, e1, r2, i2, n2, o2, s2) {
    if (t1) {
        !s2 && o2 && (function(t2, e2, r3, i3) {
            var n3 = t2;
            do {
                null === n3.z && (n3.z = tt(n3.x, n3.y, e2, r3, i3)), n3.prevZ = n3.prev, n3.nextZ = n3.next, n3 = n3.next;
            }while (n3 !== t2)
            n3.prevZ.nextZ = null, n3.prevZ = null, (function(t3) {
                var e3, r4, i4, n4, o3, s3, a3, h3, u2 = 1;
                do {
                    for(r4 = t3, t3 = null, o3 = null, s3 = 0; r4;){
                        for(s3++, i4 = r4, a3 = 0, e3 = 0; e3 < u2 && (a3++, i4 = i4.nextZ); e3++);
                        for(h3 = u2; a3 > 0 || h3 > 0 && i4;)0 !== a3 && (0 === h3 || !i4 || r4.z <= i4.z) ? (n4 = r4, r4 = r4.nextZ, a3--) : (n4 = i4, i4 = i4.nextZ, h3--), o3 ? o3.nextZ = n4 : t3 = n4, n4.prevZ = o3, o3 = n4;
                        r4 = i4;
                    }
                    o3.nextZ = null, u2 *= 2;
                }while (s3 > 1)
            })(n3);
        })(t1, i2, n2, o2);
        for(var a3, h3, u2 = t1; t1.prev !== t1.next;)if (a3 = t1.prev, h3 = t1.next, o2 ? q(t1, i2, n2, o2) : W2(t1)) e1.push(a3.i / r2), e1.push(t1.i / r2), e1.push(h3.i / r2), dt(t1), t1 = h3.next, u2 = h3.next;
        else if ((t1 = h3) === u2) {
            s2 ? 1 === s2 ? z3(t1 = K(V(t1), e1, r2), e1, r2, i2, n2, o2, 2) : 2 === s2 && Z(t1, e1, r2, i2, n2, o2) : z3(V(t1), e1, r2, i2, n2, o2, 1);
            break;
        }
    }
}
function W2(t1) {
    var e1 = t1.prev, r2 = t1, i2 = t1.next;
    if (nt(e1, r2, i2) >= 0) return !1;
    for(var n2 = t1.next.next; n2 !== t1.prev;){
        if (rt(e1.x, e1.y, r2.x, r2.y, i2.x, i2.y, n2.x, n2.y) && nt(n2.prev, n2, n2.next) >= 0) return !1;
        n2 = n2.next;
    }
    return !0;
}
function q(t1, e1, r2, i2) {
    var n2 = t1.prev, o2 = t1, s2 = t1.next;
    if (nt(n2, o2, s2) >= 0) return !1;
    for(var a4 = n2.x < o2.x ? n2.x < s2.x ? n2.x : s2.x : o2.x < s2.x ? o2.x : s2.x, h4 = n2.y < o2.y ? n2.y < s2.y ? n2.y : s2.y : o2.y < s2.y ? o2.y : s2.y, u3 = n2.x > o2.x ? n2.x > s2.x ? n2.x : s2.x : o2.x > s2.x ? o2.x : s2.x, l2 = n2.y > o2.y ? n2.y > s2.y ? n2.y : s2.y : o2.y > s2.y ? o2.y : s2.y, c1 = tt(a4, h4, e1, r2, i2), d1 = tt(u3, l2, e1, r2, i2), f2 = t1.prevZ, p = t1.nextZ; f2 && f2.z >= c1 && p && p.z <= d1;){
        if (f2 !== t1.prev && f2 !== t1.next && rt(n2.x, n2.y, o2.x, o2.y, s2.x, s2.y, f2.x, f2.y) && nt(f2.prev, f2, f2.next) >= 0) return !1;
        if (f2 = f2.prevZ, p !== t1.prev && p !== t1.next && rt(n2.x, n2.y, o2.x, o2.y, s2.x, s2.y, p.x, p.y) && nt(p.prev, p, p.next) >= 0) return !1;
        p = p.nextZ;
    }
    for(; f2 && f2.z >= c1;){
        if (f2 !== t1.prev && f2 !== t1.next && rt(n2.x, n2.y, o2.x, o2.y, s2.x, s2.y, f2.x, f2.y) && nt(f2.prev, f2, f2.next) >= 0) return !1;
        f2 = f2.prevZ;
    }
    for(; p && p.z <= d1;){
        if (p !== t1.prev && p !== t1.next && rt(n2.x, n2.y, o2.x, o2.y, s2.x, s2.y, p.x, p.y) && nt(p.prev, p, p.next) >= 0) return !1;
        p = p.nextZ;
    }
    return !0;
}
function K(t1, e1, r2) {
    var i2 = t1;
    do {
        var n2 = i2.prev, o2 = i2.next.next;
        !ot(n2, o2) && st(n2, i2, i2.next, o2) && ut(n2, o2) && ut(o2, n2) && (e1.push(n2.i / r2), e1.push(i2.i / r2), e1.push(o2.i / r2), dt(i2), dt(i2.next), i2 = t1 = o2), i2 = i2.next;
    }while (i2 !== t1)
    return V(i2);
}
function Z(t1, e1, r2, i2, n3, o3) {
    var s2 = t1;
    do {
        for(var a4 = s2.next.next; a4 !== s2.prev;){
            if (s2.i !== a4.i && it(s2, a4)) {
                var h4 = lt(s2, a4);
                return s2 = V(s2, s2.next), h4 = V(h4, h4.next), z3(s2, e1, r2, i2, n3, o3), void z3(h4, e1, r2, i2, n3, o3);
            }
            a4 = a4.next;
        }
        s2 = s2.next;
    }while (s2 !== t1)
}
function J(t1, e1) {
    return t1.x - e1.x;
}
function Q(t1, e1) {
    if (e1 = (function(t2, e2) {
        var r2, i2 = e2, n3 = t2.x, o3 = t2.y, s2 = -1 / 0;
        do {
            if (o3 <= i2.y && o3 >= i2.next.y && i2.next.y !== i2.y) {
                var a5 = i2.x + (o3 - i2.y) * (i2.next.x - i2.x) / (i2.next.y - i2.y);
                if (a5 <= n3 && a5 > s2) {
                    if (s2 = a5, a5 === n3) {
                        if (o3 === i2.y) return i2;
                        if (o3 === i2.next.y) return i2.next;
                    }
                    r2 = i2.x < i2.next.x ? i2 : i2.next;
                }
            }
            i2 = i2.next;
        }while (i2 !== e2)
        if (!r2) return null;
        if (n3 === s2) return r2;
        var h5, u3 = r2, l2 = r2.x, c1 = r2.y, d1 = 1 / 0;
        i2 = r2;
        do {
            n3 >= i2.x && i2.x >= l2 && n3 !== i2.x && rt(o3 < c1 ? n3 : s2, o3, l2, c1, o3 < c1 ? s2 : n3, o3, i2.x, i2.y) && (h5 = Math.abs(o3 - i2.y) / (n3 - i2.x), ut(i2, t2) && (h5 < d1 || h5 === d1 && (i2.x > r2.x || i2.x === r2.x && $(r2, i2))) && (r2 = i2, d1 = h5)), i2 = i2.next;
        }while (i2 !== u3)
        return r2;
    })(t1, e1)) {
        var r2 = lt(e1, t1);
        V(e1, e1.next), V(r2, r2.next);
    }
}
function $(t1, e1) {
    return nt(t1.prev, t1, e1.prev) < 0 && nt(e1.next, t1, t1.next) < 0;
}
function tt(t1, e1, r3, i2, n3) {
    return (t1 = 1431655765 & ((t1 = 858993459 & ((t1 = 252645135 & ((t1 = 16711935 & ((t1 = 32767 * (t1 - r3) * n3) | t1 << 8)) | t1 << 4)) | t1 << 2)) | t1 << 1)) | (e1 = 1431655765 & ((e1 = 858993459 & ((e1 = 252645135 & ((e1 = 16711935 & ((e1 = 32767 * (e1 - i2) * n3) | e1 << 8)) | e1 << 4)) | e1 << 2)) | e1 << 1)) << 1;
}
function et(t1) {
    var e1 = t1, r3 = t1;
    do {
        (e1.x < r3.x || e1.x === r3.x && e1.y < r3.y) && (r3 = e1), e1 = e1.next;
    }while (e1 !== t1)
    return r3;
}
function rt(t1, e1, r3, i2, n3, o3, s2, a6) {
    return (n3 - s2) * (e1 - a6) - (t1 - s2) * (o3 - a6) >= 0 && (t1 - s2) * (i2 - a6) - (r3 - s2) * (e1 - a6) >= 0 && (r3 - s2) * (o3 - a6) - (n3 - s2) * (i2 - a6) >= 0;
}
function it(t1, e1) {
    return t1.next.i !== e1.i && t1.prev.i !== e1.i && !function(t2, e2) {
        var r3 = t2;
        do {
            if (r3.i !== t2.i && r3.next.i !== t2.i && r3.i !== e2.i && r3.next.i !== e2.i && st(r3, r3.next, t2, e2)) return !0;
            r3 = r3.next;
        }while (r3 !== t2)
        return !1;
    }(t1, e1) && (ut(t1, e1) && ut(e1, t1) && (function(t2, e2) {
        var r3 = t2, i2 = !1, n3 = (t2.x + e2.x) / 2, o3 = (t2.y + e2.y) / 2;
        do {
            r3.y > o3 != r3.next.y > o3 && r3.next.y !== r3.y && n3 < (r3.next.x - r3.x) * (o3 - r3.y) / (r3.next.y - r3.y) + r3.x && (i2 = !i2), r3 = r3.next;
        }while (r3 !== t2)
        return i2;
    })(t1, e1) && (nt(t1.prev, t1, e1.prev) || nt(t1, e1.prev, e1)) || ot(t1, e1) && nt(t1.prev, t1, t1.next) > 0 && nt(e1.prev, e1, e1.next) > 0);
}
function nt(t1, e1, r3) {
    return (e1.y - t1.y) * (r3.x - e1.x) - (e1.x - t1.x) * (r3.y - e1.y);
}
function ot(t1, e1) {
    return t1.x === e1.x && t1.y === e1.y;
}
function st(t1, e1, r3, i2) {
    var n3 = ht(nt(t1, e1, r3)), o3 = ht(nt(t1, e1, i2)), s2 = ht(nt(r3, i2, t1)), a6 = ht(nt(r3, i2, e1));
    return n3 !== o3 && s2 !== a6 || !(0 !== n3 || !at(t1, r3, e1)) || !(0 !== o3 || !at(t1, i2, e1)) || !(0 !== s2 || !at(r3, t1, i2)) || !(0 !== a6 || !at(r3, e1, i2));
}
function at(t1, e1, r3) {
    return e1.x <= Math.max(t1.x, r3.x) && e1.x >= Math.min(t1.x, r3.x) && e1.y <= Math.max(t1.y, r3.y) && e1.y >= Math.min(t1.y, r3.y);
}
function ht(t1) {
    return t1 > 0 ? 1 : t1 < 0 ? -1 : 0;
}
function ut(t1, e1) {
    return nt(t1.prev, t1, t1.next) < 0 ? nt(t1, e1, t1.next) >= 0 && nt(t1, t1.prev, e1) >= 0 : nt(t1, e1, t1.prev) < 0 || nt(t1, t1.next, e1) < 0;
}
function lt(t1, e1) {
    var r3 = new ft(t1.i, t1.x, t1.y), i2 = new ft(e1.i, e1.x, e1.y), n3 = t1.next, o3 = e1.prev;
    return t1.next = e1, e1.prev = t1, r3.next = n3, n3.prev = r3, i2.next = r3, r3.prev = i2, o3.next = i2, i2.prev = o3, i2;
}
function ct(t1, e1, r3, i2) {
    var n3 = new ft(t1, e1, r3);
    return i2 ? (n3.next = i2.next, n3.prev = i2, i2.next.prev = n3, i2.next = n3) : (n3.prev = n3, n3.next = n3), n3;
}
function dt(t1) {
    t1.next.prev = t1.prev, t1.prev.next = t1.next, t1.prevZ && (t1.prevZ.nextZ = t1.nextZ), t1.nextZ && (t1.nextZ.prevZ = t1.prevZ);
}
function ft(t1, e1, r3) {
    this.i = t1, this.x = e1, this.y = r3, this.prev = null, this.next = null, this.z = null, this.prevZ = null, this.nextZ = null, this.steiner = !1;
}
function pt(t1, e1, r3, i2) {
    for(var n3 = 0, o3 = e1, s2 = r3 - i2; o3 < r3; o3 += i2)n3 += (t1[s2] - t1[o3]) * (t1[o3 + 1] + t1[s2 + 1]), s2 = o3;
    return n3;
}
H.deviation = function(t1, e1, r3, i2) {
    var n3 = e1 && e1.length, o3 = n3 ? e1[0] * r3 : t1.length, s2 = Math.abs(pt(t1, 0, o3, r3));
    if (n3) for(var a6 = 0, h5 = e1.length; a6 < h5; a6++){
        var u3 = e1[a6] * r3, l2 = a6 < h5 - 1 ? e1[a6 + 1] * r3 : t1.length;
        s2 -= Math.abs(pt(t1, u3, l2, r3));
    }
    var c1 = 0;
    for(a6 = 0; a6 < i2.length; a6 += 3){
        var d1 = i2[a6] * r3, f2 = i2[a6 + 1] * r3, p = i2[a6 + 2] * r3;
        c1 += Math.abs((t1[d1] - t1[p]) * (t1[f2 + 1] - t1[d1 + 1]) - (t1[d1] - t1[f2]) * (t1[p + 1] - t1[d1 + 1]));
    }
    return 0 === s2 && 0 === c1 ? 0 : Math.abs((c1 - s2) / s2);
}, H.flatten = function(t1) {
    for(var e1 = t1[0][0].length, r3 = {
        vertices: [],
        holes: [],
        dimensions: e1
    }, i2 = 0, n3 = 0; n3 < t1.length; n3++){
        for(var o3 = 0; o3 < t1[n3].length; o3++)for(var s2 = 0; s2 < e1; s2++)r3.vertices.push(t1[n3][o3][s2]);
        n3 > 0 && (i2 += t1[n3 - 1].length, r3.holes.push(i2));
    }
    return r3;
}, k.default = j;
var _t = G(function(t1, e1) {
    !function(r3) {
        var i2 = e1 && !e1.nodeType && e1, n3 = t1 && !t1.nodeType && t1, o4 = "object" == typeof B && B;
        o4.global !== o4 && o4.window !== o4 && o4.self !== o4 || (r3 = o4);
        var s3, a6, h5 = 2147483647, u4 = 36, l3 = 1, c1 = 26, d2 = 38, f3 = 700, p = 72, _1 = 128, m1 = "-", v1 = /^xn--/, y = /[^\x20-\x7E]/, g1 = /[\x2E\u3002\uFF0E\uFF61]/g, b1 = {
            overflow: "Overflow: input needs wider integers to process",
            "not-basic": "Illegal input >= 0x80 (not a basic code point)",
            "invalid-input": "Invalid input"
        }, x1 = u4 - l3, T1 = Math.floor, E1 = String.fromCharCode;
        function A1(t2) {
            throw RangeError(b1[t2]);
        }
        function S1(t2, e2) {
            for(var r4 = t2.length, i3 = []; r4--;)i3[r4] = e2(t2[r4]);
            return i3;
        }
        function O1(t2, e2) {
            var r4 = t2.split("@"), i3 = "";
            return r4.length > 1 && (i3 = r4[0] + "@", t2 = r4[1]), i3 + S1((t2 = t2.replace(g1, ".")).split("."), e2).join(".");
        }
        function R1(t2) {
            for(var e2, r4, i3 = [], n4 = 0, o5 = t2.length; n4 < o5;)(e2 = t2.charCodeAt(n4++)) >= 55296 && e2 <= 56319 && n4 < o5 ? 56320 == (64512 & (r4 = t2.charCodeAt(n4++))) ? i3.push(((1023 & e2) << 10) + (1023 & r4) + 65536) : (i3.push(e2), n4--) : i3.push(e2);
            return i3;
        }
        function w1(t2) {
            return S1(t2, function(t3) {
                var e2 = "";
                return t3 > 65535 && (e2 += E1((t3 -= 65536) >>> 10 & 1023 | 55296), t3 = 56320 | 1023 & t3), e2 += E1(t3);
            }).join("");
        }
        function P1(t2, e2) {
            return t2 + 22 + 75 * (t2 < 26) - ((0 != e2) << 5);
        }
        function I1(t2, e2, r4) {
            var i3 = 0;
            for(t2 = r4 ? T1(t2 / f3) : t2 >> 1, t2 += T1(t2 / e2); t2 > x1 * c1 >> 1; i3 += u4)t2 = T1(t2 / x1);
            return T1(i3 + (x1 + 1) * t2 / (t2 + d2));
        }
        function M1(t2) {
            var e2, r4, i3, n4, o5, s4, a7, d3, f4, v2, y1, g2 = [], b2 = t2.length, x2 = 0, E2 = _1, S2 = p;
            for((r4 = t2.lastIndexOf(m1)) < 0 && (r4 = 0), i3 = 0; i3 < r4; ++i3)t2.charCodeAt(i3) >= 128 && A1("not-basic"), g2.push(t2.charCodeAt(i3));
            for(n4 = r4 > 0 ? r4 + 1 : 0; n4 < b2;){
                for(o5 = x2, s4 = 1, a7 = u4; n4 >= b2 && A1("invalid-input"), ((d3 = (y1 = t2.charCodeAt(n4++)) - 48 < 10 ? y1 - 22 : y1 - 65 < 26 ? y1 - 65 : y1 - 97 < 26 ? y1 - 97 : u4) >= u4 || d3 > T1((h5 - x2) / s4)) && A1("overflow"), x2 += d3 * s4, !(d3 < (f4 = a7 <= S2 ? l3 : a7 >= S2 + c1 ? c1 : a7 - S2)); a7 += u4)s4 > T1(h5 / (v2 = u4 - f4)) && A1("overflow"), s4 *= v2;
                S2 = I1(x2 - o5, e2 = g2.length + 1, 0 == o5), T1(x2 / e2) > h5 - E2 && A1("overflow"), E2 += T1(x2 / e2), x2 %= e2, g2.splice(x2++, 0, E2);
            }
            return w1(g2);
        }
        function D1(t2) {
            var e2, r4, i3, n4, o5, s4, a7, d3, f4, v2, y1, g2, b2, x2, S2, O2 = [];
            for(g2 = (t2 = R1(t2)).length, e2 = _1, r4 = 0, o5 = p, s4 = 0; s4 < g2; ++s4)(y1 = t2[s4]) < 128 && O2.push(E1(y1));
            for(i3 = n4 = O2.length, n4 && O2.push(m1); i3 < g2;){
                for(a7 = h5, s4 = 0; s4 < g2; ++s4)(y1 = t2[s4]) >= e2 && y1 < a7 && (a7 = y1);
                for(a7 - e2 > T1((h5 - r4) / (b2 = i3 + 1)) && A1("overflow"), r4 += (a7 - e2) * b2, e2 = a7, s4 = 0; s4 < g2; ++s4)if ((y1 = t2[s4]) < e2 && (++r4) > h5 && A1("overflow"), y1 == e2) {
                    for(d3 = r4, f4 = u4; !(d3 < (v2 = f4 <= o5 ? l3 : f4 >= o5 + c1 ? c1 : f4 - o5)); f4 += u4)S2 = d3 - v2, x2 = u4 - v2, O2.push(E1(P1(v2 + S2 % x2, 0))), d3 = T1(S2 / x2);
                    O2.push(E1(P1(d3, 0))), o5 = I1(r4, b2, i3 == n4), r4 = 0, ++i3;
                }
                ++r4, ++e2;
            }
            return O2.join("");
        }
        if (s3 = {
            version: "1.3.2",
            ucs2: {
                decode: R1,
                encode: w1
            },
            decode: M1,
            encode: D1,
            toASCII: function(t2) {
                return O1(t2, function(t3) {
                    return y.test(t3) ? "xn--" + D1(t3) : t3;
                });
            },
            toUnicode: function(t2) {
                return O1(t2, function(t3) {
                    return v1.test(t3) ? M1(t3.slice(4).toLowerCase()) : t3;
                });
            }
        }, i2 && n3) {
            if (t1.exports == i2) n3.exports = s3;
            else for(a6 in s3)s3.hasOwnProperty(a6) && (i2[a6] = s3[a6]);
        } else r3.punycode = s3;
    }(B);
}), mt = {
    isString: function(t1) {
        return "string" == typeof t1;
    },
    isObject: function(t1) {
        return "object" == typeof t1 && null !== t1;
    },
    isNull: function(t1) {
        return null === t1;
    },
    isNullOrUndefined: function(t1) {
        return null == t1;
    }
};
function vt(t1, e1) {
    return Object.prototype.hasOwnProperty.call(t1, e1);
}
var yt = function(t1, e1, r3, i2) {
    e1 = e1 || "&", r3 = r3 || "=";
    var n3 = {
    };
    if ("string" != typeof t1 || 0 === t1.length) return n3;
    var o4 = /\+/g;
    t1 = t1.split(e1);
    var s3 = 1000;
    i2 && "number" == typeof i2.maxKeys && (s3 = i2.maxKeys);
    var a6 = t1.length;
    s3 > 0 && a6 > s3 && (a6 = s3);
    for(var h5 = 0; h5 < a6; ++h5){
        var u4, l3, c1, d2, f3 = t1[h5].replace(o4, "%20"), p = f3.indexOf(r3);
        p >= 0 ? (u4 = f3.substr(0, p), l3 = f3.substr(p + 1)) : (u4 = f3, l3 = ""), c1 = decodeURIComponent(u4), d2 = decodeURIComponent(l3), vt(n3, c1) ? Array.isArray(n3[c1]) ? n3[c1].push(d2) : n3[c1] = [
            n3[c1],
            d2
        ] : n3[c1] = d2;
    }
    return n3;
}, gt = function(t1) {
    switch(typeof t1){
        case "string":
            return t1;
        case "boolean":
            return t1 ? "true" : "false";
        case "number":
            return isFinite(t1) ? t1 : "";
        default:
            return "";
    }
}, bt = function(t1, e1, r3, i2) {
    return e1 = e1 || "&", r3 = r3 || "=", null === t1 && (t1 = void 0), "object" == typeof t1 ? Object.keys(t1).map(function(i3) {
        var n3 = encodeURIComponent(gt(i3)) + r3;
        return Array.isArray(t1[i3]) ? t1[i3].map(function(t2) {
            return n3 + encodeURIComponent(gt(t2));
        }).join(e1) : n3 + encodeURIComponent(gt(t1[i3]));
    }).join(e1) : i2 ? encodeURIComponent(gt(i2)) + r3 + encodeURIComponent(gt(t1)) : "";
}, xt = G(function(t1, e1) {
    e1.decode = e1.parse = yt, e1.encode = e1.stringify = bt;
}), Tt = Ut, Et = function(t1, e1) {
    return Ut(t1, !1, !0).resolve(e1);
}, At = function(t1) {
    mt.isString(t1) && (t1 = Ut(t1));
    if (!(t1 instanceof St)) return St.prototype.format.call(t1);
    return t1.format();
};
function St() {
    this.protocol = null, this.slashes = null, this.auth = null, this.host = null, this.port = null, this.hostname = null, this.hash = null, this.search = null, this.query = null, this.pathname = null, this.path = null, this.href = null;
}
var Ot = /^([a-z0-9.+-]+:)/i, Rt = /:[0-9]*$/, wt = /^(\/\/?(?!\/)[^\?\s]*)(\?[^\s]*)?$/, Pt = [
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
]), It = [
    "'"
].concat(Pt), Mt = [
    "%",
    "/",
    "?",
    ";",
    "#"
].concat(It), Dt = [
    "/",
    "?",
    "#"
], Ct = /^[+a-z0-9A-Z_-]{0,63}$/, Nt = /^([+a-z0-9A-Z_-]{0,63})(.*)$/, Lt = {
    javascript: !0,
    "javascript:": !0
}, Ft = {
    javascript: !0,
    "javascript:": !0
}, Bt = {
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
function Ut(t1, e1, r3) {
    if (t1 && mt.isObject(t1) && t1 instanceof St) return t1;
    var i2 = new St;
    return i2.parse(t1, e1, r3), i2;
}
St.prototype.parse = function(t1, e1, r3) {
    if (!mt.isString(t1)) throw new TypeError("Parameter 'url' must be a string, not " + typeof t1);
    var i2 = t1.indexOf("?"), n3 = -1 !== i2 && i2 < t1.indexOf("#") ? "?" : "#", o4 = t1.split(n3);
    o4[0] = o4[0].replace(/\\/g, "/");
    var s3 = t1 = o4.join(n3);
    if (s3 = s3.trim(), !r3 && 1 === t1.split("#").length) {
        var a6 = wt.exec(s3);
        if (a6) return this.path = s3, this.href = s3, this.pathname = a6[1], a6[2] ? (this.search = a6[2], this.query = e1 ? xt.parse(this.search.substr(1)) : this.search.substr(1)) : e1 && (this.search = "", this.query = {
        }), this;
    }
    var h5 = Ot.exec(s3);
    if (h5) {
        var u5 = (h5 = h5[0]).toLowerCase();
        this.protocol = u5, s3 = s3.substr(h5.length);
    }
    if (r3 || h5 || s3.match(/^\/\/[^@\/]+@[^@\/]+/)) {
        var l4 = "//" === s3.substr(0, 2);
        !l4 || h5 && Ft[h5] || (s3 = s3.substr(2), this.slashes = !0);
    }
    if (!Ft[h5] && (l4 || h5 && !Bt[h5])) {
        for(var c2, d3, f4 = -1, p = 0; p < Dt.length; p++){
            -1 !== (_2 = s3.indexOf(Dt[p])) && (-1 === f4 || _2 < f4) && (f4 = _2);
        }
        -1 !== (d3 = -1 === f4 ? s3.lastIndexOf("@") : s3.lastIndexOf("@", f4)) && (c2 = s3.slice(0, d3), s3 = s3.slice(d3 + 1), this.auth = decodeURIComponent(c2)), f4 = -1;
        for(p = 0; p < Mt.length; p++){
            var _2;
            -1 !== (_2 = s3.indexOf(Mt[p])) && (-1 === f4 || _2 < f4) && (f4 = _2);
        }
        -1 === f4 && (f4 = s3.length), this.host = s3.slice(0, f4), s3 = s3.slice(f4), this.parseHost(), this.hostname = this.hostname || "";
        var m1 = "[" === this.hostname[0] && "]" === this.hostname[this.hostname.length - 1];
        if (!m1) for(var v1 = this.hostname.split(/\./), y = (p = 0, v1.length); p < y; p++){
            var g1 = v1[p];
            if (g1 && !g1.match(Ct)) {
                for(var b1 = "", x1 = 0, T1 = g1.length; x1 < T1; x1++)g1.charCodeAt(x1) > 127 ? b1 += "x" : b1 += g1[x1];
                if (!b1.match(Ct)) {
                    var E1 = v1.slice(0, p), A1 = v1.slice(p + 1), S1 = g1.match(Nt);
                    S1 && (E1.push(S1[1]), A1.unshift(S1[2])), A1.length && (s3 = "/" + A1.join(".") + s3), this.hostname = E1.join(".");
                    break;
                }
            }
        }
        this.hostname.length > 255 ? this.hostname = "" : this.hostname = this.hostname.toLowerCase(), m1 || (this.hostname = _t.toASCII(this.hostname));
        var O1 = this.port ? ":" + this.port : "", R1 = this.hostname || "";
        this.host = R1 + O1, this.href += this.host, m1 && (this.hostname = this.hostname.substr(1, this.hostname.length - 2), "/" !== s3[0] && (s3 = "/" + s3));
    }
    if (!Lt[u5]) for(p = 0, y = It.length; p < y; p++){
        var w1 = It[p];
        if (-1 !== s3.indexOf(w1)) {
            var P1 = encodeURIComponent(w1);
            P1 === w1 && (P1 = escape(w1)), s3 = s3.split(w1).join(P1);
        }
    }
    var I1 = s3.indexOf("#");
    -1 !== I1 && (this.hash = s3.substr(I1), s3 = s3.slice(0, I1));
    var M1 = s3.indexOf("?");
    if (-1 !== M1 ? (this.search = s3.substr(M1), this.query = s3.substr(M1 + 1), e1 && (this.query = xt.parse(this.query)), s3 = s3.slice(0, M1)) : e1 && (this.search = "", this.query = {
    }), s3 && (this.pathname = s3), Bt[u5] && this.hostname && !this.pathname && (this.pathname = "/"), this.pathname || this.search) {
        O1 = this.pathname || "";
        var D1 = this.search || "";
        this.path = O1 + D1;
    }
    return this.href = this.format(), this;
}, St.prototype.format = function() {
    var t1 = this.auth || "";
    t1 && (t1 = (t1 = encodeURIComponent(t1)).replace(/%3A/i, ":"), t1 += "@");
    var e1 = this.protocol || "", r3 = this.pathname || "", i2 = this.hash || "", n3 = !1, o4 = "";
    this.host ? n3 = t1 + this.host : this.hostname && (n3 = t1 + (-1 === this.hostname.indexOf(":") ? this.hostname : "[" + this.hostname + "]"), this.port && (n3 += ":" + this.port)), this.query && mt.isObject(this.query) && Object.keys(this.query).length && (o4 = xt.stringify(this.query));
    var s3 = this.search || o4 && "?" + o4 || "";
    return e1 && ":" !== e1.substr(-1) && (e1 += ":"), this.slashes || (!e1 || Bt[e1]) && !1 !== n3 ? (n3 = "//" + (n3 || ""), r3 && "/" !== r3.charAt(0) && (r3 = "/" + r3)) : n3 || (n3 = ""), i2 && "#" !== i2.charAt(0) && (i2 = "#" + i2), s3 && "?" !== s3.charAt(0) && (s3 = "?" + s3), e1 + n3 + (r3 = r3.replace(/[?#]/g, function(t2) {
        return encodeURIComponent(t2);
    })) + (s3 = s3.replace("#", "%23")) + i2;
}, St.prototype.resolve = function(t1) {
    return this.resolveObject(Ut(t1, !1, !0)).format();
}, St.prototype.resolveObject = function(t1) {
    if (mt.isString(t1)) {
        var e1 = new St;
        e1.parse(t1, !1, !0), t1 = e1;
    }
    for(var r3 = new St, i2 = Object.keys(this), n3 = 0; n3 < i2.length; n3++){
        var o4 = i2[n3];
        r3[o4] = this[o4];
    }
    if (r3.hash = t1.hash, "" === t1.href) return r3.href = r3.format(), r3;
    if (t1.slashes && !t1.protocol) {
        for(var s3 = Object.keys(t1), a7 = 0; a7 < s3.length; a7++){
            var h5 = s3[a7];
            "protocol" !== h5 && (r3[h5] = t1[h5]);
        }
        return Bt[r3.protocol] && r3.hostname && !r3.pathname && (r3.path = r3.pathname = "/"), r3.href = r3.format(), r3;
    }
    if (t1.protocol && t1.protocol !== r3.protocol) {
        if (!Bt[t1.protocol]) {
            for(var u6 = Object.keys(t1), l5 = 0; l5 < u6.length; l5++){
                var c3 = u6[l5];
                r3[c3] = t1[c3];
            }
            return r3.href = r3.format(), r3;
        }
        if (r3.protocol = t1.protocol, t1.host || Ft[t1.protocol]) r3.pathname = t1.pathname;
        else {
            for(var d4 = (t1.pathname || "").split("/"); d4.length && !(t1.host = d4.shift()););
            t1.host || (t1.host = ""), t1.hostname || (t1.hostname = ""), "" !== d4[0] && d4.unshift(""), d4.length < 2 && d4.unshift(""), r3.pathname = d4.join("/");
        }
        if (r3.search = t1.search, r3.query = t1.query, r3.host = t1.host || "", r3.auth = t1.auth, r3.hostname = t1.hostname || t1.host, r3.port = t1.port, r3.pathname || r3.search) {
            var f5 = r3.pathname || "", p = r3.search || "";
            r3.path = f5 + p;
        }
        return r3.slashes = r3.slashes || t1.slashes, r3.href = r3.format(), r3;
    }
    var _3 = r3.pathname && "/" === r3.pathname.charAt(0), m2 = t1.host || t1.pathname && "/" === t1.pathname.charAt(0), v2 = m2 || _3 || r3.host && t1.pathname, y = v2, g2 = r3.pathname && r3.pathname.split("/") || [], b2 = (d4 = t1.pathname && t1.pathname.split("/") || [], r3.protocol && !Bt[r3.protocol]);
    if (b2 && (r3.hostname = "", r3.port = null, r3.host && ("" === g2[0] ? g2[0] = r3.host : g2.unshift(r3.host)), r3.host = "", t1.protocol && (t1.hostname = null, t1.port = null, t1.host && ("" === d4[0] ? d4[0] = t1.host : d4.unshift(t1.host)), t1.host = null), v2 = v2 && ("" === d4[0] || "" === g2[0])), m2) r3.host = t1.host || "" === t1.host ? t1.host : r3.host, r3.hostname = t1.hostname || "" === t1.hostname ? t1.hostname : r3.hostname, r3.search = t1.search, r3.query = t1.query, g2 = d4;
    else if (d4.length) g2 || (g2 = []), g2.pop(), g2 = g2.concat(d4), r3.search = t1.search, r3.query = t1.query;
    else if (!mt.isNullOrUndefined(t1.search)) {
        if (b2) r3.hostname = r3.host = g2.shift(), (S3 = !!(r3.host && r3.host.indexOf("@") > 0) && r3.host.split("@")) && (r3.auth = S3.shift(), r3.host = r3.hostname = S3.shift());
        return r3.search = t1.search, r3.query = t1.query, mt.isNull(r3.pathname) && mt.isNull(r3.search) || (r3.path = (r3.pathname ? r3.pathname : "") + (r3.search ? r3.search : "")), r3.href = r3.format(), r3;
    }
    if (!g2.length) return r3.pathname = null, r3.search ? r3.path = "/" + r3.search : r3.path = null, r3.href = r3.format(), r3;
    for(var x2 = g2.slice(-1)[0], T2 = (r3.host || t1.host || g2.length > 1) && ("." === x2 || ".." === x2) || "" === x2, E2 = 0, A2 = g2.length; A2 >= 0; A2--)"." === (x2 = g2[A2]) ? g2.splice(A2, 1) : ".." === x2 ? (g2.splice(A2, 1), E2++) : E2 && (g2.splice(A2, 1), E2--);
    if (!v2 && !y) for(; E2--; E2)g2.unshift("..");
    !v2 || "" === g2[0] || g2[0] && "/" === g2[0].charAt(0) || g2.unshift(""), T2 && "/" !== g2.join("/").substr(-1) && g2.push("");
    var S3, O2 = "" === g2[0] || g2[0] && "/" === g2[0].charAt(0);
    b2 && (r3.hostname = r3.host = O2 ? "" : g2.length ? g2.shift() : "", (S3 = !!(r3.host && r3.host.indexOf("@") > 0) && r3.host.split("@")) && (r3.auth = S3.shift(), r3.host = r3.hostname = S3.shift()));
    return (v2 = v2 || r3.host && g2.length) && !O2 && g2.unshift(""), g2.length ? r3.pathname = g2.join("/") : (r3.pathname = null, r3.path = null), mt.isNull(r3.pathname) && mt.isNull(r3.search) || (r3.path = (r3.pathname ? r3.pathname : "") + (r3.search ? r3.search : "")), r3.auth = t1.auth || r3.auth, r3.slashes = r3.slashes || t1.slashes, r3.href = r3.format(), r3;
}, St.prototype.parseHost = function() {
    var t1 = this.host, e2 = Rt.exec(t1);
    e2 && (":" !== (e2 = e2[0]) && (this.port = e2.substr(1)), t1 = t1.substr(0, t1.length - e2.length)), t1 && (this.hostname = t1);
};
var Gt, Xt, kt, jt, Ht, Yt, Vt, zt, Wt, qt, Kt, Zt, Jt, Qt, $t, te, ee;
!function(t1) {
    t1[t1.WEBGL_LEGACY = 0] = "WEBGL_LEGACY", t1[t1.WEBGL = 1] = "WEBGL", t1[t1.WEBGL2 = 2] = "WEBGL2";
}(Gt || (Gt = {
})), (function(t1) {
    t1[t1.UNKNOWN = 0] = "UNKNOWN", t1[t1.WEBGL = 1] = "WEBGL", t1[t1.CANVAS = 2] = "CANVAS";
})(Xt || (Xt = {
})), (function(t1) {
    t1[t1.COLOR = 16384] = "COLOR", t1[t1.DEPTH = 256] = "DEPTH", t1[t1.STENCIL = 1024] = "STENCIL";
})(kt || (kt = {
})), (function(t1) {
    t1[t1.NORMAL = 0] = "NORMAL", t1[t1.ADD = 1] = "ADD", t1[t1.MULTIPLY = 2] = "MULTIPLY", t1[t1.SCREEN = 3] = "SCREEN", t1[t1.OVERLAY = 4] = "OVERLAY", t1[t1.DARKEN = 5] = "DARKEN", t1[t1.LIGHTEN = 6] = "LIGHTEN", t1[t1.COLOR_DODGE = 7] = "COLOR_DODGE", t1[t1.COLOR_BURN = 8] = "COLOR_BURN", t1[t1.HARD_LIGHT = 9] = "HARD_LIGHT", t1[t1.SOFT_LIGHT = 10] = "SOFT_LIGHT", t1[t1.DIFFERENCE = 11] = "DIFFERENCE", t1[t1.EXCLUSION = 12] = "EXCLUSION", t1[t1.HUE = 13] = "HUE", t1[t1.SATURATION = 14] = "SATURATION", t1[t1.COLOR = 15] = "COLOR", t1[t1.LUMINOSITY = 16] = "LUMINOSITY", t1[t1.NORMAL_NPM = 17] = "NORMAL_NPM", t1[t1.ADD_NPM = 18] = "ADD_NPM", t1[t1.SCREEN_NPM = 19] = "SCREEN_NPM", t1[t1.NONE = 20] = "NONE", t1[t1.SRC_OVER = 0] = "SRC_OVER", t1[t1.SRC_IN = 21] = "SRC_IN", t1[t1.SRC_OUT = 22] = "SRC_OUT", t1[t1.SRC_ATOP = 23] = "SRC_ATOP", t1[t1.DST_OVER = 24] = "DST_OVER", t1[t1.DST_IN = 25] = "DST_IN", t1[t1.DST_OUT = 26] = "DST_OUT", t1[t1.DST_ATOP = 27] = "DST_ATOP", t1[t1.ERASE = 26] = "ERASE", t1[t1.SUBTRACT = 28] = "SUBTRACT", t1[t1.XOR = 29] = "XOR";
})(jt || (jt = {
})), (function(t1) {
    t1[t1.POINTS = 0] = "POINTS", t1[t1.LINES = 1] = "LINES", t1[t1.LINE_LOOP = 2] = "LINE_LOOP", t1[t1.LINE_STRIP = 3] = "LINE_STRIP", t1[t1.TRIANGLES = 4] = "TRIANGLES", t1[t1.TRIANGLE_STRIP = 5] = "TRIANGLE_STRIP", t1[t1.TRIANGLE_FAN = 6] = "TRIANGLE_FAN";
})(Ht || (Ht = {
})), (function(t1) {
    t1[t1.RGBA = 6408] = "RGBA", t1[t1.RGB = 6407] = "RGB", t1[t1.ALPHA = 6406] = "ALPHA", t1[t1.LUMINANCE = 6409] = "LUMINANCE", t1[t1.LUMINANCE_ALPHA = 6410] = "LUMINANCE_ALPHA", t1[t1.DEPTH_COMPONENT = 6402] = "DEPTH_COMPONENT", t1[t1.DEPTH_STENCIL = 34041] = "DEPTH_STENCIL";
})(Yt || (Yt = {
})), (function(t1) {
    t1[t1.TEXTURE_2D = 3553] = "TEXTURE_2D", t1[t1.TEXTURE_CUBE_MAP = 34067] = "TEXTURE_CUBE_MAP", t1[t1.TEXTURE_2D_ARRAY = 35866] = "TEXTURE_2D_ARRAY", t1[t1.TEXTURE_CUBE_MAP_POSITIVE_X = 34069] = "TEXTURE_CUBE_MAP_POSITIVE_X", t1[t1.TEXTURE_CUBE_MAP_NEGATIVE_X = 34070] = "TEXTURE_CUBE_MAP_NEGATIVE_X", t1[t1.TEXTURE_CUBE_MAP_POSITIVE_Y = 34071] = "TEXTURE_CUBE_MAP_POSITIVE_Y", t1[t1.TEXTURE_CUBE_MAP_NEGATIVE_Y = 34072] = "TEXTURE_CUBE_MAP_NEGATIVE_Y", t1[t1.TEXTURE_CUBE_MAP_POSITIVE_Z = 34073] = "TEXTURE_CUBE_MAP_POSITIVE_Z", t1[t1.TEXTURE_CUBE_MAP_NEGATIVE_Z = 34074] = "TEXTURE_CUBE_MAP_NEGATIVE_Z";
})(Vt || (Vt = {
})), (function(t1) {
    t1[t1.UNSIGNED_BYTE = 5121] = "UNSIGNED_BYTE", t1[t1.UNSIGNED_SHORT = 5123] = "UNSIGNED_SHORT", t1[t1.UNSIGNED_SHORT_5_6_5 = 33635] = "UNSIGNED_SHORT_5_6_5", t1[t1.UNSIGNED_SHORT_4_4_4_4 = 32819] = "UNSIGNED_SHORT_4_4_4_4", t1[t1.UNSIGNED_SHORT_5_5_5_1 = 32820] = "UNSIGNED_SHORT_5_5_5_1", t1[t1.FLOAT = 5126] = "FLOAT", t1[t1.HALF_FLOAT = 36193] = "HALF_FLOAT";
})(zt || (zt = {
})), (function(t1) {
    t1[t1.NEAREST = 0] = "NEAREST", t1[t1.LINEAR = 1] = "LINEAR";
})(Wt || (Wt = {
})), (function(t1) {
    t1[t1.CLAMP = 33071] = "CLAMP", t1[t1.REPEAT = 10497] = "REPEAT", t1[t1.MIRRORED_REPEAT = 33648] = "MIRRORED_REPEAT";
})(qt || (qt = {
})), (function(t1) {
    t1[t1.OFF = 0] = "OFF", t1[t1.POW2 = 1] = "POW2", t1[t1.ON = 2] = "ON", t1[t1.ON_MANUAL = 3] = "ON_MANUAL";
})(Kt || (Kt = {
})), (function(t1) {
    t1[t1.NPM = 0] = "NPM", t1[t1.UNPACK = 1] = "UNPACK", t1[t1.PMA = 2] = "PMA", t1[t1.NO_PREMULTIPLIED_ALPHA = 0] = "NO_PREMULTIPLIED_ALPHA", t1[t1.PREMULTIPLY_ON_UPLOAD = 1] = "PREMULTIPLY_ON_UPLOAD", t1[t1.PREMULTIPLY_ALPHA = 2] = "PREMULTIPLY_ALPHA";
})(Zt || (Zt = {
})), (function(t1) {
    t1[t1.NO = 0] = "NO", t1[t1.YES = 1] = "YES", t1[t1.AUTO = 2] = "AUTO", t1[t1.BLEND = 0] = "BLEND", t1[t1.CLEAR = 1] = "CLEAR", t1[t1.BLIT = 2] = "BLIT";
})(Jt || (Jt = {
})), (function(t1) {
    t1[t1.AUTO = 0] = "AUTO", t1[t1.MANUAL = 1] = "MANUAL";
})(Qt || (Qt = {
})), (function(t1) {
    t1.LOW = "lowp", t1.MEDIUM = "mediump", t1.HIGH = "highp";
})($t || ($t = {
})), (function(t1) {
    t1[t1.NONE = 0] = "NONE", t1[t1.SCISSOR = 1] = "SCISSOR", t1[t1.STENCIL = 2] = "STENCIL", t1[t1.SPRITE = 3] = "SPRITE";
})(te || (te = {
})), (function(t1) {
    t1[t1.NONE = 0] = "NONE", t1[t1.LOW = 2] = "LOW", t1[t1.MEDIUM = 4] = "MEDIUM", t1[t1.HIGH = 8] = "HIGH";
})(ee || (ee = {
}));
var re = {
    parse: Tt,
    format: At,
    resolve: Et
};
F.RETINA_PREFIX = /@([0-9\.]+)x/, F.FAIL_IF_MAJOR_PERFORMANCE_CAVEAT = !1;
var ie, ne = !1, oe = "6.0.2";
function se(t1) {
    var e2;
    if (!ne) {
        if (navigator.userAgent.toLowerCase().indexOf("chrome") > -1) {
            var r3 = [
                "\n %c %c %c PixiJS " + oe + " - ✰ " + t1 + " ✰  %c  %c  http://www.pixijs.com/  %c %c ♥%c♥%c♥ \n\n",
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
            (e2 = self.console).log.apply(e2, r3);
        } else self.console && self.console.log("PixiJS " + oe + " - " + t1 + " - http://www.pixijs.com/");
        ne = !0;
    }
}
function ae() {
    return (void 0) === ie && (ie = (function() {
        var t1 = {
            stencil: !0,
            failIfMajorPerformanceCaveat: F.FAIL_IF_MAJOR_PERFORMANCE_CAVEAT
        };
        try {
            if (!self.WebGLRenderingContext) return !1;
            var e2 = document.createElement("canvas"), r4 = e2.getContext("webgl", t1) || e2.getContext("experimental-webgl", t1), i2 = !(!r4 || !r4.getContextAttributes().stencil);
            if (r4) {
                var n3 = r4.getExtension("WEBGL_lose_context");
                n3 && n3.loseContext();
            }
            return r4 = null, i2;
        } catch (t2) {
            return !1;
        }
    })()), ie;
}
var he = {
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
function ue(t1, e2) {
    return (void 0) === e2 && (e2 = []), e2[0] = (t1 >> 16 & 255) / 255, e2[1] = (t1 >> 8 & 255) / 255, e2[2] = (255 & t1) / 255, e2;
}
function le(t1) {
    var e2 = t1.toString(16);
    return "#" + ("000000".substr(0, 6 - e2.length) + e2);
}
function ce(t1) {
    return "string" == typeof t1 && "#" === (t1 = he[t1.toLowerCase()] || t1)[0] && (t1 = t1.substr(1)), parseInt(t1, 16);
}
var de = function() {
    for(var t1 = [], e2 = [], r4 = 0; r4 < 32; r4++)t1[r4] = r4, e2[r4] = r4;
    t1[jt.NORMAL_NPM] = jt.NORMAL, t1[jt.ADD_NPM] = jt.ADD, t1[jt.SCREEN_NPM] = jt.SCREEN, e2[jt.NORMAL] = jt.NORMAL_NPM, e2[jt.ADD] = jt.ADD_NPM, e2[jt.SCREEN] = jt.SCREEN_NPM;
    var i2 = [];
    return i2.push(e2), i2.push(t1), i2;
}();
function fe(t1, e2) {
    return de[e2 ? 1 : 0][t1];
}
function pe(t1, e2, r4, i2) {
    return r4 = r4 || new Float32Array(4), i2 || (void 0) === i2 ? (r4[0] = t1[0] * e2, r4[1] = t1[1] * e2, r4[2] = t1[2] * e2) : (r4[0] = t1[0], r4[1] = t1[1], r4[2] = t1[2]), r4[3] = e2, r4;
}
function _e(t1, e2) {
    if (1 === e2) return (255 * e2 << 24) + t1;
    if (0 === e2) return 0;
    var r4 = t1 >> 16 & 255, i2 = t1 >> 8 & 255, n4 = 255 & t1;
    return (255 * e2 << 24) + ((r4 = r4 * e2 + 0.5 | 0) << 16) + ((i2 = i2 * e2 + 0.5 | 0) << 8) + (n4 * e2 + 0.5 | 0);
}
function me(t1, e2, r4, i2) {
    return (r4 = r4 || new Float32Array(4))[0] = (t1 >> 16 & 255) / 255, r4[1] = (t1 >> 8 & 255) / 255, r4[2] = (255 & t1) / 255, (i2 || (void 0) === i2) && (r4[0] *= e2, r4[1] *= e2, r4[2] *= e2), r4[3] = e2, r4;
}
function ve(t1, e2) {
    (void 0) === e2 && (e2 = null);
    var r4 = 6 * t1;
    if ((e2 = e2 || new Uint16Array(r4)).length !== r4) throw new Error("Out buffer length is incorrect, got " + e2.length + " and expected " + r4);
    for(var i2 = 0, n4 = 0; i2 < r4; i2 += 6, n4 += 4)e2[i2 + 0] = n4 + 0, e2[i2 + 1] = n4 + 1, e2[i2 + 2] = n4 + 2, e2[i2 + 3] = n4 + 0, e2[i2 + 4] = n4 + 2, e2[i2 + 5] = n4 + 3;
    return e2;
}
function ye(t1) {
    if (4 === t1.BYTES_PER_ELEMENT) return t1 instanceof Float32Array ? "Float32Array" : t1 instanceof Uint32Array ? "Uint32Array" : "Int32Array";
    if (2 === t1.BYTES_PER_ELEMENT) {
        if (t1 instanceof Uint16Array) return "Uint16Array";
    } else if (1 === t1.BYTES_PER_ELEMENT && t1 instanceof Uint8Array) return "Uint8Array";
    return null;
}
var ge = {
    Float32Array: Float32Array,
    Uint32Array: Uint32Array,
    Int32Array: Int32Array,
    Uint8Array: Uint8Array
};
function be(t1) {
    return t1 += 0 === t1 ? 1 : 0, --t1, t1 |= t1 >>> 1, t1 |= t1 >>> 2, t1 |= t1 >>> 4, t1 |= t1 >>> 8, 1 + (t1 |= t1 >>> 16);
}
function xe(t1) {
    return !(t1 & t1 - 1 || !t1);
}
function Te(t1) {
    var e2 = (t1 > 65535 ? 1 : 0) << 4, r4 = ((t1 >>>= e2) > 255 ? 1 : 0) << 3;
    return e2 |= r4, e2 |= r4 = ((t1 >>>= r4) > 15 ? 1 : 0) << 2, (e2 |= r4 = ((t1 >>>= r4) > 3 ? 1 : 0) << 1) | (t1 >>>= r4) >> 1;
}
function Ee(t1, e2, r4) {
    var i2, n4 = t1.length;
    if (!(e2 >= n4 || 0 === r4)) {
        var o5 = n4 - (r4 = e2 + r4 > n4 ? n4 - e2 : r4);
        for(i2 = e2; i2 < o5; ++i2)t1[i2] = t1[i2 + r4];
        t1.length = o5;
    }
}
function Ae(t1) {
    return 0 === t1 ? 0 : t1 < 0 ? -1 : 1;
}
var Se = 0;
function Oe() {
    return ++Se;
}
var Re = {
};
var we = {
}, Pe = Object.create(null), Ie = Object.create(null);
var Me = function() {
    function t1(t2, e2, r4) {
        this.canvas = document.createElement("canvas"), this.context = this.canvas.getContext("2d"), this.resolution = r4 || F.RESOLUTION, this.resize(t2, e2);
    }
    return t1.prototype.clear = function() {
        this.context.setTransform(1, 0, 0, 1, 0, 0), this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }, t1.prototype.resize = function(t2, e2) {
        this.canvas.width = t2 * this.resolution, this.canvas.height = e2 * this.resolution;
    }, t1.prototype.destroy = function() {
        this.context = null, this.canvas = null;
    }, Object.defineProperty(t1.prototype, "width", {
        get: function() {
            return this.canvas.width;
        },
        set: function(t2) {
            this.canvas.width = t2;
        },
        enumerable: !1,
        configurable: !0
    }), Object.defineProperty(t1.prototype, "height", {
        get: function() {
            return this.canvas.height;
        },
        set: function(t2) {
            this.canvas.height = t2;
        },
        enumerable: !1,
        configurable: !0
    }), t1;
}();
function De(t1) {
    var e2, r4, i2, n4 = t1.width, o6 = t1.height, s4 = t1.getContext("2d"), a8 = s4.getImageData(0, 0, n4, o6).data, h6 = a8.length, u7 = {
        top: null,
        left: null,
        right: null,
        bottom: null
    }, l6 = null;
    for(e2 = 0; e2 < h6; e2 += 4)0 !== a8[e2 + 3] && (r4 = e2 / 4 % n4, i2 = ~~(e2 / 4 / n4), null === u7.top && (u7.top = i2), null === u7.left ? u7.left = r4 : r4 < u7.left && (u7.left = r4), null === u7.right ? u7.right = r4 + 1 : u7.right < r4 && (u7.right = r4 + 1), null === u7.bottom ? u7.bottom = i2 : u7.bottom < i2 && (u7.bottom = i2));
    return null !== u7.top && (n4 = u7.right - u7.left, o6 = u7.bottom - u7.top + 1, l6 = s4.getImageData(u7.left, u7.top, n4, o6)), {
        height: o6,
        width: n4,
        data: l6
    };
}
var Ce, Ne = /^\s*data:(?:([\w-]+)\/([\w+.-]+))?(?:;charset=([\w-]+))?(?:;(base64))?,(.*)/i;
function Le(t1, e2) {
    if ((void 0) === e2 && (e2 = self.location), 0 === t1.indexOf("data:")) return "";
    e2 = e2 || self.location, Ce || (Ce = document.createElement("a")), Ce.href = t1;
    var r4 = re.parse(Ce.href), i2 = !r4.port && "" === e2.port || r4.port === e2.port;
    return r4.hostname === e2.hostname && i2 && r4.protocol === e2.protocol ? "" : "anonymous";
}
function Fe(t1, e2) {
    var r4 = F.RETINA_PREFIX.exec(t1);
    return r4 ? parseFloat(r4[1]) : (void 0) !== e2 ? e2 : 1;
}
var Be, Ue = {
    __proto__: null,
    BaseTextureCache: Ie,
    CanvasRenderTarget: Me,
    DATA_URI: Ne,
    ProgramCache: we,
    TextureCache: Pe,
    clearTextureCache: function() {
        var t1;
        for(t1 in Pe)delete Pe[t1];
        for(t1 in Ie)delete Ie[t1];
    },
    correctBlendMode: fe,
    createIndicesForQuads: ve,
    decomposeDataUri: function(t1) {
        var e2 = Ne.exec(t1);
        if (e2) return {
            mediaType: e2[1] ? e2[1].toLowerCase() : void 0,
            subType: e2[2] ? e2[2].toLowerCase() : void 0,
            charset: e2[3] ? e2[3].toLowerCase() : void 0,
            encoding: e2[4] ? e2[4].toLowerCase() : void 0,
            data: e2[5]
        };
    },
    deprecation: function(t1, e2, r4) {
        if ((void 0) === r4 && (r4 = 3), !Re[e2]) {
            var i2 = (new Error).stack;
            (void 0) === i2 ? console.warn("PixiJS Deprecation Warning: ", e2 + "\nDeprecated since v" + t1) : (i2 = i2.split("\n").splice(r4).join("\n"), console.groupCollapsed ? (console.groupCollapsed("%cPixiJS Deprecation Warning: %c%s", "color:#614108;background:#fffbe6", "font-weight:normal;color:#614108;background:#fffbe6", e2 + "\nDeprecated since v" + t1), console.warn(i2), console.groupEnd()) : (console.warn("PixiJS Deprecation Warning: ", e2 + "\nDeprecated since v" + t1), console.warn(i2))), Re[e2] = !0;
        }
    },
    destroyTextureCache: function() {
        var t1;
        for(t1 in Pe)Pe[t1].destroy();
        for(t1 in Ie)Ie[t1].destroy();
    },
    determineCrossOrigin: Le,
    getBufferType: ye,
    getResolutionOfUrl: Fe,
    hex2rgb: ue,
    hex2string: le,
    interleaveTypedArrays: function(t1, e2) {
        for(var r4 = 0, i3 = 0, n4 = {
        }, o6 = 0; o6 < t1.length; o6++)i3 += e2[o6], r4 += t1[o6].length;
        var s4 = new ArrayBuffer(4 * r4), a8 = null, h6 = 0;
        for(o6 = 0; o6 < t1.length; o6++){
            var u7 = e2[o6], l6 = t1[o6], c4 = ye(l6);
            n4[c4] || (n4[c4] = new ge[c4](s4)), a8 = n4[c4];
            for(var d5 = 0; d5 < l6.length; d5++)a8[(d5 / u7 | 0) * i3 + h6 + d5 % u7] = l6[d5];
            h6 += u7;
        }
        return new Float32Array(s4);
    },
    isPow2: xe,
    isWebGLSupported: ae,
    log2: Te,
    nextPow2: be,
    premultiplyBlendMode: de,
    premultiplyRgba: pe,
    premultiplyTint: _e,
    premultiplyTintToRgba: me,
    removeItems: Ee,
    rgb2hex: function(t1) {
        return (255 * t1[0] << 16) + (255 * t1[1] << 8) + (255 * t1[2] | 0);
    },
    sayHello: se,
    sign: Ae,
    skipHello: function() {
        ne = !0;
    },
    string2hex: ce,
    trimCanvas: De,
    uid: Oe,
    url: re,
    isMobile: L,
    EventEmitter: X2,
    earcut: k
}, Ge = 2 * Math.PI, Xe = 180 / Math.PI, ke = Math.PI / 180;
!function(t1) {
    t1[t1.POLY = 0] = "POLY", t1[t1.RECT = 1] = "RECT", t1[t1.CIRC = 2] = "CIRC", t1[t1.ELIP = 3] = "ELIP", t1[t1.RREC = 4] = "RREC";
}(Be || (Be = {
}));
var je = function() {
    function t1(t2, e2, r4, i3) {
        (void 0) === t2 && (t2 = 0), (void 0) === e2 && (e2 = 0), (void 0) === r4 && (r4 = 0), (void 0) === i3 && (i3 = 0), this.x = Number(t2), this.y = Number(e2), this.width = Number(r4), this.height = Number(i3), this.type = Be.RECT;
    }
    return Object.defineProperty(t1.prototype, "left", {
        get: function() {
            return this.x;
        },
        enumerable: !1,
        configurable: !0
    }), Object.defineProperty(t1.prototype, "right", {
        get: function() {
            return this.x + this.width;
        },
        enumerable: !1,
        configurable: !0
    }), Object.defineProperty(t1.prototype, "top", {
        get: function() {
            return this.y;
        },
        enumerable: !1,
        configurable: !0
    }), Object.defineProperty(t1.prototype, "bottom", {
        get: function() {
            return this.y + this.height;
        },
        enumerable: !1,
        configurable: !0
    }), Object.defineProperty(t1, "EMPTY", {
        get: function() {
            return new t1(0, 0, 0, 0);
        },
        enumerable: !1,
        configurable: !0
    }), t1.prototype.clone = function() {
        return new t1(this.x, this.y, this.width, this.height);
    }, t1.prototype.copyFrom = function(t2) {
        return this.x = t2.x, this.y = t2.y, this.width = t2.width, this.height = t2.height, this;
    }, t1.prototype.copyTo = function(t2) {
        return t2.x = this.x, t2.y = this.y, t2.width = this.width, t2.height = this.height, t2;
    }, t1.prototype.contains = function(t2, e2) {
        return !(this.width <= 0 || this.height <= 0) && t2 >= this.x && t2 < this.x + this.width && e2 >= this.y && e2 < this.y + this.height;
    }, t1.prototype.pad = function(t2, e2) {
        return (void 0) === t2 && (t2 = 0), (void 0) === e2 && (e2 = t2), this.x -= t2, this.y -= e2, this.width += 2 * t2, this.height += 2 * e2, this;
    }, t1.prototype.fit = function(t2) {
        var e2 = Math.max(this.x, t2.x), r4 = Math.min(this.x + this.width, t2.x + t2.width), i3 = Math.max(this.y, t2.y), n4 = Math.min(this.y + this.height, t2.y + t2.height);
        return this.x = e2, this.width = Math.max(r4 - e2, 0), this.y = i3, this.height = Math.max(n4 - i3, 0), this;
    }, t1.prototype.ceil = function(t2, e2) {
        (void 0) === t2 && (t2 = 1), (void 0) === e2 && (e2 = 0.001);
        var r4 = Math.ceil((this.x + this.width - e2) * t2) / t2, i3 = Math.ceil((this.y + this.height - e2) * t2) / t2;
        return this.x = Math.floor((this.x + e2) * t2) / t2, this.y = Math.floor((this.y + e2) * t2) / t2, this.width = r4 - this.x, this.height = i3 - this.y, this;
    }, t1.prototype.enlarge = function(t2) {
        var e2 = Math.min(this.x, t2.x), r4 = Math.max(this.x + this.width, t2.x + t2.width), i3 = Math.min(this.y, t2.y), n4 = Math.max(this.y + this.height, t2.y + t2.height);
        return this.x = e2, this.width = r4 - e2, this.y = i3, this.height = n4 - i3, this;
    }, t1;
}(), He = function() {
    function t1(t2, e2, r4) {
        (void 0) === t2 && (t2 = 0), (void 0) === e2 && (e2 = 0), (void 0) === r4 && (r4 = 0), this.x = t2, this.y = e2, this.radius = r4, this.type = Be.CIRC;
    }
    return t1.prototype.clone = function() {
        return new t1(this.x, this.y, this.radius);
    }, t1.prototype.contains = function(t2, e2) {
        if (this.radius <= 0) return !1;
        var r4 = this.radius * this.radius, i3 = this.x - t2, n4 = this.y - e2;
        return (i3 *= i3) + (n4 *= n4) <= r4;
    }, t1.prototype.getBounds = function() {
        return new je(this.x - this.radius, this.y - this.radius, 2 * this.radius, 2 * this.radius);
    }, t1;
}(), Ye = function() {
    function t1(t2, e2, r4, i3) {
        (void 0) === t2 && (t2 = 0), (void 0) === e2 && (e2 = 0), (void 0) === r4 && (r4 = 0), (void 0) === i3 && (i3 = 0), this.x = t2, this.y = e2, this.width = r4, this.height = i3, this.type = Be.ELIP;
    }
    return t1.prototype.clone = function() {
        return new t1(this.x, this.y, this.width, this.height);
    }, t1.prototype.contains = function(t2, e2) {
        if (this.width <= 0 || this.height <= 0) return !1;
        var r4 = (t2 - this.x) / this.width, i3 = (e2 - this.y) / this.height;
        return (r4 *= r4) + (i3 *= i3) <= 1;
    }, t1.prototype.getBounds = function() {
        return new je(this.x - this.width, this.y - this.height, this.width, this.height);
    }, t1;
}(), Ve = function() {
    function t1() {
        for(var t2 = arguments, e2 = [], r4 = 0; r4 < arguments.length; r4++)e2[r4] = t2[r4];
        var i3 = Array.isArray(e2[0]) ? e2[0] : e2;
        if ("number" != typeof i3[0]) {
            for(var n4 = [], o6 = 0, s4 = i3.length; o6 < s4; o6++)n4.push(i3[o6].x, i3[o6].y);
            i3 = n4;
        }
        this.points = i3, this.type = Be.POLY, this.closeStroke = !0;
    }
    return t1.prototype.clone = function() {
        var e2 = new t1(this.points.slice());
        return e2.closeStroke = this.closeStroke, e2;
    }, t1.prototype.contains = function(t2, e2) {
        for(var r4 = !1, i3 = this.points.length / 2, n5 = 0, o7 = i3 - 1; n5 < i3; o7 = n5++){
            var s5 = this.points[2 * n5], a8 = this.points[2 * n5 + 1], h6 = this.points[2 * o7], u8 = this.points[2 * o7 + 1];
            a8 > e2 != u8 > e2 && t2 < (e2 - a8) / (u8 - a8) * (h6 - s5) + s5 && (r4 = !r4);
        }
        return r4;
    }, t1;
}(), ze = function() {
    function t1(t2, e2, r4, i3, n5) {
        (void 0) === t2 && (t2 = 0), (void 0) === e2 && (e2 = 0), (void 0) === r4 && (r4 = 0), (void 0) === i3 && (i3 = 0), (void 0) === n5 && (n5 = 20), this.x = t2, this.y = e2, this.width = r4, this.height = i3, this.radius = n5, this.type = Be.RREC;
    }
    return t1.prototype.clone = function() {
        return new t1(this.x, this.y, this.width, this.height, this.radius);
    }, t1.prototype.contains = function(t2, e2) {
        if (this.width <= 0 || this.height <= 0) return !1;
        if (t2 >= this.x && t2 <= this.x + this.width && e2 >= this.y && e2 <= this.y + this.height) {
            if (e2 >= this.y + this.radius && e2 <= this.y + this.height - this.radius || t2 >= this.x + this.radius && t2 <= this.x + this.width - this.radius) return !0;
            var r4 = t2 - (this.x + this.radius), i3 = e2 - (this.y + this.radius), n5 = this.radius * this.radius;
            if (r4 * r4 + i3 * i3 <= n5) return !0;
            if ((r4 = t2 - (this.x + this.width - this.radius)) * r4 + i3 * i3 <= n5) return !0;
            if (r4 * r4 + (i3 = e2 - (this.y + this.height - this.radius)) * i3 <= n5) return !0;
            if ((r4 = t2 - (this.x + this.radius)) * r4 + i3 * i3 <= n5) return !0;
        }
        return !1;
    }, t1;
}(), We = function() {
    function t1(t2, e2) {
        (void 0) === t2 && (t2 = 0), (void 0) === e2 && (e2 = 0), this.x = t2, this.y = e2;
    }
    return t1.prototype.clone = function() {
        return new t1(this.x, this.y);
    }, t1.prototype.copyFrom = function(t2) {
        return this.set(t2.x, t2.y), this;
    }, t1.prototype.copyTo = function(t2) {
        return t2.set(this.x, this.y), t2;
    }, t1.prototype.equals = function(t2) {
        return t2.x === this.x && t2.y === this.y;
    }, t1.prototype.set = function(t2, e2) {
        return (void 0) === t2 && (t2 = 0), (void 0) === e2 && (e2 = t2), this.x = t2, this.y = e2, this;
    }, t1;
}(), qe = function() {
    function t1(t2, e2, r5, i4) {
        (void 0) === r5 && (r5 = 0), (void 0) === i4 && (i4 = 0), this._x = r5, this._y = i4, this.cb = t2, this.scope = e2;
    }
    return t1.prototype.clone = function(e2, r5) {
        return (void 0) === e2 && (e2 = this.cb), (void 0) === r5 && (r5 = this.scope), new t1(e2, r5, this._x, this._y);
    }, t1.prototype.set = function(t2, e2) {
        return (void 0) === t2 && (t2 = 0), (void 0) === e2 && (e2 = t2), this._x === t2 && this._y === e2 || (this._x = t2, this._y = e2, this.cb.call(this.scope)), this;
    }, t1.prototype.copyFrom = function(t2) {
        return this._x === t2.x && this._y === t2.y || (this._x = t2.x, this._y = t2.y, this.cb.call(this.scope)), this;
    }, t1.prototype.copyTo = function(t2) {
        return t2.set(this._x, this._y), t2;
    }, t1.prototype.equals = function(t2) {
        return t2.x === this._x && t2.y === this._y;
    }, Object.defineProperty(t1.prototype, "x", {
        get: function() {
            return this._x;
        },
        set: function(t2) {
            this._x !== t2 && (this._x = t2, this.cb.call(this.scope));
        },
        enumerable: !1,
        configurable: !0
    }), Object.defineProperty(t1.prototype, "y", {
        get: function() {
            return this._y;
        },
        set: function(t2) {
            this._y !== t2 && (this._y = t2, this.cb.call(this.scope));
        },
        enumerable: !1,
        configurable: !0
    }), t1;
}(), Ke = function() {
    function t1(t2, e2, r5, i4, n6, o7) {
        (void 0) === t2 && (t2 = 1), (void 0) === e2 && (e2 = 0), (void 0) === r5 && (r5 = 0), (void 0) === i4 && (i4 = 1), (void 0) === n6 && (n6 = 0), (void 0) === o7 && (o7 = 0), this.array = null, this.a = t2, this.b = e2, this.c = r5, this.d = i4, this.tx = n6, this.ty = o7;
    }
    return t1.prototype.fromArray = function(t2) {
        this.a = t2[0], this.b = t2[1], this.c = t2[3], this.d = t2[4], this.tx = t2[2], this.ty = t2[5];
    }, t1.prototype.set = function(t2, e2, r5, i4, n6, o7) {
        return this.a = t2, this.b = e2, this.c = r5, this.d = i4, this.tx = n6, this.ty = o7, this;
    }, t1.prototype.toArray = function(t2, e2) {
        this.array || (this.array = new Float32Array(9));
        var r5 = e2 || this.array;
        return t2 ? (r5[0] = this.a, r5[1] = this.b, r5[2] = 0, r5[3] = this.c, r5[4] = this.d, r5[5] = 0, r5[6] = this.tx, r5[7] = this.ty, r5[8] = 1) : (r5[0] = this.a, r5[1] = this.c, r5[2] = this.tx, r5[3] = this.b, r5[4] = this.d, r5[5] = this.ty, r5[6] = 0, r5[7] = 0, r5[8] = 1), r5;
    }, t1.prototype.apply = function(t2, e2) {
        e2 = e2 || new We;
        var r5 = t2.x, i4 = t2.y;
        return e2.x = this.a * r5 + this.c * i4 + this.tx, e2.y = this.b * r5 + this.d * i4 + this.ty, e2;
    }, t1.prototype.applyInverse = function(t2, e2) {
        e2 = e2 || new We;
        var r5 = 1 / (this.a * this.d + this.c * -this.b), i4 = t2.x, n6 = t2.y;
        return e2.x = this.d * r5 * i4 + -this.c * r5 * n6 + (this.ty * this.c - this.tx * this.d) * r5, e2.y = this.a * r5 * n6 + -this.b * r5 * i4 + (-this.ty * this.a + this.tx * this.b) * r5, e2;
    }, t1.prototype.translate = function(t2, e2) {
        return this.tx += t2, this.ty += e2, this;
    }, t1.prototype.scale = function(t2, e2) {
        return this.a *= t2, this.d *= e2, this.c *= t2, this.b *= e2, this.tx *= t2, this.ty *= e2, this;
    }, t1.prototype.rotate = function(t2) {
        var e2 = Math.cos(t2), r5 = Math.sin(t2), i4 = this.a, n6 = this.c, o7 = this.tx;
        return this.a = i4 * e2 - this.b * r5, this.b = i4 * r5 + this.b * e2, this.c = n6 * e2 - this.d * r5, this.d = n6 * r5 + this.d * e2, this.tx = o7 * e2 - this.ty * r5, this.ty = o7 * r5 + this.ty * e2, this;
    }, t1.prototype.append = function(t2) {
        var e2 = this.a, r5 = this.b, i4 = this.c, n6 = this.d;
        return this.a = t2.a * e2 + t2.b * i4, this.b = t2.a * r5 + t2.b * n6, this.c = t2.c * e2 + t2.d * i4, this.d = t2.c * r5 + t2.d * n6, this.tx = t2.tx * e2 + t2.ty * i4 + this.tx, this.ty = t2.tx * r5 + t2.ty * n6 + this.ty, this;
    }, t1.prototype.setTransform = function(t2, e2, r5, i4, n6, o7, s6, a9, h7) {
        return this.a = Math.cos(s6 + h7) * n6, this.b = Math.sin(s6 + h7) * n6, this.c = -Math.sin(s6 - a9) * o7, this.d = Math.cos(s6 - a9) * o7, this.tx = t2 - (r5 * this.a + i4 * this.c), this.ty = e2 - (r5 * this.b + i4 * this.d), this;
    }, t1.prototype.prepend = function(t2) {
        var e2 = this.tx;
        if (1 !== t2.a || 0 !== t2.b || 0 !== t2.c || 1 !== t2.d) {
            var r5 = this.a, i4 = this.c;
            this.a = r5 * t2.a + this.b * t2.c, this.b = r5 * t2.b + this.b * t2.d, this.c = i4 * t2.a + this.d * t2.c, this.d = i4 * t2.b + this.d * t2.d;
        }
        return this.tx = e2 * t2.a + this.ty * t2.c + t2.tx, this.ty = e2 * t2.b + this.ty * t2.d + t2.ty, this;
    }, t1.prototype.decompose = function(t2) {
        var e2 = this.a, r6 = this.b, i5 = this.c, n6 = this.d, o7 = t2.pivot, s6 = -Math.atan2(-i5, n6), a9 = Math.atan2(r6, e2), h7 = Math.abs(s6 + a9);
        return h7 < 0.00001 || Math.abs(Ge - h7) < 0.00001 ? (t2.rotation = a9, t2.skew.x = t2.skew.y = 0) : (t2.rotation = 0, t2.skew.x = s6, t2.skew.y = a9), t2.scale.x = Math.sqrt(e2 * e2 + r6 * r6), t2.scale.y = Math.sqrt(i5 * i5 + n6 * n6), t2.position.x = this.tx + (o7.x * e2 + o7.y * i5), t2.position.y = this.ty + (o7.x * r6 + o7.y * n6), t2;
    }, t1.prototype.invert = function() {
        var t2 = this.a, e2 = this.b, r6 = this.c, i5 = this.d, n6 = this.tx, o7 = t2 * i5 - e2 * r6;
        return this.a = i5 / o7, this.b = -e2 / o7, this.c = -r6 / o7, this.d = t2 / o7, this.tx = (r6 * this.ty - i5 * n6) / o7, this.ty = -(t2 * this.ty - e2 * n6) / o7, this;
    }, t1.prototype.identity = function() {
        return this.a = 1, this.b = 0, this.c = 0, this.d = 1, this.tx = 0, this.ty = 0, this;
    }, t1.prototype.clone = function() {
        var e2 = new t1;
        return e2.a = this.a, e2.b = this.b, e2.c = this.c, e2.d = this.d, e2.tx = this.tx, e2.ty = this.ty, e2;
    }, t1.prototype.copyTo = function(t2) {
        return t2.a = this.a, t2.b = this.b, t2.c = this.c, t2.d = this.d, t2.tx = this.tx, t2.ty = this.ty, t2;
    }, t1.prototype.copyFrom = function(t2) {
        return this.a = t2.a, this.b = t2.b, this.c = t2.c, this.d = t2.d, this.tx = t2.tx, this.ty = t2.ty, this;
    }, Object.defineProperty(t1, "IDENTITY", {
        get: function() {
            return new t1;
        },
        enumerable: !1,
        configurable: !0
    }), Object.defineProperty(t1, "TEMP_MATRIX", {
        get: function() {
            return new t1;
        },
        enumerable: !1,
        configurable: !0
    }), t1;
}(), Ze = [
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
], Je = [
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
], Qe = [
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
], $e = [
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
], tr = [], er = [], rr = Math.sign;
!function() {
    for(var t1 = 0; t1 < 16; t1++){
        var e2 = [];
        tr.push(e2);
        for(var r6 = 0; r6 < 16; r6++)for(var i5 = rr(Ze[t1] * Ze[r6] + Qe[t1] * Je[r6]), n6 = rr(Je[t1] * Ze[r6] + $e[t1] * Je[r6]), o7 = rr(Ze[t1] * Qe[r6] + Qe[t1] * $e[r6]), s6 = rr(Je[t1] * Qe[r6] + $e[t1] * $e[r6]), a9 = 0; a9 < 16; a9++)if (Ze[a9] === i5 && Je[a9] === n6 && Qe[a9] === o7 && $e[a9] === s6) {
            e2.push(a9);
            break;
        }
    }
    for(t1 = 0; t1 < 16; t1++){
        var h7 = new Ke;
        h7.set(Ze[t1], Je[t1], Qe[t1], $e[t1], 0, 0), er.push(h7);
    }
}();
var ir = {
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
    uX: function(t1) {
        return Ze[t1];
    },
    uY: function(t1) {
        return Je[t1];
    },
    vX: function(t1) {
        return Qe[t1];
    },
    vY: function(t1) {
        return $e[t1];
    },
    inv: function(t1) {
        return 8 & t1 ? 15 & t1 : 7 & -t1;
    },
    add: function(t1, e3) {
        return tr[t1][e3];
    },
    sub: function(t1, e3) {
        return tr[t1][ir.inv(e3)];
    },
    rotate180: function(t1) {
        return 4 ^ t1;
    },
    isVertical: function(t1) {
        return 2 == (3 & t1);
    },
    byDirection: function(t1, e3) {
        return 2 * Math.abs(t1) <= Math.abs(e3) ? e3 >= 0 ? ir.S : ir.N : 2 * Math.abs(e3) <= Math.abs(t1) ? t1 > 0 ? ir.E : ir.W : e3 > 0 ? t1 > 0 ? ir.SE : ir.SW : t1 > 0 ? ir.NE : ir.NW;
    },
    matrixAppendRotationInv: function(t1, e3, r7, i6) {
        (void 0) === r7 && (r7 = 0), (void 0) === i6 && (i6 = 0);
        var n7 = er[ir.inv(e3)];
        n7.tx = r7, n7.ty = i6, t1.append(n7);
    }
}, nr = function() {
    function t1() {
        this.worldTransform = new Ke, this.localTransform = new Ke, this.position = new qe(this.onChange, this, 0, 0), this.scale = new qe(this.onChange, this, 1, 1), this.pivot = new qe(this.onChange, this, 0, 0), this.skew = new qe(this.updateSkew, this, 0, 0), this._rotation = 0, this._cx = 1, this._sx = 0, this._cy = 0, this._sy = 1, this._localID = 0, this._currentLocalID = 0, this._worldID = 0, this._parentID = 0;
    }
    return t1.prototype.onChange = function() {
        this._localID++;
    }, t1.prototype.updateSkew = function() {
        this._cx = Math.cos(this._rotation + this.skew.y), this._sx = Math.sin(this._rotation + this.skew.y), this._cy = -Math.sin(this._rotation - this.skew.x), this._sy = Math.cos(this._rotation - this.skew.x), this._localID++;
    }, t1.prototype.updateLocalTransform = function() {
        var t2 = this.localTransform;
        this._localID !== this._currentLocalID && (t2.a = this._cx * this.scale.x, t2.b = this._sx * this.scale.x, t2.c = this._cy * this.scale.y, t2.d = this._sy * this.scale.y, t2.tx = this.position.x - (this.pivot.x * t2.a + this.pivot.y * t2.c), t2.ty = this.position.y - (this.pivot.x * t2.b + this.pivot.y * t2.d), this._currentLocalID = this._localID, this._parentID = -1);
    }, t1.prototype.updateTransform = function(t2) {
        var e3 = this.localTransform;
        if (this._localID !== this._currentLocalID && (e3.a = this._cx * this.scale.x, e3.b = this._sx * this.scale.x, e3.c = this._cy * this.scale.y, e3.d = this._sy * this.scale.y, e3.tx = this.position.x - (this.pivot.x * e3.a + this.pivot.y * e3.c), e3.ty = this.position.y - (this.pivot.x * e3.b + this.pivot.y * e3.d), this._currentLocalID = this._localID, this._parentID = -1), this._parentID !== t2._worldID) {
            var r7 = t2.worldTransform, i6 = this.worldTransform;
            i6.a = e3.a * r7.a + e3.b * r7.c, i6.b = e3.a * r7.b + e3.b * r7.d, i6.c = e3.c * r7.a + e3.d * r7.c, i6.d = e3.c * r7.b + e3.d * r7.d, i6.tx = e3.tx * r7.a + e3.ty * r7.c + r7.tx, i6.ty = e3.tx * r7.b + e3.ty * r7.d + r7.ty, this._parentID = t2._worldID, this._worldID++;
        }
    }, t1.prototype.setFromMatrix = function(t2) {
        t2.decompose(this), this._localID++;
    }, Object.defineProperty(t1.prototype, "rotation", {
        get: function() {
            return this._rotation;
        },
        set: function(t2) {
            this._rotation !== t2 && (this._rotation = t2, this.updateSkew());
        },
        enumerable: !1,
        configurable: !0
    }), t1.IDENTITY = new t1, t1;
}();
F.SORTABLE_CHILDREN = !1;
var or = function() {
    function t1() {
        this.minX = 1 / 0, this.minY = 1 / 0, this.maxX = -1 / 0, this.maxY = -1 / 0, this.rect = null, this.updateID = -1;
    }
    return t1.prototype.isEmpty = function() {
        return this.minX > this.maxX || this.minY > this.maxY;
    }, t1.prototype.clear = function() {
        this.minX = 1 / 0, this.minY = 1 / 0, this.maxX = -1 / 0, this.maxY = -1 / 0;
    }, t1.prototype.getRectangle = function(t2) {
        return this.minX > this.maxX || this.minY > this.maxY ? je.EMPTY : ((t2 = t2 || new je(0, 0, 1, 1)).x = this.minX, t2.y = this.minY, t2.width = this.maxX - this.minX, t2.height = this.maxY - this.minY, t2);
    }, t1.prototype.addPoint = function(t2) {
        this.minX = Math.min(this.minX, t2.x), this.maxX = Math.max(this.maxX, t2.x), this.minY = Math.min(this.minY, t2.y), this.maxY = Math.max(this.maxY, t2.y);
    }, t1.prototype.addPointMatrix = function(t2, e3) {
        var r8 = t2.a, i7 = t2.b, n7 = t2.c, o8 = t2.d, s7 = t2.tx, a10 = t2.ty, h8 = r8 * e3.x + n7 * e3.y + s7, u9 = i7 * e3.x + o8 * e3.y + a10;
        this.minX = Math.min(this.minX, h8), this.maxX = Math.max(this.maxX, h8), this.minY = Math.min(this.minY, u9), this.maxY = Math.max(this.maxY, u9);
    }, t1.prototype.addQuad = function(t2) {
        var e3 = this.minX, r8 = this.minY, i7 = this.maxX, n7 = this.maxY, o8 = t2[0], s7 = t2[1];
        e3 = o8 < e3 ? o8 : e3, r8 = s7 < r8 ? s7 : r8, i7 = o8 > i7 ? o8 : i7, n7 = s7 > n7 ? s7 : n7, e3 = (o8 = t2[2]) < e3 ? o8 : e3, r8 = (s7 = t2[3]) < r8 ? s7 : r8, i7 = o8 > i7 ? o8 : i7, n7 = s7 > n7 ? s7 : n7, e3 = (o8 = t2[4]) < e3 ? o8 : e3, r8 = (s7 = t2[5]) < r8 ? s7 : r8, i7 = o8 > i7 ? o8 : i7, n7 = s7 > n7 ? s7 : n7, e3 = (o8 = t2[6]) < e3 ? o8 : e3, r8 = (s7 = t2[7]) < r8 ? s7 : r8, i7 = o8 > i7 ? o8 : i7, n7 = s7 > n7 ? s7 : n7, this.minX = e3, this.minY = r8, this.maxX = i7, this.maxY = n7;
    }, t1.prototype.addFrame = function(t2, e3, r8, i7, n7) {
        this.addFrameMatrix(t2.worldTransform, e3, r8, i7, n7);
    }, t1.prototype.addFrameMatrix = function(t2, e3, r8, i7, n7) {
        var o8 = t2.a, s7 = t2.b, a10 = t2.c, h8 = t2.d, u9 = t2.tx, l7 = t2.ty, c5 = this.minX, d6 = this.minY, f6 = this.maxX, p = this.maxY, _3 = o8 * e3 + a10 * r8 + u9, m2 = s7 * e3 + h8 * r8 + l7;
        c5 = _3 < c5 ? _3 : c5, d6 = m2 < d6 ? m2 : d6, f6 = _3 > f6 ? _3 : f6, p = m2 > p ? m2 : p, c5 = (_3 = o8 * i7 + a10 * r8 + u9) < c5 ? _3 : c5, d6 = (m2 = s7 * i7 + h8 * r8 + l7) < d6 ? m2 : d6, f6 = _3 > f6 ? _3 : f6, p = m2 > p ? m2 : p, c5 = (_3 = o8 * e3 + a10 * n7 + u9) < c5 ? _3 : c5, d6 = (m2 = s7 * e3 + h8 * n7 + l7) < d6 ? m2 : d6, f6 = _3 > f6 ? _3 : f6, p = m2 > p ? m2 : p, c5 = (_3 = o8 * i7 + a10 * n7 + u9) < c5 ? _3 : c5, d6 = (m2 = s7 * i7 + h8 * n7 + l7) < d6 ? m2 : d6, f6 = _3 > f6 ? _3 : f6, p = m2 > p ? m2 : p, this.minX = c5, this.minY = d6, this.maxX = f6, this.maxY = p;
    }, t1.prototype.addVertexData = function(t2, e3, r8) {
        for(var i7 = this.minX, n7 = this.minY, o8 = this.maxX, s7 = this.maxY, a10 = e3; a10 < r8; a10 += 2){
            var h8 = t2[a10], u9 = t2[a10 + 1];
            i7 = h8 < i7 ? h8 : i7, n7 = u9 < n7 ? u9 : n7, o8 = h8 > o8 ? h8 : o8, s7 = u9 > s7 ? u9 : s7;
        }
        this.minX = i7, this.minY = n7, this.maxX = o8, this.maxY = s7;
    }, t1.prototype.addVertices = function(t2, e3, r8, i7) {
        this.addVerticesMatrix(t2.worldTransform, e3, r8, i7);
    }, t1.prototype.addVerticesMatrix = function(t2, e3, r8, i7, n7, o8) {
        (void 0) === n7 && (n7 = 0), (void 0) === o8 && (o8 = n7);
        for(var s7 = t2.a, a10 = t2.b, h9 = t2.c, u10 = t2.d, l7 = t2.tx, c5 = t2.ty, d6 = this.minX, f6 = this.minY, p = this.maxX, _3 = this.maxY, m2 = r8; m2 < i7; m2 += 2){
            var v2 = e3[m2], y = e3[m2 + 1], g2 = s7 * v2 + h9 * y + l7, b2 = u10 * y + a10 * v2 + c5;
            d6 = Math.min(d6, g2 - n7), p = Math.max(p, g2 + n7), f6 = Math.min(f6, b2 - o8), _3 = Math.max(_3, b2 + o8);
        }
        this.minX = d6, this.minY = f6, this.maxX = p, this.maxY = _3;
    }, t1.prototype.addBounds = function(t2) {
        var e3 = this.minX, r8 = this.minY, i7 = this.maxX, n7 = this.maxY;
        this.minX = t2.minX < e3 ? t2.minX : e3, this.minY = t2.minY < r8 ? t2.minY : r8, this.maxX = t2.maxX > i7 ? t2.maxX : i7, this.maxY = t2.maxY > n7 ? t2.maxY : n7;
    }, t1.prototype.addBoundsMask = function(t2, e3) {
        var r8 = t2.minX > e3.minX ? t2.minX : e3.minX, i7 = t2.minY > e3.minY ? t2.minY : e3.minY, n7 = t2.maxX < e3.maxX ? t2.maxX : e3.maxX, o8 = t2.maxY < e3.maxY ? t2.maxY : e3.maxY;
        if (r8 <= n7 && i7 <= o8) {
            var s7 = this.minX, a10 = this.minY, h9 = this.maxX, u10 = this.maxY;
            this.minX = r8 < s7 ? r8 : s7, this.minY = i7 < a10 ? i7 : a10, this.maxX = n7 > h9 ? n7 : h9, this.maxY = o8 > u10 ? o8 : u10;
        }
    }, t1.prototype.addBoundsMatrix = function(t2, e3) {
        this.addFrameMatrix(e3, t2.minX, t2.minY, t2.maxX, t2.maxY);
    }, t1.prototype.addBoundsArea = function(t2, e3) {
        var r8 = t2.minX > e3.x ? t2.minX : e3.x, i7 = t2.minY > e3.y ? t2.minY : e3.y, n7 = t2.maxX < e3.x + e3.width ? t2.maxX : e3.x + e3.width, o8 = t2.maxY < e3.y + e3.height ? t2.maxY : e3.y + e3.height;
        if (r8 <= n7 && i7 <= o8) {
            var s8 = this.minX, a11 = this.minY, h10 = this.maxX, u11 = this.maxY;
            this.minX = r8 < s8 ? r8 : s8, this.minY = i7 < a11 ? i7 : a11, this.maxX = n7 > h10 ? n7 : h10, this.maxY = o8 > u11 ? o8 : u11;
        }
    }, t1.prototype.pad = function(t2, e3) {
        (void 0) === t2 && (t2 = 0), (void 0) === e3 && (e3 = t2), this.isEmpty() || (this.minX -= t2, this.maxX += t2, this.minY -= e3, this.maxY += e3);
    }, t1.prototype.addFramePad = function(t2, e3, r8, i7, n7, o8) {
        t2 -= n7, e3 -= o8, r8 += n7, i7 += o8, this.minX = this.minX < t2 ? this.minX : t2, this.maxX = this.maxX > r8 ? this.maxX : r8, this.minY = this.minY < e3 ? this.minY : e3, this.maxY = this.maxY > i7 ? this.maxY : i7;
    }, t1;
}(), sr = function(t1, e3) {
    return (sr = Object.setPrototypeOf || ({
        __proto__: []
    }) instanceof Array && function(t2, e4) {
        t2.__proto__ = e4;
    } || function(t2, e4) {
        for(var r8 in e4)e4.hasOwnProperty(r8) && (t2[r8] = e4[r8]);
    })(t1, e3);
};
function ar(t1, e3) {
    function r8() {
        this.constructor = t1;
    }
    sr(t1, e3), t1.prototype = null === e3 ? Object.create(e3) : (r8.prototype = e3.prototype, new r8);
}
var hr = function(t1) {
    function e3() {
        var e4 = t1.call(this) || this;
        return e4.tempDisplayObjectParent = null, e4.transform = new nr, e4.alpha = 1, e4.visible = !0, e4.renderable = !0, e4.parent = null, e4.worldAlpha = 1, e4._lastSortedIndex = 0, e4._zIndex = 0, e4.filterArea = null, e4.filters = null, e4._enabledFilters = null, e4._bounds = new or, e4._localBounds = null, e4._boundsID = 0, e4._boundsRect = null, e4._localBoundsRect = null, e4._mask = null, e4._destroyed = !1, e4.isSprite = !1, e4.isMask = !1, e4;
    }
    return ar(e3, t1), e3.mixin = function(t2) {
        for(var r8 = Object.keys(t2), i7 = 0; i7 < r8.length; ++i7){
            var n7 = r8[i7];
            Object.defineProperty(e3.prototype, n7, Object.getOwnPropertyDescriptor(t2, n7));
        }
    }, e3.prototype._recursivePostUpdateTransform = function() {
        this.parent ? (this.parent._recursivePostUpdateTransform(), this.transform.updateTransform(this.parent.transform)) : this.transform.updateTransform(this._tempDisplayObjectParent.transform);
    }, e3.prototype.updateTransform = function() {
        this._boundsID++, this.transform.updateTransform(this.parent.transform), this.worldAlpha = this.alpha * this.parent.worldAlpha;
    }, e3.prototype.getBounds = function(t2, e4) {
        return t2 || (this.parent ? (this._recursivePostUpdateTransform(), this.updateTransform()) : (this.parent = this._tempDisplayObjectParent, this.updateTransform(), this.parent = null)), this._bounds.updateID !== this._boundsID && (this.calculateBounds(), this._bounds.updateID = this._boundsID), e4 || (this._boundsRect || (this._boundsRect = new je), e4 = this._boundsRect), this._bounds.getRectangle(e4);
    }, e3.prototype.getLocalBounds = function(t2) {
        t2 || (this._localBoundsRect || (this._localBoundsRect = new je), t2 = this._localBoundsRect), this._localBounds || (this._localBounds = new or);
        var e4 = this.transform, r8 = this.parent;
        this.parent = null, this.transform = this._tempDisplayObjectParent.transform;
        var i7 = this._bounds, n8 = this._boundsID;
        this._bounds = this._localBounds;
        var o8 = this.getBounds(!1, t2);
        return this.parent = r8, this.transform = e4, this._bounds = i7, this._bounds.updateID += this._boundsID - n8, o8;
    }, e3.prototype.toGlobal = function(t2, e4, r8) {
        return (void 0) === r8 && (r8 = !1), r8 || (this._recursivePostUpdateTransform(), this.parent ? this.displayObjectUpdateTransform() : (this.parent = this._tempDisplayObjectParent, this.displayObjectUpdateTransform(), this.parent = null)), this.worldTransform.apply(t2, e4);
    }, e3.prototype.toLocal = function(t2, e4, r8, i7) {
        return e4 && (t2 = e4.toGlobal(t2, r8, i7)), i7 || (this._recursivePostUpdateTransform(), this.parent ? this.displayObjectUpdateTransform() : (this.parent = this._tempDisplayObjectParent, this.displayObjectUpdateTransform(), this.parent = null)), this.worldTransform.applyInverse(t2, r8);
    }, e3.prototype.setParent = function(t2) {
        if (!t2 || !t2.addChild) throw new Error("setParent: Argument must be a Container");
        return t2.addChild(this), t2;
    }, e3.prototype.setTransform = function(t2, e4, r8, i7, n8, o8, s9, a12, h11) {
        return (void 0) === t2 && (t2 = 0), (void 0) === e4 && (e4 = 0), (void 0) === r8 && (r8 = 1), (void 0) === i7 && (i7 = 1), (void 0) === n8 && (n8 = 0), (void 0) === o8 && (o8 = 0), (void 0) === s9 && (s9 = 0), (void 0) === a12 && (a12 = 0), (void 0) === h11 && (h11 = 0), this.position.x = t2, this.position.y = e4, this.scale.x = r8 || 1, this.scale.y = i7 || 1, this.rotation = n8, this.skew.x = o8, this.skew.y = s9, this.pivot.x = a12, this.pivot.y = h11, this;
    }, e3.prototype.destroy = function(t2) {
        this.parent && this.parent.removeChild(this), this.removeAllListeners(), this.transform = null, this.parent = null, this._bounds = null, this._mask = null, this.filters = null, this.filterArea = null, this.hitArea = null, this.interactive = !1, this.interactiveChildren = !1, this._destroyed = !0;
    }, Object.defineProperty(e3.prototype, "_tempDisplayObjectParent", {
        get: function() {
            return null === this.tempDisplayObjectParent && (this.tempDisplayObjectParent = new ur), this.tempDisplayObjectParent;
        },
        enumerable: !1,
        configurable: !0
    }), e3.prototype.enableTempParent = function() {
        var t2 = this.parent;
        return this.parent = this._tempDisplayObjectParent, t2;
    }, e3.prototype.disableTempParent = function(t2) {
        this.parent = t2;
    }, Object.defineProperty(e3.prototype, "x", {
        get: function() {
            return this.position.x;
        },
        set: function(t2) {
            this.transform.position.x = t2;
        },
        enumerable: !1,
        configurable: !0
    }), Object.defineProperty(e3.prototype, "y", {
        get: function() {
            return this.position.y;
        },
        set: function(t2) {
            this.transform.position.y = t2;
        },
        enumerable: !1,
        configurable: !0
    }), Object.defineProperty(e3.prototype, "worldTransform", {
        get: function() {
            return this.transform.worldTransform;
        },
        enumerable: !1,
        configurable: !0
    }), Object.defineProperty(e3.prototype, "localTransform", {
        get: function() {
            return this.transform.localTransform;
        },
        enumerable: !1,
        configurable: !0
    }), Object.defineProperty(e3.prototype, "position", {
        get: function() {
            return this.transform.position;
        },
        set: function(t2) {
            this.transform.position.copyFrom(t2);
        },
        enumerable: !1,
        configurable: !0
    }), Object.defineProperty(e3.prototype, "scale", {
        get: function() {
            return this.transform.scale;
        },
        set: function(t2) {
            this.transform.scale.copyFrom(t2);
        },
        enumerable: !1,
        configurable: !0
    }), Object.defineProperty(e3.prototype, "pivot", {
        get: function() {
            return this.transform.pivot;
        },
        set: function(t2) {
            this.transform.pivot.copyFrom(t2);
        },
        enumerable: !1,
        configurable: !0
    }), Object.defineProperty(e3.prototype, "skew", {
        get: function() {
            return this.transform.skew;
        },
        set: function(t2) {
            this.transform.skew.copyFrom(t2);
        },
        enumerable: !1,
        configurable: !0
    }), Object.defineProperty(e3.prototype, "rotation", {
        get: function() {
            return this.transform.rotation;
        },
        set: function(t2) {
            this.transform.rotation = t2;
        },
        enumerable: !1,
        configurable: !0
    }), Object.defineProperty(e3.prototype, "angle", {
        get: function() {
            return this.transform.rotation * Xe;
        },
        set: function(t2) {
            this.transform.rotation = t2 * ke;
        },
        enumerable: !1,
        configurable: !0
    }), Object.defineProperty(e3.prototype, "zIndex", {
        get: function() {
            return this._zIndex;
        },
        set: function(t2) {
            this._zIndex = t2, this.parent && (this.parent.sortDirty = !0);
        },
        enumerable: !1,
        configurable: !0
    }), Object.defineProperty(e3.prototype, "worldVisible", {
        get: function() {
            var t2 = this;
            do {
                if (!t2.visible) return !1;
                t2 = t2.parent;
            }while (t2)
            return !0;
        },
        enumerable: !1,
        configurable: !0
    }), Object.defineProperty(e3.prototype, "mask", {
        get: function() {
            return this._mask;
        },
        set: function(t2) {
            var e4;
            this._mask && ((e4 = this._mask.maskObject || this._mask).renderable = !0, e4.isMask = !1), this._mask = t2, this._mask && ((e4 = this._mask.maskObject || this._mask).renderable = !1, e4.isMask = !0);
        },
        enumerable: !1,
        configurable: !0
    }), e3;
}(X2), ur = function(t1) {
    function e3() {
        var e4 = null !== t1 && t1.apply(this, arguments) || this;
        return e4.sortDirty = null, e4;
    }
    return ar(e3, t1), e3;
}(hr);
function lr(t1, e3) {
    return t1.zIndex === e3.zIndex ? t1._lastSortedIndex - e3._lastSortedIndex : t1.zIndex - e3.zIndex;
}
hr.prototype.displayObjectUpdateTransform = hr.prototype.updateTransform;
var cr = function(t1) {
    function e3() {
        var e4 = t1.call(this) || this;
        return e4.children = [], e4.sortableChildren = F.SORTABLE_CHILDREN, e4.sortDirty = !1, e4;
    }
    return ar(e3, t1), e3.prototype.onChildrenChange = function(t2) {
    }, e3.prototype.addChild = function() {
        for(var t2 = arguments, e4 = [], r8 = 0; r8 < arguments.length; r8++)e4[r8] = t2[r8];
        if (e4.length > 1) for(var i7 = 0; i7 < e4.length; i7++)this.addChild(e4[i7]);
        else {
            var n8 = e4[0];
            n8.parent && n8.parent.removeChild(n8), n8.parent = this, this.sortDirty = !0, n8.transform._parentID = -1, this.children.push(n8), this._boundsID++, this.onChildrenChange(this.children.length - 1), this.emit("childAdded", n8, this, this.children.length - 1), n8.emit("added", this);
        }
        return e4[0];
    }, e3.prototype.addChildAt = function(t2, e4) {
        if (e4 < 0 || e4 > this.children.length) throw new Error(t2 + "addChildAt: The index " + e4 + " supplied is out of bounds " + this.children.length);
        return t2.parent && t2.parent.removeChild(t2), t2.parent = this, this.sortDirty = !0, t2.transform._parentID = -1, this.children.splice(e4, 0, t2), this._boundsID++, this.onChildrenChange(e4), t2.emit("added", this), this.emit("childAdded", t2, this, e4), t2;
    }, e3.prototype.swapChildren = function(t2, e4) {
        if (t2 !== e4) {
            var r8 = this.getChildIndex(t2), i7 = this.getChildIndex(e4);
            this.children[r8] = e4, this.children[i7] = t2, this.onChildrenChange(r8 < i7 ? r8 : i7);
        }
    }, e3.prototype.getChildIndex = function(t2) {
        var e4 = this.children.indexOf(t2);
        if (-1 === e4) throw new Error("The supplied DisplayObject must be a child of the caller");
        return e4;
    }, e3.prototype.setChildIndex = function(t2, e4) {
        if (e4 < 0 || e4 >= this.children.length) throw new Error("The index " + e4 + " supplied is out of bounds " + this.children.length);
        var r9 = this.getChildIndex(t2);
        Ee(this.children, r9, 1), this.children.splice(e4, 0, t2), this.onChildrenChange(e4);
    }, e3.prototype.getChildAt = function(t2) {
        if (t2 < 0 || t2 >= this.children.length) throw new Error("getChildAt: Index (" + t2 + ") does not exist.");
        return this.children[t2];
    }, e3.prototype.removeChild = function() {
        for(var t2 = arguments, e4 = [], r9 = 0; r9 < arguments.length; r9++)e4[r9] = t2[r9];
        if (e4.length > 1) for(var i8 = 0; i8 < e4.length; i8++)this.removeChild(e4[i8]);
        else {
            var n9 = e4[0], o8 = this.children.indexOf(n9);
            if (-1 === o8) return null;
            n9.parent = null, n9.transform._parentID = -1, Ee(this.children, o8, 1), this._boundsID++, this.onChildrenChange(o8), n9.emit("removed", this), this.emit("childRemoved", n9, this, o8);
        }
        return e4[0];
    }, e3.prototype.removeChildAt = function(t2) {
        var e4 = this.getChildAt(t2);
        return e4.parent = null, e4.transform._parentID = -1, Ee(this.children, t2, 1), this._boundsID++, this.onChildrenChange(t2), e4.emit("removed", this), this.emit("childRemoved", e4, this, t2), e4;
    }, e3.prototype.removeChildren = function(t2, e4) {
        (void 0) === t2 && (t2 = 0), (void 0) === e4 && (e4 = this.children.length);
        var r9, i8 = t2, n10 = e4 - i8;
        if (n10 > 0 && n10 <= e4) {
            r9 = this.children.splice(i8, n10);
            for(var o9 = 0; o9 < r9.length; ++o9)r9[o9].parent = null, r9[o9].transform && (r9[o9].transform._parentID = -1);
            for(this._boundsID++, this.onChildrenChange(t2), o9 = 0; o9 < r9.length; ++o9)r9[o9].emit("removed", this), this.emit("childRemoved", r9[o9], this, o9);
            return r9;
        }
        if (0 === n10 && 0 === this.children.length) return [];
        throw new RangeError("removeChildren: numeric values are outside the acceptable range.");
    }, e3.prototype.sortChildren = function() {
        for(var t2 = !1, e4 = 0, r9 = this.children.length; e4 < r9; ++e4){
            var i8 = this.children[e4];
            i8._lastSortedIndex = e4, t2 || 0 === i8.zIndex || (t2 = !0);
        }
        t2 && this.children.length > 1 && this.children.sort(lr), this.sortDirty = !1;
    }, e3.prototype.updateTransform = function() {
        this.sortableChildren && this.sortDirty && this.sortChildren(), this._boundsID++, this.transform.updateTransform(this.parent.transform), this.worldAlpha = this.alpha * this.parent.worldAlpha;
        for(var t2 = 0, e4 = this.children.length; t2 < e4; ++t2){
            var r9 = this.children[t2];
            r9.visible && r9.updateTransform();
        }
    }, e3.prototype.calculateBounds = function() {
        this._bounds.clear(), this._calculateBounds();
        for(var t2 = 0; t2 < this.children.length; t2++){
            var e4 = this.children[t2];
            if (e4.visible && e4.renderable) {
                if (e4.calculateBounds(), e4._mask) {
                    var r10 = e4._mask.maskObject || e4._mask;
                    r10.calculateBounds(), this._bounds.addBoundsMask(e4._bounds, r10._bounds);
                } else e4.filterArea ? this._bounds.addBoundsArea(e4._bounds, e4.filterArea) : this._bounds.addBounds(e4._bounds);
            }
        }
        this._bounds.updateID = this._boundsID;
    }, e3.prototype.getLocalBounds = function(e5, r11) {
        (void 0) === r11 && (r11 = !1);
        var i9 = t1.prototype.getLocalBounds.call(this, e5);
        if (!r11) for(var n10 = 0, o10 = this.children.length; n10 < o10; ++n10){
            var s9 = this.children[n10];
            s9.visible && s9.updateTransform();
        }
        return i9;
    }, e3.prototype._calculateBounds = function() {
    }, e3.prototype.render = function(t2) {
        if (this.visible && !(this.worldAlpha <= 0) && this.renderable) {
            if (this._mask || this.filters && this.filters.length) this.renderAdvanced(t2);
            else {
                this._render(t2);
                for(var e5 = 0, r11 = this.children.length; e5 < r11; ++e5)this.children[e5].render(t2);
            }
        }
    }, e3.prototype.renderAdvanced = function(t2) {
        t2.batch.flush();
        var e6 = this.filters, r12 = this._mask;
        if (e6) {
            this._enabledFilters || (this._enabledFilters = []), this._enabledFilters.length = 0;
            for(var i9 = 0; i9 < e6.length; i9++)e6[i9].enabled && this._enabledFilters.push(e6[i9]);
            this._enabledFilters.length && t2.filter.push(this, this._enabledFilters);
        }
        r12 && t2.mask.push(this, this._mask), this._render(t2), i9 = 0;
        for(var n10 = this.children.length; i9 < n10; i9++)this.children[i9].render(t2);
        t2.batch.flush(), r12 && t2.mask.pop(this), e6 && this._enabledFilters && this._enabledFilters.length && t2.filter.pop();
    }, e3.prototype._render = function(t2) {
    }, e3.prototype.destroy = function(e6) {
        t1.prototype.destroy.call(this), this.sortDirty = !1;
        var r12 = "boolean" == typeof e6 ? e6 : e6 && e6.children, i10 = this.removeChildren(0, this.children.length);
        if (r12) for(var n10 = 0; n10 < i10.length; ++n10)i10[n10].destroy(e6);
    }, Object.defineProperty(e3.prototype, "width", {
        get: function() {
            return this.scale.x * this.getLocalBounds().width;
        },
        set: function(t2) {
            var e6 = this.getLocalBounds().width;
            this.scale.x = 0 !== e6 ? t2 / e6 : 1, this._width = t2;
        },
        enumerable: !1,
        configurable: !0
    }), Object.defineProperty(e3.prototype, "height", {
        get: function() {
            return this.scale.y * this.getLocalBounds().height;
        },
        set: function(t2) {
            var e6 = this.getLocalBounds().height;
            this.scale.y = 0 !== e6 ? t2 / e6 : 1, this._height = t2;
        },
        enumerable: !1,
        configurable: !0
    }), e3;
}(hr);
cr.prototype.containerUpdateTransform = cr.prototype.updateTransform;
var dr = {
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
hr.mixin(dr);
var fr, pr = 100, _r = 0, mr = 0, vr = 2, yr = function() {
    function t1(t2) {
        this.debug = !1, this._isActive = !1, this._isMobileAccessibility = !1, this.pool = [], this.renderId = 0, this.children = [], this.androidUpdateCount = 0, this.androidUpdateFrequency = 500, this._hookDiv = null, (L.tablet || L.phone) && this.createTouchHook();
        var e3 = document.createElement("div");
        e3.style.width = pr + "px", e3.style.height = pr + "px", e3.style.position = "absolute", e3.style.top = _r + "px", e3.style.left = mr + "px", e3.style.zIndex = vr.toString(), this.div = e3, this.renderer = t2, this._onKeyDown = this._onKeyDown.bind(this), this._onMouseMove = this._onMouseMove.bind(this), self.addEventListener("keydown", this._onKeyDown, !1);
    }
    return Object.defineProperty(t1.prototype, "isActive", {
        get: function() {
            return this._isActive;
        },
        enumerable: !1,
        configurable: !0
    }), Object.defineProperty(t1.prototype, "isMobileAccessibility", {
        get: function() {
            return this._isMobileAccessibility;
        },
        enumerable: !1,
        configurable: !0
    }), t1.prototype.createTouchHook = function() {
        var t2 = this, e3 = document.createElement("button");
        e3.style.width = "1px", e3.style.height = "1px", e3.style.position = "absolute", e3.style.top = "-1000px", e3.style.left = "-1000px", e3.style.zIndex = 2..toString(), e3.style.backgroundColor = "#FF0000", e3.title = "select to enable accessibility for this content", e3.addEventListener("focus", function() {
            t2._isMobileAccessibility = !0, t2.activate(), t2.destroyTouchHook();
        }), document.body.appendChild(e3), this._hookDiv = e3;
    }, t1.prototype.destroyTouchHook = function() {
        this._hookDiv && (document.body.removeChild(this._hookDiv), this._hookDiv = null);
    }, t1.prototype.activate = function() {
        var t2;
        this._isActive || (this._isActive = !0, self.document.addEventListener("mousemove", this._onMouseMove, !0), self.removeEventListener("keydown", this._onKeyDown, !1), this.renderer.on("postrender", this.update, this), null === (t2 = this.renderer.view.parentNode) || (void 0) === t2 || t2.appendChild(this.div));
    }, t1.prototype.deactivate = function() {
        var t2;
        this._isActive && !this._isMobileAccessibility && (this._isActive = !1, self.document.removeEventListener("mousemove", this._onMouseMove, !0), self.addEventListener("keydown", this._onKeyDown, !1), this.renderer.off("postrender", this.update), null === (t2 = this.div.parentNode) || (void 0) === t2 || t2.removeChild(this.div));
    }, t1.prototype.updateAccessibleObjects = function(t2) {
        if (t2.visible && t2.accessibleChildren) {
            t2.accessible && t2.interactive && (t2._accessibleActive || this.addChild(t2), t2.renderId = this.renderId);
            for(var e3 = t2.children, r12 = 0; r12 < e3.length; r12++)this.updateAccessibleObjects(e3[r12]);
        }
    }, t1.prototype.update = function() {
        var t2 = performance.now();
        if (!(L.android.device && t2 < this.androidUpdateCount) && (this.androidUpdateCount = t2 + this.androidUpdateFrequency, this.renderer.renderingToScreen)) {
            this.renderer._lastObjectRendered && this.updateAccessibleObjects(this.renderer._lastObjectRendered);
            var e6 = this.renderer.view.getBoundingClientRect(), r13 = e6.left, i10 = e6.top, n10 = e6.width, o10 = e6.height, s10 = this.renderer, a12 = s10.width, h11 = s10.height, u12 = s10.resolution, l7 = n10 / a12 * u12, c5 = o10 / h11 * u12, d6 = this.div;
            d6.style.left = r13 + "px", d6.style.top = i10 + "px", d6.style.width = a12 + "px", d6.style.height = h11 + "px";
            for(var f6 = 0; f6 < this.children.length; f6++){
                var p = this.children[f6];
                if (p.renderId !== this.renderId) p._accessibleActive = !1, Ee(this.children, f6, 1), this.div.removeChild(p._accessibleDiv), this.pool.push(p._accessibleDiv), p._accessibleDiv = null, f6--;
                else {
                    d6 = p._accessibleDiv;
                    var _3 = p.hitArea, m2 = p.worldTransform;
                    p.hitArea ? (d6.style.left = (m2.tx + _3.x * m2.a) * l7 + "px", d6.style.top = (m2.ty + _3.y * m2.d) * c5 + "px", d6.style.width = _3.width * m2.a * l7 + "px", d6.style.height = _3.height * m2.d * c5 + "px") : (_3 = p.getBounds(), this.capHitArea(_3), d6.style.left = _3.x * l7 + "px", d6.style.top = _3.y * c5 + "px", d6.style.width = _3.width * l7 + "px", d6.style.height = _3.height * c5 + "px", d6.title !== p.accessibleTitle && null !== p.accessibleTitle && (d6.title = p.accessibleTitle), d6.getAttribute("aria-label") !== p.accessibleHint && null !== p.accessibleHint && d6.setAttribute("aria-label", p.accessibleHint)), p.accessibleTitle === d6.title && p.tabIndex === d6.tabIndex || (d6.title = p.accessibleTitle, d6.tabIndex = p.tabIndex, this.debug && this.updateDebugHTML(d6));
                }
            }
            this.renderId++;
        }
    }, t1.prototype.updateDebugHTML = function(t2) {
        t2.innerHTML = "type: " + t2.type + "</br> title : " + t2.title + "</br> tabIndex: " + t2.tabIndex;
    }, t1.prototype.capHitArea = function(t2) {
        t2.x < 0 && (t2.width += t2.x, t2.x = 0), t2.y < 0 && (t2.height += t2.y, t2.y = 0);
        var e7 = this.renderer, r14 = e7.width, i11 = e7.height;
        t2.x + t2.width > r14 && (t2.width = r14 - t2.x), t2.y + t2.height > i11 && (t2.height = i11 - t2.y);
    }, t1.prototype.addChild = function(t2) {
        var e7 = this.pool.pop();
        e7 || ((e7 = document.createElement("button")).style.width = pr + "px", e7.style.height = pr + "px", e7.style.backgroundColor = this.debug ? "rgba(255,255,255,0.5)" : "transparent", e7.style.position = "absolute", e7.style.zIndex = vr.toString(), e7.style.borderStyle = "none", navigator.userAgent.toLowerCase().indexOf("chrome") > -1 ? e7.setAttribute("aria-live", "off") : e7.setAttribute("aria-live", "polite"), navigator.userAgent.match(/rv:.*Gecko\//) ? e7.setAttribute("aria-relevant", "additions") : e7.setAttribute("aria-relevant", "text"), e7.addEventListener("click", this._onClick.bind(this)), e7.addEventListener("focus", this._onFocus.bind(this)), e7.addEventListener("focusout", this._onFocusOut.bind(this))), e7.style.pointerEvents = t2.accessiblePointerEvents, e7.type = t2.accessibleType, t2.accessibleTitle && null !== t2.accessibleTitle ? e7.title = t2.accessibleTitle : t2.accessibleHint && null !== t2.accessibleHint || (e7.title = "displayObject " + t2.tabIndex), t2.accessibleHint && null !== t2.accessibleHint && e7.setAttribute("aria-label", t2.accessibleHint), this.debug && this.updateDebugHTML(e7), t2._accessibleActive = !0, t2._accessibleDiv = e7, e7.displayObject = t2, this.children.push(t2), this.div.appendChild(t2._accessibleDiv), t2._accessibleDiv.tabIndex = t2.tabIndex;
    }, t1.prototype._onClick = function(t2) {
        var e7 = this.renderer.plugins.interaction, r14 = t2.target.displayObject, i11 = e7.eventData;
        e7.dispatchEvent(r14, "click", i11), e7.dispatchEvent(r14, "pointertap", i11), e7.dispatchEvent(r14, "tap", i11);
    }, t1.prototype._onFocus = function(t2) {
        t2.target.getAttribute("aria-live") || t2.target.setAttribute("aria-live", "assertive");
        var e7 = this.renderer.plugins.interaction, r14 = t2.target.displayObject, i11 = e7.eventData;
        e7.dispatchEvent(r14, "mouseover", i11);
    }, t1.prototype._onFocusOut = function(t2) {
        t2.target.getAttribute("aria-live") || t2.target.setAttribute("aria-live", "polite");
        var e7 = this.renderer.plugins.interaction, r14 = t2.target.displayObject, i11 = e7.eventData;
        e7.dispatchEvent(r14, "mouseout", i11);
    }, t1.prototype._onKeyDown = function(t2) {
        9 === t2.keyCode && this.activate();
    }, t1.prototype._onMouseMove = function(t2) {
        0 === t2.movementX && 0 === t2.movementY || this.deactivate();
    }, t1.prototype.destroy = function() {
        this.destroyTouchHook(), this.div = null, self.document.removeEventListener("mousemove", this._onMouseMove, !0), self.removeEventListener("keydown", this._onKeyDown), this.pool = null, this.children = null, this.renderer = null;
    }, t1;
}();
F.TARGET_FPMS = 0.06, (function(t1) {
    t1[t1.INTERACTION = 50] = "INTERACTION", t1[t1.HIGH = 25] = "HIGH", t1[t1.NORMAL = 0] = "NORMAL", t1[t1.LOW = -25] = "LOW", t1[t1.UTILITY = -50] = "UTILITY";
})(fr || (fr = {
}));
var gr = function() {
    function t1(t2, e7, r14, i11) {
        (void 0) === e7 && (e7 = null), (void 0) === r14 && (r14 = 0), (void 0) === i11 && (i11 = !1), this.next = null, this.previous = null, this._destroyed = !1, this.fn = t2, this.context = e7, this.priority = r14, this.once = i11;
    }
    return t1.prototype.match = function(t2, e7) {
        return (void 0) === e7 && (e7 = null), this.fn === t2 && this.context === e7;
    }, t1.prototype.emit = function(t2) {
        this.fn && (this.context ? this.fn.call(this.context, t2) : this.fn(t2));
        var e7 = this.next;
        return this.once && this.destroy(!0), this._destroyed && (this.next = null), e7;
    }, t1.prototype.connect = function(t2) {
        this.previous = t2, t2.next && (t2.next.previous = this), this.next = t2.next, t2.next = this;
    }, t1.prototype.destroy = function(t2) {
        (void 0) === t2 && (t2 = !1), this._destroyed = !0, this.fn = null, this.context = null, this.previous && (this.previous.next = this.next), this.next && (this.next.previous = this.previous);
        var e7 = this.next;
        return this.next = t2 ? null : e7, this.previous = null, e7;
    }, t1;
}(), br = function() {
    function t1() {
        var t2 = this;
        this.autoStart = !1, this.deltaTime = 1, this.lastTime = -1, this.speed = 1, this.started = !1, this._requestId = null, this._maxElapsedMS = 100, this._minElapsedMS = 0, this._protected = !1, this._lastFrame = -1, this._head = new gr(null, null, 1 / 0), this.deltaMS = 1 / F.TARGET_FPMS, this.elapsedMS = 1 / F.TARGET_FPMS, this._tick = function(e7) {
            t2._requestId = null, t2.started && (t2.update(e7), t2.started && null === t2._requestId && t2._head.next && (t2._requestId = requestAnimationFrame(t2._tick)));
        };
    }
    return t1.prototype._requestIfNeeded = function() {
        null === this._requestId && this._head.next && (this.lastTime = performance.now(), this._lastFrame = this.lastTime, this._requestId = requestAnimationFrame(this._tick));
    }, t1.prototype._cancelIfNeeded = function() {
        null !== this._requestId && (cancelAnimationFrame(this._requestId), this._requestId = null);
    }, t1.prototype._startIfPossible = function() {
        this.started ? this._requestIfNeeded() : this.autoStart && this.start();
    }, t1.prototype.add = function(t2, e7, r14) {
        return (void 0) === r14 && (r14 = fr.NORMAL), this._addListener(new gr(t2, e7, r14));
    }, t1.prototype.addOnce = function(t2, e7, r14) {
        return (void 0) === r14 && (r14 = fr.NORMAL), this._addListener(new gr(t2, e7, r14, !0));
    }, t1.prototype._addListener = function(t2) {
        var e7 = this._head.next, r14 = this._head;
        if (e7) {
            for(; e7;){
                if (t2.priority > e7.priority) {
                    t2.connect(r14);
                    break;
                }
                r14 = e7, e7 = e7.next;
            }
            t2.previous || t2.connect(r14);
        } else t2.connect(r14);
        return this._startIfPossible(), this;
    }, t1.prototype.remove = function(t2, e7) {
        for(var r14 = this._head.next; r14;)r14 = r14.match(t2, e7) ? r14.destroy() : r14.next;
        return this._head.next || this._cancelIfNeeded(), this;
    }, Object.defineProperty(t1.prototype, "count", {
        get: function() {
            if (!this._head) return 0;
            for(var t2 = 0, e7 = this._head; e7 = e7.next;)t2++;
            return t2;
        },
        enumerable: !1,
        configurable: !0
    }), t1.prototype.start = function() {
        this.started || (this.started = !0, this._requestIfNeeded());
    }, t1.prototype.stop = function() {
        this.started && (this.started = !1, this._cancelIfNeeded());
    }, t1.prototype.destroy = function() {
        if (!this._protected) {
            this.stop();
            for(var t2 = this._head.next; t2;)t2 = t2.destroy(!0);
            this._head.destroy(), this._head = null;
        }
    }, t1.prototype.update = function(t3) {
        var e7;
        if ((void 0) === t3 && (t3 = performance.now()), t3 > this.lastTime) {
            if ((e7 = this.elapsedMS = t3 - this.lastTime) > this._maxElapsedMS && (e7 = this._maxElapsedMS), e7 *= this.speed, this._minElapsedMS) {
                var r14 = t3 - this._lastFrame | 0;
                if (r14 < this._minElapsedMS) return;
                this._lastFrame = t3 - r14 % this._minElapsedMS;
            }
            this.deltaMS = e7, this.deltaTime = this.deltaMS * F.TARGET_FPMS;
            for(var i11 = this._head, n11 = i11.next; n11;)n11 = n11.emit(this.deltaTime);
            i11.next || this._cancelIfNeeded();
        } else this.deltaTime = this.deltaMS = this.elapsedMS = 0;
        this.lastTime = t3;
    }, Object.defineProperty(t1.prototype, "FPS", {
        get: function() {
            return 1000 / this.elapsedMS;
        },
        enumerable: !1,
        configurable: !0
    }), Object.defineProperty(t1.prototype, "minFPS", {
        get: function() {
            return 1000 / this._maxElapsedMS;
        },
        set: function(t3) {
            var e7 = Math.min(this.maxFPS, t3), r15 = Math.min(Math.max(0, e7) / 1000, F.TARGET_FPMS);
            this._maxElapsedMS = 1 / r15;
        },
        enumerable: !1,
        configurable: !0
    }), Object.defineProperty(t1.prototype, "maxFPS", {
        get: function() {
            return this._minElapsedMS ? Math.round(1000 / this._minElapsedMS) : 0;
        },
        set: function(t3) {
            if (0 === t3) this._minElapsedMS = 0;
            else {
                var e7 = Math.max(this.minFPS, t3);
                this._minElapsedMS = 1 / (e7 / 1000);
            }
        },
        enumerable: !1,
        configurable: !0
    }), Object.defineProperty(t1, "shared", {
        get: function() {
            if (!t1._shared) {
                var e8 = t1._shared = new t1;
                e8.autoStart = !0, e8._protected = !0;
            }
            return t1._shared;
        },
        enumerable: !1,
        configurable: !0
    }), Object.defineProperty(t1, "system", {
        get: function() {
            if (!t1._system) {
                var e9 = t1._system = new t1;
                e9.autoStart = !0, e9._protected = !0;
            }
            return t1._system;
        },
        enumerable: !1,
        configurable: !0
    }), t1;
}(), xr = function() {
    function t1() {
    }
    return t1.init = function(t3) {
        var e10 = this;
        t3 = Object.assign({
            autoStart: !0,
            sharedTicker: !1
        }, t3), Object.defineProperty(this, "ticker", {
            set: function(t4) {
                this._ticker && this._ticker.remove(this.render, this), this._ticker = t4, t4 && t4.add(this.render, this, fr.LOW);
            },
            get: function() {
                return this._ticker;
            }
        }), this.stop = function() {
            e10._ticker.stop();
        }, this.start = function() {
            e10._ticker.start();
        }, this._ticker = null, this.ticker = t3.sharedTicker ? br.shared : new br, t3.autoStart && this.start();
    }, t1.destroy = function() {
        if (this._ticker) {
            var t3 = this._ticker;
            this.ticker = null, t3.destroy();
        }
    }, t1;
}(), Tr = function() {
    function t1() {
        this.pressure = 0, this.rotationAngle = 0, this.twist = 0, this.tangentialPressure = 0, this.global = new We, this.target = null, this.originalEvent = null, this.identifier = null, this.isPrimary = !1, this.button = 0, this.buttons = 0, this.width = 0, this.height = 0, this.tiltX = 0, this.tiltY = 0, this.pointerType = null, this.pressure = 0, this.rotationAngle = 0, this.twist = 0, this.tangentialPressure = 0;
    }
    return Object.defineProperty(t1.prototype, "pointerId", {
        get: function() {
            return this.identifier;
        },
        enumerable: !1,
        configurable: !0
    }), t1.prototype.getLocalPosition = function(t4, e10, r15) {
        return t4.worldTransform.applyInverse(r15 || this.global, e10);
    }, t1.prototype.copyEvent = function(t4) {
        "isPrimary" in t4 && t4.isPrimary && (this.isPrimary = !0), this.button = "button" in t4 && t4.button;
        var e10 = "buttons" in t4 && t4.buttons;
        this.buttons = Number.isInteger(e10) ? e10 : "which" in t4 && t4.which, this.width = "width" in t4 && t4.width, this.height = "height" in t4 && t4.height, this.tiltX = "tiltX" in t4 && t4.tiltX, this.tiltY = "tiltY" in t4 && t4.tiltY, this.pointerType = "pointerType" in t4 && t4.pointerType, this.pressure = "pressure" in t4 && t4.pressure, this.rotationAngle = "rotationAngle" in t4 && t4.rotationAngle, this.twist = "twist" in t4 && t4.twist || 0, this.tangentialPressure = "tangentialPressure" in t4 && t4.tangentialPressure || 0;
    }, t1.prototype.reset = function() {
        this.isPrimary = !1;
    }, t1;
}(), Er = function(t1, e10) {
    return (Er = Object.setPrototypeOf || ({
        __proto__: []
    }) instanceof Array && function(t4, e11) {
        t4.__proto__ = e11;
    } || function(t4, e11) {
        for(var r15 in e11)e11.hasOwnProperty(r15) && (t4[r15] = e11[r15]);
    })(t1, e10);
}, Ar = function() {
    function t1() {
        this.stopped = !1, this.stopsPropagatingAt = null, this.stopPropagationHint = !1, this.target = null, this.currentTarget = null, this.type = null, this.data = null;
    }
    return t1.prototype.stopPropagation = function() {
        this.stopped = !0, this.stopPropagationHint = !0, this.stopsPropagatingAt = this.currentTarget;
    }, t1.prototype.reset = function() {
        this.stopped = !1, this.stopsPropagatingAt = null, this.stopPropagationHint = !1, this.currentTarget = null, this.target = null;
    }, t1;
}(), Sr = function() {
    function t1(e10) {
        this._pointerId = e10, this._flags = t1.FLAGS.NONE;
    }
    return t1.prototype._doSet = function(t4, e10) {
        this._flags = e10 ? this._flags | t4 : this._flags & ~t4;
    }, Object.defineProperty(t1.prototype, "pointerId", {
        get: function() {
            return this._pointerId;
        },
        enumerable: !1,
        configurable: !0
    }), Object.defineProperty(t1.prototype, "flags", {
        get: function() {
            return this._flags;
        },
        set: function(t4) {
            this._flags = t4;
        },
        enumerable: !1,
        configurable: !0
    }), Object.defineProperty(t1.prototype, "none", {
        get: function() {
            return this._flags === t1.FLAGS.NONE;
        },
        enumerable: !1,
        configurable: !0
    }), Object.defineProperty(t1.prototype, "over", {
        get: function() {
            return 0 != (this._flags & t1.FLAGS.OVER);
        },
        set: function(e10) {
            this._doSet(t1.FLAGS.OVER, e10);
        },
        enumerable: !1,
        configurable: !0
    }), Object.defineProperty(t1.prototype, "rightDown", {
        get: function() {
            return 0 != (this._flags & t1.FLAGS.RIGHT_DOWN);
        },
        set: function(e10) {
            this._doSet(t1.FLAGS.RIGHT_DOWN, e10);
        },
        enumerable: !1,
        configurable: !0
    }), Object.defineProperty(t1.prototype, "leftDown", {
        get: function() {
            return 0 != (this._flags & t1.FLAGS.LEFT_DOWN);
        },
        set: function(e10) {
            this._doSet(t1.FLAGS.LEFT_DOWN, e10);
        },
        enumerable: !1,
        configurable: !0
    }), t1.FLAGS = Object.freeze({
        NONE: 0,
        OVER: 1,
        LEFT_DOWN: 2,
        RIGHT_DOWN: 4
    }), t1;
}(), Or = function() {
    function t1() {
        this._tempPoint = new We;
    }
    return t1.prototype.recursiveFindHit = function(t4, e10, r15, i12, n12) {
        if (!e10 || !e10.visible) return !1;
        var o11 = t4.data.global, s11 = !1, a13 = n12 = e10.interactive || n12, h12 = !0;
        if (e10.hitArea ? (i12 && (e10.worldTransform.applyInverse(o11, this._tempPoint), e10.hitArea.contains(this._tempPoint.x, this._tempPoint.y) ? s11 = !0 : (i12 = !1, h12 = !1)), a13 = !1) : e10._mask && i12 && (e10._mask.containsPoint && e10._mask.containsPoint(o11) || (i12 = !1)), h12 && e10.interactiveChildren && e10.children) for(var u13 = e10.children, l8 = u13.length - 1; l8 >= 0; l8--){
            var c6 = u13[l8], d7 = this.recursiveFindHit(t4, c6, r15, i12, a13);
            if (d7) {
                if (!c6.parent) continue;
                a13 = !1, d7 && (t4.target && (i12 = !1), s11 = !0);
            }
        }
        return n12 && (i12 && !t4.target && !e10.hitArea && e10.containsPoint && e10.containsPoint(o11) && (s11 = !0), e10.interactive && (s11 && !t4.target && (t4.target = e10), r15 && r15(t4, e10, !!s11))), s11;
    }, t1.prototype.findHit = function(t4, e10, r15, i12) {
        this.recursiveFindHit(t4, e10, r15, i12, !1);
    }, t1;
}(), Rr = {
    interactive: !1,
    interactiveChildren: !0,
    hitArea: null,
    get buttonMode () {
        return "pointer" === this.cursor;
    },
    set buttonMode (t1){
        t1 ? this.cursor = "pointer" : "pointer" === this.cursor && (this.cursor = null);
    },
    cursor: null,
    get trackedPointers () {
        return (void 0) === this._trackedPointers && (this._trackedPointers = {
        }), this._trackedPointers;
    },
    _trackedPointers: void 0
};
hr.mixin(Rr);
var wr = 1, Pr = {
    target: null,
    data: {
        global: null
    }
}, Ir = function(t1) {
    function e10(e11, r15) {
        var i12 = t1.call(this) || this;
        return r15 = r15 || {
        }, i12.renderer = e11, i12.autoPreventDefault = (void 0) === r15.autoPreventDefault || r15.autoPreventDefault, i12.interactionFrequency = r15.interactionFrequency || 10, i12.mouse = new Tr, i12.mouse.identifier = wr, i12.mouse.global.set(-999999), i12.activeInteractionData = {
        }, i12.activeInteractionData[wr] = i12.mouse, i12.interactionDataPool = [], i12.eventData = new Ar, i12.interactionDOMElement = null, i12.moveWhenInside = !1, i12.eventsAdded = !1, i12.tickerAdded = !1, i12.mouseOverRenderer = !("PointerEvent" in self), i12.supportsTouchEvents = "ontouchstart" in self, i12.supportsPointerEvents = !!self.PointerEvent, i12.onPointerUp = i12.onPointerUp.bind(i12), i12.processPointerUp = i12.processPointerUp.bind(i12), i12.onPointerCancel = i12.onPointerCancel.bind(i12), i12.processPointerCancel = i12.processPointerCancel.bind(i12), i12.onPointerDown = i12.onPointerDown.bind(i12), i12.processPointerDown = i12.processPointerDown.bind(i12), i12.onPointerMove = i12.onPointerMove.bind(i12), i12.processPointerMove = i12.processPointerMove.bind(i12), i12.onPointerOut = i12.onPointerOut.bind(i12), i12.processPointerOverOut = i12.processPointerOverOut.bind(i12), i12.onPointerOver = i12.onPointerOver.bind(i12), i12.cursorStyles = {
            default: "inherit",
            pointer: "pointer"
        }, i12.currentCursorMode = null, i12.cursor = null, i12.resolution = 1, i12.delayedEvents = [], i12.search = new Or, i12._tempDisplayObject = new ur, i12._useSystemTicker = (void 0) === r15.useSystemTicker || r15.useSystemTicker, i12.setTargetElement(i12.renderer.view, i12.renderer.resolution), i12;
    }
    return (function(t4, e11) {
        function r15() {
            this.constructor = t4;
        }
        Er(t4, e11), t4.prototype = null === e11 ? Object.create(e11) : (r15.prototype = e11.prototype, new r15);
    })(e10, t1), Object.defineProperty(e10.prototype, "useSystemTicker", {
        get: function() {
            return this._useSystemTicker;
        },
        set: function(t4) {
            this._useSystemTicker = t4, t4 ? this.addTickerListener() : this.removeTickerListener();
        },
        enumerable: !1,
        configurable: !0
    }), Object.defineProperty(e10.prototype, "lastObjectRendered", {
        get: function() {
            return this.renderer._lastObjectRendered || this._tempDisplayObject;
        },
        enumerable: !1,
        configurable: !0
    }), e10.prototype.hitTest = function(t4, e11) {
        return Pr.target = null, Pr.data.global = t4, e11 || (e11 = this.lastObjectRendered), this.processInteractive(Pr, e11, null, !0), Pr.target;
    }, e10.prototype.setTargetElement = function(t4, e11) {
        (void 0) === e11 && (e11 = 1), this.removeTickerListener(), this.removeEvents(), this.interactionDOMElement = t4, this.resolution = e11, this.addEvents(), this.addTickerListener();
    }, e10.prototype.addTickerListener = function() {
        !this.tickerAdded && this.interactionDOMElement && this._useSystemTicker && (br.system.add(this.tickerUpdate, this, fr.INTERACTION), this.tickerAdded = !0);
    }, e10.prototype.removeTickerListener = function() {
        this.tickerAdded && (br.system.remove(this.tickerUpdate, this), this.tickerAdded = !1);
    }, e10.prototype.addEvents = function() {
        if (!this.eventsAdded && this.interactionDOMElement) {
            var t4 = this.interactionDOMElement.style;
            self.navigator.msPointerEnabled ? (t4.msContentZooming = "none", t4.msTouchAction = "none") : this.supportsPointerEvents && (t4.touchAction = "none"), this.supportsPointerEvents ? (self.document.addEventListener("pointermove", this.onPointerMove, !0), this.interactionDOMElement.addEventListener("pointerdown", this.onPointerDown, !0), this.interactionDOMElement.addEventListener("pointerleave", this.onPointerOut, !0), this.interactionDOMElement.addEventListener("pointerover", this.onPointerOver, !0), self.addEventListener("pointercancel", this.onPointerCancel, !0), self.addEventListener("pointerup", this.onPointerUp, !0)) : (self.document.addEventListener("mousemove", this.onPointerMove, !0), this.interactionDOMElement.addEventListener("mousedown", this.onPointerDown, !0), this.interactionDOMElement.addEventListener("mouseout", this.onPointerOut, !0), this.interactionDOMElement.addEventListener("mouseover", this.onPointerOver, !0), self.addEventListener("mouseup", this.onPointerUp, !0)), this.supportsTouchEvents && (this.interactionDOMElement.addEventListener("touchstart", this.onPointerDown, !0), this.interactionDOMElement.addEventListener("touchcancel", this.onPointerCancel, !0), this.interactionDOMElement.addEventListener("touchend", this.onPointerUp, !0), this.interactionDOMElement.addEventListener("touchmove", this.onPointerMove, !0)), this.eventsAdded = !0;
        }
    }, e10.prototype.removeEvents = function() {
        if (this.eventsAdded && this.interactionDOMElement) {
            var t5 = this.interactionDOMElement.style;
            self.navigator.msPointerEnabled ? (t5.msContentZooming = "", t5.msTouchAction = "") : this.supportsPointerEvents && (t5.touchAction = ""), this.supportsPointerEvents ? (self.document.removeEventListener("pointermove", this.onPointerMove, !0), this.interactionDOMElement.removeEventListener("pointerdown", this.onPointerDown, !0), this.interactionDOMElement.removeEventListener("pointerleave", this.onPointerOut, !0), this.interactionDOMElement.removeEventListener("pointerover", this.onPointerOver, !0), self.removeEventListener("pointercancel", this.onPointerCancel, !0), self.removeEventListener("pointerup", this.onPointerUp, !0)) : (self.document.removeEventListener("mousemove", this.onPointerMove, !0), this.interactionDOMElement.removeEventListener("mousedown", this.onPointerDown, !0), this.interactionDOMElement.removeEventListener("mouseout", this.onPointerOut, !0), this.interactionDOMElement.removeEventListener("mouseover", this.onPointerOver, !0), self.removeEventListener("mouseup", this.onPointerUp, !0)), this.supportsTouchEvents && (this.interactionDOMElement.removeEventListener("touchstart", this.onPointerDown, !0), this.interactionDOMElement.removeEventListener("touchcancel", this.onPointerCancel, !0), this.interactionDOMElement.removeEventListener("touchend", this.onPointerUp, !0), this.interactionDOMElement.removeEventListener("touchmove", this.onPointerMove, !0)), this.interactionDOMElement = null, this.eventsAdded = !1;
        }
    }, e10.prototype.tickerUpdate = function(t6) {
        this._deltaTime += t6, this._deltaTime < this.interactionFrequency || (this._deltaTime = 0, this.update());
    }, e10.prototype.update = function() {
        if (this.interactionDOMElement) {
            if (this._didMove) this._didMove = !1;
            else {
                for(var t6 in this.cursor = null, this.activeInteractionData)if (this.activeInteractionData.hasOwnProperty(t6)) {
                    var e11 = this.activeInteractionData[t6];
                    if (e11.originalEvent && "touch" !== e11.pointerType) {
                        var r15 = this.configureInteractionEventForDOMEvent(this.eventData, e11.originalEvent, e11);
                        this.processInteractive(r15, this.lastObjectRendered, this.processPointerOverOut, !0);
                    }
                }
                this.setCursorMode(this.cursor);
            }
        }
    }, e10.prototype.setCursorMode = function(t7) {
        t7 = t7 || "default";
        var e12 = !0;
        if (self.OffscreenCanvas && this.interactionDOMElement instanceof OffscreenCanvas && (e12 = !1), this.currentCursorMode !== t7) {
            this.currentCursorMode = t7;
            var r16 = this.cursorStyles[t7];
            if (r16) switch(typeof r16){
                case "string":
                    e12 && (this.interactionDOMElement.style.cursor = r16);
                    break;
                case "function":
                    r16(t7);
                    break;
                case "object":
                    e12 && Object.assign(this.interactionDOMElement.style, r16);
            }
            else e12 && "string" == typeof t7 && !Object.prototype.hasOwnProperty.call(this.cursorStyles, t7) && (this.interactionDOMElement.style.cursor = t7);
        }
    }, e10.prototype.dispatchEvent = function(t7, e12, r17) {
        r17.stopPropagationHint && t7 !== r17.stopsPropagatingAt || (r17.currentTarget = t7, r17.type = e12, t7.emit(e12, r17), t7[e12] && t7[e12](r17));
    }, e10.prototype.delayDispatchEvent = function(t7, e12, r17) {
        this.delayedEvents.push({
            displayObject: t7,
            eventString: e12,
            eventData: r17
        });
    }, e10.prototype.mapPositionToPoint = function(t7, e12, r17) {
        var i12;
        i12 = this.interactionDOMElement.parentElement ? this.interactionDOMElement.getBoundingClientRect() : {
            x: 0,
            y: 0,
            width: this.interactionDOMElement.width,
            height: this.interactionDOMElement.height,
            left: 0,
            top: 0
        };
        var n12 = 1 / this.resolution;
        t7.x = (e12 - i12.left) * (this.interactionDOMElement.width / i12.width) * n12, t7.y = (r17 - i12.top) * (this.interactionDOMElement.height / i12.height) * n12;
    }, e10.prototype.processInteractive = function(t7, e12, r17, i12) {
        var n12 = this.search.findHit(t7, e12, r17, i12), o11 = this.delayedEvents;
        if (!o11.length) return n12;
        t7.stopPropagationHint = !1;
        var s11 = o11.length;
        this.delayedEvents = [];
        for(var a13 = 0; a13 < s11; a13++){
            var h12 = o11[a13], u13 = h12.displayObject, l8 = h12.eventString, c7 = h12.eventData;
            c7.stopsPropagatingAt === u13 && (c7.stopPropagationHint = !0), this.dispatchEvent(u13, l8, c7);
        }
        return n12;
    }, e10.prototype.onPointerDown = function(t7) {
        if (!this.supportsTouchEvents || "touch" !== t7.pointerType) {
            var e12 = this.normalizeToPointerData(t7);
            this.autoPreventDefault && e12[0].isNormalized && (t7.cancelable || !("cancelable" in t7)) && t7.preventDefault();
            for(var r17 = e12.length, i12 = 0; i12 < r17; i12++){
                var n12 = e12[i12], o11 = this.getInteractionDataForPointerId(n12), s11 = this.configureInteractionEventForDOMEvent(this.eventData, n12, o11);
                if (s11.data.originalEvent = t7, this.processInteractive(s11, this.lastObjectRendered, this.processPointerDown, !0), this.emit("pointerdown", s11), "touch" === n12.pointerType) this.emit("touchstart", s11);
                else if ("mouse" === n12.pointerType || "pen" === n12.pointerType) {
                    var a13 = 2 === n12.button;
                    this.emit(a13 ? "rightdown" : "mousedown", this.eventData);
                }
            }
        }
    }, e10.prototype.processPointerDown = function(t7, e13, r18) {
        var i13 = t7.data, n13 = t7.data.identifier;
        if (r18) {
            if (e13.trackedPointers[n13] || (e13.trackedPointers[n13] = new Sr(n13)), this.dispatchEvent(e13, "pointerdown", t7), "touch" === i13.pointerType) this.dispatchEvent(e13, "touchstart", t7);
            else if ("mouse" === i13.pointerType || "pen" === i13.pointerType) {
                var o12 = 2 === i13.button;
                o12 ? e13.trackedPointers[n13].rightDown = !0 : e13.trackedPointers[n13].leftDown = !0, this.dispatchEvent(e13, o12 ? "rightdown" : "mousedown", t7);
            }
        }
    }, e10.prototype.onPointerComplete = function(t7, e13, r18) {
        for(var i13 = this.normalizeToPointerData(t7), n13 = i13.length, o13 = t7.target !== this.interactionDOMElement ? "outside" : "", s12 = 0; s12 < n13; s12++){
            var a14 = i13[s12], h13 = this.getInteractionDataForPointerId(a14), u14 = this.configureInteractionEventForDOMEvent(this.eventData, a14, h13);
            if (u14.data.originalEvent = t7, this.processInteractive(u14, this.lastObjectRendered, r18, e13 || !o13), this.emit(e13 ? "pointercancel" : "pointerup" + o13, u14), "mouse" === a14.pointerType || "pen" === a14.pointerType) {
                var l9 = 2 === a14.button;
                this.emit(l9 ? "rightup" + o13 : "mouseup" + o13, u14);
            } else "touch" === a14.pointerType && (this.emit(e13 ? "touchcancel" : "touchend" + o13, u14), this.releaseInteractionDataForPointerId(a14.pointerId));
        }
    }, e10.prototype.onPointerCancel = function(t7) {
        this.supportsTouchEvents && "touch" === t7.pointerType || this.onPointerComplete(t7, !0, this.processPointerCancel);
    }, e10.prototype.processPointerCancel = function(t7, e13) {
        var r18 = t7.data, i13 = t7.data.identifier;
        (void 0) !== e13.trackedPointers[i13] && (delete e13.trackedPointers[i13], this.dispatchEvent(e13, "pointercancel", t7), "touch" === r18.pointerType && this.dispatchEvent(e13, "touchcancel", t7));
    }, e10.prototype.onPointerUp = function(t7) {
        this.supportsTouchEvents && "touch" === t7.pointerType || this.onPointerComplete(t7, !1, this.processPointerUp);
    }, e10.prototype.processPointerUp = function(t7, e13, r18) {
        var i13 = t7.data, n13 = t7.data.identifier, o13 = e13.trackedPointers[n13], s12 = "touch" === i13.pointerType, a15 = "mouse" === i13.pointerType || "pen" === i13.pointerType, h14 = !1;
        if (a15) {
            var u15 = 2 === i13.button, l10 = Sr.FLAGS, c8 = u15 ? l10.RIGHT_DOWN : l10.LEFT_DOWN, d8 = (void 0) !== o13 && o13.flags & c8;
            r18 ? (this.dispatchEvent(e13, u15 ? "rightup" : "mouseup", t7), d8 && (this.dispatchEvent(e13, u15 ? "rightclick" : "click", t7), h14 = !0)) : d8 && this.dispatchEvent(e13, u15 ? "rightupoutside" : "mouseupoutside", t7), o13 && (u15 ? o13.rightDown = !1 : o13.leftDown = !1);
        }
        r18 ? (this.dispatchEvent(e13, "pointerup", t7), s12 && this.dispatchEvent(e13, "touchend", t7), o13 && (a15 && !h14 || this.dispatchEvent(e13, "pointertap", t7), s12 && (this.dispatchEvent(e13, "tap", t7), o13.over = !1))) : o13 && (this.dispatchEvent(e13, "pointerupoutside", t7), s12 && this.dispatchEvent(e13, "touchendoutside", t7)), o13 && o13.none && delete e13.trackedPointers[n13];
    }, e10.prototype.onPointerMove = function(t7) {
        if (!this.supportsTouchEvents || "touch" !== t7.pointerType) {
            var e13 = this.normalizeToPointerData(t7);
            "mouse" !== e13[0].pointerType && "pen" !== e13[0].pointerType || (this._didMove = !0, this.cursor = null);
            for(var r18 = e13.length, i13 = 0; i13 < r18; i13++){
                var n13 = e13[i13], o13 = this.getInteractionDataForPointerId(n13), s12 = this.configureInteractionEventForDOMEvent(this.eventData, n13, o13);
                s12.data.originalEvent = t7, this.processInteractive(s12, this.lastObjectRendered, this.processPointerMove, !0), this.emit("pointermove", s12), "touch" === n13.pointerType && this.emit("touchmove", s12), "mouse" !== n13.pointerType && "pen" !== n13.pointerType || this.emit("mousemove", s12);
            }
            "mouse" === e13[0].pointerType && this.setCursorMode(this.cursor);
        }
    }, e10.prototype.processPointerMove = function(t7, e14, r19) {
        var i14 = t7.data, n14 = "touch" === i14.pointerType, o14 = "mouse" === i14.pointerType || "pen" === i14.pointerType;
        o14 && this.processPointerOverOut(t7, e14, r19), this.moveWhenInside && !r19 || (this.dispatchEvent(e14, "pointermove", t7), n14 && this.dispatchEvent(e14, "touchmove", t7), o14 && this.dispatchEvent(e14, "mousemove", t7));
    }, e10.prototype.onPointerOut = function(t7) {
        if (!this.supportsTouchEvents || "touch" !== t7.pointerType) {
            var e14 = this.normalizeToPointerData(t7)[0];
            "mouse" === e14.pointerType && (this.mouseOverRenderer = !1, this.setCursorMode(null));
            var r19 = this.getInteractionDataForPointerId(e14), i14 = this.configureInteractionEventForDOMEvent(this.eventData, e14, r19);
            i14.data.originalEvent = e14, this.processInteractive(i14, this.lastObjectRendered, this.processPointerOverOut, !1), this.emit("pointerout", i14), "mouse" === e14.pointerType || "pen" === e14.pointerType ? this.emit("mouseout", i14) : this.releaseInteractionDataForPointerId(r19.identifier);
        }
    }, e10.prototype.processPointerOverOut = function(t7, e15, r20) {
        var i15 = t7.data, n14 = t7.data.identifier, o14 = "mouse" === i15.pointerType || "pen" === i15.pointerType, s13 = e15.trackedPointers[n14];
        r20 && !s13 && (s13 = e15.trackedPointers[n14] = new Sr(n14)), (void 0) !== s13 && (r20 && this.mouseOverRenderer ? (s13.over || (s13.over = !0, this.delayDispatchEvent(e15, "pointerover", t7), o14 && this.delayDispatchEvent(e15, "mouseover", t7)), o14 && null === this.cursor && (this.cursor = e15.cursor)) : s13.over && (s13.over = !1, this.dispatchEvent(e15, "pointerout", this.eventData), o14 && this.dispatchEvent(e15, "mouseout", t7), s13.none && delete e15.trackedPointers[n14]));
    }, e10.prototype.onPointerOver = function(t7) {
        var e15 = this.normalizeToPointerData(t7)[0], r20 = this.getInteractionDataForPointerId(e15), i15 = this.configureInteractionEventForDOMEvent(this.eventData, e15, r20);
        i15.data.originalEvent = e15, "mouse" === e15.pointerType && (this.mouseOverRenderer = !0), this.emit("pointerover", i15), "mouse" !== e15.pointerType && "pen" !== e15.pointerType || this.emit("mouseover", i15);
    }, e10.prototype.getInteractionDataForPointerId = function(t7) {
        var e15, r20 = t7.pointerId;
        return r20 === wr || "mouse" === t7.pointerType ? e15 = this.mouse : this.activeInteractionData[r20] ? e15 = this.activeInteractionData[r20] : ((e15 = this.interactionDataPool.pop() || new Tr).identifier = r20, this.activeInteractionData[r20] = e15), e15.copyEvent(t7), e15;
    }, e10.prototype.releaseInteractionDataForPointerId = function(t7) {
        var e15 = this.activeInteractionData[t7];
        e15 && (delete this.activeInteractionData[t7], e15.reset(), this.interactionDataPool.push(e15));
    }, e10.prototype.configureInteractionEventForDOMEvent = function(t7, e15, r20) {
        return t7.data = r20, this.mapPositionToPoint(r20.global, e15.clientX, e15.clientY), "touch" === e15.pointerType && (e15.globalX = r20.global.x, e15.globalY = r20.global.y), r20.originalEvent = e15, t7.reset(), t7;
    }, e10.prototype.normalizeToPointerData = function(t7) {
        var e15 = [];
        if (this.supportsTouchEvents && t7 instanceof TouchEvent) for(var r20 = 0, i15 = t7.changedTouches.length; r20 < i15; r20++){
            var n14 = t7.changedTouches[r20];
            (void 0) === n14.button && (n14.button = t7.touches.length ? 1 : 0), (void 0) === n14.buttons && (n14.buttons = t7.touches.length ? 1 : 0), (void 0) === n14.isPrimary && (n14.isPrimary = 1 === t7.touches.length && "touchstart" === t7.type), (void 0) === n14.width && (n14.width = n14.radiusX || 1), (void 0) === n14.height && (n14.height = n14.radiusY || 1), (void 0) === n14.tiltX && (n14.tiltX = 0), (void 0) === n14.tiltY && (n14.tiltY = 0), (void 0) === n14.pointerType && (n14.pointerType = "touch"), (void 0) === n14.pointerId && (n14.pointerId = n14.identifier || 0), (void 0) === n14.pressure && (n14.pressure = n14.force || 0.5), (void 0) === n14.twist && (n14.twist = 0), (void 0) === n14.tangentialPressure && (n14.tangentialPressure = 0), (void 0) === n14.layerX && (n14.layerX = n14.offsetX = n14.clientX), (void 0) === n14.layerY && (n14.layerY = n14.offsetY = n14.clientY), n14.isNormalized = !0, e15.push(n14);
        }
        else if (!self.MouseEvent || t7 instanceof MouseEvent && !(this.supportsPointerEvents && t7 instanceof self.PointerEvent)) {
            var o14 = t7;
            (void 0) === o14.isPrimary && (o14.isPrimary = !0), (void 0) === o14.width && (o14.width = 1), (void 0) === o14.height && (o14.height = 1), (void 0) === o14.tiltX && (o14.tiltX = 0), (void 0) === o14.tiltY && (o14.tiltY = 0), (void 0) === o14.pointerType && (o14.pointerType = "mouse"), (void 0) === o14.pointerId && (o14.pointerId = wr), (void 0) === o14.pressure && (o14.pressure = 0.5), (void 0) === o14.twist && (o14.twist = 0), (void 0) === o14.tangentialPressure && (o14.tangentialPressure = 0), o14.isNormalized = !0, e15.push(o14);
        } else e15.push(t7);
        return e15;
    }, e10.prototype.destroy = function() {
        this.removeEvents(), this.removeTickerListener(), this.removeAllListeners(), this.renderer = null, this.mouse = null, this.eventData = null, this.interactionDOMElement = null, this.onPointerDown = null, this.processPointerDown = null, this.onPointerUp = null, this.processPointerUp = null, this.onPointerCancel = null, this.processPointerCancel = null, this.onPointerMove = null, this.processPointerMove = null, this.onPointerOut = null, this.processPointerOverOut = null, this.onPointerOver = null, this.search = null;
    }, e10;
}(X2), Mr = function() {
    function t1(t7) {
        this.items = [], this._name = t7, this._aliasCount = 0;
    }
    return t1.prototype.emit = function(t7, e10, r20, i15, n15, o15, s13, a15) {
        if (arguments.length > 8) throw new Error("max arguments reached");
        var h14 = this.name, u16 = this.items;
        this._aliasCount++;
        for(var l11 = 0, c9 = u16.length; l11 < c9; l11++)u16[l11][h14](t7, e10, r20, i15, n15, o15, s13, a15);
        return u16 === this.items && this._aliasCount--, this;
    }, t1.prototype.ensureNonAliasedItems = function() {
        this._aliasCount > 0 && this.items.length > 1 && (this._aliasCount = 0, this.items = this.items.slice(0));
    }, t1.prototype.add = function(t7) {
        return t7[this._name] && (this.ensureNonAliasedItems(), this.remove(t7), this.items.push(t7)), this;
    }, t1.prototype.remove = function(t7) {
        var e10 = this.items.indexOf(t7);
        return -1 !== e10 && (this.ensureNonAliasedItems(), this.items.splice(e10, 1)), this;
    }, t1.prototype.contains = function(t7) {
        return -1 !== this.items.indexOf(t7);
    }, t1.prototype.removeAll = function() {
        return this.ensureNonAliasedItems(), this.items.length = 0, this;
    }, t1.prototype.destroy = function() {
        this.removeAll(), this.items = null, this._name = null;
    }, Object.defineProperty(t1.prototype, "empty", {
        get: function() {
            return 0 === this.items.length;
        },
        enumerable: !1,
        configurable: !0
    }), Object.defineProperty(t1.prototype, "name", {
        get: function() {
            return this._name;
        },
        enumerable: !1,
        configurable: !0
    }), t1;
}();
Object.defineProperties(Mr.prototype, {
    dispatch: {
        value: Mr.prototype.emit
    },
    run: {
        value: Mr.prototype.emit
    }
}), F.PREFER_ENV = L.any ? Gt.WEBGL : Gt.WEBGL2, F.STRICT_TEXTURE_CACHE = !1;
var Dr = [];
function Cr(t1, e10) {
    if (!t1) return null;
    var r20 = "";
    if ("string" == typeof t1) {
        var i15 = /\.(\w{3,4})(?:$|\?|#)/i.exec(t1);
        i15 && (r20 = i15[1].toLowerCase());
    }
    for(var n15 = Dr.length - 1; n15 >= 0; --n15){
        var o15 = Dr[n15];
        if (o15.test && o15.test(t1, r20)) return new o15(t1, e10);
    }
    throw new Error("Unrecognized source type to auto-detect Resource");
}
var Nr = function(t1, e10) {
    return (Nr = Object.setPrototypeOf || ({
        __proto__: []
    }) instanceof Array && function(t7, e15) {
        t7.__proto__ = e15;
    } || function(t7, e15) {
        for(var r20 in e15)e15.hasOwnProperty(r20) && (t7[r20] = e15[r20]);
    })(t1, e10);
};
function Lr(t1, e10) {
    function r20() {
        this.constructor = t1;
    }
    Nr(t1, e10), t1.prototype = null === e10 ? Object.create(e10) : (r20.prototype = e10.prototype, new r20);
}
var Fr = function() {
    function t1(t7, e10) {
        (void 0) === t7 && (t7 = 0), (void 0) === e10 && (e10 = 0), this._width = t7, this._height = e10, this.destroyed = !1, this.internal = !1, this.onResize = new Mr("setRealSize"), this.onUpdate = new Mr("update"), this.onError = new Mr("onError");
    }
    return t1.prototype.bind = function(t7) {
        this.onResize.add(t7), this.onUpdate.add(t7), this.onError.add(t7), (this._width || this._height) && this.onResize.emit(this._width, this._height);
    }, t1.prototype.unbind = function(t7) {
        this.onResize.remove(t7), this.onUpdate.remove(t7), this.onError.remove(t7);
    }, t1.prototype.resize = function(t7, e10) {
        t7 === this._width && e10 === this._height || (this._width = t7, this._height = e10, this.onResize.emit(t7, e10));
    }, Object.defineProperty(t1.prototype, "valid", {
        get: function() {
            return !!this._width && !!this._height;
        },
        enumerable: !1,
        configurable: !0
    }), t1.prototype.update = function() {
        this.destroyed || this.onUpdate.emit();
    }, t1.prototype.load = function() {
        return Promise.resolve(this);
    }, Object.defineProperty(t1.prototype, "width", {
        get: function() {
            return this._width;
        },
        enumerable: !1,
        configurable: !0
    }), Object.defineProperty(t1.prototype, "height", {
        get: function() {
            return this._height;
        },
        enumerable: !1,
        configurable: !0
    }), t1.prototype.style = function(t7, e10, r20) {
        return !1;
    }, t1.prototype.dispose = function() {
    }, t1.prototype.destroy = function() {
        this.destroyed || (this.destroyed = !0, this.dispose(), this.onError.removeAll(), this.onError = null, this.onResize.removeAll(), this.onResize = null, this.onUpdate.removeAll(), this.onUpdate = null);
    }, t1.test = function(t7, e10) {
        return !1;
    }, t1;
}(), Br = function(t1) {
    function e10(e15, r20) {
        var i16 = this, n15 = r20 || {
        }, o16 = n15.width, s13 = n15.height;
        if (!o16 || !s13) throw new Error("BufferResource width or height invalid");
        return (i16 = t1.call(this, o16, s13) || this).data = e15, i16;
    }
    return Lr(e10, t1), e10.prototype.upload = function(t7, e15, r20) {
        var i16 = t7.gl;
        i16.pixelStorei(i16.UNPACK_PREMULTIPLY_ALPHA_WEBGL, e15.alphaMode === Zt.UNPACK);
        var n15 = e15.realWidth, o16 = e15.realHeight;
        return r20.width === n15 && r20.height === o16 ? i16.texSubImage2D(e15.target, 0, 0, 0, n15, o16, e15.format, e15.type, this.data) : (r20.width = n15, r20.height = o16, i16.texImage2D(e15.target, 0, r20.internalFormat, n15, o16, 0, e15.format, r20.type, this.data)), !0;
    }, e10.prototype.dispose = function() {
        this.data = null;
    }, e10.test = function(t7) {
        return t7 instanceof Float32Array || t7 instanceof Uint8Array || t7 instanceof Uint32Array;
    }, e10;
}(Fr), Ur = {
    scaleMode: Wt.NEAREST,
    format: Yt.RGBA,
    alphaMode: Zt.NPM
}, Gr = function(t1) {
    function e10(e15, r20) {
        (void 0) === e15 && (e15 = null), (void 0) === r20 && (r20 = null);
        var i16 = t1.call(this) || this, n15 = (r20 = r20 || {
        }).alphaMode, o16 = r20.mipmap, s13 = r20.anisotropicLevel, a15 = r20.scaleMode, h14 = r20.width, u16 = r20.height, l11 = r20.wrapMode, c9 = r20.format, d9 = r20.type, f7 = r20.target, p = r20.resolution, _4 = r20.resourceOptions;
        return !e15 || e15 instanceof Fr || ((e15 = Cr(e15, _4)).internal = !0), i16.width = h14 || 0, i16.height = u16 || 0, i16.resolution = p || F.RESOLUTION, i16.mipmap = (void 0) !== o16 ? o16 : F.MIPMAP_TEXTURES, i16.anisotropicLevel = (void 0) !== s13 ? s13 : F.ANISOTROPIC_LEVEL, i16.wrapMode = l11 || F.WRAP_MODE, i16.scaleMode = (void 0) !== a15 ? a15 : F.SCALE_MODE, i16.format = c9 || Yt.RGBA, i16.type = d9 || zt.UNSIGNED_BYTE, i16.target = f7 || Vt.TEXTURE_2D, i16.alphaMode = (void 0) !== n15 ? n15 : Zt.UNPACK, i16.uid = Oe(), i16.touched = 0, i16.isPowerOfTwo = !1, i16._refreshPOT(), i16._glTextures = {
        }, i16.dirtyId = 0, i16.dirtyStyleId = 0, i16.cacheId = null, i16.valid = h14 > 0 && u16 > 0, i16.textureCacheIds = [], i16.destroyed = !1, i16.resource = null, i16._batchEnabled = 0, i16._batchLocation = 0, i16.parentTextureArray = null, i16.setResource(e15), i16;
    }
    return Lr(e10, t1), Object.defineProperty(e10.prototype, "realWidth", {
        get: function() {
            return Math.ceil(this.width * this.resolution - 0.0001);
        },
        enumerable: !1,
        configurable: !0
    }), Object.defineProperty(e10.prototype, "realHeight", {
        get: function() {
            return Math.ceil(this.height * this.resolution - 0.0001);
        },
        enumerable: !1,
        configurable: !0
    }), e10.prototype.setStyle = function(t7, e15) {
        var r20;
        return (void 0) !== t7 && t7 !== this.scaleMode && (this.scaleMode = t7, r20 = !0), (void 0) !== e15 && e15 !== this.mipmap && (this.mipmap = e15, r20 = !0), r20 && this.dirtyStyleId++, this;
    }, e10.prototype.setSize = function(t7, e15, r20) {
        return this.resolution = r20 || this.resolution, this.width = t7, this.height = e15, this._refreshPOT(), this.update(), this;
    }, e10.prototype.setRealSize = function(t7, e15, r20) {
        return this.resolution = r20 || this.resolution, this.width = t7 / this.resolution, this.height = e15 / this.resolution, this._refreshPOT(), this.update(), this;
    }, e10.prototype._refreshPOT = function() {
        this.isPowerOfTwo = xe(this.realWidth) && xe(this.realHeight);
    }, e10.prototype.setResolution = function(t7) {
        var e15 = this.resolution;
        return e15 === t7 ? this : (this.resolution = t7, this.valid && (this.width = this.width * e15 / t7, this.height = this.height * e15 / t7, this.emit("update", this)), this._refreshPOT(), this);
    }, e10.prototype.setResource = function(t7) {
        if (this.resource === t7) return this;
        if (this.resource) throw new Error("Resource can be set only once");
        return t7.bind(this), this.resource = t7, this;
    }, e10.prototype.update = function() {
        this.valid ? (this.dirtyId++, this.dirtyStyleId++, this.emit("update", this)) : this.width > 0 && this.height > 0 && (this.valid = !0, this.emit("loaded", this), this.emit("update", this));
    }, e10.prototype.onError = function(t7) {
        this.emit("error", this, t7);
    }, e10.prototype.destroy = function() {
        this.resource && (this.resource.unbind(this), this.resource.internal && this.resource.destroy(), this.resource = null), this.cacheId && (delete Ie[this.cacheId], delete Pe[this.cacheId], this.cacheId = null), this.dispose(), e10.removeFromCache(this), this.textureCacheIds = null, this.destroyed = !0;
    }, e10.prototype.dispose = function() {
        this.emit("dispose", this);
    }, e10.prototype.castToBaseTexture = function() {
        return this;
    }, e10.from = function(t7, r20, i16) {
        (void 0) === i16 && (i16 = F.STRICT_TEXTURE_CACHE);
        var n15 = "string" == typeof t7, o16 = null;
        if (n15) o16 = t7;
        else {
            if (!t7._pixiId) {
                var s13 = r20 && r20.pixiIdPrefix || "pixiid";
                t7._pixiId = s13 + "_" + Oe();
            }
            o16 = t7._pixiId;
        }
        var a15 = Ie[o16];
        if (n15 && i16 && !a15) throw new Error('The cacheId "' + o16 + '" does not exist in BaseTextureCache.');
        return a15 || ((a15 = new e10(t7, r20)).cacheId = o16, e10.addToCache(a15, o16)), a15;
    }, e10.fromBuffer = function(t7, r20, i16, n15) {
        t7 = t7 || new Float32Array(r20 * i16 * 4);
        var o16 = new Br(t7, {
            width: r20,
            height: i16
        }), s14 = t7 instanceof Float32Array ? zt.FLOAT : zt.UNSIGNED_BYTE;
        return new e10(o16, Object.assign(Ur, n15 || {
            width: r20,
            height: i16,
            type: s14
        }));
    }, e10.addToCache = function(t7, e15) {
        e15 && (-1 === t7.textureCacheIds.indexOf(e15) && t7.textureCacheIds.push(e15), Ie[e15] && console.warn("BaseTexture added to the cache with an id [" + e15 + "] that already had an entry"), Ie[e15] = t7);
    }, e10.removeFromCache = function(t7) {
        if ("string" == typeof t7) {
            var e15 = Ie[t7];
            if (e15) {
                var r20 = e15.textureCacheIds.indexOf(t7);
                return r20 > -1 && e15.textureCacheIds.splice(r20, 1), delete Ie[t7], e15;
            }
        } else if (t7 && t7.textureCacheIds) {
            for(var i16 = 0; i16 < t7.textureCacheIds.length; ++i16)delete Ie[t7.textureCacheIds[i16]];
            return t7.textureCacheIds.length = 0, t7;
        }
        return null;
    }, e10._globalBatch = 0, e10;
}(X2), Xr = function(t1) {
    function e10(e16, r21) {
        var i17 = this, n15 = r21 || {
        }, o16 = n15.width, s14 = n15.height;
        (i17 = t1.call(this, o16, s14) || this).items = [], i17.itemDirtyIds = [];
        for(var a15 = 0; a15 < e16; a15++){
            var h14 = new Gr;
            i17.items.push(h14), i17.itemDirtyIds.push(-2);
        }
        return i17.length = e16, i17._load = null, i17.baseTexture = null, i17;
    }
    return Lr(e10, t1), e10.prototype.initFromArray = function(t7, e16) {
        for(var r21 = 0; r21 < this.length; r21++)t7[r21] && (t7[r21].castToBaseTexture ? this.addBaseTextureAt(t7[r21].castToBaseTexture(), r21) : t7[r21] instanceof Fr ? this.addResourceAt(t7[r21], r21) : this.addResourceAt(Cr(t7[r21], e16), r21));
    }, e10.prototype.dispose = function() {
        for(var t7 = 0, e16 = this.length; t7 < e16; t7++)this.items[t7].destroy();
        this.items = null, this.itemDirtyIds = null, this._load = null;
    }, e10.prototype.addResourceAt = function(t7, e16) {
        if (!this.items[e16]) throw new Error("Index " + e16 + " is out of bounds");
        return t7.valid && !this.valid && this.resize(t7.width, t7.height), this.items[e16].setResource(t7), this;
    }, e10.prototype.bind = function(e16) {
        if (null !== this.baseTexture) throw new Error("Only one base texture per TextureArray is allowed");
        t1.prototype.bind.call(this, e16);
        for(var r21 = 0; r21 < this.length; r21++)this.items[r21].parentTextureArray = e16, this.items[r21].on("update", e16.update, e16);
    }, e10.prototype.unbind = function(e16) {
        t1.prototype.unbind.call(this, e16);
        for(var r21 = 0; r21 < this.length; r21++)this.items[r21].parentTextureArray = null, this.items[r21].off("update", e16.update, e16);
    }, e10.prototype.load = function() {
        var t7 = this;
        if (this._load) return this._load;
        var e16 = this.items.map(function(t8) {
            return t8.resource;
        }).filter(function(t8) {
            return t8;
        }).map(function(t8) {
            return t8.load();
        });
        return this._load = Promise.all(e16).then(function() {
            var e17 = t7.items[0], r21 = e17.realWidth, i17 = e17.realHeight;
            return t7.resize(r21, i17), Promise.resolve(t7);
        }), this._load;
    }, e10;
}(Fr), kr = function(t1) {
    function e10(e16, r21) {
        var i17, n15, o16 = this, s14 = r21 || {
        }, a15 = s14.width, h15 = s14.height;
        return Array.isArray(e16) ? (i17 = e16, n15 = e16.length) : n15 = e16, o16 = t1.call(this, n15, {
            width: a15,
            height: h15
        }) || this, i17 && o16.initFromArray(i17, r21), o16;
    }
    return Lr(e10, t1), e10.prototype.addBaseTextureAt = function(t7, e16) {
        if (!t7.resource) throw new Error("ArrayResource does not support RenderTexture");
        return this.addResourceAt(t7.resource, e16), this;
    }, e10.prototype.bind = function(e16) {
        t1.prototype.bind.call(this, e16), e16.target = Vt.TEXTURE_2D_ARRAY;
    }, e10.prototype.upload = function(t7, e16, r21) {
        var i17 = this.length, n15 = this.itemDirtyIds, o16 = this.items, s14 = t7.gl;
        r21.dirtyId < 0 && s14.texImage3D(s14.TEXTURE_2D_ARRAY, 0, e16.format, this._width, this._height, i17, 0, e16.format, e16.type, null);
        for(var a15 = 0; a15 < i17; a15++){
            var h15 = o16[a15];
            n15[a15] < h15.dirtyId && (n15[a15] = h15.dirtyId, h15.valid && s14.texSubImage3D(s14.TEXTURE_2D_ARRAY, 0, 0, 0, a15, h15.resource.width, h15.resource.height, 1, e16.format, e16.type, h15.resource.source));
        }
        return !0;
    }, e10;
}(Xr), jr = function(t1) {
    function e10(e16) {
        var r21 = this, i17 = e16, n15 = i17.naturalWidth || i17.videoWidth || i17.width, o16 = i17.naturalHeight || i17.videoHeight || i17.height;
        return (r21 = t1.call(this, n15, o16) || this).source = e16, r21.noSubImage = !1, r21;
    }
    return Lr(e10, t1), e10.crossOrigin = function(t7, e16, r21) {
        (void 0) === r21 && 0 !== e16.indexOf("data:") ? t7.crossOrigin = Le(e16) : !1 !== r21 && (t7.crossOrigin = "string" == typeof r21 ? r21 : "anonymous");
    }, e10.prototype.upload = function(t7, e16, r21, i17) {
        var n15 = t7.gl, o16 = e16.realWidth, s14 = e16.realHeight;
        return i17 = i17 || this.source, n15.pixelStorei(n15.UNPACK_PREMULTIPLY_ALPHA_WEBGL, e16.alphaMode === Zt.UNPACK), this.noSubImage || e16.target !== n15.TEXTURE_2D || r21.width !== o16 || r21.height !== s14 ? (r21.width = o16, r21.height = s14, n15.texImage2D(e16.target, 0, e16.format, e16.format, e16.type, i17)) : n15.texSubImage2D(n15.TEXTURE_2D, 0, 0, 0, e16.format, e16.type, i17), !0;
    }, e10.prototype.update = function() {
        if (!this.destroyed) {
            var e16 = this.source, r21 = e16.naturalWidth || e16.videoWidth || e16.width, i17 = e16.naturalHeight || e16.videoHeight || e16.height;
            this.resize(r21, i17), t1.prototype.update.call(this);
        }
    }, e10.prototype.dispose = function() {
        this.source = null;
    }, e10;
}(Fr), Hr = function(t1) {
    function e10(e17) {
        return t1.call(this, e17) || this;
    }
    return Lr(e10, t1), e10.test = function(t7) {
        var e17 = self.OffscreenCanvas;
        return !!(e17 && t7 instanceof e17) || self.HTMLCanvasElement && t7 instanceof HTMLCanvasElement;
    }, e10;
}(jr), Yr = function(t1) {
    function e10(r22, i18) {
        var n15 = this, o16 = i18 || {
        }, s14 = o16.width, a15 = o16.height, h16 = o16.autoLoad, u16 = o16.linkBaseTexture;
        if (r22 && r22.length !== e10.SIDES) throw new Error("Invalid length. Got " + r22.length + ", expected 6");
        n15 = t1.call(this, 6, {
            width: s14,
            height: a15
        }) || this;
        for(var l11 = 0; l11 < e10.SIDES; l11++)n15.items[l11].target = Vt.TEXTURE_CUBE_MAP_POSITIVE_X + l11;
        return n15.linkBaseTexture = !1 !== u16, r22 && n15.initFromArray(r22, i18), !1 !== h16 && n15.load(), n15;
    }
    return Lr(e10, t1), e10.prototype.bind = function(e17) {
        t1.prototype.bind.call(this, e17), e17.target = Vt.TEXTURE_CUBE_MAP;
    }, e10.prototype.addBaseTextureAt = function(t7, e17, r22) {
        if ((void 0) === r22 && (r22 = this.linkBaseTexture), !this.items[e17]) throw new Error("Index " + e17 + " is out of bounds");
        if (!this.linkBaseTexture || t7.parentTextureArray || Object.keys(t7._glTextures).length > 0) {
            if (!t7.resource) throw new Error("CubeResource does not support copying of renderTexture.");
            this.addResourceAt(t7.resource, e17);
        } else t7.target = Vt.TEXTURE_CUBE_MAP_POSITIVE_X + e17, t7.parentTextureArray = this.baseTexture, this.items[e17] = t7;
        return t7.valid && !this.valid && this.resize(t7.realWidth, t7.realHeight), this.items[e17] = t7, this;
    }, e10.prototype.upload = function(t7, r22, i18) {
        for(var n15 = this.itemDirtyIds, o16 = 0; o16 < e10.SIDES; o16++){
            var s14 = this.items[o16];
            n15[o16] < s14.dirtyId && (s14.valid && s14.resource ? (s14.resource.upload(t7, s14, i18), n15[o16] = s14.dirtyId) : n15[o16] < -1 && (t7.gl.texImage2D(s14.target, 0, i18.internalFormat, r22.realWidth, r22.realHeight, 0, r22.format, i18.type, null), n15[o16] = -1));
        }
        return !0;
    }, e10.test = function(t7) {
        return Array.isArray(t7) && t7.length === e10.SIDES;
    }, e10.SIDES = 6, e10;
}(Xr), Vr = function(t1) {
    function e10(e17, r22) {
        var i18 = this;
        if (r22 = r22 || {
        }, !(e17 instanceof HTMLImageElement)) {
            var n15 = new Image;
            jr.crossOrigin(n15, e17, r22.crossorigin), n15.src = e17, e17 = n15;
        }
        return i18 = t1.call(this, e17) || this, !e17.complete && i18._width && i18._height && (i18._width = 0, i18._height = 0), i18.url = e17.src, i18._process = null, i18.preserveBitmap = !1, i18.createBitmap = ((void 0) !== r22.createBitmap ? r22.createBitmap : F.CREATE_IMAGE_BITMAP) && !!self.createImageBitmap, i18.alphaMode = "number" == typeof r22.alphaMode ? r22.alphaMode : null, i18.bitmap = null, i18._load = null, !1 !== r22.autoLoad && i18.load(), i18;
    }
    return Lr(e10, t1), e10.prototype.load = function(t7) {
        var e17 = this;
        return this._load ? this._load : ((void 0) !== t7 && (this.createBitmap = t7), this._load = new Promise(function(t8, r22) {
            var i18 = e17.source;
            e17.url = i18.src;
            var n16 = function() {
                e17.destroyed || (i18.onload = null, i18.onerror = null, e17.resize(i18.width, i18.height), e17._load = null, e17.createBitmap ? t8(e17.process()) : t8(e17));
            };
            i18.complete && i18.src ? n16() : (i18.onload = n16, i18.onerror = function(t9) {
                r22(t9), e17.onError.emit(t9);
            });
        }), this._load);
    }, e10.prototype.process = function() {
        var t7 = this, e17 = this.source;
        return null !== this._process ? this._process : null === this.bitmap && self.createImageBitmap ? (this._process = self.createImageBitmap(e17, 0, 0, e17.width, e17.height, {
            premultiplyAlpha: this.alphaMode === Zt.UNPACK ? "premultiply" : "none"
        }).then(function(e18) {
            return t7.destroyed ? Promise.reject() : (t7.bitmap = e18, t7.update(), t7._process = null, Promise.resolve(t7));
        }), this._process) : Promise.resolve(this);
    }, e10.prototype.upload = function(e17, r22, i18) {
        if ("number" == typeof this.alphaMode && (r22.alphaMode = this.alphaMode), !this.createBitmap) return t1.prototype.upload.call(this, e17, r22, i18);
        if (!this.bitmap && (this.process(), !this.bitmap)) return !1;
        if (t1.prototype.upload.call(this, e17, r22, i18, this.bitmap), !this.preserveBitmap) {
            var n16 = !0, o16 = r22._glTextures;
            for(var s15 in o16){
                var a15 = o16[s15];
                if (a15 !== i18 && a15.dirtyId !== r22.dirtyId) {
                    n16 = !1;
                    break;
                }
            }
            n16 && (this.bitmap.close && this.bitmap.close(), this.bitmap = null);
        }
        return !0;
    }, e10.prototype.dispose = function() {
        this.source.onload = null, this.source.onerror = null, t1.prototype.dispose.call(this), this.bitmap && (this.bitmap.close(), this.bitmap = null), this._process = null, this._load = null;
    }, e10.test = function(t7) {
        return "string" == typeof t7 || t7 instanceof HTMLImageElement;
    }, e10;
}(jr), zr = function(t1) {
    function e10(e17, r22) {
        var i18 = this;
        return r22 = r22 || {
        }, (i18 = t1.call(this, document.createElement("canvas")) || this)._width = 0, i18._height = 0, i18.svg = e17, i18.scale = r22.scale || 1, i18._overrideWidth = r22.width, i18._overrideHeight = r22.height, i18._resolve = null, i18._crossorigin = r22.crossorigin, i18._load = null, !1 !== r22.autoLoad && i18.load(), i18;
    }
    return Lr(e10, t1), e10.prototype.load = function() {
        var t7 = this;
        return this._load ? this._load : (this._load = new Promise(function(e17) {
            if (t7._resolve = function() {
                t7.resize(t7.source.width, t7.source.height), e17(t7);
            }, /^\<svg/.test(t7.svg.trim())) {
                if (!btoa) throw new Error("Your browser doesn't support base64 conversions.");
                t7.svg = "data:image/svg+xml;base64," + btoa(unescape(encodeURIComponent(t7.svg)));
            }
            t7._loadSvg();
        }), this._load);
    }, e10.prototype._loadSvg = function() {
        var t7 = this, e17 = new Image;
        jr.crossOrigin(e17, this.svg, this._crossorigin), e17.src = this.svg, e17.onerror = function(r22) {
            t7._resolve && (e17.onerror = null, t7.onError.emit(r22));
        }, e17.onload = function() {
            if (t7._resolve) {
                var r22 = e17.width, i18 = e17.height;
                if (!r22 || !i18) throw new Error("The SVG image must have width and height defined (in pixels), canvas API needs them.");
                var n17 = r22 * t7.scale, o17 = i18 * t7.scale;
                (t7._overrideWidth || t7._overrideHeight) && (n17 = t7._overrideWidth || t7._overrideHeight / i18 * r22, o17 = t7._overrideHeight || t7._overrideWidth / r22 * i18), n17 = Math.round(n17), o17 = Math.round(o17);
                var s16 = t7.source;
                s16.width = n17, s16.height = o17, s16._pixiId = "canvas_" + Oe(), s16.getContext("2d").drawImage(e17, 0, 0, r22, i18, 0, 0, n17, o17), t7._resolve(), t7._resolve = null;
            }
        };
    }, e10.getSize = function(t7) {
        var r23 = e10.SVG_SIZE.exec(t7), i19 = {
        };
        return r23 && (i19[r23[1]] = Math.round(parseFloat(r23[3])), i19[r23[5]] = Math.round(parseFloat(r23[7]))), i19;
    }, e10.prototype.dispose = function() {
        t1.prototype.dispose.call(this), this._resolve = null, this._crossorigin = null;
    }, e10.test = function(t7, e17) {
        return "svg" === e17 || "string" == typeof t7 && /^data:image\/svg\+xml(;(charset=utf8|utf8))?;base64/.test(t7) || "string" == typeof t7 && 0 === t7.indexOf("<svg");
    }, e10.SVG_SIZE = /<svg[^>]*(?:\s(width|height)=('|")(\d*(?:\.\d+)?)(?:px)?('|"))[^>]*(?:\s(width|height)=('|")(\d*(?:\.\d+)?)(?:px)?('|"))[^>]*>/i, e10;
}(jr), Wr = function(t1) {
    function e10(r23, i19) {
        var n18 = this;
        if (i19 = i19 || {
        }, !(r23 instanceof HTMLVideoElement)) {
            var o18 = document.createElement("video");
            o18.setAttribute("preload", "auto"), o18.setAttribute("webkit-playsinline", ""), o18.setAttribute("playsinline", ""), "string" == typeof r23 && (r23 = [
                r23
            ]);
            var s17 = r23[0].src || r23[0];
            jr.crossOrigin(o18, s17, i19.crossorigin);
            for(var a16 = 0; a16 < r23.length; ++a16){
                var h16 = document.createElement("source"), u16 = r23[a16], l11 = u16.src, c9 = u16.mime, d9 = (l11 = l11 || r23[a16]).split("?").shift().toLowerCase(), f7 = d9.substr(d9.lastIndexOf(".") + 1);
                c9 = c9 || e10.MIME_TYPES[f7] || "video/" + f7, h16.src = l11, h16.type = c9, o18.appendChild(h16);
            }
            r23 = o18;
        }
        return (n18 = t1.call(this, r23) || this).noSubImage = !0, n18._autoUpdate = !0, n18._isConnectedToTicker = !1, n18._updateFPS = i19.updateFPS || 0, n18._msToNextUpdate = 0, n18.autoPlay = !1 !== i19.autoPlay, n18._load = null, n18._resolve = null, n18._onCanPlay = n18._onCanPlay.bind(n18), n18._onError = n18._onError.bind(n18), !1 !== i19.autoLoad && n18.load(), n18;
    }
    return Lr(e10, t1), e10.prototype.update = function(e17) {
        if (!this.destroyed) {
            var r23 = br.shared.elapsedMS * this.source.playbackRate;
            this._msToNextUpdate = Math.floor(this._msToNextUpdate - r23), (!this._updateFPS || this._msToNextUpdate <= 0) && (t1.prototype.update.call(this), this._msToNextUpdate = this._updateFPS ? Math.floor(1000 / this._updateFPS) : 0);
        }
    }, e10.prototype.load = function() {
        var t7 = this;
        if (this._load) return this._load;
        var e17 = this.source;
        return (e17.readyState === e17.HAVE_ENOUGH_DATA || e17.readyState === e17.HAVE_FUTURE_DATA) && e17.width && e17.height && (e17.complete = !0), e17.addEventListener("play", this._onPlayStart.bind(this)), e17.addEventListener("pause", this._onPlayStop.bind(this)), this._isSourceReady() ? this._onCanPlay() : (e17.addEventListener("canplay", this._onCanPlay), e17.addEventListener("canplaythrough", this._onCanPlay), e17.addEventListener("error", this._onError, !0)), this._load = new Promise(function(r24) {
            t7.valid ? r24(t7) : (t7._resolve = r24, e17.load());
        }), this._load;
    }, e10.prototype._onError = function(t7) {
        this.source.removeEventListener("error", this._onError, !0), this.onError.emit(t7);
    }, e10.prototype._isSourcePlaying = function() {
        var t7 = this.source;
        return t7.currentTime > 0 && !1 === t7.paused && !1 === t7.ended && t7.readyState > 2;
    }, e10.prototype._isSourceReady = function() {
        var t7 = this.source;
        return 3 === t7.readyState || 4 === t7.readyState;
    }, e10.prototype._onPlayStart = function() {
        this.valid || this._onCanPlay(), this.autoUpdate && !this._isConnectedToTicker && (br.shared.add(this.update, this), this._isConnectedToTicker = !0);
    }, e10.prototype._onPlayStop = function() {
        this._isConnectedToTicker && (br.shared.remove(this.update, this), this._isConnectedToTicker = !1);
    }, e10.prototype._onCanPlay = function() {
        var t7 = this.source;
        t7.removeEventListener("canplay", this._onCanPlay), t7.removeEventListener("canplaythrough", this._onCanPlay);
        var e17 = this.valid;
        this.resize(t7.videoWidth, t7.videoHeight), !e17 && this._resolve && (this._resolve(this), this._resolve = null), this._isSourcePlaying() ? this._onPlayStart() : this.autoPlay && t7.play();
    }, e10.prototype.dispose = function() {
        this._isConnectedToTicker && br.shared.remove(this.update, this);
        var e17 = this.source;
        e17 && (e17.removeEventListener("error", this._onError, !0), e17.pause(), e17.src = "", e17.load()), t1.prototype.dispose.call(this);
    }, Object.defineProperty(e10.prototype, "autoUpdate", {
        get: function() {
            return this._autoUpdate;
        },
        set: function(t7) {
            t7 !== this._autoUpdate && (this._autoUpdate = t7, !this._autoUpdate && this._isConnectedToTicker ? (br.shared.remove(this.update, this), this._isConnectedToTicker = !1) : this._autoUpdate && !this._isConnectedToTicker && this._isSourcePlaying() && (br.shared.add(this.update, this), this._isConnectedToTicker = !0));
        },
        enumerable: !1,
        configurable: !0
    }), Object.defineProperty(e10.prototype, "updateFPS", {
        get: function() {
            return this._updateFPS;
        },
        set: function(t7) {
            t7 !== this._updateFPS && (this._updateFPS = t7);
        },
        enumerable: !1,
        configurable: !0
    }), e10.test = function(t7, r24) {
        return self.HTMLVideoElement && t7 instanceof HTMLVideoElement || e10.TYPES.indexOf(r24) > -1;
    }, e10.TYPES = [
        "mp4",
        "m4v",
        "webm",
        "ogg",
        "ogv",
        "h264",
        "avi",
        "mov"
    ], e10.MIME_TYPES = {
        ogv: "video/ogg",
        mov: "video/quicktime",
        m4v: "video/mp4"
    }, e10;
}(jr), qr = function(t1) {
    function e10(e17) {
        return t1.call(this, e17) || this;
    }
    return Lr(e10, t1), e10.test = function(t7) {
        return !!self.createImageBitmap && t7 instanceof ImageBitmap;
    }, e10;
}(jr);
Dr.push(Vr, qr, Hr, Wr, zr, Br, Yr, kr);
var Kr = {
    __proto__: null,
    Resource: Fr,
    BaseImageResource: jr,
    INSTALLED: Dr,
    autoDetectResource: Cr,
    AbstractMultiResource: Xr,
    ArrayResource: kr,
    BufferResource: Br,
    CanvasResource: Hr,
    CubeResource: Yr,
    ImageResource: Vr,
    SVGResource: zr,
    VideoResource: Wr,
    ImageBitmapResource: qr
}, Zr = function() {
    function t1(t7) {
        this.renderer = t7;
    }
    return t1.prototype.destroy = function() {
        this.renderer = null;
    }, t1;
}(), Jr = function(t1) {
    function e10() {
        return null !== t1 && t1.apply(this, arguments) || this;
    }
    return Lr(e10, t1), e10.prototype.upload = function(t7, e17, r24) {
        var i19 = t7.gl;
        i19.pixelStorei(i19.UNPACK_PREMULTIPLY_ALPHA_WEBGL, e17.alphaMode === Zt.UNPACK);
        var n18 = e17.realWidth, o19 = e17.realHeight;
        return r24.width === n18 && r24.height === o19 ? i19.texSubImage2D(e17.target, 0, 0, 0, n18, o19, e17.format, e17.type, this.data) : (r24.width = n18, r24.height = o19, i19.texImage2D(e17.target, 0, 1 === t7.context.webGLVersion ? i19.DEPTH_COMPONENT : i19.DEPTH_COMPONENT16, n18, o19, 0, e17.format, e17.type, this.data)), !0;
    }, e10;
}(Br), Qr = function() {
    function t1(t7, e10) {
        this.width = Math.ceil(t7 || 100), this.height = Math.ceil(e10 || 100), this.stencil = !1, this.depth = !1, this.dirtyId = 0, this.dirtyFormat = 0, this.dirtySize = 0, this.depthTexture = null, this.colorTextures = [], this.glFramebuffers = {
        }, this.disposeRunner = new Mr("disposeFramebuffer"), this.multisample = ee.NONE;
    }
    return Object.defineProperty(t1.prototype, "colorTexture", {
        get: function() {
            return this.colorTextures[0];
        },
        enumerable: !1,
        configurable: !0
    }), t1.prototype.addColorTexture = function(t7, e10) {
        return (void 0) === t7 && (t7 = 0), this.colorTextures[t7] = e10 || new Gr(null, {
            scaleMode: Wt.NEAREST,
            resolution: 1,
            mipmap: Kt.OFF,
            width: this.width,
            height: this.height
        }), this.dirtyId++, this.dirtyFormat++, this;
    }, t1.prototype.addDepthTexture = function(t7) {
        return this.depthTexture = t7 || new Gr(new Jr(null, {
            width: this.width,
            height: this.height
        }), {
            scaleMode: Wt.NEAREST,
            resolution: 1,
            width: this.width,
            height: this.height,
            mipmap: Kt.OFF,
            format: Yt.DEPTH_COMPONENT,
            type: zt.UNSIGNED_SHORT
        }), this.dirtyId++, this.dirtyFormat++, this;
    }, t1.prototype.enableDepth = function() {
        return this.depth = !0, this.dirtyId++, this.dirtyFormat++, this;
    }, t1.prototype.enableStencil = function() {
        return this.stencil = !0, this.dirtyId++, this.dirtyFormat++, this;
    }, t1.prototype.resize = function(t7, e10) {
        if (t7 = Math.ceil(t7), e10 = Math.ceil(e10), t7 !== this.width || e10 !== this.height) {
            this.width = t7, this.height = e10, this.dirtyId++, this.dirtySize++;
            for(var r24 = 0; r24 < this.colorTextures.length; r24++){
                var i19 = this.colorTextures[r24], n18 = i19.resolution;
                i19.setSize(t7 / n18, e10 / n18);
            }
            this.depthTexture && (n18 = this.depthTexture.resolution, this.depthTexture.setSize(t7 / n18, e10 / n18));
        }
    }, t1.prototype.dispose = function() {
        this.disposeRunner.emit(this, !1);
    }, t1.prototype.destroyDepthTexture = function() {
        this.depthTexture && (this.depthTexture.destroy(), this.depthTexture = null, ++this.dirtyId, ++this.dirtyFormat);
    }, t1;
}(), $r = function(t1) {
    function e10(e17) {
        var r25 = this;
        "number" == typeof e17 && (e17 = {
            width: arguments[0],
            height: arguments[1],
            scaleMode: arguments[2],
            resolution: arguments[3]
        }), r25 = t1.call(this, null, e17) || this;
        var i20 = e17 || {
        }, n19 = i20.width, o19 = i20.height;
        return r25.mipmap = 0, r25.width = Math.ceil(n19) || 100, r25.height = Math.ceil(o19) || 100, r25.valid = !0, r25.clearColor = [
            0,
            0,
            0,
            0
        ], r25.framebuffer = new Qr(r25.width * r25.resolution, r25.height * r25.resolution).addColorTexture(0, r25), r25.maskStack = [], r25.filterStack = [
            {
            }
        ], r25;
    }
    return Lr(e10, t1), e10.prototype.resize = function(t7, e17) {
        t7 = Math.ceil(t7), e17 = Math.ceil(e17), this.framebuffer.resize(t7 * this.resolution, e17 * this.resolution);
    }, e10.prototype.dispose = function() {
        this.framebuffer.dispose(), t1.prototype.dispose.call(this);
    }, e10.prototype.destroy = function() {
        t1.prototype.destroy.call(this), this.framebuffer.destroyDepthTexture(), this.framebuffer = null;
    }, e10;
}(Gr), ti = function() {
    function t1() {
        this.x0 = 0, this.y0 = 0, this.x1 = 1, this.y1 = 0, this.x2 = 1, this.y2 = 1, this.x3 = 0, this.y3 = 1, this.uvsFloat32 = new Float32Array(8);
    }
    return t1.prototype.set = function(t7, e10, r25) {
        var i20 = e10.width, n19 = e10.height;
        if (r25) {
            var o19 = t7.width / 2 / i20, s18 = t7.height / 2 / n19, a17 = t7.x / i20 + o19, h17 = t7.y / n19 + s18;
            r25 = ir.add(r25, ir.NW), this.x0 = a17 + o19 * ir.uX(r25), this.y0 = h17 + s18 * ir.uY(r25), r25 = ir.add(r25, 2), this.x1 = a17 + o19 * ir.uX(r25), this.y1 = h17 + s18 * ir.uY(r25), r25 = ir.add(r25, 2), this.x2 = a17 + o19 * ir.uX(r25), this.y2 = h17 + s18 * ir.uY(r25), r25 = ir.add(r25, 2), this.x3 = a17 + o19 * ir.uX(r25), this.y3 = h17 + s18 * ir.uY(r25);
        } else this.x0 = t7.x / i20, this.y0 = t7.y / n19, this.x1 = (t7.x + t7.width) / i20, this.y1 = t7.y / n19, this.x2 = (t7.x + t7.width) / i20, this.y2 = (t7.y + t7.height) / n19, this.x3 = t7.x / i20, this.y3 = (t7.y + t7.height) / n19;
        this.uvsFloat32[0] = this.x0, this.uvsFloat32[1] = this.y0, this.uvsFloat32[2] = this.x1, this.uvsFloat32[3] = this.y1, this.uvsFloat32[4] = this.x2, this.uvsFloat32[5] = this.y2, this.uvsFloat32[6] = this.x3, this.uvsFloat32[7] = this.y3;
    }, t1;
}(), ei = new ti, ri = function(t1) {
    function e10(r25, i20, n19, o20, s19, a18) {
        var h18 = t1.call(this) || this;
        if (h18.noFrame = !1, i20 || (h18.noFrame = !0, i20 = new je(0, 0, 1, 1)), r25 instanceof e10 && (r25 = r25.baseTexture), h18.baseTexture = r25, h18._frame = i20, h18.trim = o20, h18.valid = !1, h18._uvs = ei, h18.uvMatrix = null, h18.orig = n19 || i20, h18._rotate = Number(s19 || 0), !0 === s19) h18._rotate = 2;
        else if (h18._rotate % 2 != 0) throw new Error("attempt to use diamond-shaped UVs. If you are sure, set rotation manually");
        return h18.defaultAnchor = a18 ? new We(a18.x, a18.y) : new We(0, 0), h18._updateID = 0, h18.textureCacheIds = [], r25.valid ? h18.noFrame ? r25.valid && h18.onBaseTextureUpdated(r25) : h18.frame = i20 : r25.once("loaded", h18.onBaseTextureUpdated, h18), h18.noFrame && r25.on("update", h18.onBaseTextureUpdated, h18), h18;
    }
    return Lr(e10, t1), e10.prototype.update = function() {
        this.baseTexture.resource && this.baseTexture.resource.update();
    }, e10.prototype.onBaseTextureUpdated = function(t7) {
        if (this.noFrame) {
            if (!this.baseTexture.valid) return;
            this._frame.width = t7.width, this._frame.height = t7.height, this.valid = !0, this.updateUvs();
        } else this.frame = this._frame;
        this.emit("update", this);
    }, e10.prototype.destroy = function(t7) {
        if (this.baseTexture) {
            if (t7) {
                var r25 = this.baseTexture.resource;
                r25 && r25.url && Pe[r25.url] && e10.removeFromCache(r25.url), this.baseTexture.destroy();
            }
            this.baseTexture.off("loaded", this.onBaseTextureUpdated, this), this.baseTexture.off("update", this.onBaseTextureUpdated, this), this.baseTexture = null;
        }
        this._frame = null, this._uvs = null, this.trim = null, this.orig = null, this.valid = !1, e10.removeFromCache(this), this.textureCacheIds = null;
    }, e10.prototype.clone = function() {
        var t7 = this._frame.clone(), r26 = this._frame === this.orig ? t7 : this.orig.clone(), i20 = new e10(this.baseTexture, !this.noFrame && t7, r26, this.trim && this.trim.clone(), this.rotate, this.defaultAnchor);
        return this.noFrame && (i20._frame = t7), i20;
    }, e10.prototype.updateUvs = function() {
        this._uvs === ei && (this._uvs = new ti), this._uvs.set(this._frame, this.baseTexture, this.rotate), this._updateID++;
    }, e10.from = function(t7, r26, i20) {
        (void 0) === r26 && (r26 = {
        }), (void 0) === i20 && (i20 = F.STRICT_TEXTURE_CACHE);
        var n19 = "string" == typeof t7, o20 = null;
        if (n19) o20 = t7;
        else {
            if (!t7._pixiId) {
                var s19 = r26 && r26.pixiIdPrefix || "pixiid";
                t7._pixiId = s19 + "_" + Oe();
            }
            o20 = t7._pixiId;
        }
        var a18 = Pe[o20];
        if (n19 && i20 && !a18) throw new Error('The cacheId "' + o20 + '" does not exist in TextureCache.');
        return a18 || (r26.resolution || (r26.resolution = Fe(t7)), (a18 = new e10(new Gr(t7, r26))).baseTexture.cacheId = o20, Gr.addToCache(a18.baseTexture, o20), e10.addToCache(a18, o20)), a18;
    }, e10.fromURL = function(t7, r26) {
        var i20 = Object.assign({
            autoLoad: !1
        }, null == r26 ? void 0 : r26.resourceOptions), n19 = e10.from(t7, Object.assign({
            resourceOptions: i20
        }, r26), !1), o20 = n19.baseTexture.resource;
        return n19.baseTexture.valid ? Promise.resolve(n19) : o20.load().then(function() {
            return Promise.resolve(n19);
        });
    }, e10.fromBuffer = function(t7, r26, i20, n19) {
        return new e10(Gr.fromBuffer(t7, r26, i20, n19));
    }, e10.fromLoader = function(t7, r26, i20, n19) {
        var o20 = new Gr(t7, Object.assign({
            scaleMode: F.SCALE_MODE,
            resolution: Fe(r26)
        }, n19)), s20 = o20.resource;
        s20 instanceof Vr && (s20.url = r26);
        var a18 = new e10(o20);
        return i20 || (i20 = r26), Gr.addToCache(a18.baseTexture, i20), e10.addToCache(a18, i20), i20 !== r26 && (Gr.addToCache(a18.baseTexture, r26), e10.addToCache(a18, r26)), a18.baseTexture.valid ? Promise.resolve(a18) : new Promise(function(t8) {
            a18.baseTexture.once("loaded", function() {
                return t8(a18);
            });
        });
    }, e10.addToCache = function(t7, e17) {
        e17 && (-1 === t7.textureCacheIds.indexOf(e17) && t7.textureCacheIds.push(e17), Pe[e17] && console.warn("Texture added to the cache with an id [" + e17 + "] that already had an entry"), Pe[e17] = t7);
    }, e10.removeFromCache = function(t7) {
        if ("string" == typeof t7) {
            var e17 = Pe[t7];
            if (e17) {
                var r26 = e17.textureCacheIds.indexOf(t7);
                return r26 > -1 && e17.textureCacheIds.splice(r26, 1), delete Pe[t7], e17;
            }
        } else if (t7 && t7.textureCacheIds) {
            for(var i20 = 0; i20 < t7.textureCacheIds.length; ++i20)Pe[t7.textureCacheIds[i20]] === t7 && delete Pe[t7.textureCacheIds[i20]];
            return t7.textureCacheIds.length = 0, t7;
        }
        return null;
    }, Object.defineProperty(e10.prototype, "resolution", {
        get: function() {
            return this.baseTexture.resolution;
        },
        enumerable: !1,
        configurable: !0
    }), Object.defineProperty(e10.prototype, "frame", {
        get: function() {
            return this._frame;
        },
        set: function(t7) {
            this._frame = t7, this.noFrame = !1;
            var e18 = t7.x, r27 = t7.y, i21 = t7.width, n19 = t7.height, o20 = e18 + i21 > this.baseTexture.width, s20 = r27 + n19 > this.baseTexture.height;
            if (o20 || s20) {
                var a18 = o20 && s20 ? "and" : "or", h18 = "X: " + e18 + " + " + i21 + " = " + (e18 + i21) + " > " + this.baseTexture.width, u17 = "Y: " + r27 + " + " + n19 + " = " + (r27 + n19) + " > " + this.baseTexture.height;
                throw new Error("Texture Error: frame does not fit inside the base Texture dimensions: " + h18 + " " + a18 + " " + u17);
            }
            this.valid = i21 && n19 && this.baseTexture.valid, this.trim || this.rotate || (this.orig = t7), this.valid && this.updateUvs();
        },
        enumerable: !1,
        configurable: !0
    }), Object.defineProperty(e10.prototype, "rotate", {
        get: function() {
            return this._rotate;
        },
        set: function(t7) {
            this._rotate = t7, this.valid && this.updateUvs();
        },
        enumerable: !1,
        configurable: !0
    }), Object.defineProperty(e10.prototype, "width", {
        get: function() {
            return this.orig.width;
        },
        enumerable: !1,
        configurable: !0
    }), Object.defineProperty(e10.prototype, "height", {
        get: function() {
            return this.orig.height;
        },
        enumerable: !1,
        configurable: !0
    }), e10.prototype.castToBaseTexture = function() {
        return this.baseTexture;
    }, e10;
}(X2);
function ii(t1) {
    t1.destroy = function() {
    }, t1.on = function() {
    }, t1.once = function() {
    }, t1.emit = function() {
    };
}
ri.EMPTY = new ri(new Gr), ii(ri.EMPTY), ii(ri.EMPTY.baseTexture), ri.WHITE = (function() {
    var t1 = document.createElement("canvas");
    t1.width = 16, t1.height = 16;
    var e10 = t1.getContext("2d");
    return e10.fillStyle = "white", e10.fillRect(0, 0, 16, 16), new ri(new Gr(new Hr(t1)));
})(), ii(ri.WHITE), ii(ri.WHITE.baseTexture);
var ni = function(t1) {
    function e10(e18, r27) {
        var i21 = t1.call(this, e18, r27) || this;
        return i21.valid = !0, i21.filterFrame = null, i21.filterPoolKey = null, i21.updateUvs(), i21;
    }
    return Lr(e10, t1), Object.defineProperty(e10.prototype, "framebuffer", {
        get: function() {
            return this.baseTexture.framebuffer;
        },
        enumerable: !1,
        configurable: !0
    }), e10.prototype.resize = function(t7, e18, r27) {
        (void 0) === r27 && (r27 = !0), t7 = Math.ceil(t7), e18 = Math.ceil(e18), this.valid = t7 > 0 && e18 > 0, this._frame.width = this.orig.width = t7, this._frame.height = this.orig.height = e18, r27 && this.baseTexture.resize(t7, e18), this.updateUvs();
    }, e10.prototype.setResolution = function(t7) {
        var e18 = this.baseTexture;
        e18.resolution !== t7 && (e18.setResolution(t7), this.resize(e18.width, e18.height, !1));
    }, e10.create = function(t7) {
        for(var r27 = arguments, i21 = [], n19 = 1; n19 < arguments.length; n19++)i21[n19 - 1] = r27[n19];
        return "number" == typeof t7 && (t7 = {
            width: t7,
            height: i21[0],
            scaleMode: i21[1],
            resolution: i21[2]
        }), new e10(new $r(t7));
    }, e10;
}(ri), oi = function() {
    function t1(t7) {
        this.texturePool = {
        }, this.textureOptions = t7 || {
        }, this.enableFullScreen = !1, this._pixelsWidth = 0, this._pixelsHeight = 0;
    }
    return t1.prototype.createTexture = function(t7, e10) {
        var r27 = new $r(Object.assign({
            width: t7,
            height: e10,
            resolution: 1
        }, this.textureOptions));
        return new ni(r27);
    }, t1.prototype.getOptimalTexture = function(e10, r27, i21) {
        (void 0) === i21 && (i21 = 1);
        var n19 = t1.SCREEN_KEY;
        e10 *= i21, r27 *= i21, this.enableFullScreen && e10 === this._pixelsWidth && r27 === this._pixelsHeight || (n19 = (65535 & (e10 = be(e10))) << 16 | 65535 & (r27 = be(r27))), this.texturePool[n19] || (this.texturePool[n19] = []);
        var o20 = this.texturePool[n19].pop();
        return o20 || (o20 = this.createTexture(e10, r27)), o20.filterPoolKey = n19, o20.setResolution(i21), o20;
    }, t1.prototype.getFilterTexture = function(t7, e10) {
        var r27 = this.getOptimalTexture(t7.width, t7.height, e10 || t7.resolution);
        return r27.filterFrame = t7.filterFrame, r27;
    }, t1.prototype.returnTexture = function(t7) {
        var e10 = t7.filterPoolKey;
        t7.filterFrame = null, this.texturePool[e10].push(t7);
    }, t1.prototype.returnFilterTexture = function(t7) {
        this.returnTexture(t7);
    }, t1.prototype.clear = function(t7) {
        if (t7 = !1 !== t7) for(var e10 in this.texturePool){
            var r27 = this.texturePool[e10];
            if (r27) for(var i21 = 0; i21 < r27.length; i21++)r27[i21].destroy(!0);
        }
        this.texturePool = {
        };
    }, t1.prototype.setScreenSize = function(e10) {
        if (e10.width !== this._pixelsWidth || e10.height !== this._pixelsHeight) {
            var r28 = t1.SCREEN_KEY, i22 = this.texturePool[r28];
            if (this.enableFullScreen = e10.width > 0 && e10.height > 0, i22) for(var n19 = 0; n19 < i22.length; n19++)i22[n19].destroy(!0);
            this.texturePool[r28] = [], this._pixelsWidth = e10.width, this._pixelsHeight = e10.height;
        }
    }, t1.SCREEN_KEY = "screen", t1;
}(), si = function() {
    function t1(t7, e10, r29, i23, n20, o20, s20) {
        (void 0) === e10 && (e10 = 0), (void 0) === r29 && (r29 = !1), (void 0) === i23 && (i23 = 5126), this.buffer = t7, this.size = e10, this.normalized = r29, this.type = i23, this.stride = n20, this.start = o20, this.instance = s20;
    }
    return t1.prototype.destroy = function() {
        this.buffer = null;
    }, t1.from = function(e10, r29, i23, n20, o20) {
        return new t1(e10, r29, i23, n20, o20);
    }, t1;
}(), ai = 0, hi = function() {
    function t1(t7, e10, r29) {
        (void 0) === e10 && (e10 = !0), (void 0) === r29 && (r29 = !1), this.data = t7 || new Float32Array(1), this._glBuffers = {
        }, this._updateID = 0, this.index = r29, this.static = e10, this.id = ai++, this.disposeRunner = new Mr("disposeBuffer");
    }
    return t1.prototype.update = function(t7) {
        this.data = t7 || this.data, this._updateID++;
    }, t1.prototype.dispose = function() {
        this.disposeRunner.emit(this, !1);
    }, t1.prototype.destroy = function() {
        this.dispose(), this.data = null;
    }, t1.from = function(e10) {
        return e10 instanceof Array && (e10 = new Float32Array(e10)), new t1(e10);
    }, t1;
}();
function ui(t1) {
    if (4 === t1.BYTES_PER_ELEMENT) return t1 instanceof Float32Array ? "Float32Array" : t1 instanceof Uint32Array ? "Uint32Array" : "Int32Array";
    if (2 === t1.BYTES_PER_ELEMENT) {
        if (t1 instanceof Uint16Array) return "Uint16Array";
    } else if (1 === t1.BYTES_PER_ELEMENT && t1 instanceof Uint8Array) return "Uint8Array";
    return null;
}
var li = {
    Float32Array: Float32Array,
    Uint32Array: Uint32Array,
    Int32Array: Int32Array,
    Uint8Array: Uint8Array
}, ci = {
    5126: 4,
    5123: 2,
    5121: 1
}, di = 0, fi = {
    Float32Array: Float32Array,
    Uint32Array: Uint32Array,
    Int32Array: Int32Array,
    Uint8Array: Uint8Array,
    Uint16Array: Uint16Array
}, pi = function() {
    function t1(t7, e10) {
        (void 0) === t7 && (t7 = []), (void 0) === e10 && (e10 = {
        }), this.buffers = t7, this.indexBuffer = null, this.attributes = e10, this.glVertexArrayObjects = {
        }, this.id = di++, this.instanced = !1, this.instanceCount = 1, this.disposeRunner = new Mr("disposeGeometry"), this.refCount = 0;
    }
    return t1.prototype.addAttribute = function(t7, e10, r29, i23, n20, o20, s20, a19) {
        if ((void 0) === r29 && (r29 = 0), (void 0) === i23 && (i23 = !1), (void 0) === a19 && (a19 = !1), !e10) throw new Error("You must pass a buffer when creating an attribute");
        e10 instanceof hi || (e10 instanceof Array && (e10 = new Float32Array(e10)), e10 = new hi(e10));
        var h19 = t7.split("|");
        if (h19.length > 1) {
            for(var u18 = 0; u18 < h19.length; u18++)this.addAttribute(h19[u18], e10, r29, i23, n20);
            return this;
        }
        var l12 = this.buffers.indexOf(e10);
        return -1 === l12 && (this.buffers.push(e10), l12 = this.buffers.length - 1), this.attributes[t7] = new si(l12, r29, i23, n20, o20, s20, a19), this.instanced = this.instanced || a19, this;
    }, t1.prototype.getAttribute = function(t7) {
        return this.attributes[t7];
    }, t1.prototype.getBuffer = function(t7) {
        return this.buffers[this.getAttribute(t7).buffer];
    }, t1.prototype.addIndex = function(t7) {
        return t7 instanceof hi || (t7 instanceof Array && (t7 = new Uint16Array(t7)), t7 = new hi(t7)), t7.index = !0, this.indexBuffer = t7, -1 === this.buffers.indexOf(t7) && this.buffers.push(t7), this;
    }, t1.prototype.getIndex = function() {
        return this.indexBuffer;
    }, t1.prototype.interleave = function() {
        if (1 === this.buffers.length || 2 === this.buffers.length && this.indexBuffer) return this;
        var t7, e10 = [], r29 = [], i23 = new hi;
        for(t7 in this.attributes){
            var n20 = this.attributes[t7], o20 = this.buffers[n20.buffer];
            e10.push(o20.data), r29.push(n20.size * ci[n20.type] / 4), n20.buffer = 0;
        }
        for(i23.data = (function(t8, e18) {
            for(var r30 = 0, i24 = 0, n21 = {
            }, o21 = 0; o21 < t8.length; o21++)i24 += e18[o21], r30 += t8[o21].length;
            var s20 = new ArrayBuffer(4 * r30), a19 = null, h19 = 0;
            for(o21 = 0; o21 < t8.length; o21++){
                var u19 = e18[o21], l12 = t8[o21], c10 = ui(l12);
                n21[c10] || (n21[c10] = new li[c10](s20)), a19 = n21[c10];
                for(var d10 = 0; d10 < l12.length; d10++)a19[(d10 / u19 | 0) * i24 + h19 + d10 % u19] = l12[d10];
                h19 += u19;
            }
            return new Float32Array(s20);
        })(e10, r29), t7 = 0; t7 < this.buffers.length; t7++)this.buffers[t7] !== this.indexBuffer && this.buffers[t7].destroy();
        return this.buffers = [
            i23
        ], this.indexBuffer && this.buffers.push(this.indexBuffer), this;
    }, t1.prototype.getSize = function() {
        for(var t7 in this.attributes){
            var e10 = this.attributes[t7];
            return this.buffers[e10.buffer].data.length / (e10.stride / 4 || e10.size);
        }
        return 0;
    }, t1.prototype.dispose = function() {
        this.disposeRunner.emit(this, !1);
    }, t1.prototype.destroy = function() {
        this.dispose(), this.buffers = null, this.indexBuffer = null, this.attributes = null;
    }, t1.prototype.clone = function() {
        for(var e18 = new t1, r29 = 0; r29 < this.buffers.length; r29++)e18.buffers[r29] = new hi(this.buffers[r29].data.slice(0));
        for(var r29 in this.attributes){
            var i23 = this.attributes[r29];
            e18.attributes[r29] = new si(i23.buffer, i23.size, i23.normalized, i23.type, i23.stride, i23.start, i23.instance);
        }
        return this.indexBuffer && (e18.indexBuffer = e18.buffers[this.buffers.indexOf(this.indexBuffer)], e18.indexBuffer.index = !0), e18;
    }, t1.merge = function(e18) {
        for(var r29, i24 = new t1, n21 = [], o21 = [], s20 = [], a19 = 0; a19 < e18.length; a19++){
            r29 = e18[a19];
            for(var h19 = 0; h19 < r29.buffers.length; h19++)o21[h19] = o21[h19] || 0, o21[h19] += r29.buffers[h19].data.length, s20[h19] = 0;
        }
        for(a19 = 0; a19 < r29.buffers.length; a19++)n21[a19] = new fi[ui(r29.buffers[a19].data)](o21[a19]), i24.buffers[a19] = new hi(n21[a19]);
        for(a19 = 0; a19 < e18.length; a19++)for(r29 = e18[a19], h19 = 0; h19 < r29.buffers.length; h19++)n21[h19].set(r29.buffers[h19].data, s20[h19]), s20[h19] += r29.buffers[h19].data.length;
        if (i24.attributes = r29.attributes, r29.indexBuffer) {
            i24.indexBuffer = i24.buffers[r29.buffers.indexOf(r29.indexBuffer)], i24.indexBuffer.index = !0;
            var u20 = 0, l13 = 0, c11 = 0, d11 = 0;
            for(a19 = 0; a19 < r29.buffers.length; a19++)if (r29.buffers[a19] !== r29.indexBuffer) {
                d11 = a19;
                break;
            }
            for(var a19 in r29.attributes){
                var f8 = r29.attributes[a19];
                (0 | f8.buffer) === d11 && (l13 += f8.size * ci[f8.type] / 4);
            }
            for(a19 = 0; a19 < e18.length; a19++){
                var p = e18[a19].indexBuffer.data;
                for(h19 = 0; h19 < p.length; h19++)i24.indexBuffer.data[h19 + c11] += u20;
                u20 += r29.buffers[d11].data.length / l13, c11 += p.length;
            }
        }
        return i24;
    }, t1;
}(), _i = function(t1) {
    function e18() {
        var e19 = t1.call(this) || this;
        return e19.addAttribute("aVertexPosition", new Float32Array([
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
        ]), e19;
    }
    return Lr(e18, t1), e18;
}(pi), mi = function(t1) {
    function e18() {
        var e19 = t1.call(this) || this;
        return e19.vertices = new Float32Array([
            -1,
            -1,
            1,
            -1,
            1,
            1,
            -1,
            1
        ]), e19.uvs = new Float32Array([
            0,
            0,
            1,
            0,
            1,
            1,
            0,
            1
        ]), e19.vertexBuffer = new hi(e19.vertices), e19.uvBuffer = new hi(e19.uvs), e19.addAttribute("aVertexPosition", e19.vertexBuffer).addAttribute("aTextureCoord", e19.uvBuffer).addIndex([
            0,
            1,
            2,
            0,
            2,
            3
        ]), e19;
    }
    return Lr(e18, t1), e18.prototype.map = function(t7, e19) {
        var r29 = 0, i24 = 0;
        return this.uvs[0] = r29, this.uvs[1] = i24, this.uvs[2] = r29 + e19.width / t7.width, this.uvs[3] = i24, this.uvs[4] = r29 + e19.width / t7.width, this.uvs[5] = i24 + e19.height / t7.height, this.uvs[6] = r29, this.uvs[7] = i24 + e19.height / t7.height, r29 = e19.x, i24 = e19.y, this.vertices[0] = r29, this.vertices[1] = i24, this.vertices[2] = r29 + e19.width, this.vertices[3] = i24, this.vertices[4] = r29 + e19.width, this.vertices[5] = i24 + e19.height, this.vertices[6] = r29, this.vertices[7] = i24 + e19.height, this.invalidate(), this;
    }, e18.prototype.invalidate = function() {
        return this.vertexBuffer._updateID++, this.uvBuffer._updateID++, this;
    }, e18;
}(pi), vi = 0, yi = function() {
    function t1(t7, e18) {
        this.uniforms = t7, this.group = !0, this.syncUniforms = {
        }, this.dirtyId = 0, this.id = vi++, this.static = !!e18;
    }
    return t1.prototype.update = function() {
        this.dirtyId++;
    }, t1.prototype.add = function(e18, r29, i24) {
        this.uniforms[e18] = new t1(r29, i24);
    }, t1.from = function(e18, r29) {
        return new t1(e18, r29);
    }, t1;
}(), gi = function() {
    function t1() {
        this.renderTexture = null, this.target = null, this.legacy = !1, this.resolution = 1, this.sourceFrame = new je, this.destinationFrame = new je, this.bindingSourceFrame = new je, this.bindingDestinationFrame = new je, this.filters = [], this.transform = null;
    }
    return t1.prototype.clear = function() {
        this.target = null, this.filters = null, this.renderTexture = null;
    }, t1;
}(), bi = [
    new We,
    new We,
    new We,
    new We
], xi = new Ke, Ti = function(t1) {
    function e18(e19) {
        var r29 = t1.call(this, e19) || this;
        return r29.defaultFilterStack = [
            {
            }
        ], r29.texturePool = new oi, r29.texturePool.setScreenSize(e19.view), r29.statePool = [], r29.quad = new _i, r29.quadUv = new mi, r29.tempRect = new je, r29.activeState = {
        }, r29.globalUniforms = new yi({
            outputFrame: new je,
            inputSize: new Float32Array(4),
            inputPixel: new Float32Array(4),
            inputClamp: new Float32Array(4),
            resolution: 1,
            filterArea: new Float32Array(4),
            filterClamp: new Float32Array(4)
        }, !0), r29.forceClear = !1, r29.useMaxPadding = !1, r29;
    }
    return Lr(e18, t1), e18.prototype.push = function(t7, e19) {
        for(var r29 = this.renderer, i24 = this.defaultFilterStack, n21 = this.statePool.pop() || new gi, o21 = this.renderer.renderTexture, s20 = e19[0].resolution, a19 = e19[0].padding, h20 = e19[0].autoFit, u21 = e19[0].legacy, l14 = 1; l14 < e19.length; l14++){
            var c12 = e19[l14];
            s20 = Math.min(s20, c12.resolution), a19 = this.useMaxPadding ? Math.max(a19, c12.padding) : a19 + c12.padding, h20 = h20 && c12.autoFit, u21 = u21 || c12.legacy;
        }
        if (1 === i24.length && (this.defaultFilterStack[0].renderTexture = o21.current), i24.push(n21), n21.resolution = s20, n21.legacy = u21, n21.target = t7, n21.sourceFrame.copyFrom(t7.filterArea || t7.getBounds(!0)), n21.sourceFrame.pad(a19), h20) {
            var d12 = this.tempRect.copyFrom(o21.sourceFrame);
            r29.projection.transform && this.transformAABB(xi.copyFrom(r29.projection.transform).invert(), d12), n21.sourceFrame.fit(d12);
        }
        this.roundFrame(n21.sourceFrame, o21.current ? o21.current.resolution : r29.resolution, o21.sourceFrame, o21.destinationFrame, r29.projection.transform), n21.renderTexture = this.getOptimalFilterTexture(n21.sourceFrame.width, n21.sourceFrame.height, s20), n21.filters = e19, n21.destinationFrame.width = n21.renderTexture.width, n21.destinationFrame.height = n21.renderTexture.height;
        var f9 = this.tempRect;
        f9.x = 0, f9.y = 0, f9.width = n21.sourceFrame.width, f9.height = n21.sourceFrame.height, n21.renderTexture.filterFrame = n21.sourceFrame, n21.bindingSourceFrame.copyFrom(o21.sourceFrame), n21.bindingDestinationFrame.copyFrom(o21.destinationFrame), n21.transform = r29.projection.transform, r29.projection.transform = null, o21.bind(n21.renderTexture, n21.sourceFrame, f9), r29.framebuffer.clear(0, 0, 0, 0);
    }, e18.prototype.pop = function() {
        var t7 = this.defaultFilterStack, e19 = t7.pop(), r29 = e19.filters;
        this.activeState = e19;
        var i24 = this.globalUniforms.uniforms;
        i24.outputFrame = e19.sourceFrame, i24.resolution = e19.resolution;
        var n21 = i24.inputSize, o21 = i24.inputPixel, s20 = i24.inputClamp;
        if (n21[0] = e19.destinationFrame.width, n21[1] = e19.destinationFrame.height, n21[2] = 1 / n21[0], n21[3] = 1 / n21[1], o21[0] = n21[0] * e19.resolution, o21[1] = n21[1] * e19.resolution, o21[2] = 1 / o21[0], o21[3] = 1 / o21[1], s20[0] = 0.5 * o21[2], s20[1] = 0.5 * o21[3], s20[2] = e19.sourceFrame.width * n21[2] - 0.5 * o21[2], s20[3] = e19.sourceFrame.height * n21[3] - 0.5 * o21[3], e19.legacy) {
            var a19 = i24.filterArea;
            a19[0] = e19.destinationFrame.width, a19[1] = e19.destinationFrame.height, a19[2] = e19.sourceFrame.x, a19[3] = e19.sourceFrame.y, i24.filterClamp = i24.inputClamp;
        }
        this.globalUniforms.update();
        var h20 = t7[t7.length - 1];
        if (e19.renderTexture.framebuffer.multisample > 1 && this.renderer.framebuffer.blit(), 1 === r29.length) r29[0].apply(this, e19.renderTexture, h20.renderTexture, Jt.BLEND, e19), this.returnFilterTexture(e19.renderTexture);
        else {
            var u21 = e19.renderTexture, l14 = this.getOptimalFilterTexture(u21.width, u21.height, e19.resolution);
            l14.filterFrame = u21.filterFrame;
            var c13 = 0;
            for(c13 = 0; c13 < r29.length - 1; ++c13){
                r29[c13].apply(this, u21, l14, Jt.CLEAR, e19);
                var d13 = u21;
                u21 = l14, l14 = d13;
            }
            r29[c13].apply(this, u21, h20.renderTexture, Jt.BLEND, e19), this.returnFilterTexture(u21), this.returnFilterTexture(l14);
        }
        e19.clear(), this.statePool.push(e19);
    }, e18.prototype.bindAndClear = function(t7, e19) {
        (void 0) === e19 && (e19 = Jt.CLEAR);
        var r29 = this.renderer, i24 = r29.renderTexture, n21 = r29.state;
        if (t7 === this.defaultFilterStack[this.defaultFilterStack.length - 1].renderTexture ? this.renderer.projection.transform = this.activeState.transform : this.renderer.projection.transform = null, t7 && t7.filterFrame) {
            var o21 = this.tempRect;
            o21.x = 0, o21.y = 0, o21.width = t7.filterFrame.width, o21.height = t7.filterFrame.height, i24.bind(t7, t7.filterFrame, o21);
        } else t7 !== this.defaultFilterStack[this.defaultFilterStack.length - 1].renderTexture ? i24.bind(t7) : this.renderer.renderTexture.bind(t7, this.activeState.bindingSourceFrame, this.activeState.bindingDestinationFrame);
        var s20 = 1 & n21.stateId || this.forceClear;
        (e19 === Jt.CLEAR || e19 === Jt.BLIT && s20) && this.renderer.framebuffer.clear(0, 0, 0, 0);
    }, e18.prototype.applyFilter = function(t7, e19, r29, i24) {
        var n21 = this.renderer;
        n21.state.set(t7.state), this.bindAndClear(r29, i24), t7.uniforms.uSampler = e19, t7.uniforms.filterGlobals = this.globalUniforms, n21.shader.bind(t7), t7.legacy ? (this.quadUv.map(e19._frame, e19.filterFrame), n21.geometry.bind(this.quadUv), n21.geometry.draw(Ht.TRIANGLES)) : (n21.geometry.bind(this.quad), n21.geometry.draw(Ht.TRIANGLE_STRIP));
    }, e18.prototype.calculateSpriteMatrix = function(t7, e19) {
        var r29 = this.activeState, i24 = r29.sourceFrame, n21 = r29.destinationFrame, o22 = e19._texture.orig, s20 = t7.set(n21.width, 0, 0, n21.height, i24.x, i24.y), a20 = e19.worldTransform.copyTo(Ke.TEMP_MATRIX);
        return a20.invert(), s20.prepend(a20), s20.scale(1 / o22.width, 1 / o22.height), s20.translate(e19.anchor.x, e19.anchor.y), s20;
    }, e18.prototype.destroy = function() {
        this.texturePool.clear(!1);
    }, e18.prototype.getOptimalFilterTexture = function(t7, e19, r29) {
        return (void 0) === r29 && (r29 = 1), this.texturePool.getOptimalTexture(t7, e19, r29);
    }, e18.prototype.getFilterTexture = function(t7, e19) {
        if ("number" == typeof t7) {
            var r29 = t7;
            t7 = e19, e19 = r29;
        }
        t7 = t7 || this.activeState.renderTexture;
        var i24 = this.texturePool.getOptimalTexture(t7.width, t7.height, e19 || t7.resolution);
        return i24.filterFrame = t7.filterFrame, i24;
    }, e18.prototype.returnFilterTexture = function(t7) {
        this.texturePool.returnTexture(t7);
    }, e18.prototype.emptyPool = function() {
        this.texturePool.clear(!0);
    }, e18.prototype.resize = function() {
        this.texturePool.setScreenSize(this.renderer.view);
    }, e18.prototype.transformAABB = function(t7, e19) {
        var r30 = bi[0], i24 = bi[1], n21 = bi[2], o22 = bi[3];
        r30.set(e19.left, e19.top), i24.set(e19.left, e19.bottom), n21.set(e19.right, e19.top), o22.set(e19.right, e19.bottom), t7.apply(r30, r30), t7.apply(i24, i24), t7.apply(n21, n21), t7.apply(o22, o22);
        var s20 = Math.min(r30.x, i24.x, n21.x, o22.x), a20 = Math.min(r30.y, i24.y, n21.y, o22.y), h20 = Math.max(r30.x, i24.x, n21.x, o22.x), u22 = Math.max(r30.y, i24.y, n21.y, o22.y);
        e19.x = s20, e19.y = a20, e19.width = h20 - s20, e19.height = u22 - a20;
    }, e18.prototype.roundFrame = function(t7, e19, r30, i24, n21) {
        if (n21) {
            var o22 = n21.a, s20 = n21.b, a20 = n21.c, h20 = n21.d;
            if (!(0 === s20 && 0 === a20 || 0 === o22 && 0 === h20)) return;
        }
        (n21 = n21 ? xi.copyFrom(n21) : xi.identity()).translate(-r30.x, -r30.y).scale(i24.width / r30.width, i24.height / r30.height).translate(i24.x, i24.y), this.transformAABB(n21, t7), t7.ceil(e19), this.transformAABB(n21.invert(), t7);
    }, e18;
}(Zr), Ei = function() {
    function t1(t7) {
        this.renderer = t7;
    }
    return t1.prototype.flush = function() {
    }, t1.prototype.destroy = function() {
        this.renderer = null;
    }, t1.prototype.start = function() {
    }, t1.prototype.stop = function() {
        this.flush();
    }, t1.prototype.render = function(t7) {
    }, t1;
}(), Ai = function(t1) {
    function e18(e19) {
        var r30 = t1.call(this, e19) || this;
        return r30.emptyRenderer = new Ei(e19), r30.currentRenderer = r30.emptyRenderer, r30;
    }
    return Lr(e18, t1), e18.prototype.setObjectRenderer = function(t7) {
        this.currentRenderer !== t7 && (this.currentRenderer.stop(), this.currentRenderer = t7, this.currentRenderer.start());
    }, e18.prototype.flush = function() {
        this.setObjectRenderer(this.emptyRenderer);
    }, e18.prototype.reset = function() {
        this.setObjectRenderer(this.emptyRenderer);
    }, e18.prototype.copyBoundTextures = function(t7, e19) {
        for(var r30 = this.renderer.texture.boundTextures, i24 = e19 - 1; i24 >= 0; --i24)t7[i24] = r30[i24] || null, t7[i24] && (t7[i24]._batchLocation = i24);
    }, e18.prototype.boundArray = function(t7, e19, r30, i24) {
        for(var n21 = t7.elements, o23 = t7.ids, s21 = t7.count, a21 = 0, h21 = 0; h21 < s21; h21++){
            var u22 = n21[h21], l15 = u22._batchLocation;
            if (l15 >= 0 && l15 < i24 && e19[l15] === u22) o23[h21] = l15;
            else for(; a21 < i24;){
                var c14 = e19[a21];
                if (!c14 || c14._batchEnabled !== r30 || c14._batchLocation !== a21) {
                    o23[h21] = a21, u22._batchLocation = a21, e19[a21] = u22;
                    break;
                }
                a21++;
            }
        }
    }, e18;
}(Zr), Si = 0, Oi = function(t1) {
    function e18(e19) {
        var r30 = t1.call(this, e19) || this;
        return r30.webGLVersion = 1, r30.extensions = {
        }, r30.supports = {
            uint32Indices: !1
        }, r30.handleContextLost = r30.handleContextLost.bind(r30), r30.handleContextRestored = r30.handleContextRestored.bind(r30), e19.view.addEventListener("webglcontextlost", r30.handleContextLost, !1), e19.view.addEventListener("webglcontextrestored", r30.handleContextRestored, !1), r30;
    }
    return Lr(e18, t1), Object.defineProperty(e18.prototype, "isLost", {
        get: function() {
            return !this.gl || this.gl.isContextLost();
        },
        enumerable: !1,
        configurable: !0
    }), e18.prototype.contextChange = function(t7) {
        this.gl = t7, this.renderer.gl = t7, this.renderer.CONTEXT_UID = Si++, t7.isContextLost() && t7.getExtension("WEBGL_lose_context") && t7.getExtension("WEBGL_lose_context").restoreContext();
    }, e18.prototype.initFromContext = function(t7) {
        this.gl = t7, this.validateContext(t7), this.renderer.gl = t7, this.renderer.CONTEXT_UID = Si++, this.renderer.runners.contextChange.emit(t7);
    }, e18.prototype.initFromOptions = function(t7) {
        var e19 = this.createContext(this.renderer.view, t7);
        this.initFromContext(e19);
    }, e18.prototype.createContext = function(t7, e19) {
        var r30;
        if (F.PREFER_ENV >= Gt.WEBGL2 && (r30 = t7.getContext("webgl2", e19)), r30) this.webGLVersion = 2;
        else if (this.webGLVersion = 1, !(r30 = t7.getContext("webgl", e19) || t7.getContext("experimental-webgl", e19))) throw new Error("This browser does not support WebGL. Try using the canvas renderer");
        return this.gl = r30, this.getExtensions(), this.gl;
    }, e18.prototype.getExtensions = function() {
        var t7 = this.gl, e19 = {
            anisotropicFiltering: t7.getExtension("EXT_texture_filter_anisotropic"),
            floatTextureLinear: t7.getExtension("OES_texture_float_linear"),
            s3tc: t7.getExtension("WEBGL_compressed_texture_s3tc"),
            s3tc_sRGB: t7.getExtension("WEBGL_compressed_texture_s3tc_srgb"),
            etc: t7.getExtension("WEBGL_compressed_texture_etc"),
            etc1: t7.getExtension("WEBGL_compressed_texture_etc1"),
            pvrtc: t7.getExtension("WEBGL_compressed_texture_pvrtc") || t7.getExtension("WEBKIT_WEBGL_compressed_texture_pvrtc"),
            atc: t7.getExtension("WEBGL_compressed_texture_atc"),
            astc: t7.getExtension("WEBGL_compressed_texture_astc")
        };
        1 === this.webGLVersion ? Object.assign(this.extensions, e19, {
            drawBuffers: t7.getExtension("WEBGL_draw_buffers"),
            depthTexture: t7.getExtension("WEBGL_depth_texture"),
            loseContext: t7.getExtension("WEBGL_lose_context"),
            vertexArrayObject: t7.getExtension("OES_vertex_array_object") || t7.getExtension("MOZ_OES_vertex_array_object") || t7.getExtension("WEBKIT_OES_vertex_array_object"),
            uint32ElementIndex: t7.getExtension("OES_element_index_uint"),
            floatTexture: t7.getExtension("OES_texture_float"),
            floatTextureLinear: t7.getExtension("OES_texture_float_linear"),
            textureHalfFloat: t7.getExtension("OES_texture_half_float"),
            textureHalfFloatLinear: t7.getExtension("OES_texture_half_float_linear")
        }) : 2 === this.webGLVersion && Object.assign(this.extensions, e19, {
            colorBufferFloat: t7.getExtension("EXT_color_buffer_float")
        });
    }, e18.prototype.handleContextLost = function(t7) {
        t7.preventDefault();
    }, e18.prototype.handleContextRestored = function() {
        this.renderer.runners.contextChange.emit(this.gl);
    }, e18.prototype.destroy = function() {
        var t7 = this.renderer.view;
        t7.removeEventListener("webglcontextlost", this.handleContextLost), t7.removeEventListener("webglcontextrestored", this.handleContextRestored), this.gl.useProgram(null), this.extensions.loseContext && this.extensions.loseContext.loseContext();
    }, e18.prototype.postrender = function() {
        this.renderer.renderingToScreen && this.gl.flush();
    }, e18.prototype.validateContext = function(t7) {
        var e19 = t7.getContextAttributes(), r30 = "WebGL2RenderingContext" in self && t7 instanceof self.WebGL2RenderingContext;
        r30 && (this.webGLVersion = 2), e19.stencil || console.warn("Provided WebGL context does not have a stencil buffer, masks may not render correctly");
        var i24 = r30 || !!t7.getExtension("OES_element_index_uint");
        this.supports.uint32Indices = i24, i24 || console.warn("Provided WebGL context does not support 32 index buffer, complex graphics may not render correctly");
    }, e18;
}(Zr), Ri = function(t1) {
    this.framebuffer = t1, this.stencil = null, this.dirtyId = 0, this.dirtyFormat = 0, this.dirtySize = 0, this.multisample = ee.NONE, this.msaaBuffer = null, this.blitFramebuffer = null;
}, wi = new je, Pi = function(t1) {
    function e18(e19) {
        var r30 = t1.call(this, e19) || this;
        return r30.managedFramebuffers = [], r30.unknownFramebuffer = new Qr(10, 10), r30.msaaSamples = null, r30;
    }
    return Lr(e18, t1), e18.prototype.contextChange = function() {
        var t7 = this.gl = this.renderer.gl;
        if (this.CONTEXT_UID = this.renderer.CONTEXT_UID, this.current = this.unknownFramebuffer, this.viewport = new je, this.hasMRT = !0, this.writeDepthTexture = !0, this.disposeAll(!0), 1 === this.renderer.context.webGLVersion) {
            var e19 = this.renderer.context.extensions.drawBuffers, r30 = this.renderer.context.extensions.depthTexture;
            F.PREFER_ENV === Gt.WEBGL_LEGACY && (e19 = null, r30 = null), e19 ? t7.drawBuffers = function(t8) {
                return e19.drawBuffersWEBGL(t8);
            } : (this.hasMRT = !1, t7.drawBuffers = function() {
            }), r30 || (this.writeDepthTexture = !1);
        } else this.msaaSamples = t7.getInternalformatParameter(t7.RENDERBUFFER, t7.RGBA8, t7.SAMPLES);
    }, e18.prototype.bind = function(t7, e20) {
        var r31 = this.gl;
        if (t7) {
            var i24 = t7.glFramebuffers[this.CONTEXT_UID] || this.initFramebuffer(t7);
            this.current !== t7 && (this.current = t7, r31.bindFramebuffer(r31.FRAMEBUFFER, i24.framebuffer)), i24.dirtyId !== t7.dirtyId && (i24.dirtyId = t7.dirtyId, i24.dirtyFormat !== t7.dirtyFormat ? (i24.dirtyFormat = t7.dirtyFormat, this.updateFramebuffer(t7)) : i24.dirtySize !== t7.dirtySize && (i24.dirtySize = t7.dirtySize, this.resizeFramebuffer(t7)));
            for(var n21 = 0; n21 < t7.colorTextures.length; n21++){
                var o23 = t7.colorTextures[n21];
                this.renderer.texture.unbind(o23.parentTextureArray || o23);
            }
            t7.depthTexture && this.renderer.texture.unbind(t7.depthTexture), e20 ? this.setViewport(e20.x, e20.y, e20.width, e20.height) : this.setViewport(0, 0, t7.width, t7.height);
        } else this.current && (this.current = null, r31.bindFramebuffer(r31.FRAMEBUFFER, null)), e20 ? this.setViewport(e20.x, e20.y, e20.width, e20.height) : this.setViewport(0, 0, this.renderer.width, this.renderer.height);
    }, e18.prototype.setViewport = function(t7, e20, r31, i25) {
        var n22 = this.viewport;
        n22.width === r31 && n22.height === i25 && n22.x === t7 && n22.y === e20 || (n22.x = t7, n22.y = e20, n22.width = r31, n22.height = i25, this.gl.viewport(t7, e20, r31, i25));
    }, Object.defineProperty(e18.prototype, "size", {
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
    }), e18.prototype.clear = function(t7, e20, r31, i25, n22) {
        (void 0) === n22 && (n22 = kt.COLOR | kt.DEPTH);
        var o24 = this.gl;
        o24.clearColor(t7, e20, r31, i25), o24.clear(n22);
    }, e18.prototype.initFramebuffer = function(t7) {
        var e20 = this.gl, r31 = new Ri(e20.createFramebuffer());
        return r31.multisample = this.detectSamples(t7.multisample), t7.glFramebuffers[this.CONTEXT_UID] = r31, this.managedFramebuffers.push(t7), t7.disposeRunner.add(this), r31;
    }, e18.prototype.resizeFramebuffer = function(t7) {
        var e20 = this.gl, r31 = t7.glFramebuffers[this.CONTEXT_UID];
        r31.stencil && (e20.bindRenderbuffer(e20.RENDERBUFFER, r31.stencil), e20.renderbufferStorage(e20.RENDERBUFFER, e20.DEPTH_STENCIL, t7.width, t7.height));
        for(var i25 = t7.colorTextures, n22 = 0; n22 < i25.length; n22++)this.renderer.texture.bind(i25[n22], 0);
        t7.depthTexture && this.renderer.texture.bind(t7.depthTexture, 0);
    }, e18.prototype.updateFramebuffer = function(t7) {
        var e20 = this.gl, r31 = t7.glFramebuffers[this.CONTEXT_UID], i25 = t7.colorTextures.length;
        e20.drawBuffers || (i25 = Math.min(i25, 1)), r31.multisample > 1 && (r31.msaaBuffer = e20.createRenderbuffer(), e20.bindRenderbuffer(e20.RENDERBUFFER, r31.msaaBuffer), e20.renderbufferStorageMultisample(e20.RENDERBUFFER, r31.multisample, e20.RGBA8, t7.width, t7.height), e20.framebufferRenderbuffer(e20.FRAMEBUFFER, e20.COLOR_ATTACHMENT0, e20.RENDERBUFFER, r31.msaaBuffer));
        for(var n22 = [], o24 = 0; o24 < i25; o24++)if (!(0 === o24 && r31.multisample > 1)) {
            var s21 = t7.colorTextures[o24], a21 = s21.parentTextureArray || s21;
            this.renderer.texture.bind(a21, 0), e20.framebufferTexture2D(e20.FRAMEBUFFER, e20.COLOR_ATTACHMENT0 + o24, s21.target, a21._glTextures[this.CONTEXT_UID].texture, 0), n22.push(e20.COLOR_ATTACHMENT0 + o24);
        }
        if (n22.length > 1 && e20.drawBuffers(n22), t7.depthTexture && this.writeDepthTexture) {
            var h21 = t7.depthTexture;
            this.renderer.texture.bind(h21, 0), e20.framebufferTexture2D(e20.FRAMEBUFFER, e20.DEPTH_ATTACHMENT, e20.TEXTURE_2D, h21._glTextures[this.CONTEXT_UID].texture, 0);
        }
        r31.stencil || !t7.stencil && !t7.depth || (r31.stencil = e20.createRenderbuffer(), e20.bindRenderbuffer(e20.RENDERBUFFER, r31.stencil), e20.renderbufferStorage(e20.RENDERBUFFER, e20.DEPTH_STENCIL, t7.width, t7.height), t7.depthTexture || e20.framebufferRenderbuffer(e20.FRAMEBUFFER, e20.DEPTH_STENCIL_ATTACHMENT, e20.RENDERBUFFER, r31.stencil));
    }, e18.prototype.detectSamples = function(t7) {
        var e20 = this.msaaSamples, r31 = ee.NONE;
        if (t7 <= 1 || null === e20) return r31;
        for(var i25 = 0; i25 < e20.length; i25++)if (e20[i25] <= t7) {
            r31 = e20[i25];
            break;
        }
        return 1 === r31 && (r31 = ee.NONE), r31;
    }, e18.prototype.blit = function(t7, e20, r31) {
        var i25 = this.current, n22 = this.renderer, o24 = this.gl, s22 = this.CONTEXT_UID;
        if (2 === n22.context.webGLVersion && i25) {
            var a22 = i25.glFramebuffers[s22];
            if (a22) {
                if (!t7) {
                    if (a22.multisample <= 1) return;
                    a22.blitFramebuffer || (a22.blitFramebuffer = new Qr(i25.width, i25.height), a22.blitFramebuffer.addColorTexture(0, i25.colorTextures[0])), (t7 = a22.blitFramebuffer).width = i25.width, t7.height = i25.height;
                }
                e20 || ((e20 = wi).width = i25.width, e20.height = i25.height), r31 || (r31 = e20);
                var h22 = e20.width === r31.width && e20.height === r31.height;
                this.bind(t7), o24.bindFramebuffer(o24.READ_FRAMEBUFFER, a22.framebuffer), o24.blitFramebuffer(e20.x, e20.y, e20.width, e20.height, r31.x, r31.y, r31.width, r31.height, o24.COLOR_BUFFER_BIT, h22 ? o24.NEAREST : o24.LINEAR);
            }
        }
    }, e18.prototype.disposeFramebuffer = function(t7, e20) {
        var r31 = t7.glFramebuffers[this.CONTEXT_UID], i25 = this.gl;
        if (r31) {
            delete t7.glFramebuffers[this.CONTEXT_UID];
            var n22 = this.managedFramebuffers.indexOf(t7);
            n22 >= 0 && this.managedFramebuffers.splice(n22, 1), t7.disposeRunner.remove(this), e20 || (i25.deleteFramebuffer(r31.framebuffer), r31.stencil && i25.deleteRenderbuffer(r31.stencil));
        }
    }, e18.prototype.disposeAll = function(t7) {
        var e20 = this.managedFramebuffers;
        this.managedFramebuffers = [];
        for(var r31 = 0; r31 < e20.length; r31++)this.disposeFramebuffer(e20[r31], t7);
    }, e18.prototype.forceStencil = function() {
        var t7 = this.current;
        if (t7) {
            var e20 = t7.glFramebuffers[this.CONTEXT_UID];
            if (e20 && !e20.stencil) {
                t7.enableStencil();
                var r31 = t7.width, i25 = t7.height, n23 = this.gl, o24 = n23.createRenderbuffer();
                n23.bindRenderbuffer(n23.RENDERBUFFER, o24), n23.renderbufferStorage(n23.RENDERBUFFER, n23.DEPTH_STENCIL, r31, i25), e20.stencil = o24, n23.framebufferRenderbuffer(n23.FRAMEBUFFER, n23.DEPTH_STENCIL_ATTACHMENT, n23.RENDERBUFFER, o24);
            }
        }
    }, e18.prototype.reset = function() {
        this.current = this.unknownFramebuffer, this.viewport = new je;
    }, e18;
}(Zr), Ii = function(t1) {
    this.buffer = t1 || null, this.updateID = -1, this.byteLength = -1, this.refCount = 0;
}, Mi = {
    5126: 4,
    5123: 2,
    5121: 1
}, Di = function(t1) {
    function e18(e21) {
        var r32 = t1.call(this, e21) || this;
        return r32._activeGeometry = null, r32._activeVao = null, r32.hasVao = !0, r32.hasInstance = !0, r32.canUseUInt32ElementIndex = !1, r32.managedGeometries = {
        }, r32.managedBuffers = {
        }, r32;
    }
    return Lr(e18, t1), e18.prototype.contextChange = function() {
        this.disposeAll(!0);
        var t7 = this.gl = this.renderer.gl, e21 = this.renderer.context;
        if (this.CONTEXT_UID = this.renderer.CONTEXT_UID, 2 !== e21.webGLVersion) {
            var r32 = this.renderer.context.extensions.vertexArrayObject;
            F.PREFER_ENV === Gt.WEBGL_LEGACY && (r32 = null), r32 ? (t7.createVertexArray = function() {
                return r32.createVertexArrayOES();
            }, t7.bindVertexArray = function(t8) {
                return r32.bindVertexArrayOES(t8);
            }, t7.deleteVertexArray = function(t8) {
                return r32.deleteVertexArrayOES(t8);
            }) : (this.hasVao = !1, t7.createVertexArray = function() {
                return null;
            }, t7.bindVertexArray = function() {
                return null;
            }, t7.deleteVertexArray = function() {
                return null;
            });
        }
        if (2 !== e21.webGLVersion) {
            var i26 = t7.getExtension("ANGLE_instanced_arrays");
            i26 ? (t7.vertexAttribDivisor = function(t8, e22) {
                return i26.vertexAttribDivisorANGLE(t8, e22);
            }, t7.drawElementsInstanced = function(t8, e22, r33, n24, o25) {
                return i26.drawElementsInstancedANGLE(t8, e22, r33, n24, o25);
            }, t7.drawArraysInstanced = function(t8, e22, r33, n24) {
                return i26.drawArraysInstancedANGLE(t8, e22, r33, n24);
            }) : this.hasInstance = !1;
        }
        this.canUseUInt32ElementIndex = 2 === e21.webGLVersion || !!e21.extensions.uint32ElementIndex;
    }, e18.prototype.bind = function(t7, e21) {
        e21 = e21 || this.renderer.shader.shader;
        var r33 = this.gl, i27 = t7.glVertexArrayObjects[this.CONTEXT_UID], n24 = !1;
        i27 || (this.managedGeometries[t7.id] = t7, t7.disposeRunner.add(this), t7.glVertexArrayObjects[this.CONTEXT_UID] = i27 = {
        }, n24 = !0);
        var o25 = i27[e21.program.id] || this.initGeometryVao(t7, e21.program, n24);
        this._activeGeometry = t7, this._activeVao !== o25 && (this._activeVao = o25, this.hasVao ? r33.bindVertexArray(o25) : this.activateVao(t7, e21.program)), this.updateBuffers();
    }, e18.prototype.reset = function() {
        this.unbind();
    }, e18.prototype.updateBuffers = function() {
        for(var t7 = this._activeGeometry, e21 = this.gl, r33 = 0; r33 < t7.buffers.length; r33++){
            var i27 = t7.buffers[r33], n24 = i27._glBuffers[this.CONTEXT_UID];
            if (i27._updateID !== n24.updateID) {
                n24.updateID = i27._updateID;
                var o25 = i27.index ? e21.ELEMENT_ARRAY_BUFFER : e21.ARRAY_BUFFER;
                if (e21.bindBuffer(o25, n24.buffer), this._boundBuffer = n24, n24.byteLength >= i27.data.byteLength) e21.bufferSubData(o25, 0, i27.data);
                else {
                    var s22 = i27.static ? e21.STATIC_DRAW : e21.DYNAMIC_DRAW;
                    n24.byteLength = i27.data.byteLength, e21.bufferData(o25, i27.data, s22);
                }
            }
        }
    }, e18.prototype.checkCompatibility = function(t7, e21) {
        var r33 = t7.attributes, i28 = e21.attributeData;
        for(var n25 in i28)if (!r33[n25]) throw new Error('shader and geometry incompatible, geometry missing the "' + n25 + '" attribute');
    }, e18.prototype.getSignature = function(t7, e21) {
        var r33 = t7.attributes, i28 = e21.attributeData, n25 = [
            "g",
            t7.id
        ];
        for(var o26 in r33)i28[o26] && n25.push(o26);
        return n25.join("-");
    }, e18.prototype.initGeometryVao = function(t7, e21, r33) {
        (void 0) === r33 && (r33 = !0), this.checkCompatibility(t7, e21);
        var i28 = this.gl, n25 = this.CONTEXT_UID, o26 = this.getSignature(t7, e21), s23 = t7.glVertexArrayObjects[this.CONTEXT_UID], a23 = s23[o26];
        if (a23) return s23[e21.id] = a23, a23;
        var h23 = t7.buffers, u23 = t7.attributes, l16 = {
        }, c15 = {
        };
        for(var d14 in h23)l16[d14] = 0, c15[d14] = 0;
        for(var d14 in u23)!u23[d14].size && e21.attributeData[d14] ? u23[d14].size = e21.attributeData[d14].size : u23[d14].size || console.warn("PIXI Geometry attribute '" + d14 + "' size cannot be determined (likely the bound shader does not have the attribute)"), l16[u23[d14].buffer] += u23[d14].size * Mi[u23[d14].type];
        for(var d14 in u23){
            var f9 = u23[d14], p = f9.size;
            (void 0) === f9.stride && (l16[f9.buffer] === p * Mi[f9.type] ? f9.stride = 0 : f9.stride = l16[f9.buffer]), (void 0) === f9.start && (f9.start = c15[f9.buffer], c15[f9.buffer] += p * Mi[f9.type]);
        }
        a23 = i28.createVertexArray(), i28.bindVertexArray(a23);
        for(var _4 = 0; _4 < h23.length; _4++){
            var m3 = h23[_4];
            m3._glBuffers[n25] || (m3._glBuffers[n25] = new Ii(i28.createBuffer()), this.managedBuffers[m3.id] = m3, m3.disposeRunner.add(this)), r33 && m3._glBuffers[n25].refCount++;
        }
        return this.activateVao(t7, e21), this._activeVao = a23, s23[e21.id] = a23, s23[o26] = a23, a23;
    }, e18.prototype.disposeBuffer = function(t7, e21) {
        if (this.managedBuffers[t7.id]) {
            delete this.managedBuffers[t7.id];
            var r33 = t7._glBuffers[this.CONTEXT_UID], i28 = this.gl;
            t7.disposeRunner.remove(this), r33 && (e21 || i28.deleteBuffer(r33.buffer), delete t7._glBuffers[this.CONTEXT_UID]);
        }
    }, e18.prototype.disposeGeometry = function(t7, e21) {
        if (this.managedGeometries[t7.id]) {
            delete this.managedGeometries[t7.id];
            var r34 = t7.glVertexArrayObjects[this.CONTEXT_UID], i29 = this.gl, n25 = t7.buffers;
            if (t7.disposeRunner.remove(this), r34) {
                for(var o26 = 0; o26 < n25.length; o26++){
                    var s23 = n25[o26]._glBuffers[this.CONTEXT_UID];
                    s23.refCount--, 0 !== s23.refCount || e21 || this.disposeBuffer(n25[o26], e21);
                }
                if (!e21) for(var a23 in r34)if ("g" === a23[0]) {
                    var h23 = r34[a23];
                    this._activeVao === h23 && this.unbind(), i29.deleteVertexArray(h23);
                }
                delete t7.glVertexArrayObjects[this.CONTEXT_UID];
            }
        }
    }, e18.prototype.disposeAll = function(t7) {
        for(var e21 = Object.keys(this.managedGeometries), r35 = 0; r35 < e21.length; r35++)this.disposeGeometry(this.managedGeometries[e21[r35]], t7);
        for(e21 = Object.keys(this.managedBuffers), r35 = 0; r35 < e21.length; r35++)this.disposeBuffer(this.managedBuffers[e21[r35]], t7);
    }, e18.prototype.activateVao = function(t7, e21) {
        var r35 = this.gl, i30 = this.CONTEXT_UID, n26 = t7.buffers, o27 = t7.attributes;
        t7.indexBuffer && r35.bindBuffer(r35.ELEMENT_ARRAY_BUFFER, t7.indexBuffer._glBuffers[i30].buffer);
        var s24 = null;
        for(var a24 in o27){
            var h24 = o27[a24], u23 = n26[h24.buffer]._glBuffers[i30];
            if (e21.attributeData[a24]) {
                s24 !== u23 && (r35.bindBuffer(r35.ARRAY_BUFFER, u23.buffer), s24 = u23);
                var l16 = e21.attributeData[a24].location;
                if (r35.enableVertexAttribArray(l16), r35.vertexAttribPointer(l16, h24.size, h24.type || r35.FLOAT, h24.normalized, h24.stride, h24.start), h24.instance) {
                    if (!this.hasInstance) throw new Error("geometry error, GPU Instancing is not supported on this device");
                    r35.vertexAttribDivisor(l16, 1);
                }
            }
        }
    }, e18.prototype.draw = function(t7, e21, r35, i30) {
        var n26 = this.gl, o27 = this._activeGeometry;
        if (o27.indexBuffer) {
            var s24 = o27.indexBuffer.data.BYTES_PER_ELEMENT, a24 = 2 === s24 ? n26.UNSIGNED_SHORT : n26.UNSIGNED_INT;
            2 === s24 || 4 === s24 && this.canUseUInt32ElementIndex ? o27.instanced ? n26.drawElementsInstanced(t7, e21 || o27.indexBuffer.data.length, a24, (r35 || 0) * s24, i30 || 1) : n26.drawElements(t7, e21 || o27.indexBuffer.data.length, a24, (r35 || 0) * s24) : console.warn("unsupported index buffer type: uint32");
        } else o27.instanced ? n26.drawArraysInstanced(t7, r35, e21 || o27.getSize(), i30 || 1) : n26.drawArrays(t7, r35, e21 || o27.getSize());
        return this;
    }, e18.prototype.unbind = function() {
        this.gl.bindVertexArray(null), this._activeVao = null, this._activeGeometry = null;
    }, e18;
}(Zr), Ci = function() {
    function t1(t7) {
        (void 0) === t7 && (t7 = null), this.type = te.NONE, this.autoDetect = !0, this.maskObject = t7 || null, this.pooled = !1, this.isMaskData = !0, this._stencilCounter = 0, this._scissorCounter = 0, this._scissorRect = null, this._target = null;
    }
    return t1.prototype.reset = function() {
        this.pooled && (this.maskObject = null, this.type = te.NONE, this.autoDetect = !0), this._target = null;
    }, t1.prototype.copyCountersOrReset = function(t7) {
        t7 ? (this._stencilCounter = t7._stencilCounter, this._scissorCounter = t7._scissorCounter, this._scissorRect = t7._scissorRect) : (this._stencilCounter = 0, this._scissorCounter = 0, this._scissorRect = null);
    }, t1;
}();
function Ni(t1, e18, r35) {
    var i30 = t1.createShader(e18);
    return t1.shaderSource(i30, r35), t1.compileShader(i30), i30;
}
function Li(t1, e18, r35, i30) {
    var n26 = Ni(t1, t1.VERTEX_SHADER, e18), o27 = Ni(t1, t1.FRAGMENT_SHADER, r35), s25 = t1.createProgram();
    if (t1.attachShader(s25, n26), t1.attachShader(s25, o27), i30) for(var a25 in i30)t1.bindAttribLocation(s25, i30[a25], a25);
    return t1.linkProgram(s25), t1.getProgramParameter(s25, t1.LINK_STATUS) || (t1.getShaderParameter(n26, t1.COMPILE_STATUS) || (console.warn(e18), console.error(t1.getShaderInfoLog(n26))), t1.getShaderParameter(o27, t1.COMPILE_STATUS) || (console.warn(r35), console.error(t1.getShaderInfoLog(o27))), console.error("Pixi.js Error: Could not initialize shader."), console.error("gl.VALIDATE_STATUS", t1.getProgramParameter(s25, t1.VALIDATE_STATUS)), console.error("gl.getError()", t1.getError()), "" !== t1.getProgramInfoLog(s25) && console.warn("Pixi.js Warning: gl.getProgramInfoLog()", t1.getProgramInfoLog(s25)), t1.deleteProgram(s25), s25 = null), t1.deleteShader(n26), t1.deleteShader(o27), s25;
}
function Fi(t1) {
    for(var e18 = new Array(t1), r35 = 0; r35 < e18.length; r35++)e18[r35] = !1;
    return e18;
}
function Bi(t1, e18) {
    switch(t1){
        case "float":
            return 0;
        case "vec2":
            return new Float32Array(2 * e18);
        case "vec3":
            return new Float32Array(3 * e18);
        case "vec4":
            return new Float32Array(4 * e18);
        case "int":
        case "uint":
        case "sampler2D":
        case "sampler2DArray":
            return 0;
        case "ivec2":
            return new Int32Array(2 * e18);
        case "ivec3":
            return new Int32Array(3 * e18);
        case "ivec4":
            return new Int32Array(4 * e18);
        case "uvec2":
            return new Uint32Array(2 * e18);
        case "uvec3":
            return new Uint32Array(3 * e18);
        case "uvec4":
            return new Uint32Array(4 * e18);
        case "bool":
            return !1;
        case "bvec2":
            return Fi(2 * e18);
        case "bvec3":
            return Fi(3 * e18);
        case "bvec4":
            return Fi(4 * e18);
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
var Ui, Gi = {
}, Xi = Gi;
function ki() {
    if (Xi === Gi || Xi && Xi.isContextLost()) {
        var t1 = document.createElement("canvas"), e18 = void 0;
        F.PREFER_ENV >= Gt.WEBGL2 && (e18 = t1.getContext("webgl2", {
        })), e18 || ((e18 = t1.getContext("webgl", {
        }) || t1.getContext("experimental-webgl", {
        })) ? e18.getExtension("WEBGL_draw_buffers") : e18 = null), Xi = e18;
    }
    return Xi;
}
function ji(t7, e21, r35) {
    if ("precision" !== t7.substring(0, 9)) {
        var i30 = e21;
        return e21 === $t.HIGH && r35 !== $t.HIGH && (i30 = $t.MEDIUM), "precision " + i30 + " float;\n" + t7;
    }
    return r35 !== $t.HIGH && "precision highp" === t7.substring(0, 15) ? t7.replace("precision highp", "precision mediump") : t7;
}
var Hi = {
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
function Yi(t7) {
    return Hi[t7];
}
var Vi = null, zi = {
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
function Wi(t7, e21) {
    if (!Vi) {
        var r35 = Object.keys(zi);
        Vi = {
        };
        for(var i31 = 0; i31 < r35.length; ++i31){
            var n26 = r35[i31];
            Vi[t7[n26]] = zi[n26];
        }
    }
    return Vi[e21];
}
var qi, Ki = [
    {
        test: function(t7) {
            return "float" === t7.type && 1 === t7.size;
        },
        code: function(t7) {
            return '\n            if(uv["' + t7 + '"] !== ud["' + t7 + '"].value)\n            {\n                ud["' + t7 + '"].value = uv["' + t7 + '"]\n                gl.uniform1f(ud["' + t7 + '"].location, uv["' + t7 + '"])\n            }\n            ';
        }
    },
    {
        test: function(t7) {
            return ("sampler2D" === t7.type || "samplerCube" === t7.type || "sampler2DArray" === t7.type) && 1 === t7.size && !t7.isArray;
        },
        code: function(t7) {
            return 't = syncData.textureCount++;\n\n            renderer.texture.bind(uv["' + t7 + '"], t);\n\n            if(ud["' + t7 + '"].value !== t)\n            {\n                ud["' + t7 + '"].value = t;\n                gl.uniform1i(ud["' + t7 + '"].location, t);\n; // eslint-disable-line max-len\n            }';
        }
    },
    {
        test: function(t7, e21) {
            return "mat3" === t7.type && 1 === t7.size && (void 0) !== e21.a;
        },
        code: function(t7) {
            return '\n            gl.uniformMatrix3fv(ud["' + t7 + '"].location, false, uv["' + t7 + '"].toArray(true));\n            ';
        }
    },
    {
        test: function(t7, e21) {
            return "vec2" === t7.type && 1 === t7.size && (void 0) !== e21.x;
        },
        code: function(t7) {
            return '\n                cv = ud["' + t7 + '"].value;\n                v = uv["' + t7 + '"];\n\n                if(cv[0] !== v.x || cv[1] !== v.y)\n                {\n                    cv[0] = v.x;\n                    cv[1] = v.y;\n                    gl.uniform2f(ud["' + t7 + '"].location, v.x, v.y);\n                }';
        }
    },
    {
        test: function(t7) {
            return "vec2" === t7.type && 1 === t7.size;
        },
        code: function(t7) {
            return '\n                cv = ud["' + t7 + '"].value;\n                v = uv["' + t7 + '"];\n\n                if(cv[0] !== v[0] || cv[1] !== v[1])\n                {\n                    cv[0] = v[0];\n                    cv[1] = v[1];\n                    gl.uniform2f(ud["' + t7 + '"].location, v[0], v[1]);\n                }\n            ';
        }
    },
    {
        test: function(t7, e21) {
            return "vec4" === t7.type && 1 === t7.size && (void 0) !== e21.width;
        },
        code: function(t7) {
            return '\n                cv = ud["' + t7 + '"].value;\n                v = uv["' + t7 + '"];\n\n                if(cv[0] !== v.x || cv[1] !== v.y || cv[2] !== v.width || cv[3] !== v.height)\n                {\n                    cv[0] = v.x;\n                    cv[1] = v.y;\n                    cv[2] = v.width;\n                    cv[3] = v.height;\n                    gl.uniform4f(ud["' + t7 + '"].location, v.x, v.y, v.width, v.height)\n                }';
        }
    },
    {
        test: function(t7) {
            return "vec4" === t7.type && 1 === t7.size;
        },
        code: function(t7) {
            return '\n                cv = ud["' + t7 + '"].value;\n                v = uv["' + t7 + '"];\n\n                if(cv[0] !== v[0] || cv[1] !== v[1] || cv[2] !== v[2] || cv[3] !== v[3])\n                {\n                    cv[0] = v[0];\n                    cv[1] = v[1];\n                    cv[2] = v[2];\n                    cv[3] = v[3];\n\n                    gl.uniform4f(ud["' + t7 + '"].location, v[0], v[1], v[2], v[3])\n                }';
        }
    }
], Zi = {
    float: "\n    if(cv !== v)\n    {\n        cv.v = v;\n        gl.uniform1f(location, v)\n    }",
    vec2: "\n    if(cv[0] !== v[0] || cv[1] !== v[1])\n    {\n        cv[0] = v[0];\n        cv[1] = v[1];\n        gl.uniform2f(location, v[0], v[1])\n    }",
    vec3: "\n    if(cv[0] !== v[0] || cv[1] !== v[1] || cv[2] !== v[2])\n    {\n        cv[0] = v[0];\n        cv[1] = v[1];\n        cv[2] = v[2];\n\n        gl.uniform3f(location, v[0], v[1], v[2])\n    }",
    vec4: "gl.uniform4f(location, v[0], v[1], v[2], v[3])",
    int: "gl.uniform1i(location, v)",
    ivec2: "gl.uniform2i(location, v[0], v[1])",
    ivec3: "gl.uniform3i(location, v[0], v[1], v[2])",
    ivec4: "gl.uniform4i(location, v[0], v[1], v[2], v[3])",
    uint: "gl.uniform1ui(location, v)",
    uvec2: "gl.uniform2ui(location, v[0], v[1])",
    uvec3: "gl.uniform3ui(location, v[0], v[1], v[2])",
    uvec4: "gl.uniform4ui(location, v[0], v[1], v[2], v[3])",
    bool: "gl.uniform1i(location, v)",
    bvec2: "gl.uniform2i(location, v[0], v[1])",
    bvec3: "gl.uniform3i(location, v[0], v[1], v[2])",
    bvec4: "gl.uniform4i(location, v[0], v[1], v[2], v[3])",
    mat2: "gl.uniformMatrix2fv(location, false, v)",
    mat3: "gl.uniformMatrix3fv(location, false, v)",
    mat4: "gl.uniformMatrix4fv(location, false, v)",
    sampler2D: "gl.uniform1i(location, v)",
    samplerCube: "gl.uniform1i(location, v)",
    sampler2DArray: "gl.uniform1i(location, v)"
}, Ji = {
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
}, Qi = [
    "precision mediump float;",
    "void main(void){",
    "float test = 0.1;",
    "%forloop%",
    "gl_FragColor = vec4(0.0);",
    "}"
].join("\n");
function $i(t7) {
    for(var e21 = "", r36 = 0; r36 < t7; ++r36)r36 > 0 && (e21 += "\nelse "), r36 < t7 - 1 && (e21 += "if(test == " + r36 + ".0){}");
    return e21;
}
function tn(t7, e21) {
    if (0 === t7) throw new Error("Invalid value of `0` passed to `checkMaxIfStatementsInShader`");
    for(var r36 = e21.createShader(e21.FRAGMENT_SHADER);;){
        var i32 = Qi.replace(/%forloop%/gi, $i(t7));
        if (e21.shaderSource(r36, i32), e21.compileShader(r36), e21.getShaderParameter(r36, e21.COMPILE_STATUS)) break;
        t7 = t7 / 2 | 0;
    }
    return t7;
}
var en = 0, rn = {
}, nn = function() {
    function t7(e21, r36, i33) {
        (void 0) === i33 && (i33 = "pixi-shader"), this.id = en++, this.vertexSrc = e21 || t7.defaultVertexSrc, this.fragmentSrc = r36 || t7.defaultFragmentSrc, this.vertexSrc = this.vertexSrc.trim(), this.fragmentSrc = this.fragmentSrc.trim(), "#version" !== this.vertexSrc.substring(0, 8) && (i33 = i33.replace(/\s+/g, "-"), rn[i33] ? (rn[i33]++, i33 += "-" + rn[i33]) : rn[i33] = 1, this.vertexSrc = "#define SHADER_NAME " + i33 + "\n" + this.vertexSrc, this.fragmentSrc = "#define SHADER_NAME " + i33 + "\n" + this.fragmentSrc, this.vertexSrc = ji(this.vertexSrc, F.PRECISION_VERTEX, $t.HIGH), this.fragmentSrc = ji(this.fragmentSrc, F.PRECISION_FRAGMENT, function() {
            if (!Ui) {
                Ui = $t.MEDIUM;
                var t8 = ki();
                if (t8 && t8.getShaderPrecisionFormat) {
                    var e22 = t8.getShaderPrecisionFormat(t8.FRAGMENT_SHADER, t8.HIGH_FLOAT);
                    Ui = e22.precision ? $t.HIGH : $t.MEDIUM;
                }
            }
            return Ui;
        }())), this.extractData(this.vertexSrc, this.fragmentSrc), this.glPrograms = {
        }, this.syncUniforms = null;
    }
    return t7.prototype.extractData = function(t9, e21) {
        var r36 = ki();
        if (r36) {
            var i33 = Li(r36, t9, e21);
            this.attributeData = this.getAttributeData(i33, r36), this.uniformData = this.getUniformData(i33, r36), r36.deleteProgram(i33);
        } else this.uniformData = {
        }, this.attributeData = {
        };
    }, t7.prototype.getAttributeData = function(t9, e21) {
        for(var r36 = {
        }, i34 = [], n27 = e21.getProgramParameter(t9, e21.ACTIVE_ATTRIBUTES), o27 = 0; o27 < n27; o27++){
            var s25 = e21.getActiveAttrib(t9, o27), a25 = Wi(e21, s25.type), h25 = {
                type: a25,
                name: s25.name,
                size: Yi(a25),
                location: 0
            };
            r36[s25.name] = h25, i34.push(h25);
        }
        for(i34.sort(function(t10, e23) {
            return t10.name > e23.name ? 1 : -1;
        }), o27 = 0; o27 < i34.length; o27++)i34[o27].location = o27;
        return r36;
    }, t7.prototype.getUniformData = function(t9, e21) {
        for(var r36 = {
        }, i34 = e21.getProgramParameter(t9, e21.ACTIVE_UNIFORMS), n27 = 0; n27 < i34; n27++){
            var o27 = e21.getActiveUniform(t9, n27), s26 = o27.name.replace(/\[.*?\]$/, ""), a26 = o27.name.match(/\[.*?\]$/), h26 = Wi(e21, o27.type);
            r36[s26] = {
                type: h26,
                size: o27.size,
                isArray: a26,
                value: Bi(h26, o27.size)
            };
        }
        return r36;
    }, Object.defineProperty(t7, "defaultVertexSrc", {
        get: function() {
            return "attribute vec2 aVertexPosition;\nattribute vec2 aTextureCoord;\n\nuniform mat3 projectionMatrix;\n\nvarying vec2 vTextureCoord;\n\nvoid main(void){\n   gl_Position = vec4((projectionMatrix * vec3(aVertexPosition, 1.0)).xy, 0.0, 1.0);\n   vTextureCoord = aTextureCoord;\n}\n";
        },
        enumerable: !1,
        configurable: !0
    }), Object.defineProperty(t7, "defaultFragmentSrc", {
        get: function() {
            return "varying vec2 vTextureCoord;\n\nuniform sampler2D uSampler;\n\nvoid main(void){\n   gl_FragColor *= texture2D(uSampler, vTextureCoord);\n}";
        },
        enumerable: !1,
        configurable: !0
    }), t7.from = function(e21, r36, i34) {
        var n27 = e21 + r36, o28 = we[n27];
        return o28 || (we[n27] = o28 = new t7(e21, r36, i34)), o28;
    }, t7;
}(), on = function() {
    function t7(t9, e21) {
        for(var r36 in this.program = t9, this.uniformGroup = e21 ? e21 instanceof yi ? e21 : new yi(e21) : new yi({
        }), t9.uniformData)this.uniformGroup.uniforms[r36] instanceof Array && (this.uniformGroup.uniforms[r36] = new Float32Array(this.uniformGroup.uniforms[r36]));
    }
    return t7.prototype.checkUniformExists = function(t9, e21) {
        if (e21.uniforms[t9]) return !0;
        for(var r36 in e21.uniforms){
            var i34 = e21.uniforms[r36];
            if (i34.group && this.checkUniformExists(t9, i34)) return !0;
        }
        return !1;
    }, t7.prototype.destroy = function() {
        this.uniformGroup = null;
    }, Object.defineProperty(t7.prototype, "uniforms", {
        get: function() {
            return this.uniformGroup.uniforms;
        },
        enumerable: !1,
        configurable: !0
    }), t7.from = function(e21, r36, i35) {
        return new t7(nn.from(e21, r36), i35);
    }, t7;
}(), sn = function() {
    function t7() {
        this.data = 0, this.blendMode = jt.NORMAL, this.polygonOffset = 0, this.blend = !0, this.depthMask = !0;
    }
    return Object.defineProperty(t7.prototype, "blend", {
        get: function() {
            return !!(1 & this.data);
        },
        set: function(t9) {
            !!(1 & this.data) !== t9 && (this.data ^= 1);
        },
        enumerable: !1,
        configurable: !0
    }), Object.defineProperty(t7.prototype, "offsets", {
        get: function() {
            return !!(2 & this.data);
        },
        set: function(t9) {
            !!(2 & this.data) !== t9 && (this.data ^= 2);
        },
        enumerable: !1,
        configurable: !0
    }), Object.defineProperty(t7.prototype, "culling", {
        get: function() {
            return !!(4 & this.data);
        },
        set: function(t9) {
            !!(4 & this.data) !== t9 && (this.data ^= 4);
        },
        enumerable: !1,
        configurable: !0
    }), Object.defineProperty(t7.prototype, "depthTest", {
        get: function() {
            return !!(8 & this.data);
        },
        set: function(t9) {
            !!(8 & this.data) !== t9 && (this.data ^= 8);
        },
        enumerable: !1,
        configurable: !0
    }), Object.defineProperty(t7.prototype, "depthMask", {
        get: function() {
            return !!(32 & this.data);
        },
        set: function(t9) {
            !!(32 & this.data) !== t9 && (this.data ^= 32);
        },
        enumerable: !1,
        configurable: !0
    }), Object.defineProperty(t7.prototype, "clockwiseFrontFace", {
        get: function() {
            return !!(16 & this.data);
        },
        set: function(t9) {
            !!(16 & this.data) !== t9 && (this.data ^= 16);
        },
        enumerable: !1,
        configurable: !0
    }), Object.defineProperty(t7.prototype, "blendMode", {
        get: function() {
            return this._blendMode;
        },
        set: function(t9) {
            this.blend = t9 !== jt.NONE, this._blendMode = t9;
        },
        enumerable: !1,
        configurable: !0
    }), Object.defineProperty(t7.prototype, "polygonOffset", {
        get: function() {
            return this._polygonOffset;
        },
        set: function(t9) {
            this.offsets = !!t9, this._polygonOffset = t9;
        },
        enumerable: !1,
        configurable: !0
    }), t7.for2d = function() {
        var e21 = new t7;
        return e21.depthTest = !1, e21.blend = !0, e21;
    }, t7;
}(), an = function(t7) {
    function e21(r36, i35, n27) {
        var o28 = this, s27 = nn.from(r36 || e21.defaultVertexSrc, i35 || e21.defaultFragmentSrc);
        return (o28 = t7.call(this, s27, n27) || this).padding = 0, o28.resolution = F.FILTER_RESOLUTION, o28.enabled = !0, o28.autoFit = !0, o28.legacy = !!o28.program.attributeData.aTextureCoord, o28.state = new sn, o28;
    }
    return Lr(e21, t7), e21.prototype.apply = function(t9, e23, r36, i35, n27) {
        t9.applyFilter(this, e23, r36, i35);
    }, Object.defineProperty(e21.prototype, "blendMode", {
        get: function() {
            return this.state.blendMode;
        },
        set: function(t9) {
            this.state.blendMode = t9;
        },
        enumerable: !1,
        configurable: !0
    }), Object.defineProperty(e21, "defaultVertexSrc", {
        get: function() {
            return "attribute vec2 aVertexPosition;\n\nuniform mat3 projectionMatrix;\n\nvarying vec2 vTextureCoord;\n\nuniform vec4 inputSize;\nuniform vec4 outputFrame;\n\nvec4 filterVertexPosition( void )\n{\n    vec2 position = aVertexPosition * max(outputFrame.zw, vec2(0.)) + outputFrame.xy;\n\n    return vec4((projectionMatrix * vec3(position, 1.0)).xy, 0.0, 1.0);\n}\n\nvec2 filterTextureCoord( void )\n{\n    return aVertexPosition * (outputFrame.zw * inputSize.zw);\n}\n\nvoid main(void)\n{\n    gl_Position = filterVertexPosition();\n    vTextureCoord = filterTextureCoord();\n}\n";
        },
        enumerable: !1,
        configurable: !0
    }), Object.defineProperty(e21, "defaultFragmentSrc", {
        get: function() {
            return "varying vec2 vTextureCoord;\n\nuniform sampler2D uSampler;\n\nvoid main(void){\n   gl_FragColor = texture2D(uSampler, vTextureCoord);\n}\n";
        },
        enumerable: !1,
        configurable: !0
    }), e21;
}(on), hn = "attribute vec2 aVertexPosition;\nattribute vec2 aTextureCoord;\n\nuniform mat3 projectionMatrix;\nuniform mat3 otherMatrix;\n\nvarying vec2 vMaskCoord;\nvarying vec2 vTextureCoord;\n\nvoid main(void)\n{\n    gl_Position = vec4((projectionMatrix * vec3(aVertexPosition, 1.0)).xy, 0.0, 1.0);\n\n    vTextureCoord = aTextureCoord;\n    vMaskCoord = ( otherMatrix * vec3( aTextureCoord, 1.0)  ).xy;\n}\n", un = "varying vec2 vMaskCoord;\nvarying vec2 vTextureCoord;\n\nuniform sampler2D uSampler;\nuniform sampler2D mask;\nuniform float alpha;\nuniform float npmAlpha;\nuniform vec4 maskClamp;\n\nvoid main(void)\n{\n    float clip = step(3.5,\n        step(maskClamp.x, vMaskCoord.x) +\n        step(maskClamp.y, vMaskCoord.y) +\n        step(vMaskCoord.x, maskClamp.z) +\n        step(vMaskCoord.y, maskClamp.w));\n\n    vec4 original = texture2D(uSampler, vTextureCoord);\n    vec4 masky = texture2D(mask, vMaskCoord);\n    float alphaMul = 1.0 - npmAlpha * (1.0 - masky.a);\n\n    original *= (alphaMul * masky.r * alpha * clip);\n\n    gl_FragColor = original;\n}\n", ln = new Ke, cn = function() {
    function t7(t9, e21) {
        this._texture = t9, this.mapCoord = new Ke, this.uClampFrame = new Float32Array(4), this.uClampOffset = new Float32Array(2), this._textureID = -1, this._updateID = 0, this.clampOffset = 0, this.clampMargin = (void 0) === e21 ? 0.5 : e21, this.isSimple = !1;
    }
    return Object.defineProperty(t7.prototype, "texture", {
        get: function() {
            return this._texture;
        },
        set: function(t9) {
            this._texture = t9, this._textureID = -1;
        },
        enumerable: !1,
        configurable: !0
    }), t7.prototype.multiplyUvs = function(t9, e21) {
        (void 0) === e21 && (e21 = t9);
        for(var r36 = this.mapCoord, i35 = 0; i35 < t9.length; i35 += 2){
            var n27 = t9[i35], o28 = t9[i35 + 1];
            e21[i35] = n27 * r36.a + o28 * r36.c + r36.tx, e21[i35 + 1] = n27 * r36.b + o28 * r36.d + r36.ty;
        }
        return e21;
    }, t7.prototype.update = function(t9) {
        var e21 = this._texture;
        if (!e21 || !e21.valid) return !1;
        if (!t9 && this._textureID === e21._updateID) return !1;
        this._textureID = e21._updateID, this._updateID++;
        var r36 = e21._uvs;
        this.mapCoord.set(r36.x1 - r36.x0, r36.y1 - r36.y0, r36.x3 - r36.x0, r36.y3 - r36.y0, r36.x0, r36.y0);
        var i35 = e21.orig, n28 = e21.trim;
        n28 && (ln.set(i35.width / n28.width, 0, 0, i35.height / n28.height, -n28.x / n28.width, -n28.y / n28.height), this.mapCoord.append(ln));
        var o29 = e21.baseTexture, s27 = this.uClampFrame, a27 = this.clampMargin / o29.resolution, h27 = this.clampOffset;
        return s27[0] = (e21._frame.x + a27 + h27) / o29.width, s27[1] = (e21._frame.y + a27 + h27) / o29.height, s27[2] = (e21._frame.x + e21._frame.width - a27 + h27) / o29.width, s27[3] = (e21._frame.y + e21._frame.height - a27 + h27) / o29.height, this.uClampOffset[0] = h27 / o29.realWidth, this.uClampOffset[1] = h27 / o29.realHeight, this.isSimple = e21._frame.width === o29.width && e21._frame.height === o29.height && 0 === e21.rotate, !0;
    }, t7;
}(), dn = function(t7) {
    function e21(e23) {
        var r36 = this, i35 = new Ke;
        return r36 = t7.call(this, hn, un) || this, e23.renderable = !1, r36.maskSprite = e23, r36.maskMatrix = i35, r36;
    }
    return Lr(e21, t7), e21.prototype.apply = function(t9, e23, r36, i35) {
        var n28 = this.maskSprite, o29 = n28._texture;
        o29.valid && (o29.uvMatrix || (o29.uvMatrix = new cn(o29, 0)), o29.uvMatrix.update(), this.uniforms.npmAlpha = o29.baseTexture.alphaMode ? 0 : 1, this.uniforms.mask = o29, this.uniforms.otherMatrix = t9.calculateSpriteMatrix(this.maskMatrix, n28).prepend(o29.uvMatrix.mapCoord), this.uniforms.alpha = n28.worldAlpha, this.uniforms.maskClamp = o29.uvMatrix.uClampFrame, t9.applyFilter(this, e23, r36, i35));
    }, e21;
}(an), fn = function(t7) {
    function e21(e23) {
        var r36 = t7.call(this, e23) || this;
        return r36.enableScissor = !0, r36.alphaMaskPool = [], r36.maskDataPool = [], r36.maskStack = [], r36.alphaMaskIndex = 0, r36;
    }
    return Lr(e21, t7), e21.prototype.setMaskStack = function(t9) {
        this.maskStack = t9, this.renderer.scissor.setMaskStack(t9), this.renderer.stencil.setMaskStack(t9);
    }, e21.prototype.push = function(t9, e23) {
        var r36 = e23;
        if (!r36.isMaskData) {
            var i35 = this.maskDataPool.pop() || new Ci;
            i35.pooled = !0, i35.maskObject = e23, r36 = i35;
        }
        switch(r36.autoDetect && this.detect(r36), r36.copyCountersOrReset(this.maskStack[this.maskStack.length - 1]), r36._target = t9, r36.type){
            case te.SCISSOR:
                this.maskStack.push(r36), this.renderer.scissor.push(r36);
                break;
            case te.STENCIL:
                this.maskStack.push(r36), this.renderer.stencil.push(r36);
                break;
            case te.SPRITE:
                r36.copyCountersOrReset(null), this.pushSpriteMask(r36), this.maskStack.push(r36);
        }
    }, e21.prototype.pop = function(t9) {
        var e23 = this.maskStack.pop();
        if (e23 && e23._target === t9) {
            switch(e23.type){
                case te.SCISSOR:
                    this.renderer.scissor.pop();
                    break;
                case te.STENCIL:
                    this.renderer.stencil.pop(e23.maskObject);
                    break;
                case te.SPRITE:
                    this.popSpriteMask();
            }
            e23.reset(), e23.pooled && this.maskDataPool.push(e23);
        }
    }, e21.prototype.detect = function(t9) {
        var e23 = t9.maskObject;
        if (e23.isSprite) t9.type = te.SPRITE;
        else if (t9.type = te.STENCIL, this.enableScissor && e23.isFastRect && e23.isFastRect()) {
            var r36 = e23.worldTransform, i36 = Math.atan2(r36.b, r36.a), n28 = Math.atan2(r36.d, r36.c);
            i36 = Math.round(i36 * (180 / Math.PI) * 100), n28 = ((n28 = Math.round(n28 * (180 / Math.PI) * 100) - i36) % 18000 + 18000) % 18000, 0 == (i36 = (i36 % 9000 + 9000) % 9000) && 9000 === n28 && (t9.type = te.SCISSOR);
        }
    }, e21.prototype.pushSpriteMask = function(t9) {
        var e23 = t9.maskObject, r37 = t9._target, i37 = this.alphaMaskPool[this.alphaMaskIndex];
        i37 || (i37 = this.alphaMaskPool[this.alphaMaskIndex] = [
            new dn(e23)
        ]), i37[0].resolution = this.renderer.resolution, i37[0].maskSprite = e23;
        var n29 = r37.filterArea;
        r37.filterArea = e23.getBounds(!0), this.renderer.filter.push(r37, i37), r37.filterArea = n29, this.alphaMaskIndex++;
    }, e21.prototype.popSpriteMask = function() {
        this.renderer.filter.pop(), this.alphaMaskIndex--;
    }, e21;
}(Zr), pn = function(t7) {
    function e21(e23) {
        var r37 = t7.call(this, e23) || this;
        return r37.maskStack = [], r37.glConst = 0, r37;
    }
    return Lr(e21, t7), e21.prototype.getStackLength = function() {
        return this.maskStack.length;
    }, e21.prototype.setMaskStack = function(t9) {
        var e23 = this.renderer.gl, r37 = this.getStackLength();
        this.maskStack = t9;
        var i37 = this.getStackLength();
        i37 !== r37 && (0 === i37 ? e23.disable(this.glConst) : (e23.enable(this.glConst), this._useCurrent()));
    }, e21.prototype._useCurrent = function() {
    }, e21.prototype.destroy = function() {
        t7.prototype.destroy.call(this), this.maskStack = null;
    }, e21;
}(Zr), _n = function(t7) {
    function e21(e23) {
        var r37 = t7.call(this, e23) || this;
        return r37.glConst = WebGLRenderingContext.SCISSOR_TEST, r37;
    }
    return Lr(e21, t7), e21.prototype.getStackLength = function() {
        var t9 = this.maskStack[this.maskStack.length - 1];
        return t9 ? t9._scissorCounter : 0;
    }, e21.prototype.push = function(t9) {
        var e23 = t9.maskObject;
        e23.renderable = !0;
        var r37 = t9._scissorRect, i37 = e23.getBounds(!0), n29 = this.renderer.gl;
        e23.renderable = !1, r37 ? i37.fit(r37) : n29.enable(n29.SCISSOR_TEST), t9._scissorCounter++, t9._scissorRect = i37, this._useCurrent();
    }, e21.prototype.pop = function() {
        var t9 = this.renderer.gl;
        this.getStackLength() > 0 ? this._useCurrent() : t9.disable(t9.SCISSOR_TEST);
    }, e21.prototype._useCurrent = function() {
        var t9 = this.maskStack[this.maskStack.length - 1]._scissorRect, e23 = this.renderer.renderTexture.current, r37 = this.renderer.projection, i37 = r37.transform, n29 = r37.sourceFrame, o29 = r37.destinationFrame, s27 = e23 ? e23.resolution : this.renderer.resolution, a27 = o29.width / n29.width, h27 = o29.height / n29.height, u24 = ((t9.x - n29.x) * a27 + o29.x) * s27, l17 = ((t9.y - n29.y) * h27 + o29.y) * s27, c15 = t9.width * a27 * s27, d14 = t9.height * h27 * s27;
        i37 && (u24 += i37.tx * s27, l17 += i37.ty * s27), e23 || (l17 = this.renderer.height - d14 - l17), this.renderer.gl.scissor(u24, l17, c15, d14);
    }, e21;
}(pn), mn = function(t7) {
    function e21(e23) {
        var r37 = t7.call(this, e23) || this;
        return r37.glConst = WebGLRenderingContext.STENCIL_TEST, r37;
    }
    return Lr(e21, t7), e21.prototype.getStackLength = function() {
        var t9 = this.maskStack[this.maskStack.length - 1];
        return t9 ? t9._stencilCounter : 0;
    }, e21.prototype.push = function(t9) {
        var e23 = t9.maskObject, r37 = this.renderer.gl, i37 = t9._stencilCounter;
        0 === i37 && (this.renderer.framebuffer.forceStencil(), r37.enable(r37.STENCIL_TEST)), t9._stencilCounter++, r37.colorMask(!1, !1, !1, !1), r37.stencilFunc(r37.EQUAL, i37, this._getBitwiseMask()), r37.stencilOp(r37.KEEP, r37.KEEP, r37.INCR), e23.renderable = !0, e23.render(this.renderer), this.renderer.batch.flush(), this.renderer.framebuffer.blit(), e23.renderable = !1, this._useCurrent();
    }, e21.prototype.pop = function(t9) {
        var e23 = this.renderer.gl;
        0 === this.getStackLength() ? (e23.disable(e23.STENCIL_TEST), e23.clear(e23.STENCIL_BUFFER_BIT), e23.clearStencil(0)) : (e23.colorMask(!1, !1, !1, !1), e23.stencilOp(e23.KEEP, e23.KEEP, e23.DECR), t9.renderable = !0, t9.render(this.renderer), this.renderer.batch.flush(), t9.renderable = !1, this._useCurrent());
    }, e21.prototype._useCurrent = function() {
        var t9 = this.renderer.gl;
        t9.colorMask(!0, !0, !0, !0), t9.stencilFunc(t9.EQUAL, this.getStackLength(), this._getBitwiseMask()), t9.stencilOp(t9.KEEP, t9.KEEP, t9.KEEP);
    }, e21.prototype._getBitwiseMask = function() {
        return (1 << this.getStackLength()) - 1;
    }, e21;
}(pn), vn = function(t7) {
    function e21(e23) {
        var r37 = t7.call(this, e23) || this;
        return r37.destinationFrame = null, r37.sourceFrame = null, r37.defaultFrame = null, r37.projectionMatrix = new Ke, r37.transform = null, r37;
    }
    return Lr(e21, t7), e21.prototype.update = function(t9, e23, r37, i37) {
        this.destinationFrame = t9 || this.destinationFrame || this.defaultFrame, this.sourceFrame = e23 || this.sourceFrame || t9, this.calculateProjection(this.destinationFrame, this.sourceFrame, r37, i37), this.transform && this.projectionMatrix.append(this.transform);
        var n29 = this.renderer;
        n29.globalUniforms.uniforms.projectionMatrix = this.projectionMatrix, n29.globalUniforms.update(), n29.shader.shader && n29.shader.syncUniformGroup(n29.shader.shader.uniforms.globals);
    }, e21.prototype.calculateProjection = function(t9, e23, r37, i37) {
        var n29 = this.projectionMatrix, o29 = i37 ? -1 : 1;
        n29.identity(), n29.a = 1 / e23.width * 2, n29.d = o29 * (1 / e23.height * 2), n29.tx = -1 - e23.x * n29.a, n29.ty = -o29 - e23.y * n29.d;
    }, e21.prototype.setTransform = function(t9) {
    }, e21;
}(Zr), yn = new je, gn = new je, bn = function(t7) {
    function e21(e23) {
        var r37 = t7.call(this, e23) || this;
        return r37.clearColor = e23._backgroundColorRgba, r37.defaultMaskStack = [], r37.current = null, r37.sourceFrame = new je, r37.destinationFrame = new je, r37.viewportFrame = new je, r37;
    }
    return Lr(e21, t7), e21.prototype.bind = function(t9, e23, r37) {
        (void 0) === t9 && (t9 = null);
        var i37, n29, o29, s27 = this.renderer;
        this.current = t9, t9 ? (o29 = (i37 = t9.baseTexture).resolution, e23 || (yn.width = t9.frame.width, yn.height = t9.frame.height, e23 = yn), r37 || (gn.x = t9.frame.x, gn.y = t9.frame.y, gn.width = e23.width, gn.height = e23.height, r37 = gn), n29 = i37.framebuffer) : (o29 = s27.resolution, e23 || (yn.width = s27.screen.width, yn.height = s27.screen.height, e23 = yn), r37 || ((r37 = yn).width = e23.width, r37.height = e23.height));
        var a27 = this.viewportFrame;
        a27.x = r37.x * o29, a27.y = r37.y * o29, a27.width = r37.width * o29, a27.height = r37.height * o29, t9 || (a27.y = s27.view.height - (a27.y + a27.height)), this.renderer.framebuffer.bind(n29, a27), this.renderer.projection.update(r37, e23, o29, !n29), t9 ? this.renderer.mask.setMaskStack(i37.maskStack) : this.renderer.mask.setMaskStack(this.defaultMaskStack), this.sourceFrame.copyFrom(e23), this.destinationFrame.copyFrom(r37);
    }, e21.prototype.clear = function(t9, e23) {
        t9 = this.current ? t9 || this.current.baseTexture.clearColor : t9 || this.clearColor;
        var r37 = this.destinationFrame, i37 = this.current ? this.current.baseTexture : this.renderer.screen, n29 = r37.width !== i37.width || r37.height !== i37.height;
        if (n29) {
            var o29 = this.viewportFrame, s27 = o29.x, a27 = o29.y, h27 = o29.width, u24 = o29.height;
            this.renderer.gl.enable(this.renderer.gl.SCISSOR_TEST), this.renderer.gl.scissor(s27, a27, h27, u24);
        }
        this.renderer.framebuffer.clear(t9[0], t9[1], t9[2], t9[3], e23), n29 && this.renderer.scissor.pop();
    }, e21.prototype.resize = function() {
        this.bind(null);
    }, e21.prototype.reset = function() {
        this.bind(null);
    }, e21;
}(Zr), xn = function() {
}, Tn = function() {
    function t7(t9, e21) {
        this.program = t9, this.uniformData = e21, this.uniformGroups = {
        };
    }
    return t7.prototype.destroy = function() {
        this.uniformData = null, this.uniformGroups = null, this.program = null;
    }, t7;
}(), En = 0, An = {
    textureCount: 0
}, Sn = function(t7) {
    function e21(e23) {
        var r37 = t7.call(this, e23) || this;
        return r37.destroyed = !1, r37.systemCheck(), r37.gl = null, r37.shader = null, r37.program = null, r37.cache = {
        }, r37.id = En++, r37;
    }
    return Lr(e21, t7), e21.prototype.systemCheck = function() {
        if (!function() {
            if ("boolean" == typeof qi) return qi;
            try {
                var t9 = new Function("param1", "param2", "param3", "return param1[param2] === param3;");
                qi = !0 === t9({
                    a: "b"
                }, "a", "b");
            } catch (t10) {
                qi = !1;
            }
            return qi;
        }()) throw new Error("Current environment does not allow unsafe-eval, please use @pixi/unsafe-eval module to enable support.");
    }, e21.prototype.contextChange = function(t9) {
        this.gl = t9, this.reset();
    }, e21.prototype.bind = function(t9, e23) {
        t9.uniforms.globals = this.renderer.globalUniforms;
        var r37 = t9.program, i37 = r37.glPrograms[this.renderer.CONTEXT_UID] || this.generateShader(t9);
        return this.shader = t9, this.program !== r37 && (this.program = r37, this.gl.useProgram(i37.program)), e23 || (An.textureCount = 0, this.syncUniformGroup(t9.uniformGroup, An)), i37;
    }, e21.prototype.setUniforms = function(t9) {
        var e23 = this.shader.program, r37 = e23.glPrograms[this.renderer.CONTEXT_UID];
        e23.syncUniforms(r37.uniformData, t9, this.renderer);
    }, e21.prototype.syncUniformGroup = function(t9, e23) {
        var r37 = this.getglProgram();
        t9.static && t9.dirtyId === r37.uniformGroups[t9.id] || (r37.uniformGroups[t9.id] = t9.dirtyId, this.syncUniforms(t9, r37, e23));
    }, e21.prototype.syncUniforms = function(t9, e23, r37) {
        (t9.syncUniforms[this.shader.program.id] || this.createSyncGroups(t9))(e23.uniformData, t9.uniforms, this.renderer, r37);
    }, e21.prototype.createSyncGroups = function(t9) {
        var e23 = this.getSignature(t9, this.shader.program.uniformData);
        return this.cache[e23] || (this.cache[e23] = (function(t10, e24) {
            var r37 = [
                "\n        var v = null;\n        var cv = null\n        var t = 0;\n        var gl = renderer.gl\n    "
            ];
            for(var i37 in t10.uniforms){
                var n29 = e24[i37];
                if (n29) {
                    for(var o30 = t10.uniforms[i37], s28 = !1, a28 = 0; a28 < Ki.length; a28++)if (Ki[a28].test(n29, o30)) {
                        r37.push(Ki[a28].code(i37, o30)), s28 = !0;
                        break;
                    }
                    if (!s28) {
                        var h28 = (1 === n29.size ? Zi : Ji)[n29.type].replace("location", 'ud["' + i37 + '"].location');
                        r37.push('\n            cv = ud["' + i37 + '"].value;\n            v = uv["' + i37 + '"];\n            ' + h28 + ";");
                    }
                } else t10.uniforms[i37].group && r37.push('\n                    renderer.shader.syncUniformGroup(uv["' + i37 + '"], syncData);\n                ');
            }
            return new Function("ud", "uv", "renderer", "syncData", r37.join("\n"));
        })(t9, this.shader.program.uniformData)), t9.syncUniforms[this.shader.program.id] = this.cache[e23], t9.syncUniforms[this.shader.program.id];
    }, e21.prototype.getSignature = function(t9, e23) {
        var r37 = t9.uniforms, i37 = [];
        for(var n30 in r37)i37.push(n30), e23[n30] && i37.push(e23[n30].type);
        return i37.join("-");
    }, e21.prototype.getglProgram = function() {
        return this.shader ? this.shader.program.glPrograms[this.renderer.CONTEXT_UID] : null;
    }, e21.prototype.generateShader = function(t9) {
        var e23 = this.gl, r37 = t9.program, i37 = {
        };
        for(var n30 in r37.attributeData)i37[n30] = r37.attributeData[n30].location;
        var o31 = Li(e23, r37.vertexSrc, r37.fragmentSrc, i37), s29 = {
        };
        for(var n30 in r37.uniformData){
            var a29 = r37.uniformData[n30];
            s29[n30] = {
                location: e23.getUniformLocation(o31, n30),
                value: Bi(a29.type, a29.size)
            };
        }
        var h29 = new Tn(o31, s29);
        return r37.glPrograms[this.renderer.CONTEXT_UID] = h29, h29;
    }, e21.prototype.reset = function() {
        this.program = null, this.shader = null;
    }, e21.prototype.destroy = function() {
        this.destroyed = !0;
    }, e21;
}(Zr), On = 0, Rn = 1, wn = 2, Pn = 3, In = 4, Mn = 5, Dn = function(t7) {
    function e21(e23) {
        var r37 = t7.call(this, e23) || this;
        return r37.gl = null, r37.stateId = 0, r37.polygonOffset = 0, r37.blendMode = jt.NONE, r37._blendEq = !1, r37.map = [], r37.map[On] = r37.setBlend, r37.map[Rn] = r37.setOffset, r37.map[wn] = r37.setCullFace, r37.map[Pn] = r37.setDepthTest, r37.map[In] = r37.setFrontFace, r37.map[Mn] = r37.setDepthMask, r37.checks = [], r37.defaultState = new sn, r37.defaultState.blend = !0, r37;
    }
    return Lr(e21, t7), e21.prototype.contextChange = function(t9) {
        this.gl = t9, this.blendModes = (function(t10, e23) {
            return (void 0) === e23 && (e23 = []), e23[jt.NORMAL] = [
                t10.ONE,
                t10.ONE_MINUS_SRC_ALPHA
            ], e23[jt.ADD] = [
                t10.ONE,
                t10.ONE
            ], e23[jt.MULTIPLY] = [
                t10.DST_COLOR,
                t10.ONE_MINUS_SRC_ALPHA,
                t10.ONE,
                t10.ONE_MINUS_SRC_ALPHA
            ], e23[jt.SCREEN] = [
                t10.ONE,
                t10.ONE_MINUS_SRC_COLOR,
                t10.ONE,
                t10.ONE_MINUS_SRC_ALPHA
            ], e23[jt.OVERLAY] = [
                t10.ONE,
                t10.ONE_MINUS_SRC_ALPHA
            ], e23[jt.DARKEN] = [
                t10.ONE,
                t10.ONE_MINUS_SRC_ALPHA
            ], e23[jt.LIGHTEN] = [
                t10.ONE,
                t10.ONE_MINUS_SRC_ALPHA
            ], e23[jt.COLOR_DODGE] = [
                t10.ONE,
                t10.ONE_MINUS_SRC_ALPHA
            ], e23[jt.COLOR_BURN] = [
                t10.ONE,
                t10.ONE_MINUS_SRC_ALPHA
            ], e23[jt.HARD_LIGHT] = [
                t10.ONE,
                t10.ONE_MINUS_SRC_ALPHA
            ], e23[jt.SOFT_LIGHT] = [
                t10.ONE,
                t10.ONE_MINUS_SRC_ALPHA
            ], e23[jt.DIFFERENCE] = [
                t10.ONE,
                t10.ONE_MINUS_SRC_ALPHA
            ], e23[jt.EXCLUSION] = [
                t10.ONE,
                t10.ONE_MINUS_SRC_ALPHA
            ], e23[jt.HUE] = [
                t10.ONE,
                t10.ONE_MINUS_SRC_ALPHA
            ], e23[jt.SATURATION] = [
                t10.ONE,
                t10.ONE_MINUS_SRC_ALPHA
            ], e23[jt.COLOR] = [
                t10.ONE,
                t10.ONE_MINUS_SRC_ALPHA
            ], e23[jt.LUMINOSITY] = [
                t10.ONE,
                t10.ONE_MINUS_SRC_ALPHA
            ], e23[jt.NONE] = [
                0,
                0
            ], e23[jt.NORMAL_NPM] = [
                t10.SRC_ALPHA,
                t10.ONE_MINUS_SRC_ALPHA,
                t10.ONE,
                t10.ONE_MINUS_SRC_ALPHA
            ], e23[jt.ADD_NPM] = [
                t10.SRC_ALPHA,
                t10.ONE,
                t10.ONE,
                t10.ONE
            ], e23[jt.SCREEN_NPM] = [
                t10.SRC_ALPHA,
                t10.ONE_MINUS_SRC_COLOR,
                t10.ONE,
                t10.ONE_MINUS_SRC_ALPHA
            ], e23[jt.SRC_IN] = [
                t10.DST_ALPHA,
                t10.ZERO
            ], e23[jt.SRC_OUT] = [
                t10.ONE_MINUS_DST_ALPHA,
                t10.ZERO
            ], e23[jt.SRC_ATOP] = [
                t10.DST_ALPHA,
                t10.ONE_MINUS_SRC_ALPHA
            ], e23[jt.DST_OVER] = [
                t10.ONE_MINUS_DST_ALPHA,
                t10.ONE
            ], e23[jt.DST_IN] = [
                t10.ZERO,
                t10.SRC_ALPHA
            ], e23[jt.DST_OUT] = [
                t10.ZERO,
                t10.ONE_MINUS_SRC_ALPHA
            ], e23[jt.DST_ATOP] = [
                t10.ONE_MINUS_DST_ALPHA,
                t10.SRC_ALPHA
            ], e23[jt.XOR] = [
                t10.ONE_MINUS_DST_ALPHA,
                t10.ONE_MINUS_SRC_ALPHA
            ], e23[jt.SUBTRACT] = [
                t10.ONE,
                t10.ONE,
                t10.ONE,
                t10.ONE,
                t10.FUNC_REVERSE_SUBTRACT,
                t10.FUNC_ADD
            ], e23;
        })(t9), this.set(this.defaultState), this.reset();
    }, e21.prototype.set = function(t9) {
        if (t9 = t9 || this.defaultState, this.stateId !== t9.data) {
            for(var e23 = this.stateId ^ t9.data, r37 = 0; e23;)1 & e23 && this.map[r37].call(this, !!(t9.data & 1 << r37)), e23 >>= 1, r37++;
            this.stateId = t9.data;
        }
        for(r37 = 0; r37 < this.checks.length; r37++)this.checks[r37](this, t9);
    }, e21.prototype.forceState = function(t9) {
        t9 = t9 || this.defaultState;
        for(var e24 = 0; e24 < this.map.length; e24++)this.map[e24].call(this, !!(t9.data & 1 << e24));
        for(e24 = 0; e24 < this.checks.length; e24++)this.checks[e24](this, t9);
        this.stateId = t9.data;
    }, e21.prototype.setBlend = function(t9) {
        this.updateCheck(e21.checkBlendMode, t9), this.gl[t9 ? "enable" : "disable"](this.gl.BLEND);
    }, e21.prototype.setOffset = function(t9) {
        this.updateCheck(e21.checkPolygonOffset, t9), this.gl[t9 ? "enable" : "disable"](this.gl.POLYGON_OFFSET_FILL);
    }, e21.prototype.setDepthTest = function(t9) {
        this.gl[t9 ? "enable" : "disable"](this.gl.DEPTH_TEST);
    }, e21.prototype.setDepthMask = function(t9) {
        this.gl.depthMask(t9);
    }, e21.prototype.setCullFace = function(t9) {
        this.gl[t9 ? "enable" : "disable"](this.gl.CULL_FACE);
    }, e21.prototype.setFrontFace = function(t9) {
        this.gl.frontFace(this.gl[t9 ? "CW" : "CCW"]);
    }, e21.prototype.setBlendMode = function(t9) {
        if (t9 !== this.blendMode) {
            this.blendMode = t9;
            var e24 = this.blendModes[t9], r38 = this.gl;
            2 === e24.length ? r38.blendFunc(e24[0], e24[1]) : r38.blendFuncSeparate(e24[0], e24[1], e24[2], e24[3]), 6 === e24.length ? (this._blendEq = !0, r38.blendEquationSeparate(e24[4], e24[5])) : this._blendEq && (this._blendEq = !1, r38.blendEquationSeparate(r38.FUNC_ADD, r38.FUNC_ADD));
        }
    }, e21.prototype.setPolygonOffset = function(t9, e25) {
        this.gl.polygonOffset(t9, e25);
    }, e21.prototype.reset = function() {
        this.gl.pixelStorei(this.gl.UNPACK_FLIP_Y_WEBGL, !1), this.forceState(this.defaultState), this._blendEq = !0, this.blendMode = -1, this.setBlendMode(0);
    }, e21.prototype.updateCheck = function(t9, e25) {
        var r39 = this.checks.indexOf(t9);
        e25 && -1 === r39 ? this.checks.push(t9) : e25 || -1 === r39 || this.checks.splice(r39, 1);
    }, e21.checkBlendMode = function(t9, e25) {
        t9.setBlendMode(e25.blendMode);
    }, e21.checkPolygonOffset = function(t9, e25) {
        t9.setPolygonOffset(1, e25.polygonOffset);
    }, e21;
}(Zr), Cn = function(t7) {
    function e21(e25) {
        var r39 = t7.call(this, e25) || this;
        return r39.count = 0, r39.checkCount = 0, r39.maxIdle = F.GC_MAX_IDLE, r39.checkCountMax = F.GC_MAX_CHECK_COUNT, r39.mode = F.GC_MODE, r39;
    }
    return Lr(e21, t7), e21.prototype.postrender = function() {
        this.renderer.renderingToScreen && (this.count++, this.mode !== Qt.MANUAL && (this.checkCount++, this.checkCount > this.checkCountMax && (this.checkCount = 0, this.run())));
    }, e21.prototype.run = function() {
        for(var t9 = this.renderer.texture, e25 = t9.managedTextures, r39 = !1, i37 = 0; i37 < e25.length; i37++){
            var n30 = e25[i37];
            !n30.framebuffer && this.count - n30.touched > this.maxIdle && (t9.destroyTexture(n30, !0), e25[i37] = null, r39 = !0);
        }
        if (r39) {
            var o31 = 0;
            for(i37 = 0; i37 < e25.length; i37++)null !== e25[i37] && (e25[o31++] = e25[i37]);
            e25.length = o31;
        }
    }, e21.prototype.unload = function(t9) {
        var e25 = this.renderer.texture, r39 = t9._texture;
        r39 && !r39.framebuffer && e25.destroyTexture(r39);
        for(var i37 = t9.children.length - 1; i37 >= 0; i37--)this.unload(t9.children[i37]);
    }, e21;
}(Zr), Nn = function(t7) {
    this.texture = t7, this.width = -1, this.height = -1, this.dirtyId = -1, this.dirtyStyleId = -1, this.mipmap = !1, this.wrapMode = 33071, this.type = 6408, this.internalFormat = 5121;
}, Ln = function(t7) {
    function e21(e25) {
        var r39 = t7.call(this, e25) || this;
        return r39.boundTextures = [], r39.currentLocation = -1, r39.managedTextures = [], r39._unknownBoundTextures = !1, r39.unknownTexture = new Gr, r39;
    }
    return Lr(e21, t7), e21.prototype.contextChange = function() {
        var t9 = this.gl = this.renderer.gl;
        this.CONTEXT_UID = this.renderer.CONTEXT_UID, this.webGLVersion = this.renderer.context.webGLVersion;
        var e25 = t9.getParameter(t9.MAX_TEXTURE_IMAGE_UNITS);
        this.boundTextures.length = e25;
        for(var r39 = 0; r39 < e25; r39++)this.boundTextures[r39] = null;
        this.emptyTextures = {
        };
        var i37 = new Nn(t9.createTexture());
        for(t9.bindTexture(t9.TEXTURE_2D, i37.texture), t9.texImage2D(t9.TEXTURE_2D, 0, t9.RGBA, 1, 1, 0, t9.RGBA, t9.UNSIGNED_BYTE, new Uint8Array(4)), this.emptyTextures[t9.TEXTURE_2D] = i37, this.emptyTextures[t9.TEXTURE_CUBE_MAP] = new Nn(t9.createTexture()), t9.bindTexture(t9.TEXTURE_CUBE_MAP, this.emptyTextures[t9.TEXTURE_CUBE_MAP].texture), r39 = 0; r39 < 6; r39++)t9.texImage2D(t9.TEXTURE_CUBE_MAP_POSITIVE_X + r39, 0, t9.RGBA, 1, 1, 0, t9.RGBA, t9.UNSIGNED_BYTE, null);
        for(t9.texParameteri(t9.TEXTURE_CUBE_MAP, t9.TEXTURE_MAG_FILTER, t9.LINEAR), t9.texParameteri(t9.TEXTURE_CUBE_MAP, t9.TEXTURE_MIN_FILTER, t9.LINEAR), r39 = 0; r39 < this.boundTextures.length; r39++)this.bind(null, r39);
    }, e21.prototype.bind = function(t9, e25) {
        (void 0) === e25 && (e25 = 0);
        var r39 = this.gl;
        if (t9) {
            if ((t9 = t9.castToBaseTexture()).parentTextureArray) return;
            if (t9.valid) {
                t9.touched = this.renderer.textureGC.count;
                var i37 = t9._glTextures[this.CONTEXT_UID] || this.initTexture(t9);
                this.boundTextures[e25] !== t9 && (this.currentLocation !== e25 && (this.currentLocation = e25, r39.activeTexture(r39.TEXTURE0 + e25)), r39.bindTexture(t9.target, i37.texture)), i37.dirtyId !== t9.dirtyId && (this.currentLocation !== e25 && (this.currentLocation = e25, r39.activeTexture(r39.TEXTURE0 + e25)), this.updateTexture(t9)), this.boundTextures[e25] = t9;
            }
        } else this.currentLocation !== e25 && (this.currentLocation = e25, r39.activeTexture(r39.TEXTURE0 + e25)), r39.bindTexture(r39.TEXTURE_2D, this.emptyTextures[r39.TEXTURE_2D].texture), this.boundTextures[e25] = null;
    }, e21.prototype.reset = function() {
        this._unknownBoundTextures = !0, this.currentLocation = -1;
        for(var t9 = 0; t9 < this.boundTextures.length; t9++)this.boundTextures[t9] = this.unknownTexture;
    }, e21.prototype.unbind = function(t9) {
        var e25 = this.gl, r39 = this.boundTextures;
        if (this._unknownBoundTextures) {
            this._unknownBoundTextures = !1;
            for(var i38 = 0; i38 < r39.length; i38++)r39[i38] === this.unknownTexture && this.bind(null, i38);
        }
        for(i38 = 0; i38 < r39.length; i38++)r39[i38] === t9 && (this.currentLocation !== i38 && (e25.activeTexture(e25.TEXTURE0 + i38), this.currentLocation = i38), e25.bindTexture(t9.target, this.emptyTextures[t9.target].texture), r39[i38] = null);
    }, e21.prototype.initTexture = function(t9) {
        var e25 = new Nn(this.gl.createTexture());
        return e25.dirtyId = -1, t9._glTextures[this.CONTEXT_UID] = e25, this.managedTextures.push(t9), t9.on("dispose", this.destroyTexture, this), e25;
    }, e21.prototype.initTextureType = function(t9, e25) {
        if (e25.internalFormat = t9.format, e25.type = t9.type, 2 === this.webGLVersion) {
            var r39 = this.renderer.gl;
            t9.type === r39.FLOAT && t9.format === r39.RGBA && (e25.internalFormat = r39.RGBA32F), t9.type === zt.HALF_FLOAT && (e25.type = r39.HALF_FLOAT), e25.type === r39.HALF_FLOAT && t9.format === r39.RGBA && (e25.internalFormat = r39.RGBA16F);
        }
    }, e21.prototype.updateTexture = function(t9) {
        var e25 = t9._glTextures[this.CONTEXT_UID];
        if (e25) {
            var r40 = this.renderer;
            if (this.initTextureType(t9, e25), t9.resource && t9.resource.upload(r40, t9, e25)) ;
            else {
                var i39 = t9.realWidth, n31 = t9.realHeight, o32 = r40.gl;
                (e25.width !== i39 || e25.height !== n31 || e25.dirtyId < 0) && (e25.width = i39, e25.height = n31, o32.texImage2D(t9.target, 0, e25.internalFormat, i39, n31, 0, t9.format, e25.type, null));
            }
            t9.dirtyStyleId !== e25.dirtyStyleId && this.updateTextureStyle(t9), e25.dirtyId = t9.dirtyId;
        }
    }, e21.prototype.destroyTexture = function(t9, e25) {
        var r41 = this.gl;
        if ((t9 = t9.castToBaseTexture())._glTextures[this.CONTEXT_UID] && (this.unbind(t9), r41.deleteTexture(t9._glTextures[this.CONTEXT_UID].texture), t9.off("dispose", this.destroyTexture, this), delete t9._glTextures[this.CONTEXT_UID], !e25)) {
            var i40 = this.managedTextures.indexOf(t9);
            -1 !== i40 && Ee(this.managedTextures, i40, 1);
        }
    }, e21.prototype.updateTextureStyle = function(t9) {
        var e25 = t9._glTextures[this.CONTEXT_UID];
        e25 && (t9.mipmap !== Kt.POW2 && 2 === this.webGLVersion || t9.isPowerOfTwo ? e25.mipmap = t9.mipmap >= 1 : e25.mipmap = !1, 2 === this.webGLVersion || t9.isPowerOfTwo ? e25.wrapMode = t9.wrapMode : e25.wrapMode = qt.CLAMP, t9.resource && t9.resource.style(this.renderer, t9, e25) || this.setStyle(t9, e25), e25.dirtyStyleId = t9.dirtyStyleId);
    }, e21.prototype.setStyle = function(t9, e25) {
        var r41 = this.gl;
        if (e25.mipmap && t9.mipmap !== Kt.ON_MANUAL && r41.generateMipmap(t9.target), r41.texParameteri(t9.target, r41.TEXTURE_WRAP_S, e25.wrapMode), r41.texParameteri(t9.target, r41.TEXTURE_WRAP_T, e25.wrapMode), e25.mipmap) {
            r41.texParameteri(t9.target, r41.TEXTURE_MIN_FILTER, t9.scaleMode === Wt.LINEAR ? r41.LINEAR_MIPMAP_LINEAR : r41.NEAREST_MIPMAP_NEAREST);
            var i41 = this.renderer.context.extensions.anisotropicFiltering;
            if (i41 && t9.anisotropicLevel > 0 && t9.scaleMode === Wt.LINEAR) {
                var n32 = Math.min(t9.anisotropicLevel, r41.getParameter(i41.MAX_TEXTURE_MAX_ANISOTROPY_EXT));
                r41.texParameterf(t9.target, i41.TEXTURE_MAX_ANISOTROPY_EXT, n32);
            }
        } else r41.texParameteri(t9.target, r41.TEXTURE_MIN_FILTER, t9.scaleMode === Wt.LINEAR ? r41.LINEAR : r41.NEAREST);
        r41.texParameteri(t9.target, r41.TEXTURE_MAG_FILTER, t9.scaleMode === Wt.LINEAR ? r41.LINEAR : r41.NEAREST);
    }, e21;
}(Zr), Fn = {
    __proto__: null,
    FilterSystem: Ti,
    BatchSystem: Ai,
    ContextSystem: Oi,
    FramebufferSystem: Pi,
    GeometrySystem: Di,
    MaskSystem: fn,
    ScissorSystem: _n,
    StencilSystem: mn,
    ProjectionSystem: vn,
    RenderTextureSystem: bn,
    ShaderSystem: Sn,
    StateSystem: Dn,
    TextureGCSystem: Cn,
    TextureSystem: Ln
}, Bn = new Ke, Un = function(t7) {
    function e21(e25, r41) {
        (void 0) === e25 && (e25 = Xt.UNKNOWN);
        var i42 = t7.call(this) || this;
        return r41 = Object.assign({
        }, F.RENDER_OPTIONS, r41), i42.options = r41, i42.type = e25, i42.screen = new je(0, 0, r41.width, r41.height), i42.view = r41.view || document.createElement("canvas"), i42.resolution = r41.resolution || F.RESOLUTION, i42.useContextAlpha = r41.useContextAlpha, i42.autoDensity = !!r41.autoDensity, i42.preserveDrawingBuffer = r41.preserveDrawingBuffer, i42.clearBeforeRender = r41.clearBeforeRender, i42._backgroundColor = 0, i42._backgroundColorRgba = [
            0,
            0,
            0,
            1
        ], i42._backgroundColorString = "#000000", i42.backgroundColor = r41.backgroundColor || i42._backgroundColor, i42.backgroundAlpha = r41.backgroundAlpha, (void 0) !== r41.transparent && (i42.useContextAlpha = r41.transparent, i42.backgroundAlpha = r41.transparent ? 0 : 1), i42._lastObjectRendered = null, i42.plugins = {
        }, i42;
    }
    return Lr(e21, t7), e21.prototype.initPlugins = function(t9) {
        for(var e25 in t9)this.plugins[e25] = new t9[e25](this);
    }, Object.defineProperty(e21.prototype, "width", {
        get: function() {
            return this.view.width;
        },
        enumerable: !1,
        configurable: !0
    }), Object.defineProperty(e21.prototype, "height", {
        get: function() {
            return this.view.height;
        },
        enumerable: !1,
        configurable: !0
    }), e21.prototype.resize = function(t9, e25) {
        this.screen.width = t9, this.screen.height = e25, this.view.width = t9 * this.resolution, this.view.height = e25 * this.resolution, this.autoDensity && (this.view.style.width = t9 + "px", this.view.style.height = e25 + "px"), this.emit("resize", t9, e25);
    }, e21.prototype.generateTexture = function(t9, e25, r41, i42) {
        0 === (i42 = i42 || t9.getLocalBounds(null, !0)).width && (i42.width = 1), 0 === i42.height && (i42.height = 1);
        var n33 = ni.create({
            width: 0 | i42.width,
            height: 0 | i42.height,
            scaleMode: e25,
            resolution: r41
        });
        return Bn.tx = -i42.x, Bn.ty = -i42.y, this.render(t9, {
            renderTexture: n33,
            clear: !1,
            transform: Bn,
            skipUpdateTransform: !!t9.parent
        }), n33;
    }, e21.prototype.destroy = function(t9) {
        for(var e25 in this.plugins)this.plugins[e25].destroy(), this.plugins[e25] = null;
        t9 && this.view.parentNode && this.view.parentNode.removeChild(this.view), this.plugins = null, this.type = Xt.UNKNOWN, this.view = null, this.screen = null, this._tempDisplayObjectParent = null, this.options = null, this._backgroundColorRgba = null, this._backgroundColorString = null, this._lastObjectRendered = null;
    }, Object.defineProperty(e21.prototype, "backgroundColor", {
        get: function() {
            return this._backgroundColor;
        },
        set: function(t9) {
            this._backgroundColor = t9, this._backgroundColorString = le(t9), ue(t9, this._backgroundColorRgba);
        },
        enumerable: !1,
        configurable: !0
    }), Object.defineProperty(e21.prototype, "backgroundAlpha", {
        get: function() {
            return this._backgroundColorRgba[3];
        },
        set: function(t9) {
            this._backgroundColorRgba[3] = t9;
        },
        enumerable: !1,
        configurable: !0
    }), e21;
}(X2), Gn = function(t7) {
    function e21(r41) {
        var i42 = t7.call(this, Xt.WEBGL, r41) || this;
        return r41 = i42.options, i42.gl = null, i42.CONTEXT_UID = 0, i42.runners = {
            destroy: new Mr("destroy"),
            contextChange: new Mr("contextChange"),
            reset: new Mr("reset"),
            update: new Mr("update"),
            postrender: new Mr("postrender"),
            prerender: new Mr("prerender"),
            resize: new Mr("resize")
        }, i42.globalUniforms = new yi({
            projectionMatrix: new Ke
        }, !0), i42.addSystem(fn, "mask").addSystem(Oi, "context").addSystem(Dn, "state").addSystem(Sn, "shader").addSystem(Ln, "texture").addSystem(Di, "geometry").addSystem(Pi, "framebuffer").addSystem(_n, "scissor").addSystem(mn, "stencil").addSystem(vn, "projection").addSystem(Cn, "textureGC").addSystem(Ti, "filter").addSystem(bn, "renderTexture").addSystem(Ai, "batch"), i42.initPlugins(e21.__plugins), r41.context ? i42.context.initFromContext(r41.context) : i42.context.initFromOptions({
            alpha: !!i42.useContextAlpha,
            antialias: r41.antialias,
            premultipliedAlpha: i42.useContextAlpha && "notMultiplied" !== i42.useContextAlpha,
            stencil: !0,
            preserveDrawingBuffer: r41.preserveDrawingBuffer,
            powerPreference: i42.options.powerPreference
        }), i42.renderingToScreen = !0, se(2 === i42.context.webGLVersion ? "WebGL 2" : "WebGL 1"), i42.resize(i42.options.width, i42.options.height), i42;
    }
    return Lr(e21, t7), e21.create = function(t9) {
        if (ae()) return new e21(t9);
        throw new Error('WebGL unsupported in this browser, use "pixi.js-legacy" for fallback canvas2d support.');
    }, e21.prototype.addSystem = function(t9, e25) {
        e25 || (e25 = t9.name);
        var r41 = new t9(this);
        if (this[e25]) throw new Error('Whoops! The name "' + e25 + '" is already in use');
        for(var i42 in this[e25] = r41, this.runners)this.runners[i42].add(r41);
        return this;
    }, e21.prototype.render = function(t9, e25) {
        var r41, i42, n33, o33;
        if (e25 && (e25 instanceof ni ? (r41 = e25, i42 = arguments[2], n33 = arguments[3], o33 = arguments[4]) : (r41 = e25.renderTexture, i42 = e25.clear, n33 = e25.transform, o33 = e25.skipUpdateTransform)), this.renderingToScreen = !r41, this.runners.prerender.emit(), this.emit("prerender"), this.projection.transform = n33, !this.context.isLost) {
            if (r41 || (this._lastObjectRendered = t9), !o33) {
                var s29 = t9.enableTempParent();
                t9.updateTransform(), t9.disableTempParent(s29);
            }
            this.renderTexture.bind(r41), this.batch.currentRenderer.start(), ((void 0) !== i42 ? i42 : this.clearBeforeRender) && this.renderTexture.clear(), t9.render(this), this.batch.currentRenderer.flush(), r41 && r41.baseTexture.update(), this.runners.postrender.emit(), this.projection.transform = null, this.emit("postrender");
        }
    }, e21.prototype.resize = function(e25, r41) {
        t7.prototype.resize.call(this, e25, r41), this.runners.resize.emit(e25, r41);
    }, e21.prototype.reset = function() {
        return this.runners.reset.emit(), this;
    }, e21.prototype.clear = function() {
        this.renderTexture.bind(), this.renderTexture.clear();
    }, e21.prototype.destroy = function(e25) {
        for(var r41 in this.runners.destroy.emit(), this.runners)this.runners[r41].destroy();
        t7.prototype.destroy.call(this, e25), this.gl = null;
    }, Object.defineProperty(e21.prototype, "extract", {
        get: function() {
            return this.plugins.extract;
        },
        enumerable: !1,
        configurable: !0
    }), e21.registerPlugin = function(t9, r41) {
        e21.__plugins = e21.__plugins || {
        }, e21.__plugins[t9] = r41;
    }, e21;
}(Un);
function Xn(t7) {
    return Gn.create(t7);
}
var kn = "attribute vec2 aVertexPosition;\nattribute vec2 aTextureCoord;\n\nuniform mat3 projectionMatrix;\n\nvarying vec2 vTextureCoord;\n\nvoid main(void)\n{\n    gl_Position = vec4((projectionMatrix * vec3(aVertexPosition, 1.0)).xy, 0.0, 1.0);\n    vTextureCoord = aTextureCoord;\n}", jn = "attribute vec2 aVertexPosition;\n\nuniform mat3 projectionMatrix;\n\nvarying vec2 vTextureCoord;\n\nuniform vec4 inputSize;\nuniform vec4 outputFrame;\n\nvec4 filterVertexPosition( void )\n{\n    vec2 position = aVertexPosition * max(outputFrame.zw, vec2(0.)) + outputFrame.xy;\n\n    return vec4((projectionMatrix * vec3(position, 1.0)).xy, 0.0, 1.0);\n}\n\nvec2 filterTextureCoord( void )\n{\n    return aVertexPosition * (outputFrame.zw * inputSize.zw);\n}\n\nvoid main(void)\n{\n    gl_Position = filterVertexPosition();\n    vTextureCoord = filterTextureCoord();\n}\n", Hn = function() {
    this.texArray = null, this.blend = 0, this.type = Ht.TRIANGLES, this.start = 0, this.size = 0, this.data = null;
}, Yn = function() {
    function t7() {
        this.elements = [], this.ids = [], this.count = 0;
    }
    return t7.prototype.clear = function() {
        for(var t9 = 0; t9 < this.count; t9++)this.elements[t9] = null;
        this.count = 0;
    }, t7;
}(), Vn = function() {
    function t7(t9) {
        "number" == typeof t9 ? this.rawBinaryData = new ArrayBuffer(t9) : t9 instanceof Uint8Array ? this.rawBinaryData = t9.buffer : this.rawBinaryData = t9, this.uint32View = new Uint32Array(this.rawBinaryData), this.float32View = new Float32Array(this.rawBinaryData);
    }
    return Object.defineProperty(t7.prototype, "int8View", {
        get: function() {
            return this._int8View || (this._int8View = new Int8Array(this.rawBinaryData)), this._int8View;
        },
        enumerable: !1,
        configurable: !0
    }), Object.defineProperty(t7.prototype, "uint8View", {
        get: function() {
            return this._uint8View || (this._uint8View = new Uint8Array(this.rawBinaryData)), this._uint8View;
        },
        enumerable: !1,
        configurable: !0
    }), Object.defineProperty(t7.prototype, "int16View", {
        get: function() {
            return this._int16View || (this._int16View = new Int16Array(this.rawBinaryData)), this._int16View;
        },
        enumerable: !1,
        configurable: !0
    }), Object.defineProperty(t7.prototype, "uint16View", {
        get: function() {
            return this._uint16View || (this._uint16View = new Uint16Array(this.rawBinaryData)), this._uint16View;
        },
        enumerable: !1,
        configurable: !0
    }), Object.defineProperty(t7.prototype, "int32View", {
        get: function() {
            return this._int32View || (this._int32View = new Int32Array(this.rawBinaryData)), this._int32View;
        },
        enumerable: !1,
        configurable: !0
    }), t7.prototype.view = function(t9) {
        return this[t9 + "View"];
    }, t7.prototype.destroy = function() {
        this.rawBinaryData = null, this._int8View = null, this._uint8View = null, this._int16View = null, this._uint16View = null, this._int32View = null, this.uint32View = null, this.float32View = null;
    }, t7.sizeOf = function(t9) {
        switch(t9){
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
                throw new Error(t9 + " isn't a valid view type");
        }
    }, t7;
}(), zn = function(t7) {
    function e21(e25) {
        var r41 = t7.call(this, e25) || this;
        return r41.shaderGenerator = null, r41.geometryClass = null, r41.vertexSize = null, r41.state = sn.for2d(), r41.size = 4 * F.SPRITE_BATCH_SIZE, r41._vertexCount = 0, r41._indexCount = 0, r41._bufferedElements = [], r41._bufferedTextures = [], r41._bufferSize = 0, r41._shader = null, r41._packedGeometries = [], r41._packedGeometryPoolSize = 2, r41._flushId = 0, r41._aBuffers = {
        }, r41._iBuffers = {
        }, r41.MAX_TEXTURES = 1, r41.renderer.on("prerender", r41.onPrerender, r41), e25.runners.contextChange.add(r41), r41._dcIndex = 0, r41._aIndex = 0, r41._iIndex = 0, r41._attributeBuffer = null, r41._indexBuffer = null, r41._tempBoundTextures = [], r41;
    }
    return Lr(e21, t7), e21.prototype.contextChange = function() {
        var t9 = this.renderer.gl;
        F.PREFER_ENV === Gt.WEBGL_LEGACY ? this.MAX_TEXTURES = 1 : (this.MAX_TEXTURES = Math.min(t9.getParameter(t9.MAX_TEXTURE_IMAGE_UNITS), F.SPRITE_MAX_TEXTURES), this.MAX_TEXTURES = tn(this.MAX_TEXTURES, t9)), this._shader = this.shaderGenerator.generateShader(this.MAX_TEXTURES);
        for(var e25 = 0; e25 < this._packedGeometryPoolSize; e25++)this._packedGeometries[e25] = new this.geometryClass;
        this.initFlushBuffers();
    }, e21.prototype.initFlushBuffers = function() {
        for(var t9 = e21._drawCallPool, r41 = e21._textureArrayPool, i42 = this.size / 4, n33 = Math.floor(i42 / this.MAX_TEXTURES) + 1; t9.length < i42;)t9.push(new Hn);
        for(; r41.length < n33;)r41.push(new Yn);
        for(var o33 = 0; o33 < this.MAX_TEXTURES; o33++)this._tempBoundTextures[o33] = null;
    }, e21.prototype.onPrerender = function() {
        this._flushId = 0;
    }, e21.prototype.render = function(t9) {
        t9._texture.valid && (this._vertexCount + t9.vertexData.length / 2 > this.size && this.flush(), this._vertexCount += t9.vertexData.length / 2, this._indexCount += t9.indices.length, this._bufferedTextures[this._bufferSize] = t9._texture.baseTexture, this._bufferedElements[this._bufferSize++] = t9);
    }, e21.prototype.buildTexturesAndDrawCalls = function() {
        var t9 = this._bufferedTextures, r41 = this.MAX_TEXTURES, i42 = e21._textureArrayPool, n33 = this.renderer.batch, o33 = this._tempBoundTextures, s30 = this.renderer.textureGC.count, a30 = ++Gr._globalBatch, h29 = 0, u25 = i42[0], l17 = 0;
        n33.copyBoundTextures(o33, r41);
        for(var c15 = 0; c15 < this._bufferSize; ++c15){
            var d14 = t9[c15];
            t9[c15] = null, d14._batchEnabled !== a30 && (u25.count >= r41 && (n33.boundArray(u25, o33, a30, r41), this.buildDrawCalls(u25, l17, c15), l17 = c15, u25 = i42[++h29], ++a30), d14._batchEnabled = a30, d14.touched = s30, u25.elements[u25.count++] = d14);
        }
        for(u25.count > 0 && (n33.boundArray(u25, o33, a30, r41), this.buildDrawCalls(u25, l17, this._bufferSize), ++h29, ++a30), c15 = 0; c15 < o33.length; c15++)o33[c15] = null;
        Gr._globalBatch = a30;
    }, e21.prototype.buildDrawCalls = function(t9, r41, i42) {
        var n33 = this._bufferedElements, o33 = this._attributeBuffer, s30 = this._indexBuffer, a30 = this.vertexSize, h29 = e21._drawCallPool, u25 = this._dcIndex, l17 = this._aIndex, c15 = this._iIndex, d15 = h29[u25];
        d15.start = this._iIndex, d15.texArray = t9;
        for(var f10 = r41; f10 < i42; ++f10){
            var p = n33[f10], _4 = p._texture.baseTexture, m4 = de[_4.alphaMode ? 1 : 0][p.blendMode];
            n33[f10] = null, r41 < f10 && d15.blend !== m4 && (d15.size = c15 - d15.start, r41 = f10, (d15 = h29[++u25]).texArray = t9, d15.start = c15), this.packInterleavedGeometry(p, o33, s30, l17, c15), l17 += p.vertexData.length / 2 * a30, c15 += p.indices.length, d15.blend = m4;
        }
        r41 < i42 && (d15.size = c15 - d15.start, ++u25), this._dcIndex = u25, this._aIndex = l17, this._iIndex = c15;
    }, e21.prototype.bindAndClearTexArray = function(t9) {
        for(var e25 = this.renderer.texture, r41 = 0; r41 < t9.count; r41++)e25.bind(t9.elements[r41], t9.ids[r41]), t9.elements[r41] = null;
        t9.count = 0;
    }, e21.prototype.updateGeometry = function() {
        var t9 = this._packedGeometries, e25 = this._attributeBuffer, r41 = this._indexBuffer;
        F.CAN_UPLOAD_SAME_BUFFER ? (t9[this._flushId]._buffer.update(e25.rawBinaryData), t9[this._flushId]._indexBuffer.update(r41), this.renderer.geometry.updateBuffers()) : (this._packedGeometryPoolSize <= this._flushId && (this._packedGeometryPoolSize++, t9[this._flushId] = new this.geometryClass), t9[this._flushId]._buffer.update(e25.rawBinaryData), t9[this._flushId]._indexBuffer.update(r41), this.renderer.geometry.bind(t9[this._flushId]), this.renderer.geometry.updateBuffers(), this._flushId++);
    }, e21.prototype.drawBatches = function() {
        for(var t9 = this._dcIndex, r41 = this.renderer, i42 = r41.gl, n33 = r41.state, o33 = e21._drawCallPool, s30 = null, a30 = 0; a30 < t9; a30++){
            var h29 = o33[a30], u25 = h29.texArray, l17 = h29.type, c15 = h29.size, d15 = h29.start, f10 = h29.blend;
            s30 !== u25 && (s30 = u25, this.bindAndClearTexArray(u25)), this.state.blendMode = f10, n33.set(this.state), i42.drawElements(l17, c15, i42.UNSIGNED_SHORT, 2 * d15);
        }
    }, e21.prototype.flush = function() {
        0 !== this._vertexCount && (this._attributeBuffer = this.getAttributeBuffer(this._vertexCount), this._indexBuffer = this.getIndexBuffer(this._indexCount), this._aIndex = 0, this._iIndex = 0, this._dcIndex = 0, this.buildTexturesAndDrawCalls(), this.updateGeometry(), this.drawBatches(), this._bufferSize = 0, this._vertexCount = 0, this._indexCount = 0);
    }, e21.prototype.start = function() {
        this.renderer.state.set(this.state), this.renderer.shader.bind(this._shader), F.CAN_UPLOAD_SAME_BUFFER && this.renderer.geometry.bind(this._packedGeometries[this._flushId]);
    }, e21.prototype.stop = function() {
        this.flush();
    }, e21.prototype.destroy = function() {
        for(var e25 = 0; e25 < this._packedGeometryPoolSize; e25++)this._packedGeometries[e25] && this._packedGeometries[e25].destroy();
        this.renderer.off("prerender", this.onPrerender, this), this._aBuffers = null, this._iBuffers = null, this._packedGeometries = null, this._attributeBuffer = null, this._indexBuffer = null, this._shader && (this._shader.destroy(), this._shader = null), t7.prototype.destroy.call(this);
    }, e21.prototype.getAttributeBuffer = function(t9) {
        var e25 = be(Math.ceil(t9 / 8)), r41 = Te(e25), i42 = 8 * e25;
        this._aBuffers.length <= r41 && (this._iBuffers.length = r41 + 1);
        var n33 = this._aBuffers[i42];
        return n33 || (this._aBuffers[i42] = n33 = new Vn(i42 * this.vertexSize * 4)), n33;
    }, e21.prototype.getIndexBuffer = function(t9) {
        var e25 = be(Math.ceil(t9 / 12)), r41 = Te(e25), i42 = 12 * e25;
        this._iBuffers.length <= r41 && (this._iBuffers.length = r41 + 1);
        var n33 = this._iBuffers[r41];
        return n33 || (this._iBuffers[r41] = n33 = new Uint16Array(i42)), n33;
    }, e21.prototype.packInterleavedGeometry = function(t9, e25, r41, i42, n33) {
        for(var o33 = e25.uint32View, s30 = e25.float32View, a30 = i42 / this.vertexSize, h30 = t9.uvs, u26 = t9.indices, l18 = t9.vertexData, c16 = t9._texture.baseTexture._batchLocation, d16 = Math.min(t9.worldAlpha, 1), f11 = d16 < 1 && t9._texture.baseTexture.alphaMode ? _e(t9._tintRGB, d16) : t9._tintRGB + (255 * d16 << 24), p = 0; p < l18.length; p += 2)s30[i42++] = l18[p], s30[i42++] = l18[p + 1], s30[i42++] = h30[p], s30[i42++] = h30[p + 1], o33[i42++] = f11, s30[i42++] = c16;
        for(p = 0; p < u26.length; p++)r41[n33++] = a30 + u26[p];
    }, e21._drawCallPool = [], e21._textureArrayPool = [], e21;
}(Ei), Wn = function() {
    function t7(t9, e21) {
        if (this.vertexSrc = t9, this.fragTemplate = e21, this.programCache = {
        }, this.defaultGroupCache = {
        }, e21.indexOf("%count%") < 0) throw new Error('Fragment template must contain "%count%".');
        if (e21.indexOf("%forloop%") < 0) throw new Error('Fragment template must contain "%forloop%".');
    }
    return t7.prototype.generateShader = function(t9) {
        if (!this.programCache[t9]) {
            for(var e21 = new Int32Array(t9), r41 = 0; r41 < t9; r41++)e21[r41] = r41;
            this.defaultGroupCache[t9] = yi.from({
                uSamplers: e21
            }, !0);
            var i42 = this.fragTemplate;
            i42 = (i42 = i42.replace(/%count%/gi, "" + t9)).replace(/%forloop%/gi, this.generateSampleSrc(t9)), this.programCache[t9] = new nn(this.vertexSrc, i42);
        }
        var n33 = {
            tint: new Float32Array([
                1,
                1,
                1,
                1
            ]),
            translationMatrix: new Ke,
            default: this.defaultGroupCache[t9]
        };
        return new on(this.programCache[t9], n33);
    }, t7.prototype.generateSampleSrc = function(t9) {
        var e25 = "";
        e25 += "\n", e25 += "\n";
        for(var r42 = 0; r42 < t9; r42++)r42 > 0 && (e25 += "\nelse "), r42 < t9 - 1 && (e25 += "if(vTextureId < " + r42 + ".5)"), e25 += "\n{", e25 += "\n\tcolor = texture2D(uSamplers[" + r42 + "], vTextureCoord);", e25 += "\n}";
        return (e25 += "\n") + "\n";
    }, t7;
}(), qn = function(t7) {
    function e25(e26) {
        (void 0) === e26 && (e26 = !1);
        var r42 = t7.call(this) || this;
        return r42._buffer = new hi(null, e26, !1), r42._indexBuffer = new hi(null, e26, !0), r42.addAttribute("aVertexPosition", r42._buffer, 2, !1, zt.FLOAT).addAttribute("aTextureCoord", r42._buffer, 2, !1, zt.FLOAT).addAttribute("aColor", r42._buffer, 4, !0, zt.UNSIGNED_BYTE).addAttribute("aTextureId", r42._buffer, 1, !0, zt.FLOAT).addIndex(r42._indexBuffer), r42;
    }
    return Lr(e25, t7), e25;
}(pi), Kn = "precision highp float;\nattribute vec2 aVertexPosition;\nattribute vec2 aTextureCoord;\nattribute vec4 aColor;\nattribute float aTextureId;\n\nuniform mat3 projectionMatrix;\nuniform mat3 translationMatrix;\nuniform vec4 tint;\n\nvarying vec2 vTextureCoord;\nvarying vec4 vColor;\nvarying float vTextureId;\n\nvoid main(void){\n    gl_Position = vec4((projectionMatrix * translationMatrix * vec3(aVertexPosition, 1.0)).xy, 0.0, 1.0);\n\n    vTextureCoord = aTextureCoord;\n    vTextureId = aTextureId;\n    vColor = aColor * tint;\n}\n", Zn = "varying vec2 vTextureCoord;\nvarying vec4 vColor;\nvarying float vTextureId;\nuniform sampler2D uSamplers[%count%];\n\nvoid main(void){\n    vec4 color;\n    %forloop%\n    gl_FragColor = color * vColor;\n}\n", Jn = function() {
    function t7() {
    }
    return t7.create = function(t9) {
        var e25 = Object.assign({
            vertex: Kn,
            fragment: Zn,
            geometryClass: qn,
            vertexSize: 6
        }, t9), r42 = e25.vertex, i43 = e25.fragment, n33 = e25.vertexSize, o33 = e25.geometryClass;
        return (function(t10) {
            function e26(e27) {
                var s30 = t10.call(this, e27) || this;
                return s30.shaderGenerator = new Wn(r42, i43), s30.geometryClass = o33, s30.vertexSize = n33, s30;
            }
            return Lr(e26, t10), e26;
        })(zn);
    }, Object.defineProperty(t7, "defaultVertexSrc", {
        get: function() {
            return Kn;
        },
        enumerable: !1,
        configurable: !0
    }), Object.defineProperty(t7, "defaultFragmentTemplate", {
        get: function() {
            return Zn;
        },
        enumerable: !1,
        configurable: !0
    }), t7;
}(), Qn = Jn.create(), $n = {
}, to = function(t7) {
    Object.defineProperty($n, t7, {
        get: function() {
            return Kr[t7];
        }
    });
};
for(var eo in Kr)to(eo);
var ro = {
}, io = function(t7) {
    Object.defineProperty(ro, t7, {
        get: function() {
            return Fn[t7];
        }
    });
};
for(var eo in Fn)io(eo);
var no = function() {
    function t7(e25) {
        var r42 = this;
        this.stage = new cr, e25 = Object.assign({
            forceCanvas: !1
        }, e25), this.renderer = Xn(e25), t7._plugins.forEach(function(t9) {
            t9.init.call(r42, e25);
        });
    }
    return t7.registerPlugin = function(e25) {
        t7._plugins.push(e25);
    }, t7.prototype.render = function() {
        this.renderer.render(this.stage);
    }, Object.defineProperty(t7.prototype, "view", {
        get: function() {
            return this.renderer.view;
        },
        enumerable: !1,
        configurable: !0
    }), Object.defineProperty(t7.prototype, "screen", {
        get: function() {
            return this.renderer.screen;
        },
        enumerable: !1,
        configurable: !0
    }), t7.prototype.destroy = function(e25, r42) {
        var i43 = this, n33 = t7._plugins.slice(0);
        n33.reverse(), n33.forEach(function(t9) {
            t9.destroy.call(i43);
        }), this.stage.destroy(r42), this.stage = null, this.renderer.destroy(e25), this.renderer = null;
    }, t7._plugins = [], t7;
}(), oo = function() {
    function t7() {
    }
    return t7.init = function(t9) {
        var e25 = this;
        Object.defineProperty(this, "resizeTo", {
            set: function(t10) {
                self.removeEventListener("resize", this.queueResize), this._resizeTo = t10, t10 && (self.addEventListener("resize", this.queueResize), this.resize());
            },
            get: function() {
                return this._resizeTo;
            }
        }), this.queueResize = function() {
            e25._resizeTo && (e25.cancelResize(), e25._resizeId = requestAnimationFrame(function() {
                return e25.resize();
            }));
        }, this.cancelResize = function() {
            e25._resizeId && (cancelAnimationFrame(e25._resizeId), e25._resizeId = null);
        }, this.resize = function() {
            if (e25._resizeTo) {
                var t10, r42;
                if (e25.cancelResize(), e25._resizeTo === self) t10 = self.innerWidth, r42 = self.innerHeight;
                else {
                    var i43 = e25._resizeTo;
                    t10 = i43.clientWidth, r42 = i43.clientHeight;
                }
                e25.renderer.resize(t10, r42);
            }
        }, this._resizeId = null, this._resizeTo = null, this.resizeTo = t9.resizeTo || null;
    }, t7.destroy = function() {
        self.removeEventListener("resize", this.queueResize), this.cancelResize(), this.cancelResize = null, this.queueResize = null, this.resizeTo = null, this.resize = null;
    }, t7;
}();
no.registerPlugin(oo);
var so = new je, ao = function() {
    function t7(t9) {
        this.renderer = t9;
    }
    return t7.prototype.image = function(t9, e25, r43) {
        var i44 = new Image;
        return i44.src = this.base64(t9, e25, r43), i44;
    }, t7.prototype.base64 = function(t9, e25, r43) {
        return this.canvas(t9).toDataURL(e25, r43);
    }, t7.prototype.canvas = function(e25) {
        var r43, i44, n33, o33 = this.renderer, s30 = !1, a30 = !1;
        e25 && (e25 instanceof ni ? n33 = e25 : (n33 = this.renderer.generateTexture(e25), a30 = !0)), n33 ? (r43 = n33.baseTexture.resolution, i44 = n33.frame, s30 = !1, o33.renderTexture.bind(n33)) : (r43 = this.renderer.resolution, s30 = !0, (i44 = so).width = this.renderer.width, i44.height = this.renderer.height, o33.renderTexture.bind(null));
        var h30 = Math.floor(i44.width * r43 + 0.0001), u26 = Math.floor(i44.height * r43 + 0.0001), l18 = new Me(h30, u26, 1), c16 = new Uint8Array(4 * h30 * u26), d16 = o33.gl;
        d16.readPixels(i44.x * r43, i44.y * r43, h30, u26, d16.RGBA, d16.UNSIGNED_BYTE, c16);
        var f11 = l18.context.getImageData(0, 0, h30, u26);
        if (t7.arrayPostDivide(c16, f11.data), l18.context.putImageData(f11, 0, 0), s30) {
            var p = new Me(l18.width, l18.height, 1);
            p.context.scale(1, -1), p.context.drawImage(l18.canvas, 0, -u26), l18.destroy(), l18 = p;
        }
        return a30 && n33.destroy(!0), l18.canvas;
    }, t7.prototype.pixels = function(e25) {
        var r43, i44, n33, o33 = this.renderer, s30 = !1;
        e25 && (e25 instanceof ni ? n33 = e25 : (n33 = this.renderer.generateTexture(e25), s30 = !0)), n33 ? (r43 = n33.baseTexture.resolution, i44 = n33.frame, o33.renderTexture.bind(n33)) : (r43 = o33.resolution, (i44 = so).width = o33.width, i44.height = o33.height, o33.renderTexture.bind(null));
        var a30 = i44.width * r43, h30 = i44.height * r43, u26 = new Uint8Array(4 * a30 * h30), l18 = o33.gl;
        return l18.readPixels(i44.x * r43, i44.y * r43, a30, h30, l18.RGBA, l18.UNSIGNED_BYTE, u26), s30 && n33.destroy(!0), t7.arrayPostDivide(u26, u26), u26;
    }, t7.prototype.destroy = function() {
        this.renderer = null;
    }, t7.arrayPostDivide = function(t9, e25) {
        for(var r43 = 0; r43 < t9.length; r43 += 4){
            var i44 = e25[r43 + 3] = t9[r43 + 3];
            0 !== i44 ? (e25[r43] = Math.round(Math.min(255 * t9[r43] / i44, 255)), e25[r43 + 1] = Math.round(Math.min(255 * t9[r43 + 1] / i44, 255)), e25[r43 + 2] = Math.round(Math.min(255 * t9[r43 + 2] / i44, 255))) : (e25[r43] = t9[r43], e25[r43 + 1] = t9[r43 + 1], e25[r43 + 2] = t9[r43 + 2]);
        }
    }, t7;
}();
var ho = function(t7, e25) {
    if (t7) {
        e25 = e25 || {
        };
        for(var r43 = {
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
        }, i45 = r43.parser[e25.strictMode ? "strict" : "loose"].exec(t7), n33 = {
        }, o33 = 14; o33--;)n33[r43.key[o33]] = i45[o33] || "";
        return n33[r43.q.name] = {
        }, n33[r43.key[12]].replace(r43.q.parser, function(t9, e26, i46) {
            e26 && (n33[r43.q.name][e26] = i46);
        }), n33;
    }
}, uo = U(G(function(t7, e25) {
    Object.defineProperty(e25, "__esModule", {
        value: !0
    });
    var r44 = function() {
        function t9(t11, e26) {
            for(var r45 = 0; r45 < e26.length; r45++){
                var i46 = e26[r45];
                i46.enumerable = i46.enumerable || !1, i46.configurable = !0, "value" in i46 && (i46.writable = !0), Object.defineProperty(t11, i46.key, i46);
            }
        }
        return function(e26, r45, i47) {
            return r45 && t9(e26.prototype, r45), i47 && t9(e26, i47), e26;
        };
    }();
    function i47(t9, e26) {
        if (!(t9 instanceof e26)) throw new TypeError("Cannot call a class as a function");
    }
    var n34 = function() {
        function t9(e26, r45, n35) {
            (void 0) === r45 && (r45 = !1), i47(this, t9), this._fn = e26, this._once = r45, this._thisArg = n35, this._next = this._prev = this._owner = null;
        }
        return r44(t9, [
            {
                key: "detach",
                value: function() {
                    return null !== this._owner && (this._owner.detach(this), !0);
                }
            }
        ]), t9;
    }();
    function o34(t9, e26) {
        return t9._head ? (t9._tail._next = e26, e26._prev = t9._tail, t9._tail = e26) : (t9._head = e26, t9._tail = e26), e26._owner = t9, e26;
    }
    var s30 = function() {
        function t9() {
            i47(this, t9), this._head = this._tail = void 0;
        }
        return r44(t9, [
            {
                key: "handlers",
                value: function() {
                    var t11 = !(arguments.length <= 0 || (void 0) === arguments[0]) && arguments[0], e26 = this._head;
                    if (t11) return !!e26;
                    for(var r45 = []; e26;)r45.push(e26), e26 = e26._next;
                    return r45;
                }
            },
            {
                key: "has",
                value: function(t11) {
                    if (!(t11 instanceof n34)) throw new Error("MiniSignal#has(): First arg must be a MiniSignalBinding object.");
                    return t11._owner === this;
                }
            },
            {
                key: "dispatch",
                value: function() {
                    var t11 = arguments, e26 = this._head;
                    if (!e26) return !1;
                    for(; e26;)e26._once && this.detach(e26), e26._fn.apply(e26._thisArg, t11), e26 = e26._next;
                    return !0;
                }
            },
            {
                key: "add",
                value: function(t11) {
                    var e26 = arguments.length <= 1 || (void 0) === arguments[1] ? null : arguments[1];
                    if ("function" != typeof t11) throw new Error("MiniSignal#add(): First arg must be a Function.");
                    return o34(this, new n34(t11, !1, e26));
                }
            },
            {
                key: "once",
                value: function(t11) {
                    var e26 = arguments.length <= 1 || (void 0) === arguments[1] ? null : arguments[1];
                    if ("function" != typeof t11) throw new Error("MiniSignal#once(): First arg must be a Function.");
                    return o34(this, new n34(t11, !0, e26));
                }
            },
            {
                key: "detach",
                value: function(t11) {
                    if (!(t11 instanceof n34)) throw new Error("MiniSignal#detach(): First arg must be a MiniSignalBinding object.");
                    return t11._owner !== this ? this : (t11._prev && (t11._prev._next = t11._next), t11._next && (t11._next._prev = t11._prev), t11 === this._head ? (this._head = t11._next, null === t11._next && (this._tail = null)) : t11 === this._tail && (this._tail = t11._prev, this._tail._next = null), t11._owner = null, this);
                }
            },
            {
                key: "detachAll",
                value: function() {
                    var t11 = this._head;
                    if (!t11) return this;
                    for(this._head = this._tail = null; t11;)t11._owner = null, t11 = t11._next;
                    return this;
                }
            }
        ]), t9;
    }();
    s30.MiniSignalBinding = n34, e25.default = s30, t7.exports = e25.default;
}));
function lo() {
}
function co(t7, e25, r44, i47) {
    var n34 = 0, o34 = t7.length;
    !function s30(a30) {
        a30 || n34 === o34 ? r44 && r44(a30) : i47 ? setTimeout(function() {
            e25(t7[n34++], s30);
        }, 1) : e25(t7[n34++], s30);
    }();
}
function fo(t7) {
    return function() {
        if (null === t7) throw new Error("Callback was already called.");
        var e25 = t7;
        t7 = null, e25.apply(this, arguments);
    };
}
function po(t7, e25) {
    if (null == e25) e25 = 1;
    else if (0 === e25) throw new Error("Concurrency must not be zero");
    var r44 = 0, i47 = {
        _tasks: [],
        concurrency: e25,
        saturated: lo,
        unsaturated: lo,
        buffer: e25 / 4,
        empty: lo,
        drain: lo,
        error: lo,
        started: !1,
        paused: !1,
        push: function(t9, e26) {
            n34(t9, !1, e26);
        },
        kill: function() {
            r44 = 0, i47.drain = lo, i47.started = !1, i47._tasks = [];
        },
        unshift: function(t9, e26) {
            n34(t9, !0, e26);
        },
        process: function() {
            for(; !i47.paused && r44 < i47.concurrency && i47._tasks.length;){
                var e26 = i47._tasks.shift();
                0 === i47._tasks.length && i47.empty(), (r44 += 1) === i47.concurrency && i47.saturated(), t7(e26.data, fo(o34(e26)));
            }
        },
        length: function() {
            return i47._tasks.length;
        },
        running: function() {
            return r44;
        },
        idle: function() {
            return i47._tasks.length + r44 === 0;
        },
        pause: function() {
            !0 !== i47.paused && (i47.paused = !0);
        },
        resume: function() {
            if (!1 !== i47.paused) {
                i47.paused = !1;
                for(var t9 = 1; t9 <= i47.concurrency; t9++)i47.process();
            }
        }
    };
    function n34(t11, e27, r45) {
        if (null != r45 && "function" != typeof r45) throw new Error("task callback must be a function");
        if (i47.started = !0, null == t11 && i47.idle()) setTimeout(function() {
            return i47.drain();
        }, 1);
        else {
            var n35 = {
                data: t11,
                callback: "function" == typeof r45 ? r45 : lo
            };
            e27 ? i47._tasks.unshift(n35) : i47._tasks.push(n35), setTimeout(function() {
                return i47.process();
            }, 1);
        }
    }
    function o34(t11) {
        return function() {
            r44 -= 1, t11.callback.apply(t11, arguments), null != arguments[0] && i47.error(arguments[0], t11.data), r44 <= i47.concurrency - i47.buffer && i47.unsaturated(), i47.idle() && i47.drain(), i47.process();
        };
    }
    return i47;
}
var _o = {
};
function mo(t7, e25) {
    for(var r44 = 0; r44 < e25.length; r44++){
        var i47 = e25[r44];
        i47.enumerable = i47.enumerable || !1, i47.configurable = !0, "value" in i47 && (i47.writable = !0), Object.defineProperty(t7, i47.key, i47);
    }
}
function vo(t7, e25, r44) {
    return e25 && mo(t7.prototype, e25), r44 && mo(t7, r44), t7;
}
var yo = !(!window.XDomainRequest || "withCredentials" in new XMLHttpRequest), go = null;
function bo() {
}
var xo = function() {
    function t7(e25, r44, i48) {
        if ("string" != typeof e25 || "string" != typeof r44) throw new Error("Both name and url are required for constructing a resource.");
        i48 = i48 || {
        }, this._flags = 0, this._setFlag(t7.STATUS_FLAGS.DATA_URL, 0 === r44.indexOf("data:")), this.name = e25, this.url = r44, this.extension = this._getExtension(), this.data = null, this.crossOrigin = !0 === i48.crossOrigin ? "anonymous" : i48.crossOrigin, this.timeout = i48.timeout || 0, this.loadType = i48.loadType || this._determineLoadType(), this.xhrType = i48.xhrType, this.metadata = i48.metadata || {
        }, this.error = null, this.xhr = null, this.children = [], this.type = t7.TYPE.UNKNOWN, this.progressChunk = 0, this._dequeue = bo, this._onLoadBinding = null, this._elementTimer = 0, this._boundComplete = this.complete.bind(this), this._boundOnError = this._onError.bind(this), this._boundOnProgress = this._onProgress.bind(this), this._boundOnTimeout = this._onTimeout.bind(this), this._boundXhrOnError = this._xhrOnError.bind(this), this._boundXhrOnTimeout = this._xhrOnTimeout.bind(this), this._boundXhrOnAbort = this._xhrOnAbort.bind(this), this._boundXhrOnLoad = this._xhrOnLoad.bind(this), this.onStart = new uo, this.onProgress = new uo, this.onComplete = new uo, this.onAfterMiddleware = new uo;
    }
    t7.setExtensionLoadType = function(e25, r44) {
        To(t7._loadTypeMap, e25, r44);
    }, t7.setExtensionXhrType = function(e25, r44) {
        To(t7._xhrTypeMap, e25, r44);
    };
    var e25 = t7.prototype;
    return e25.complete = function() {
        this._clearEvents(), this._finish();
    }, e25.abort = function(e27) {
        if (!this.error) {
            if (this.error = new Error(e27), this._clearEvents(), this.xhr) this.xhr.abort();
            else if (this.xdr) this.xdr.abort();
            else if (this.data) {
                if (this.data.src) this.data.src = t7.EMPTY_GIF;
                else for(; this.data.firstChild;)this.data.removeChild(this.data.firstChild);
            }
            this._finish();
        }
    }, e25.load = function(e27) {
        var r44 = this;
        if (!this.isLoading) {
            if (this.isComplete) e27 && setTimeout(function() {
                return e27(r44);
            }, 1);
            else switch(e27 && this.onComplete.once(e27), this._setFlag(t7.STATUS_FLAGS.LOADING, !0), this.onStart.dispatch(this), !1 !== this.crossOrigin && "string" == typeof this.crossOrigin || (this.crossOrigin = this._determineCrossOrigin(this.url)), this.loadType){
                case t7.LOAD_TYPE.IMAGE:
                    this.type = t7.TYPE.IMAGE, this._loadElement("image");
                    break;
                case t7.LOAD_TYPE.AUDIO:
                    this.type = t7.TYPE.AUDIO, this._loadSourceElement("audio");
                    break;
                case t7.LOAD_TYPE.VIDEO:
                    this.type = t7.TYPE.VIDEO, this._loadSourceElement("video");
                    break;
                case t7.LOAD_TYPE.XHR:
                default:
                    yo && this.crossOrigin ? this._loadXdr() : this._loadXhr();
            }
        }
    }, e25._hasFlag = function(t11) {
        return 0 != (this._flags & t11);
    }, e25._setFlag = function(t11, e27) {
        this._flags = e27 ? this._flags | t11 : this._flags & ~t11;
    }, e25._clearEvents = function() {
        clearTimeout(this._elementTimer), this.data && this.data.removeEventListener && (this.data.removeEventListener("error", this._boundOnError, !1), this.data.removeEventListener("load", this._boundComplete, !1), this.data.removeEventListener("progress", this._boundOnProgress, !1), this.data.removeEventListener("canplaythrough", this._boundComplete, !1)), this.xhr && (this.xhr.removeEventListener ? (this.xhr.removeEventListener("error", this._boundXhrOnError, !1), this.xhr.removeEventListener("timeout", this._boundXhrOnTimeout, !1), this.xhr.removeEventListener("abort", this._boundXhrOnAbort, !1), this.xhr.removeEventListener("progress", this._boundOnProgress, !1), this.xhr.removeEventListener("load", this._boundXhrOnLoad, !1)) : (this.xhr.onerror = null, this.xhr.ontimeout = null, this.xhr.onprogress = null, this.xhr.onload = null));
    }, e25._finish = function() {
        if (this.isComplete) throw new Error("Complete called again for an already completed resource.");
        this._setFlag(t7.STATUS_FLAGS.COMPLETE, !0), this._setFlag(t7.STATUS_FLAGS.LOADING, !1), this.onComplete.dispatch(this);
    }, e25._loadElement = function(t11) {
        this.metadata.loadElement ? this.data = this.metadata.loadElement : "image" === t11 && (void 0) !== window.Image ? this.data = new Image : this.data = document.createElement(t11), this.crossOrigin && (this.data.crossOrigin = this.crossOrigin), this.metadata.skipSource || (this.data.src = this.url), this.data.addEventListener("error", this._boundOnError, !1), this.data.addEventListener("load", this._boundComplete, !1), this.data.addEventListener("progress", this._boundOnProgress, !1), this.timeout && (this._elementTimer = setTimeout(this._boundOnTimeout, this.timeout));
    }, e25._loadSourceElement = function(t11) {
        if (this.metadata.loadElement ? this.data = this.metadata.loadElement : "audio" === t11 && (void 0) !== window.Audio ? this.data = new Audio : this.data = document.createElement(t11), null !== this.data) {
            if (this.crossOrigin && (this.data.crossOrigin = this.crossOrigin), !this.metadata.skipSource) {
                if (navigator.isCocoonJS) this.data.src = Array.isArray(this.url) ? this.url[0] : this.url;
                else if (Array.isArray(this.url)) for(var e27 = this.metadata.mimeType, r44 = 0; r44 < this.url.length; ++r44)this.data.appendChild(this._createSource(t11, this.url[r44], Array.isArray(e27) ? e27[r44] : e27));
                else {
                    var i48 = this.metadata.mimeType;
                    this.data.appendChild(this._createSource(t11, this.url, Array.isArray(i48) ? i48[0] : i48));
                }
            }
            this.data.addEventListener("error", this._boundOnError, !1), this.data.addEventListener("load", this._boundComplete, !1), this.data.addEventListener("progress", this._boundOnProgress, !1), this.data.addEventListener("canplaythrough", this._boundComplete, !1), this.data.load(), this.timeout && (this._elementTimer = setTimeout(this._boundOnTimeout, this.timeout));
        } else this.abort("Unsupported element: " + t11);
    }, e25._loadXhr = function() {
        "string" != typeof this.xhrType && (this.xhrType = this._determineXhrType());
        var e28 = this.xhr = new XMLHttpRequest;
        e28.open("GET", this.url, !0), e28.timeout = this.timeout, this.xhrType === t7.XHR_RESPONSE_TYPE.JSON || this.xhrType === t7.XHR_RESPONSE_TYPE.DOCUMENT ? e28.responseType = t7.XHR_RESPONSE_TYPE.TEXT : e28.responseType = this.xhrType, e28.addEventListener("error", this._boundXhrOnError, !1), e28.addEventListener("timeout", this._boundXhrOnTimeout, !1), e28.addEventListener("abort", this._boundXhrOnAbort, !1), e28.addEventListener("progress", this._boundOnProgress, !1), e28.addEventListener("load", this._boundXhrOnLoad, !1), e28.send();
    }, e25._loadXdr = function() {
        "string" != typeof this.xhrType && (this.xhrType = this._determineXhrType());
        var t11 = this.xhr = new XDomainRequest;
        t11.timeout = this.timeout || 5000, t11.onerror = this._boundXhrOnError, t11.ontimeout = this._boundXhrOnTimeout, t11.onprogress = this._boundOnProgress, t11.onload = this._boundXhrOnLoad, t11.open("GET", this.url, !0), setTimeout(function() {
            return t11.send();
        }, 1);
    }, e25._createSource = function(t11, e28, r45) {
        r45 || (r45 = t11 + "/" + this._getExtension(e28));
        var i49 = document.createElement("source");
        return i49.src = e28, i49.type = r45, i49;
    }, e25._onError = function(t11) {
        this.abort("Failed to load element using: " + t11.target.nodeName);
    }, e25._onProgress = function(t11) {
        t11 && t11.lengthComputable && this.onProgress.dispatch(this, t11.loaded / t11.total);
    }, e25._onTimeout = function() {
        this.abort("Load timed out.");
    }, e25._xhrOnError = function() {
        var t11 = this.xhr;
        this.abort(Eo(t11) + " Request failed. Status: " + t11.status + ', text: "' + t11.statusText + '"');
    }, e25._xhrOnTimeout = function() {
        var t11 = this.xhr;
        this.abort(Eo(t11) + " Request timed out.");
    }, e25._xhrOnAbort = function() {
        var t11 = this.xhr;
        this.abort(Eo(t11) + " Request was aborted by the user.");
    }, e25._xhrOnLoad = function() {
        var e28 = this.xhr, r45 = "", i49 = (void 0) === e28.status ? 200 : e28.status;
        if ("" !== e28.responseType && "text" !== e28.responseType && (void 0) !== e28.responseType || (r45 = e28.responseText), 0 === i49 && (r45.length > 0 || e28.responseType === t7.XHR_RESPONSE_TYPE.BUFFER) ? i49 = 200 : 1223 === i49 && (i49 = 204), 2 === (i49 / 100 | 0)) {
            if (this.xhrType === t7.XHR_RESPONSE_TYPE.TEXT) this.data = r45, this.type = t7.TYPE.TEXT;
            else if (this.xhrType === t7.XHR_RESPONSE_TYPE.JSON) try {
                this.data = JSON.parse(r45), this.type = t7.TYPE.JSON;
            } catch (t11) {
                return void this.abort("Error trying to parse loaded json: " + t11);
            }
            else if (this.xhrType === t7.XHR_RESPONSE_TYPE.DOCUMENT) try {
                if (window.DOMParser) {
                    var n34 = new DOMParser;
                    this.data = n34.parseFromString(r45, "text/xml");
                } else {
                    var o34 = document.createElement("div");
                    o34.innerHTML = r45, this.data = o34;
                }
                this.type = t7.TYPE.XML;
            } catch (t11) {
                return void this.abort("Error trying to parse loaded xml: " + t11);
            }
            else this.data = e28.response || r45;
            this.complete();
        } else this.abort("[" + e28.status + "] " + e28.statusText + ": " + e28.responseURL);
    }, e25._determineCrossOrigin = function(t11, e28) {
        if (0 === t11.indexOf("data:")) return "";
        if (window.origin !== window.location.origin) return "anonymous";
        e28 = e28 || window.location, go || (go = document.createElement("a")), go.href = t11;
        var r45 = !(t11 = ho(go.href, {
            strictMode: !0
        })).port && "" === e28.port || t11.port === e28.port, i49 = t11.protocol ? t11.protocol + ":" : "";
        return t11.host === e28.hostname && r45 && i49 === e28.protocol ? "" : "anonymous";
    }, e25._determineXhrType = function() {
        return t7._xhrTypeMap[this.extension] || t7.XHR_RESPONSE_TYPE.TEXT;
    }, e25._determineLoadType = function() {
        return t7._loadTypeMap[this.extension] || t7.LOAD_TYPE.XHR;
    }, e25._getExtension = function() {
        var t11 = this.url, e28 = "";
        if (this.isDataUrl) {
            var r45 = t11.indexOf("/");
            e28 = t11.substring(r45 + 1, t11.indexOf(";", r45));
        } else {
            var i49 = t11.indexOf("?"), n36 = t11.indexOf("#"), o35 = Math.min(i49 > -1 ? i49 : t11.length, n36 > -1 ? n36 : t11.length);
            e28 = (t11 = t11.substring(0, o35)).substring(t11.lastIndexOf(".") + 1);
        }
        return e28.toLowerCase();
    }, e25._getMimeFromXhrType = function(e28) {
        switch(e28){
            case t7.XHR_RESPONSE_TYPE.BUFFER:
                return "application/octet-binary";
            case t7.XHR_RESPONSE_TYPE.BLOB:
                return "application/blob";
            case t7.XHR_RESPONSE_TYPE.DOCUMENT:
                return "application/xml";
            case t7.XHR_RESPONSE_TYPE.JSON:
                return "application/json";
            case t7.XHR_RESPONSE_TYPE.DEFAULT:
            case t7.XHR_RESPONSE_TYPE.TEXT:
            default:
                return "text/plain";
        }
    }, vo(t7, [
        {
            key: "isDataUrl",
            get: function() {
                return this._hasFlag(t7.STATUS_FLAGS.DATA_URL);
            }
        },
        {
            key: "isComplete",
            get: function() {
                return this._hasFlag(t7.STATUS_FLAGS.COMPLETE);
            }
        },
        {
            key: "isLoading",
            get: function() {
                return this._hasFlag(t7.STATUS_FLAGS.LOADING);
            }
        }
    ]), t7;
}();
function To(t7, e25, r46) {
    e25 && 0 === e25.indexOf(".") && (e25 = e25.substring(1)), e25 && (t7[e25] = r46);
}
function Eo(t7) {
    return t7.toString().replace("object ", "");
}
xo.STATUS_FLAGS = {
    NONE: 0,
    DATA_URL: 1,
    COMPLETE: 2,
    LOADING: 4
}, xo.TYPE = {
    UNKNOWN: 0,
    JSON: 1,
    XML: 2,
    IMAGE: 3,
    AUDIO: 4,
    VIDEO: 5,
    TEXT: 6
}, xo.LOAD_TYPE = {
    XHR: 1,
    IMAGE: 2,
    AUDIO: 3,
    VIDEO: 4
}, xo.XHR_RESPONSE_TYPE = {
    DEFAULT: "text",
    BUFFER: "arraybuffer",
    BLOB: "blob",
    DOCUMENT: "document",
    JSON: "json",
    TEXT: "text"
}, xo._loadTypeMap = {
    gif: xo.LOAD_TYPE.IMAGE,
    png: xo.LOAD_TYPE.IMAGE,
    bmp: xo.LOAD_TYPE.IMAGE,
    jpg: xo.LOAD_TYPE.IMAGE,
    jpeg: xo.LOAD_TYPE.IMAGE,
    tif: xo.LOAD_TYPE.IMAGE,
    tiff: xo.LOAD_TYPE.IMAGE,
    webp: xo.LOAD_TYPE.IMAGE,
    tga: xo.LOAD_TYPE.IMAGE,
    svg: xo.LOAD_TYPE.IMAGE,
    "svg+xml": xo.LOAD_TYPE.IMAGE,
    mp3: xo.LOAD_TYPE.AUDIO,
    ogg: xo.LOAD_TYPE.AUDIO,
    wav: xo.LOAD_TYPE.AUDIO,
    mp4: xo.LOAD_TYPE.VIDEO,
    webm: xo.LOAD_TYPE.VIDEO
}, xo._xhrTypeMap = {
    xhtml: xo.XHR_RESPONSE_TYPE.DOCUMENT,
    html: xo.XHR_RESPONSE_TYPE.DOCUMENT,
    htm: xo.XHR_RESPONSE_TYPE.DOCUMENT,
    xml: xo.XHR_RESPONSE_TYPE.DOCUMENT,
    tmx: xo.XHR_RESPONSE_TYPE.DOCUMENT,
    svg: xo.XHR_RESPONSE_TYPE.DOCUMENT,
    tsx: xo.XHR_RESPONSE_TYPE.DOCUMENT,
    gif: xo.XHR_RESPONSE_TYPE.BLOB,
    png: xo.XHR_RESPONSE_TYPE.BLOB,
    bmp: xo.XHR_RESPONSE_TYPE.BLOB,
    jpg: xo.XHR_RESPONSE_TYPE.BLOB,
    jpeg: xo.XHR_RESPONSE_TYPE.BLOB,
    tif: xo.XHR_RESPONSE_TYPE.BLOB,
    tiff: xo.XHR_RESPONSE_TYPE.BLOB,
    webp: xo.XHR_RESPONSE_TYPE.BLOB,
    tga: xo.XHR_RESPONSE_TYPE.BLOB,
    json: xo.XHR_RESPONSE_TYPE.JSON,
    text: xo.XHR_RESPONSE_TYPE.TEXT,
    txt: xo.XHR_RESPONSE_TYPE.TEXT,
    ttf: xo.XHR_RESPONSE_TYPE.BUFFER,
    otf: xo.XHR_RESPONSE_TYPE.BUFFER
}, xo.EMPTY_GIF = "data:image/gif;base64,R0lGODlhAQABAIAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw==";
var Ao = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
var So = window.URL || window.webkitURL;
var Oo = {
    caching: function(t7, e25) {
        var r46 = this;
        _o[t7.url] ? (t7.data = _o[t7.url], t7.complete()) : t7.onComplete.once(function() {
            return _o[r46.url] = r46.data;
        }), e25();
    },
    parsing: function(t7, e25) {
        if (t7.data) {
            if (t7.xhr && t7.xhrType === xo.XHR_RESPONSE_TYPE.BLOB) {
                if (window.Blob && "string" != typeof t7.data) {
                    if (0 === t7.data.type.indexOf("image")) {
                        var r46 = So.createObjectURL(t7.data);
                        return t7.blob = t7.data, t7.data = new Image, t7.data.src = r46, t7.type = xo.TYPE.IMAGE, void (t7.data.onload = function() {
                            So.revokeObjectURL(r46), t7.data.onload = null, e25();
                        });
                    }
                } else {
                    var i50 = t7.xhr.getResponseHeader("content-type");
                    if (i50 && 0 === i50.indexOf("image")) return t7.data = new Image, t7.data.src = "data:" + i50 + ";base64," + (function(t11) {
                        for(var e28 = "", r47 = 0; r47 < t11.length;){
                            for(var i51 = [
                                0,
                                0,
                                0
                            ], n37 = [
                                0,
                                0,
                                0,
                                0
                            ], o36 = 0; o36 < i51.length; ++o36)r47 < t11.length ? i51[o36] = 255 & t11.charCodeAt(r47++) : i51[o36] = 0;
                            switch(n37[0] = i51[0] >> 2, n37[1] = (3 & i51[0]) << 4 | i51[1] >> 4, n37[2] = (15 & i51[1]) << 2 | i51[2] >> 6, n37[3] = 63 & i51[2], r47 - (t11.length - 1)){
                                case 2:
                                    n37[3] = 64, n37[2] = 64;
                                    break;
                                case 1:
                                    n37[3] = 64;
                            }
                            for(var s30 = 0; s30 < n37.length; ++s30)e28 += Ao.charAt(n37[s30]);
                        }
                        return e28;
                    })(t7.xhr.responseText), t7.type = xo.TYPE.IMAGE, void (t7.data.onload = function() {
                        t7.data.onload = null, e25();
                    });
                }
            }
            e25();
        } else e25();
    }
}, Ro = /(#[\w-]+)?$/, wo = function() {
    function t7(e25, r47) {
        var i52 = this;
        (void 0) === e25 && (e25 = ""), (void 0) === r47 && (r47 = 10), this.baseUrl = e25, this.progress = 0, this.loading = !1, this.defaultQueryString = "", this._beforeMiddleware = [], this._afterMiddleware = [], this._resourcesParsing = [], this._boundLoadResource = function(t11, e28) {
            return i52._loadResource(t11, e28);
        }, this._queue = po(this._boundLoadResource, r47), this._queue.pause(), this.resources = {
        }, this.onProgress = new uo, this.onError = new uo, this.onLoad = new uo, this.onStart = new uo, this.onComplete = new uo;
        for(var n38 = 0; n38 < t7._defaultBeforeMiddleware.length; ++n38)this.pre(t7._defaultBeforeMiddleware[n38]);
        for(var o37 = 0; o37 < t7._defaultAfterMiddleware.length; ++o37)this.use(t7._defaultAfterMiddleware[o37]);
    }
    var e25 = t7.prototype;
    return e25.add = function(t11, e28, r47, i52) {
        if (Array.isArray(t11)) {
            for(var n38 = 0; n38 < t11.length; ++n38)this.add(t11[n38]);
            return this;
        }
        if ("object" == typeof t11 && (i52 = e28 || t11.callback || t11.onComplete, r47 = t11, e28 = t11.url, t11 = t11.name || t11.key || t11.url), "string" != typeof e28 && (i52 = r47, r47 = e28, e28 = t11), "string" != typeof e28) throw new Error("No url passed to add resource to loader.");
        if ("function" == typeof r47 && (i52 = r47, r47 = null), this.loading && (!r47 || !r47.parentResource)) throw new Error("Cannot add resources while the loader is running.");
        if (this.resources[t11]) throw new Error('Resource named "' + t11 + '" already exists.');
        if (e28 = this._prepareUrl(e28), this.resources[t11] = new xo(t11, e28, r47), "function" == typeof i52 && this.resources[t11].onAfterMiddleware.once(i52), this.loading) {
            for(var o37 = r47.parentResource, s31 = [], a30 = 0; a30 < o37.children.length; ++a30)o37.children[a30].isComplete || s31.push(o37.children[a30]);
            var h30 = o37.progressChunk * (s31.length + 1) / (s31.length + 2);
            o37.children.push(this.resources[t11]), o37.progressChunk = h30;
            for(var u26 = 0; u26 < s31.length; ++u26)s31[u26].progressChunk = h30;
            this.resources[t11].progressChunk = h30;
        }
        return this._queue.push(this.resources[t11]), this;
    }, e25.pre = function(t11) {
        return this._beforeMiddleware.push(t11), this;
    }, e25.use = function(t11) {
        return this._afterMiddleware.push(t11), this;
    }, e25.reset = function() {
        for(var t11 in this.progress = 0, this.loading = !1, this._queue.kill(), this._queue.pause(), this.resources){
            var e28 = this.resources[t11];
            e28._onLoadBinding && e28._onLoadBinding.detach(), e28.isLoading && e28.abort();
        }
        return this.resources = {
        }, this;
    }, e25.load = function(t11) {
        if ("function" == typeof t11 && this.onComplete.once(t11), this.loading) return this;
        if (this._queue.idle()) this._onStart(), this._onComplete();
        else {
            for(var e29 = 100 / this._queue._tasks.length, r47 = 0; r47 < this._queue._tasks.length; ++r47)this._queue._tasks[r47].data.progressChunk = e29;
            this._onStart(), this._queue.resume();
        }
        return this;
    }, e25._prepareUrl = function(t11) {
        var e30, r48 = ho(t11, {
            strictMode: !0
        });
        if (e30 = r48.protocol || !r48.path || 0 === t11.indexOf("//") ? t11 : this.baseUrl.length && this.baseUrl.lastIndexOf("/") !== this.baseUrl.length - 1 && "/" !== t11.charAt(0) ? this.baseUrl + "/" + t11 : this.baseUrl + t11, this.defaultQueryString) {
            var i52 = Ro.exec(e30)[0];
            -1 !== (e30 = e30.substr(0, e30.length - i52.length)).indexOf("?") ? e30 += "&" + this.defaultQueryString : e30 += "?" + this.defaultQueryString, e30 += i52;
        }
        return e30;
    }, e25._loadResource = function(t11, e30) {
        var r48 = this;
        t11._dequeue = e30, co(this._beforeMiddleware, function(e31, i53) {
            e31.call(r48, t11, function() {
                i53(t11.isComplete ? {
                } : null);
            });
        }, function() {
            t11.isComplete ? r48._onLoad(t11) : (t11._onLoadBinding = t11.onComplete.once(r48._onLoad, r48), t11.load());
        }, !0);
    }, e25._onStart = function() {
        this.progress = 0, this.loading = !0, this.onStart.dispatch(this);
    }, e25._onComplete = function() {
        this.progress = 100, this.loading = !1, this.onComplete.dispatch(this, this.resources);
    }, e25._onLoad = function(t11) {
        var e30 = this;
        t11._onLoadBinding = null, this._resourcesParsing.push(t11), t11._dequeue(), co(this._afterMiddleware, function(r48, i53) {
            r48.call(e30, t11, i53);
        }, function() {
            t11.onAfterMiddleware.dispatch(t11), e30.progress = Math.min(100, e30.progress + t11.progressChunk), e30.onProgress.dispatch(e30, t11), t11.error ? e30.onError.dispatch(t11.error, e30, t11) : e30.onLoad.dispatch(e30, t11), e30._resourcesParsing.splice(e30._resourcesParsing.indexOf(t11), 1), e30._queue.idle() && 0 === e30._resourcesParsing.length && e30._onComplete();
        }, !0);
    }, vo(t7, [
        {
            key: "concurrency",
            get: function() {
                return this._queue.concurrency;
            },
            set: function(t11) {
                this._queue.concurrency = t11;
            }
        }
    ]), t7;
}();
wo._defaultBeforeMiddleware = [], wo._defaultAfterMiddleware = [], wo.pre = function(t7) {
    return wo._defaultBeforeMiddleware.push(t7), wo;
}, wo.use = function(t7) {
    return wo._defaultAfterMiddleware.push(t7), wo;
};
var Po = function(t7, e25) {
    return (Po = Object.setPrototypeOf || ({
        __proto__: []
    }) instanceof Array && function(t11, e30) {
        t11.__proto__ = e30;
    } || function(t11, e30) {
        for(var r48 in e30)e30.hasOwnProperty(r48) && (t11[r48] = e30[r48]);
    })(t7, e25);
}, Io = function() {
    function t7() {
    }
    return t7.add = function() {
        xo.setExtensionLoadType("svg", xo.LOAD_TYPE.XHR), xo.setExtensionXhrType("svg", xo.XHR_RESPONSE_TYPE.TEXT);
    }, t7.use = function(t11, e25) {
        if (!t11.data || t11.type !== xo.TYPE.IMAGE && "svg" !== t11.extension) e25();
        else {
            var r48 = t11.data, i53 = t11.url, n39 = t11.name, o38 = t11.metadata;
            ri.fromLoader(r48, i53, n39, o38).then(function(r49) {
                t11.texture = r49, e25();
            }).catch(e25);
        }
    }, t7;
}(), Mo = function(t7) {
    function e25(r49, i54) {
        for(var n40 = t7.call(this, r49, i54) || this, o39 = 0; o39 < e25._plugins.length; ++o39){
            var s32 = e25._plugins[o39], a31 = s32.pre, h31 = s32.use;
            a31 && n40.pre(a31), h31 && n40.use(h31);
        }
        return n40._protected = !1, n40;
    }
    return (function(t11, e30) {
        function r49() {
            this.constructor = t11;
        }
        Po(t11, e30), t11.prototype = null === e30 ? Object.create(e30) : (r49.prototype = e30.prototype, new r49);
    })(e25, t7), e25.prototype.destroy = function() {
        this._protected || this.reset();
    }, Object.defineProperty(e25, "shared", {
        get: function() {
            var t11 = e25._shared;
            return t11 || ((t11 = new e25)._protected = !0, e25._shared = t11), t11;
        },
        enumerable: !1,
        configurable: !0
    }), e25.registerPlugin = function(t11) {
        return e25._plugins.push(t11), t11.add && t11.add(), e25;
    }, e25._plugins = [], e25;
}(wo);
Mo.registerPlugin({
    use: Oo.parsing
}), Mo.registerPlugin(Io);
var Do, Co, No = function() {
    function t7() {
    }
    return t7.init = function(t11) {
        t11 = Object.assign({
            sharedLoader: !1
        }, t11), this.loader = t11.sharedLoader ? Mo.shared : new Mo;
    }, t7.destroy = function() {
        this.loader && (this.loader.destroy(), this.loader = null);
    }, t7;
}(), Lo = xo;
!function(t7) {
    t7[t7.COMPRESSED_RGB_S3TC_DXT1_EXT = 33776] = "COMPRESSED_RGB_S3TC_DXT1_EXT", t7[t7.COMPRESSED_RGBA_S3TC_DXT1_EXT = 33777] = "COMPRESSED_RGBA_S3TC_DXT1_EXT", t7[t7.COMPRESSED_RGBA_S3TC_DXT3_EXT = 33778] = "COMPRESSED_RGBA_S3TC_DXT3_EXT", t7[t7.COMPRESSED_RGBA_S3TC_DXT5_EXT = 33779] = "COMPRESSED_RGBA_S3TC_DXT5_EXT", t7[t7.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT = 35917] = "COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT", t7[t7.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT = 35918] = "COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT", t7[t7.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT = 35919] = "COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT", t7[t7.COMPRESSED_SRGB_S3TC_DXT1_EXT = 35916] = "COMPRESSED_SRGB_S3TC_DXT1_EXT", t7[t7.COMPRESSED_R11_EAC = 37488] = "COMPRESSED_R11_EAC", t7[t7.COMPRESSED_SIGNED_R11_EAC = 37489] = "COMPRESSED_SIGNED_R11_EAC", t7[t7.COMPRESSED_RG11_EAC = 37490] = "COMPRESSED_RG11_EAC", t7[t7.COMPRESSED_SIGNED_RG11_EAC = 37491] = "COMPRESSED_SIGNED_RG11_EAC", t7[t7.COMPRESSED_RGB8_ETC2 = 37492] = "COMPRESSED_RGB8_ETC2", t7[t7.COMPRESSED_RGBA8_ETC2_EAC = 37496] = "COMPRESSED_RGBA8_ETC2_EAC", t7[t7.COMPRESSED_SRGB8_ETC2 = 37493] = "COMPRESSED_SRGB8_ETC2", t7[t7.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC = 37497] = "COMPRESSED_SRGB8_ALPHA8_ETC2_EAC", t7[t7.COMPRESSED_RGB8_PUNCHTHROUGH_ALPHA1_ETC2 = 37494] = "COMPRESSED_RGB8_PUNCHTHROUGH_ALPHA1_ETC2", t7[t7.COMPRESSED_SRGB8_PUNCHTHROUGH_ALPHA1_ETC2 = 37495] = "COMPRESSED_SRGB8_PUNCHTHROUGH_ALPHA1_ETC2", t7[t7.COMPRESSED_RGB_PVRTC_4BPPV1_IMG = 35840] = "COMPRESSED_RGB_PVRTC_4BPPV1_IMG", t7[t7.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG = 35842] = "COMPRESSED_RGBA_PVRTC_4BPPV1_IMG", t7[t7.COMPRESSED_RGB_PVRTC_2BPPV1_IMG = 35841] = "COMPRESSED_RGB_PVRTC_2BPPV1_IMG", t7[t7.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG = 35843] = "COMPRESSED_RGBA_PVRTC_2BPPV1_IMG", t7[t7.COMPRESSED_RGB_ETC1_WEBGL = 36196] = "COMPRESSED_RGB_ETC1_WEBGL", t7[t7.COMPRESSED_RGB_ATC_WEBGL = 35986] = "COMPRESSED_RGB_ATC_WEBGL", t7[t7.COMPRESSED_RGBA_ATC_EXPLICIT_ALPHA_WEBGL = 35986] = "COMPRESSED_RGBA_ATC_EXPLICIT_ALPHA_WEBGL", t7[t7.COMPRESSED_RGBA_ATC_INTERPOLATED_ALPHA_WEBGL = 34798] = "COMPRESSED_RGBA_ATC_INTERPOLATED_ALPHA_WEBGL";
}(Co || (Co = {
}));
var Fo = ((Do = {
})[Co.COMPRESSED_RGB_S3TC_DXT1_EXT] = 0.5, Do[Co.COMPRESSED_RGBA_S3TC_DXT1_EXT] = 0.5, Do[Co.COMPRESSED_RGBA_S3TC_DXT3_EXT] = 1, Do[Co.COMPRESSED_RGBA_S3TC_DXT5_EXT] = 1, Do[Co.COMPRESSED_SRGB_S3TC_DXT1_EXT] = 0.5, Do[Co.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT] = 0.5, Do[Co.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT] = 1, Do[Co.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT] = 1, Do[Co.COMPRESSED_R11_EAC] = 0.5, Do[Co.COMPRESSED_SIGNED_R11_EAC] = 0.5, Do[Co.COMPRESSED_RG11_EAC] = 1, Do[Co.COMPRESSED_SIGNED_RG11_EAC] = 1, Do[Co.COMPRESSED_RGB8_ETC2] = 0.5, Do[Co.COMPRESSED_RGBA8_ETC2_EAC] = 1, Do[Co.COMPRESSED_SRGB8_ETC2] = 0.5, Do[Co.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC] = 1, Do[Co.COMPRESSED_RGB8_PUNCHTHROUGH_ALPHA1_ETC2] = 0.5, Do[Co.COMPRESSED_SRGB8_PUNCHTHROUGH_ALPHA1_ETC2] = 0.5, Do[Co.COMPRESSED_RGB_PVRTC_4BPPV1_IMG] = 0.5, Do[Co.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG] = 0.5, Do[Co.COMPRESSED_RGB_PVRTC_2BPPV1_IMG] = 0.25, Do[Co.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG] = 0.25, Do[Co.COMPRESSED_RGB_ETC1_WEBGL] = 0.5, Do[Co.COMPRESSED_RGB_ATC_WEBGL] = 0.5, Do[Co.COMPRESSED_RGBA_ATC_EXPLICIT_ALPHA_WEBGL] = 1, Do[Co.COMPRESSED_RGBA_ATC_INTERPOLATED_ALPHA_WEBGL] = 1, Do), Bo = function(t7, e25) {
    return (Bo = Object.setPrototypeOf || ({
        __proto__: []
    }) instanceof Array && function(t11, e30) {
        t11.__proto__ = e30;
    } || function(t11, e30) {
        for(var r49 in e30)e30.hasOwnProperty(r49) && (t11[r49] = e30[r49]);
    })(t7, e25);
};
function Uo(t7, e25) {
    function r49() {
        this.constructor = t7;
    }
    Bo(t7, e25), t7.prototype = null === e25 ? Object.create(e25) : (r49.prototype = e25.prototype, new r49);
}
var Go = function(t7) {
    function e25(e30, r49) {
        (void 0) === r49 && (r49 = {
            width: 1,
            height: 1,
            autoLoad: !0
        });
        var i54, n40, o39 = this;
        return "string" == typeof e30 ? (i54 = e30, n40 = new Uint8Array) : (i54 = null, n40 = e30), (o39 = t7.call(this, n40, r49) || this).origin = i54, o39.buffer = n40 ? new Vn(n40) : null, o39.origin && !1 !== r49.autoLoad && o39.load(), n40 && n40.length && (o39.loaded = !0, o39.onBlobLoaded(o39.buffer.rawBinaryData)), o39;
    }
    return Uo(e25, t7), e25.prototype.onBlobLoaded = function(t11) {
    }, e25.prototype.load = function() {
        return t12 = this, e31 = Promise, r50 = function() {
            var t12;
            return (function(t13, e31) {
                var r50, i54, n40, o39, s33 = {
                    label: 0,
                    sent: function() {
                        if (1 & n40[0]) throw n40[1];
                        return n40[1];
                    },
                    trys: [],
                    ops: []
                };
                return o39 = {
                    next: a33(0),
                    throw: a33(1),
                    return: a33(2)
                }, "function" == typeof Symbol && (o39[Symbol.iterator] = function() {
                    return this;
                }), o39;
                function a33(o40) {
                    return function(a34) {
                        return (function(o41) {
                            if (r50) throw new TypeError("Generator is already executing.");
                            for(; s33;)try {
                                if (r50 = 1, i54 && (n40 = 2 & o41[0] ? i54.return : o41[0] ? i54.throw || ((n40 = i54.return) && n40.call(i54), 0) : i54.next) && !(n40 = n40.call(i54, o41[1])).done) return n40;
                                switch(i54 = 0, n40 && (o41 = [
                                    2 & o41[0],
                                    n40.value
                                ]), o41[0]){
                                    case 0:
                                    case 1:
                                        n40 = o41;
                                        break;
                                    case 4:
                                        return s33.label++, {
                                            value: o41[1],
                                            done: !1
                                        };
                                    case 5:
                                        s33.label++, i54 = o41[1], o41 = [
                                            0
                                        ];
                                        continue;
                                    case 7:
                                        o41 = s33.ops.pop(), s33.trys.pop();
                                        continue;
                                    default:
                                        if (!(n40 = (n40 = s33.trys).length > 0 && n40[n40.length - 1]) && (6 === o41[0] || 2 === o41[0])) {
                                            s33 = 0;
                                            continue;
                                        }
                                        if (3 === o41[0] && (!n40 || o41[1] > n40[0] && o41[1] < n40[3])) {
                                            s33.label = o41[1];
                                            break;
                                        }
                                        if (6 === o41[0] && s33.label < n40[1]) {
                                            s33.label = n40[1], n40 = o41;
                                            break;
                                        }
                                        if (n40 && s33.label < n40[2]) {
                                            s33.label = n40[2], s33.ops.push(o41);
                                            break;
                                        }
                                        n40[2] && s33.ops.pop(), s33.trys.pop();
                                        continue;
                                }
                                o41 = e31.call(t13, s33);
                            } catch (t14) {
                                o41 = [
                                    6,
                                    t14
                                ], i54 = 0;
                            } finally{
                                r50 = n40 = 0;
                            }
                            if (5 & o41[0]) throw o41[1];
                            return {
                                value: o41[0] ? o41[1] : void 0,
                                done: !0
                            };
                        })([
                            o40,
                            a34
                        ]);
                    };
                }
            })(this, function(e31) {
                switch(e31.label){
                    case 0:
                        return [
                            4,
                            fetch(this.origin)
                        ];
                    case 1:
                        return [
                            4,
                            e31.sent().blob()
                        ];
                    case 2:
                        return [
                            4,
                            e31.sent().arrayBuffer()
                        ];
                    case 3:
                        return t12 = e31.sent(), this.data = new Uint32Array(t12), this.buffer = new Vn(t12), this.loaded = !0, this.onBlobLoaded(t12), this.update(), [
                            2,
                            this
                        ];
                }
            });
        }, new (e31 || (e31 = Promise))(function(i54, n40) {
            function o39(t12) {
                try {
                    a33(r50.next(t12));
                } catch (t13) {
                    n40(t13);
                }
            }
            function s33(t12) {
                try {
                    a33(r50.throw(t12));
                } catch (t13) {
                    n40(t13);
                }
            }
            function a33(t12) {
                t12.done ? i54(t12.value) : new e31(function(e31) {
                    e31(t12.value);
                }).then(o39, s33);
            }
            a33((r50 = r50.apply(t12, [])).next());
        });
        var t12, e31, r50;
    }, e25;
}(Br), Xo = function(t7) {
    function e25(r50, i54) {
        var n40 = t7.call(this, r50, i54) || this;
        return n40.format = i54.format, n40.levels = i54.levels || 1, n40._width = i54.width, n40._height = i54.height, n40._extension = e25._formatToExtension(n40.format), (i54.levelBuffers || n40.buffer) && (n40._levelBuffers = i54.levelBuffers || e25._createLevelBuffers(r50 instanceof Uint8Array ? r50 : n40.buffer.uint8View, n40.format, n40.levels, 4, 4, n40.width, n40.height)), n40;
    }
    return Uo(e25, t7), e25.prototype.upload = function(t12, e31, r50) {
        var i54 = t12.gl;
        if (!t12.context.extensions[this._extension]) throw new Error(this._extension + " textures are not supported on the current machine");
        if (!this._levelBuffers) return !1;
        for(var n40 = 0, o39 = this.levels; n40 < o39; n40++){
            var s33 = this._levelBuffers[n40], a33 = s33.levelID, h32 = s33.levelWidth, u27 = s33.levelHeight, l18 = s33.levelBuffer;
            i54.compressedTexImage2D(i54.TEXTURE_2D, a33, this.format, h32, u27, 0, l18);
        }
        return !0;
    }, e25.prototype.onBlobLoaded = function() {
        this._levelBuffers = e25._createLevelBuffers(this.buffer.uint8View, this.format, this.levels, 4, 4, this.width, this.height);
    }, e25._formatToExtension = function(t12) {
        if (t12 >= 33776 && t12 <= 33779) return "s3tc";
        if (t12 >= 37488 && t12 <= 37497) return "etc";
        if (t12 >= 35840 && t12 <= 35843) return "pvrtc";
        if (t12 >= 36196) return "etc1";
        if (t12 >= 35986 && t12 <= 34798) return "atc";
        throw new Error("Invalid (compressed) texture format given!");
    }, e25._createLevelBuffers = function(t12, e31, r50, i54, n40, o39, s34) {
        for(var a34 = new Array(r50), h33 = t12.byteOffset, u28 = o39, l19 = s34, c16 = u28 + i54 - 1 & ~(i54 - 1), d16 = l19 + n40 - 1 & ~(n40 - 1), f11 = c16 * d16 * Fo[e31], p = 0; p < r50; p++)a34[p] = {
            levelID: p,
            levelWidth: r50 > 1 ? u28 : c16,
            levelHeight: r50 > 1 ? l19 : d16,
            levelBuffer: new Uint8Array(t12.buffer, h33, f11)
        }, h33 += f11, f11 = (c16 = (u28 = u28 >> 1 || 1) + i54 - 1 & ~(i54 - 1)) * (d16 = (l19 = l19 >> 1 || 1) + n40 - 1 & ~(n40 - 1)) * Fo[e31];
        return a34;
    }, e25;
}(Go), ko = /iPhone/i, jo = /iPod/i, Ho = /iPad/i, Yo = /\biOS-universal(?:.+)Mac\b/i, Vo = /\bAndroid(?:.+)Mobile\b/i, zo = /Android/i, Wo = /(?:SD4930UR|\bSilk(?:.+)Mobile\b)/i, qo = /Silk/i, Ko = /Windows Phone/i, Zo = /\bWindows(?:.+)ARM\b/i, Jo = /BlackBerry/i, Qo = /BB10/i, $o = /Opera Mini/i, ts = /\b(CriOS|Chrome)(?:.+)Mobile/i, es = /Mobile(?:.+)Firefox\b/i, rs = function(t7) {
    return (void 0) !== t7 && "MacIntel" === t7.platform && "number" == typeof t7.maxTouchPoints && t7.maxTouchPoints > 1 && "undefined" == typeof MSStream;
}, is = function(t7) {
    var e25 = {
        userAgent: "",
        platform: "",
        maxTouchPoints: 0
    };
    t7 || "undefined" == typeof navigator ? "string" == typeof t7 ? e25.userAgent = t7 : t7 && t7.userAgent && (e25 = {
        userAgent: t7.userAgent,
        platform: t7.platform,
        maxTouchPoints: t7.maxTouchPoints || 0
    }) : e25 = {
        userAgent: navigator.userAgent,
        platform: navigator.platform,
        maxTouchPoints: navigator.maxTouchPoints || 0
    };
    var r50 = e25.userAgent, i54 = r50.split("[FBAN");
    (void 0) !== i54[1] && (r50 = i54[0]), (void 0) !== (i54 = r50.split("Twitter"))[1] && (r50 = i54[0]);
    var n40 = function(t12) {
        return function(e31) {
            return e31.test(t12);
        };
    }(r50), o39 = {
        apple: {
            phone: n40(ko) && !n40(Ko),
            ipod: n40(jo),
            tablet: !n40(ko) && (n40(Ho) || rs(e25)) && !n40(Ko),
            universal: n40(Yo),
            device: (n40(ko) || n40(jo) || n40(Ho) || n40(Yo) || rs(e25)) && !n40(Ko)
        },
        amazon: {
            phone: n40(Wo),
            tablet: !n40(Wo) && n40(qo),
            device: n40(Wo) || n40(qo)
        },
        android: {
            phone: !n40(Ko) && n40(Wo) || !n40(Ko) && n40(Vo),
            tablet: !n40(Ko) && !n40(Wo) && !n40(Vo) && (n40(qo) || n40(zo)),
            device: !n40(Ko) && (n40(Wo) || n40(qo) || n40(Vo) || n40(zo)) || n40(/\bokhttp\b/i)
        },
        windows: {
            phone: n40(Ko),
            tablet: n40(Zo),
            device: n40(Ko) || n40(Zo)
        },
        other: {
            blackberry: n40(Jo),
            blackberry10: n40(Qo),
            opera: n40($o),
            firefox: n40(es),
            chrome: n40(ts),
            device: n40(Jo) || n40(Qo) || n40($o) || n40(es) || n40(ts)
        },
        any: !1,
        phone: !1,
        tablet: !1
    };
    return o39.any = o39.apple.device || o39.android.device || o39.windows.device || o39.other.device, o39.phone = o39.apple.phone || o39.android.phone || o39.windows.phone, o39.tablet = o39.apple.tablet || o39.android.tablet || o39.windows.tablet, o39;
}(self.navigator), ns = {
    MIPMAP_TEXTURES: 1,
    ANISOTROPIC_LEVEL: 0,
    RESOLUTION: 1,
    FILTER_RESOLUTION: 1,
    SPRITE_MAX_TEXTURES: function(t7) {
        var e25, r50 = !0;
        (is.tablet || is.phone) && (is.apple.device && (e25 = navigator.userAgent.match(/OS (\d+)_(\d+)?/)) && parseInt(e25[1], 10) < 11 && (r50 = !1), is.android.device && (e25 = navigator.userAgent.match(/Android\s([0-9.]*)/)) && parseInt(e25[1], 10) < 7 && (r50 = !1));
        return r50 ? 32 : 4;
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
    GC_MODE: 0,
    GC_MAX_IDLE: 3600,
    GC_MAX_CHECK_COUNT: 600,
    WRAP_MODE: 33071,
    SCALE_MODE: 1,
    PRECISION_VERTEX: "highp",
    PRECISION_FRAGMENT: is.apple.device ? "highp" : "mediump",
    CAN_UPLOAD_SAME_BUFFER: !is.apple.device,
    CREATE_IMAGE_BITMAP: !1,
    ROUND_PIXELS: !1
}, os = "undefined" != typeof globalThis ? globalThis : "undefined" != typeof window ? window : "undefined" != typeof global ? global : "undefined" != typeof self ? self : {
};
function ss(t7, e25, r50) {
    return t7(r50 = {
        path: e25,
        exports: {
        },
        require: function(t12, e31) {
            return (function() {
                throw new Error("Dynamic requires are not currently supported by @rollup/plugin-commonjs");
            })(null == e31 && r50.path);
        }
    }, r50.exports), r50.exports;
}
ss(function(t7) {
    var e25 = Object.prototype.hasOwnProperty, r50 = "~";
    function i54() {
    }
    function n40(t12, e31, r51) {
        this.fn = t12, this.context = e31, this.once = r51 || !1;
    }
    function o39(t12, e31, i55, o40, s34) {
        if ("function" != typeof i55) throw new TypeError("The listener must be a function");
        var a34 = new n40(i55, o40 || t12, s34), h33 = r50 ? r50 + e31 : e31;
        return t12._events[h33] ? t12._events[h33].fn ? t12._events[h33] = [
            t12._events[h33],
            a34
        ] : t12._events[h33].push(a34) : (t12._events[h33] = a34, t12._eventsCount++), t12;
    }
    function s34(t12, e31) {
        0 == --t12._eventsCount ? t12._events = new i54 : delete t12._events[e31];
    }
    function a34() {
        this._events = new i54, this._eventsCount = 0;
    }
    Object.create && (i54.prototype = Object.create(null), (new i54).__proto__ || (r50 = !1)), a34.prototype.eventNames = function() {
        var t12, i55, n41 = [];
        if (0 === this._eventsCount) return n41;
        for(i55 in t12 = this._events)e25.call(t12, i55) && n41.push(r50 ? i55.slice(1) : i55);
        return Object.getOwnPropertySymbols ? n41.concat(Object.getOwnPropertySymbols(t12)) : n41;
    }, a34.prototype.listeners = function(t12) {
        var e31 = r50 ? r50 + t12 : t12, i55 = this._events[e31];
        if (!i55) return [];
        if (i55.fn) return [
            i55.fn
        ];
        for(var n41 = 0, o40 = i55.length, s35 = new Array(o40); n41 < o40; n41++)s35[n41] = i55[n41].fn;
        return s35;
    }, a34.prototype.listenerCount = function(t12) {
        var e31 = r50 ? r50 + t12 : t12, i55 = this._events[e31];
        return i55 ? i55.fn ? 1 : i55.length : 0;
    }, a34.prototype.emit = function(t12, e31, i55, n41, o40, s35) {
        var a35 = arguments, h33 = r50 ? r50 + t12 : t12;
        if (!this._events[h33]) return !1;
        var u28, l19, c16 = this._events[h33], d16 = arguments.length;
        if (c16.fn) {
            switch(c16.once && this.removeListener(t12, c16.fn, void 0, !0), d16){
                case 1:
                    return c16.fn.call(c16.context), !0;
                case 2:
                    return c16.fn.call(c16.context, e31), !0;
                case 3:
                    return c16.fn.call(c16.context, e31, i55), !0;
                case 4:
                    return c16.fn.call(c16.context, e31, i55, n41), !0;
                case 5:
                    return c16.fn.call(c16.context, e31, i55, n41, o40), !0;
                case 6:
                    return c16.fn.call(c16.context, e31, i55, n41, o40, s35), !0;
            }
            for(l19 = 1, u28 = new Array(d16 - 1); l19 < d16; l19++)u28[l19 - 1] = a35[l19];
            c16.fn.apply(c16.context, u28);
        } else {
            var f11, p = c16.length;
            for(l19 = 0; l19 < p; l19++)switch(c16[l19].once && this.removeListener(t12, c16[l19].fn, void 0, !0), d16){
                case 1:
                    c16[l19].fn.call(c16[l19].context);
                    break;
                case 2:
                    c16[l19].fn.call(c16[l19].context, e31);
                    break;
                case 3:
                    c16[l19].fn.call(c16[l19].context, e31, i55);
                    break;
                case 4:
                    c16[l19].fn.call(c16[l19].context, e31, i55, n41);
                    break;
                default:
                    if (!u28) for(f11 = 1, u28 = new Array(d16 - 1); f11 < d16; f11++)u28[f11 - 1] = a35[f11];
                    c16[l19].fn.apply(c16[l19].context, u28);
            }
        }
        return !0;
    }, a34.prototype.on = function(t12, e31, r51) {
        return o39(this, t12, e31, r51, !1);
    }, a34.prototype.once = function(t12, e31, r51) {
        return o39(this, t12, e31, r51, !0);
    }, a34.prototype.removeListener = function(t12, e31, i55, n41) {
        var o40 = r50 ? r50 + t12 : t12;
        if (!this._events[o40]) return this;
        if (!e31) return s34(this, o40), this;
        var a35 = this._events[o40];
        if (a35.fn) a35.fn !== e31 || n41 && !a35.once || i55 && a35.context !== i55 || s34(this, o40);
        else {
            for(var h33 = 0, u28 = [], l19 = a35.length; h33 < l19; h33++)(a35[h33].fn !== e31 || n41 && !a35[h33].once || i55 && a35[h33].context !== i55) && u28.push(a35[h33]);
            u28.length ? this._events[o40] = 1 === u28.length ? u28[0] : u28 : s34(this, o40);
        }
        return this;
    }, a34.prototype.removeAllListeners = function(t12) {
        var e31;
        return t12 ? (e31 = r50 ? r50 + t12 : t12, this._events[e31] && s34(this, e31)) : (this._events = new i54, this._eventsCount = 0), this;
    }, a34.prototype.off = a34.prototype.removeListener, a34.prototype.addListener = a34.prototype.on, a34.prefixed = r50, a34.EventEmitter = a34, t7.exports = a34;
});
var as = ss(function(t7, e25) {
    !function(r50) {
        var i54 = e25 && !e25.nodeType && e25, n40 = t7 && !t7.nodeType && t7, o39 = "object" == typeof os && os;
        o39.global !== o39 && o39.window !== o39 && o39.self !== o39 || (r50 = o39);
        var s34, a34, h34 = 2147483647, u29 = 36, l20 = 1, c16 = 26, d16 = 38, f12 = 700, p = 72, _5 = 128, m5 = "-", v3 = /^xn--/, y = /[^\x20-\x7E]/, g3 = /[\x2E\u3002\uFF0E\uFF61]/g, b3 = {
            overflow: "Overflow: input needs wider integers to process",
            "not-basic": "Illegal input >= 0x80 (not a basic code point)",
            "invalid-input": "Invalid input"
        }, x2 = u29 - l20, T2 = Math.floor, E2 = String.fromCharCode;
        function A2(t12) {
            throw RangeError(b3[t12]);
        }
        function S3(t12, e31) {
            for(var r51 = t12.length, i55 = []; r51--;)i55[r51] = e31(t12[r51]);
            return i55;
        }
        function O2(t12, e31) {
            var r51 = t12.split("@"), i55 = "";
            return r51.length > 1 && (i55 = r51[0] + "@", t12 = r51[1]), i55 + S3((t12 = t12.replace(g3, ".")).split("."), e31).join(".");
        }
        function R2(t12) {
            for(var e31, r51, i55 = [], n41 = 0, o40 = t12.length; n41 < o40;)(e31 = t12.charCodeAt(n41++)) >= 55296 && e31 <= 56319 && n41 < o40 ? 56320 == (64512 & (r51 = t12.charCodeAt(n41++))) ? i55.push(((1023 & e31) << 10) + (1023 & r51) + 65536) : (i55.push(e31), n41--) : i55.push(e31);
            return i55;
        }
        function w2(t12) {
            return S3(t12, function(t13) {
                var e31 = "";
                return t13 > 65535 && (e31 += E2((t13 -= 65536) >>> 10 & 1023 | 55296), t13 = 56320 | 1023 & t13), e31 + E2(t13);
            }).join("");
        }
        function P2(t12, e31) {
            return t12 + 22 + 75 * (t12 < 26) - ((0 != e31) << 5);
        }
        function I1(t12, e31, r51) {
            var i55 = 0;
            for(t12 = r51 ? T2(t12 / f12) : t12 >> 1, t12 += T2(t12 / e31); t12 > x2 * c16 >> 1; i55 += u29)t12 = T2(t12 / x2);
            return T2(i55 + (x2 + 1) * t12 / (t12 + d16));
        }
        function M1(t12) {
            var e31, r51, i55, n41, o40, s35, a35, d17, f13, v4, y1, g4 = [], b4 = t12.length, x3 = 0, E3 = _5, S4 = p;
            for((r51 = t12.lastIndexOf(m5)) < 0 && (r51 = 0), i55 = 0; i55 < r51; ++i55)t12.charCodeAt(i55) >= 128 && A2("not-basic"), g4.push(t12.charCodeAt(i55));
            for(n41 = r51 > 0 ? r51 + 1 : 0; n41 < b4;){
                for(o40 = x3, s35 = 1, a35 = u29; n41 >= b4 && A2("invalid-input"), ((d17 = (y1 = t12.charCodeAt(n41++)) - 48 < 10 ? y1 - 22 : y1 - 65 < 26 ? y1 - 65 : y1 - 97 < 26 ? y1 - 97 : u29) >= u29 || d17 > T2((h34 - x3) / s35)) && A2("overflow"), x3 += d17 * s35, !(d17 < (f13 = a35 <= S4 ? l20 : a35 >= S4 + c16 ? c16 : a35 - S4)); a35 += u29)s35 > T2(h34 / (v4 = u29 - f13)) && A2("overflow"), s35 *= v4;
                S4 = I1(x3 - o40, e31 = g4.length + 1, 0 == o40), T2(x3 / e31) > h34 - E3 && A2("overflow"), E3 += T2(x3 / e31), x3 %= e31, g4.splice(x3++, 0, E3);
            }
            return w2(g4);
        }
        function D2(t12) {
            var e31, r51, i55, n41, o40, s35, a35, d17, f13, v4, y1, g4, b4, x3, S4, O3 = [];
            for(g4 = (t12 = R2(t12)).length, e31 = _5, r51 = 0, o40 = p, s35 = 0; s35 < g4; ++s35)(y1 = t12[s35]) < 128 && O3.push(E2(y1));
            for(i55 = n41 = O3.length, n41 && O3.push(m5); i55 < g4;){
                for(a35 = h34, s35 = 0; s35 < g4; ++s35)(y1 = t12[s35]) >= e31 && y1 < a35 && (a35 = y1);
                for(a35 - e31 > T2((h34 - r51) / (b4 = i55 + 1)) && A2("overflow"), r51 += (a35 - e31) * b4, e31 = a35, s35 = 0; s35 < g4; ++s35)if ((y1 = t12[s35]) < e31 && (++r51) > h34 && A2("overflow"), y1 == e31) {
                    for(d17 = r51, f13 = u29; !(d17 < (v4 = f13 <= o40 ? l20 : f13 >= o40 + c16 ? c16 : f13 - o40)); f13 += u29)S4 = d17 - v4, x3 = u29 - v4, O3.push(E2(P2(v4 + S4 % x3, 0))), d17 = T2(S4 / x3);
                    O3.push(E2(P2(d17, 0))), o40 = I1(r51, b4, i55 == n41), r51 = 0, ++i55;
                }
                ++r51, ++e31;
            }
            return O3.join("");
        }
        if (s34 = {
            version: "1.3.2",
            ucs2: {
                decode: R2,
                encode: w2
            },
            decode: M1,
            encode: D2,
            toASCII: function(t12) {
                return O2(t12, function(t13) {
                    return y.test(t13) ? "xn--" + D2(t13) : t13;
                });
            },
            toUnicode: function(t12) {
                return O2(t12, function(t13) {
                    return v3.test(t13) ? M1(t13.slice(4).toLowerCase()) : t13;
                });
            }
        }, i54 && n40) {
            if (t7.exports == i54) n40.exports = s34;
            else for(a34 in s34)s34.hasOwnProperty(a34) && (i54[a34] = s34[a34]);
        } else r50.punycode = s34;
    }(os);
}), hs = {
    isString: function(t7) {
        return "string" == typeof t7;
    },
    isObject: function(t7) {
        return "object" == typeof t7 && null !== t7;
    },
    isNull: function(t7) {
        return null === t7;
    },
    isNullOrUndefined: function(t7) {
        return null == t7;
    }
};
function us(t7, e25) {
    return Object.prototype.hasOwnProperty.call(t7, e25);
}
var ls = function(t7, e25, r50, i54) {
    e25 = e25 || "&", r50 = r50 || "=";
    var n40 = {
    };
    if ("string" != typeof t7 || 0 === t7.length) return n40;
    var o39 = /\+/g;
    t7 = t7.split(e25);
    var s34 = 1000;
    i54 && "number" == typeof i54.maxKeys && (s34 = i54.maxKeys);
    var a34 = t7.length;
    s34 > 0 && a34 > s34 && (a34 = s34);
    for(var h34 = 0; h34 < a34; ++h34){
        var u29, l20, c16, d16, f12 = t7[h34].replace(o39, "%20"), p = f12.indexOf(r50);
        p >= 0 ? (u29 = f12.substr(0, p), l20 = f12.substr(p + 1)) : (u29 = f12, l20 = ""), c16 = decodeURIComponent(u29), d16 = decodeURIComponent(l20), us(n40, c16) ? Array.isArray(n40[c16]) ? n40[c16].push(d16) : n40[c16] = [
            n40[c16],
            d16
        ] : n40[c16] = d16;
    }
    return n40;
}, cs = function(t7) {
    switch(typeof t7){
        case "string":
            return t7;
        case "boolean":
            return t7 ? "true" : "false";
        case "number":
            return isFinite(t7) ? t7 : "";
        default:
            return "";
    }
}, ds = function(t7, e25, r50, i54) {
    return e25 = e25 || "&", r50 = r50 || "=", null === t7 && (t7 = void 0), "object" == typeof t7 ? Object.keys(t7).map(function(i55) {
        var n40 = encodeURIComponent(cs(i55)) + r50;
        return Array.isArray(t7[i55]) ? t7[i55].map(function(t12) {
            return n40 + encodeURIComponent(cs(t12));
        }).join(e25) : n40 + encodeURIComponent(cs(t7[i55]));
    }).join(e25) : i54 ? encodeURIComponent(cs(i54)) + r50 + encodeURIComponent(cs(t7)) : "";
}, fs = ss(function(t7, e25) {
    e25.decode = e25.parse = ls, e25.encode = e25.stringify = ds;
});
function ps() {
    this.protocol = null, this.slashes = null, this.auth = null, this.host = null, this.port = null, this.hostname = null, this.hash = null, this.search = null, this.query = null, this.pathname = null, this.path = null, this.href = null;
}
var _s = /^([a-z0-9.+-]+:)/i, ms = /:[0-9]*$/, vs = /^(\/\/?(?!\/)[^\?\s]*)(\?[^\s]*)?$/, ys = [
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
]), gs = [
    "'"
].concat(ys), bs = [
    "%",
    "/",
    "?",
    ";",
    "#"
].concat(gs), xs = [
    "/",
    "?",
    "#"
], Ts = /^[+a-z0-9A-Z_-]{0,63}$/, Es = /^([+a-z0-9A-Z_-]{0,63})(.*)$/, As = {
    javascript: !0,
    "javascript:": !0
}, Ss = {
    javascript: !0,
    "javascript:": !0
}, Os = {
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
function Rs(t7, e25, r50) {
    if (t7 && hs.isObject(t7) && t7 instanceof ps) return t7;
    var i54 = new ps;
    return i54.parse(t7, e25, r50), i54;
}
ps.prototype.parse = function(t7, e25, r50) {
    if (!hs.isString(t7)) throw new TypeError("Parameter 'url' must be a string, not " + typeof t7);
    var i54 = t7.indexOf("?"), n40 = -1 !== i54 && i54 < t7.indexOf("#") ? "?" : "#", o39 = t7.split(n40);
    o39[0] = o39[0].replace(/\\/g, "/");
    var s34 = t7 = o39.join(n40);
    if (s34 = s34.trim(), !r50 && 1 === t7.split("#").length) {
        var a34 = vs.exec(s34);
        if (a34) return this.path = s34, this.href = s34, this.pathname = a34[1], a34[2] ? (this.search = a34[2], this.query = e25 ? fs.parse(this.search.substr(1)) : this.search.substr(1)) : e25 && (this.search = "", this.query = {
        }), this;
    }
    var h34 = _s.exec(s34);
    if (h34) {
        var u30 = (h34 = h34[0]).toLowerCase();
        this.protocol = u30, s34 = s34.substr(h34.length);
    }
    if (r50 || h34 || s34.match(/^\/\/[^@\/]+@[^@\/]+/)) {
        var l21 = "//" === s34.substr(0, 2);
        !l21 || h34 && Ss[h34] || (s34 = s34.substr(2), this.slashes = !0);
    }
    if (!Ss[h34] && (l21 || h34 && !Os[h34])) {
        for(var c17, d17, f13 = -1, p = 0; p < xs.length; p++)-1 !== (_5 = s34.indexOf(xs[p])) && (-1 === f13 || _5 < f13) && (f13 = _5);
        for(-1 !== (d17 = -1 === f13 ? s34.lastIndexOf("@") : s34.lastIndexOf("@", f13)) && (c17 = s34.slice(0, d17), s34 = s34.slice(d17 + 1), this.auth = decodeURIComponent(c17)), f13 = -1, p = 0; p < bs.length; p++){
            var _5;
            -1 !== (_5 = s34.indexOf(bs[p])) && (-1 === f13 || _5 < f13) && (f13 = _5);
        }
        -1 === f13 && (f13 = s34.length), this.host = s34.slice(0, f13), s34 = s34.slice(f13), this.parseHost(), this.hostname = this.hostname || "";
        var m5 = "[" === this.hostname[0] && "]" === this.hostname[this.hostname.length - 1];
        if (!m5) for(var v3 = this.hostname.split(/\./), y = (p = 0, v3.length); p < y; p++){
            var g3 = v3[p];
            if (g3 && !g3.match(Ts)) {
                for(var b3 = "", x2 = 0, T2 = g3.length; x2 < T2; x2++)g3.charCodeAt(x2) > 127 ? b3 += "x" : b3 += g3[x2];
                if (!b3.match(Ts)) {
                    var E2 = v3.slice(0, p), A2 = v3.slice(p + 1), S3 = g3.match(Es);
                    S3 && (E2.push(S3[1]), A2.unshift(S3[2])), A2.length && (s34 = "/" + A2.join(".") + s34), this.hostname = E2.join(".");
                    break;
                }
            }
        }
        this.hostname.length > 255 ? this.hostname = "" : this.hostname = this.hostname.toLowerCase(), m5 || (this.hostname = as.toASCII(this.hostname));
        var O2 = this.port ? ":" + this.port : "", R2 = this.hostname || "";
        this.host = R2 + O2, this.href += this.host, m5 && (this.hostname = this.hostname.substr(1, this.hostname.length - 2), "/" !== s34[0] && (s34 = "/" + s34));
    }
    if (!As[u30]) for(p = 0, y = gs.length; p < y; p++){
        var w2 = gs[p];
        if (-1 !== s34.indexOf(w2)) {
            var P2 = encodeURIComponent(w2);
            P2 === w2 && (P2 = escape(w2)), s34 = s34.split(w2).join(P2);
        }
    }
    var I1 = s34.indexOf("#");
    -1 !== I1 && (this.hash = s34.substr(I1), s34 = s34.slice(0, I1));
    var M1 = s34.indexOf("?");
    if (-1 !== M1 ? (this.search = s34.substr(M1), this.query = s34.substr(M1 + 1), e25 && (this.query = fs.parse(this.query)), s34 = s34.slice(0, M1)) : e25 && (this.search = "", this.query = {
    }), s34 && (this.pathname = s34), Os[u30] && this.hostname && !this.pathname && (this.pathname = "/"), this.pathname || this.search) {
        O2 = this.pathname || "";
        var D2 = this.search || "";
        this.path = O2 + D2;
    }
    return this.href = this.format(), this;
}, ps.prototype.format = function() {
    var t7 = this.auth || "";
    t7 && (t7 = (t7 = encodeURIComponent(t7)).replace(/%3A/i, ":"), t7 += "@");
    var e25 = this.protocol || "", r50 = this.pathname || "", i54 = this.hash || "", n40 = !1, o39 = "";
    this.host ? n40 = t7 + this.host : this.hostname && (n40 = t7 + (-1 === this.hostname.indexOf(":") ? this.hostname : "[" + this.hostname + "]"), this.port && (n40 += ":" + this.port)), this.query && hs.isObject(this.query) && Object.keys(this.query).length && (o39 = fs.stringify(this.query));
    var s34 = this.search || o39 && "?" + o39 || "";
    return e25 && ":" !== e25.substr(-1) && (e25 += ":"), this.slashes || (!e25 || Os[e25]) && !1 !== n40 ? (n40 = "//" + (n40 || ""), r50 && "/" !== r50.charAt(0) && (r50 = "/" + r50)) : n40 || (n40 = ""), i54 && "#" !== i54.charAt(0) && (i54 = "#" + i54), s34 && "?" !== s34.charAt(0) && (s34 = "?" + s34), e25 + n40 + (r50 = r50.replace(/[?#]/g, function(t12) {
        return encodeURIComponent(t12);
    })) + (s34 = s34.replace("#", "%23")) + i54;
}, ps.prototype.resolve = function(t7) {
    return this.resolveObject(Rs(t7, !1, !0)).format();
}, ps.prototype.resolveObject = function(t7) {
    if (hs.isString(t7)) {
        var e25 = new ps;
        e25.parse(t7, !1, !0), t7 = e25;
    }
    for(var r50 = new ps, i54 = Object.keys(this), n40 = 0; n40 < i54.length; n40++){
        var o39 = i54[n40];
        r50[o39] = this[o39];
    }
    if (r50.hash = t7.hash, "" === t7.href) return r50.href = r50.format(), r50;
    if (t7.slashes && !t7.protocol) {
        for(var s34 = Object.keys(t7), a35 = 0; a35 < s34.length; a35++){
            var h34 = s34[a35];
            "protocol" !== h34 && (r50[h34] = t7[h34]);
        }
        return Os[r50.protocol] && r50.hostname && !r50.pathname && (r50.path = r50.pathname = "/"), r50.href = r50.format(), r50;
    }
    if (t7.protocol && t7.protocol !== r50.protocol) {
        if (!Os[t7.protocol]) {
            for(var u31 = Object.keys(t7), l22 = 0; l22 < u31.length; l22++){
                var c18 = u31[l22];
                r50[c18] = t7[c18];
            }
            return r50.href = r50.format(), r50;
        }
        if (r50.protocol = t7.protocol, t7.host || Ss[t7.protocol]) r50.pathname = t7.pathname;
        else {
            for(var d18 = (t7.pathname || "").split("/"); d18.length && !(t7.host = d18.shift()););
            t7.host || (t7.host = ""), t7.hostname || (t7.hostname = ""), "" !== d18[0] && d18.unshift(""), d18.length < 2 && d18.unshift(""), r50.pathname = d18.join("/");
        }
        if (r50.search = t7.search, r50.query = t7.query, r50.host = t7.host || "", r50.auth = t7.auth, r50.hostname = t7.hostname || t7.host, r50.port = t7.port, r50.pathname || r50.search) {
            var f14 = r50.pathname || "", p = r50.search || "";
            r50.path = f14 + p;
        }
        return r50.slashes = r50.slashes || t7.slashes, r50.href = r50.format(), r50;
    }
    var _6 = r50.pathname && "/" === r50.pathname.charAt(0), m6 = t7.host || t7.pathname && "/" === t7.pathname.charAt(0), v4 = m6 || _6 || r50.host && t7.pathname, y = v4, g4 = r50.pathname && r50.pathname.split("/") || [], b4 = (d18 = t7.pathname && t7.pathname.split("/") || [], r50.protocol && !Os[r50.protocol]);
    if (b4 && (r50.hostname = "", r50.port = null, r50.host && ("" === g4[0] ? g4[0] = r50.host : g4.unshift(r50.host)), r50.host = "", t7.protocol && (t7.hostname = null, t7.port = null, t7.host && ("" === d18[0] ? d18[0] = t7.host : d18.unshift(t7.host)), t7.host = null), v4 = v4 && ("" === d18[0] || "" === g4[0])), m6) r50.host = t7.host || "" === t7.host ? t7.host : r50.host, r50.hostname = t7.hostname || "" === t7.hostname ? t7.hostname : r50.hostname, r50.search = t7.search, r50.query = t7.query, g4 = d18;
    else if (d18.length) g4 || (g4 = []), g4.pop(), g4 = g4.concat(d18), r50.search = t7.search, r50.query = t7.query;
    else if (!hs.isNullOrUndefined(t7.search)) return b4 && (r50.hostname = r50.host = g4.shift(), (S4 = !!(r50.host && r50.host.indexOf("@") > 0) && r50.host.split("@")) && (r50.auth = S4.shift(), r50.host = r50.hostname = S4.shift())), r50.search = t7.search, r50.query = t7.query, hs.isNull(r50.pathname) && hs.isNull(r50.search) || (r50.path = (r50.pathname ? r50.pathname : "") + (r50.search ? r50.search : "")), r50.href = r50.format(), r50;
    if (!g4.length) return r50.pathname = null, r50.search ? r50.path = "/" + r50.search : r50.path = null, r50.href = r50.format(), r50;
    for(var x3 = g4.slice(-1)[0], T3 = (r50.host || t7.host || g4.length > 1) && ("." === x3 || ".." === x3) || "" === x3, E3 = 0, A3 = g4.length; A3 >= 0; A3--)"." === (x3 = g4[A3]) ? g4.splice(A3, 1) : ".." === x3 ? (g4.splice(A3, 1), E3++) : E3 && (g4.splice(A3, 1), E3--);
    if (!v4 && !y) for(; E3--; E3)g4.unshift("..");
    !v4 || "" === g4[0] || g4[0] && "/" === g4[0].charAt(0) || g4.unshift(""), T3 && "/" !== g4.join("/").substr(-1) && g4.push("");
    var S4, O3 = "" === g4[0] || g4[0] && "/" === g4[0].charAt(0);
    return b4 && (r50.hostname = r50.host = O3 ? "" : g4.length ? g4.shift() : "", (S4 = !!(r50.host && r50.host.indexOf("@") > 0) && r50.host.split("@")) && (r50.auth = S4.shift(), r50.host = r50.hostname = S4.shift())), (v4 = v4 || r50.host && g4.length) && !O3 && g4.unshift(""), g4.length ? r50.pathname = g4.join("/") : (r50.pathname = null, r50.path = null), hs.isNull(r50.pathname) && hs.isNull(r50.search) || (r50.path = (r50.pathname ? r50.pathname : "") + (r50.search ? r50.search : "")), r50.auth = t7.auth || r50.auth, r50.slashes = r50.slashes || t7.slashes, r50.href = r50.format(), r50;
}, ps.prototype.parseHost = function() {
    var t7 = this.host, e31 = ms.exec(t7);
    e31 && (":" !== (e31 = e31[0]) && (this.port = e31.substr(1)), t7 = t7.substr(0, t7.length - e31.length)), t7 && (this.hostname = t7);
};
var ws = function(t7, e31) {
    return Rs(t7, !1, !0).resolve(e31);
};
ns.RETINA_PREFIX = /@([0-9\.]+)x/, ns.FAIL_IF_MAJOR_PERFORMANCE_CAVEAT = !1, (function() {
    for(var t7 = [], e31 = [], r50 = 0; r50 < 32; r50++)t7[r50] = r50, e31[r50] = r50;
    t7[jt.NORMAL_NPM] = jt.NORMAL, t7[jt.ADD_NPM] = jt.ADD, t7[jt.SCREEN_NPM] = jt.SCREEN, e31[jt.NORMAL] = jt.NORMAL_NPM, e31[jt.ADD] = jt.ADD_NPM, e31[jt.SCREEN] = jt.SCREEN_NPM;
    var i54 = [];
    i54.push(e31), i54.push(t7);
})(), (function() {
    function t7(t12, e31, r50) {
        this.canvas = document.createElement("canvas"), this.context = this.canvas.getContext("2d"), this.resolution = r50 || ns.RESOLUTION, this.resize(t12, e31);
    }
    t7.prototype.clear = function() {
        this.context.setTransform(1, 0, 0, 1, 0, 0), this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }, t7.prototype.resize = function(t12, e31) {
        this.canvas.width = t12 * this.resolution, this.canvas.height = e31 * this.resolution;
    }, t7.prototype.destroy = function() {
        this.context = null, this.canvas = null;
    }, Object.defineProperty(t7.prototype, "width", {
        get: function() {
            return this.canvas.width;
        },
        set: function(t12) {
            this.canvas.width = t12;
        },
        enumerable: !1,
        configurable: !0
    }), Object.defineProperty(t7.prototype, "height", {
        get: function() {
            return this.canvas.height;
        },
        set: function(t12) {
            this.canvas.height = t12;
        },
        enumerable: !1,
        configurable: !0
    });
})();
var Ps, Is, Ms = function() {
    function t7() {
    }
    return t7.use = function(e31, r50) {
        var i54 = e31.data;
        if (e31.type === Lo.TYPE.JSON && i54 && i54.cacheID && i54.textures) {
            for(var n40 = i54.textures, o40 = void 0, s35 = void 0, a36 = 0, h35 = n40.length; a36 < h35; a36++){
                var u32 = n40[a36], l23 = u32.src, c19 = u32.format;
                if (c19 || (s35 = l23), t7.textureFormats[c19]) {
                    o40 = l23;
                    break;
                }
            }
            if (!(o40 = o40 || s35)) return void r50(new Error("Cannot load compressed-textures in " + e31.url + ", make sure you provide a fallback"));
            if (o40 === e31.url) return void r50(new Error("URL of compressed texture cannot be the same as the manifest's URL"));
            var d19 = {
                crossOrigin: e31.crossOrigin,
                metadata: e31.metadata.imageMetadata,
                parentResource: e31
            }, f15 = ws(e31.url.replace(this.baseUrl, ""), o40), p = i54.cacheID;
            this.add(p, f15, d19, function(t12) {
                if (t12.error) r50(t12.error);
                else {
                    var i55 = t12.texture, n41 = (void 0) === i55 ? null : i55, o41 = t12.textures, s36 = (void 0) === o41 ? {
                    } : o41;
                    Object.assign(e31, {
                        texture: n41,
                        textures: s36
                    }), r50();
                }
            });
        } else r50();
    }, t7.add = function() {
        var e31 = document.createElement("canvas").getContext("webgl");
        if (e31) {
            var r50 = {
                s3tc: e31.getExtension("WEBGL_compressed_texture_s3tc"),
                s3tc_sRGB: e31.getExtension("WEBGL_compressed_texture_s3tc_srgb"),
                etc: e31.getExtension("WEBGL_compressed_texture_etc"),
                etc1: e31.getExtension("WEBGL_compressed_texture_etc1"),
                pvrtc: e31.getExtension("WEBGL_compressed_texture_pvrtc") || e31.getExtension("WEBKIT_WEBGL_compressed_texture_pvrtc"),
                atc: e31.getExtension("WEBGL_compressed_texture_atc"),
                astc: e31.getExtension("WEBGL_compressed_texture_astc")
            };
            for(var i54 in t7.textureExtensions = r50, t7.textureFormats = {
            }, r50){
                var n42 = r50[i54];
                n42 && Object.assign(t7.textureFormats, Object.getPrototypeOf(n42));
            }
        }
    }, t7;
}();
function Ds(t7, e31, r51) {
    var i56 = {
        textures: {
        },
        texture: null
    };
    return e31 ? (e31.map(function(t12) {
        return new ri(new Gr(t12, Object.assign({
            mipmap: Kt.OFF,
            alphaMode: Zt.NO_PREMULTIPLIED_ALPHA
        }, r51)));
    }).forEach(function(e32, r52) {
        var n43 = e32.baseTexture, o42 = t7 + "-" + (r52 + 1);
        Gr.addToCache(n43, o42), ri.addToCache(e32, o42), 0 === r52 && (Gr.addToCache(n43, t7), ri.addToCache(e32, t7), i56.texture = e32), i56.textures[o42] = e32;
    }), i56) : i56;
}
Lo.setExtensionXhrType("dds", Lo.XHR_RESPONSE_TYPE.BUFFER);
var Cs, Ns;
!function(t7) {
    t7[t7.DXGI_FORMAT_UNKNOWN = 0] = "DXGI_FORMAT_UNKNOWN", t7[t7.DXGI_FORMAT_R32G32B32A32_TYPELESS = 1] = "DXGI_FORMAT_R32G32B32A32_TYPELESS", t7[t7.DXGI_FORMAT_R32G32B32A32_FLOAT = 2] = "DXGI_FORMAT_R32G32B32A32_FLOAT", t7[t7.DXGI_FORMAT_R32G32B32A32_UINT = 3] = "DXGI_FORMAT_R32G32B32A32_UINT", t7[t7.DXGI_FORMAT_R32G32B32A32_SINT = 4] = "DXGI_FORMAT_R32G32B32A32_SINT", t7[t7.DXGI_FORMAT_R32G32B32_TYPELESS = 5] = "DXGI_FORMAT_R32G32B32_TYPELESS", t7[t7.DXGI_FORMAT_R32G32B32_FLOAT = 6] = "DXGI_FORMAT_R32G32B32_FLOAT", t7[t7.DXGI_FORMAT_R32G32B32_UINT = 7] = "DXGI_FORMAT_R32G32B32_UINT", t7[t7.DXGI_FORMAT_R32G32B32_SINT = 8] = "DXGI_FORMAT_R32G32B32_SINT", t7[t7.DXGI_FORMAT_R16G16B16A16_TYPELESS = 9] = "DXGI_FORMAT_R16G16B16A16_TYPELESS", t7[t7.DXGI_FORMAT_R16G16B16A16_FLOAT = 10] = "DXGI_FORMAT_R16G16B16A16_FLOAT", t7[t7.DXGI_FORMAT_R16G16B16A16_UNORM = 11] = "DXGI_FORMAT_R16G16B16A16_UNORM", t7[t7.DXGI_FORMAT_R16G16B16A16_UINT = 12] = "DXGI_FORMAT_R16G16B16A16_UINT", t7[t7.DXGI_FORMAT_R16G16B16A16_SNORM = 13] = "DXGI_FORMAT_R16G16B16A16_SNORM", t7[t7.DXGI_FORMAT_R16G16B16A16_SINT = 14] = "DXGI_FORMAT_R16G16B16A16_SINT", t7[t7.DXGI_FORMAT_R32G32_TYPELESS = 15] = "DXGI_FORMAT_R32G32_TYPELESS", t7[t7.DXGI_FORMAT_R32G32_FLOAT = 16] = "DXGI_FORMAT_R32G32_FLOAT", t7[t7.DXGI_FORMAT_R32G32_UINT = 17] = "DXGI_FORMAT_R32G32_UINT", t7[t7.DXGI_FORMAT_R32G32_SINT = 18] = "DXGI_FORMAT_R32G32_SINT", t7[t7.DXGI_FORMAT_R32G8X24_TYPELESS = 19] = "DXGI_FORMAT_R32G8X24_TYPELESS", t7[t7.DXGI_FORMAT_D32_FLOAT_S8X24_UINT = 20] = "DXGI_FORMAT_D32_FLOAT_S8X24_UINT", t7[t7.DXGI_FORMAT_R32_FLOAT_X8X24_TYPELESS = 21] = "DXGI_FORMAT_R32_FLOAT_X8X24_TYPELESS", t7[t7.DXGI_FORMAT_X32_TYPELESS_G8X24_UINT = 22] = "DXGI_FORMAT_X32_TYPELESS_G8X24_UINT", t7[t7.DXGI_FORMAT_R10G10B10A2_TYPELESS = 23] = "DXGI_FORMAT_R10G10B10A2_TYPELESS", t7[t7.DXGI_FORMAT_R10G10B10A2_UNORM = 24] = "DXGI_FORMAT_R10G10B10A2_UNORM", t7[t7.DXGI_FORMAT_R10G10B10A2_UINT = 25] = "DXGI_FORMAT_R10G10B10A2_UINT", t7[t7.DXGI_FORMAT_R11G11B10_FLOAT = 26] = "DXGI_FORMAT_R11G11B10_FLOAT", t7[t7.DXGI_FORMAT_R8G8B8A8_TYPELESS = 27] = "DXGI_FORMAT_R8G8B8A8_TYPELESS", t7[t7.DXGI_FORMAT_R8G8B8A8_UNORM = 28] = "DXGI_FORMAT_R8G8B8A8_UNORM", t7[t7.DXGI_FORMAT_R8G8B8A8_UNORM_SRGB = 29] = "DXGI_FORMAT_R8G8B8A8_UNORM_SRGB", t7[t7.DXGI_FORMAT_R8G8B8A8_UINT = 30] = "DXGI_FORMAT_R8G8B8A8_UINT", t7[t7.DXGI_FORMAT_R8G8B8A8_SNORM = 31] = "DXGI_FORMAT_R8G8B8A8_SNORM", t7[t7.DXGI_FORMAT_R8G8B8A8_SINT = 32] = "DXGI_FORMAT_R8G8B8A8_SINT", t7[t7.DXGI_FORMAT_R16G16_TYPELESS = 33] = "DXGI_FORMAT_R16G16_TYPELESS", t7[t7.DXGI_FORMAT_R16G16_FLOAT = 34] = "DXGI_FORMAT_R16G16_FLOAT", t7[t7.DXGI_FORMAT_R16G16_UNORM = 35] = "DXGI_FORMAT_R16G16_UNORM", t7[t7.DXGI_FORMAT_R16G16_UINT = 36] = "DXGI_FORMAT_R16G16_UINT", t7[t7.DXGI_FORMAT_R16G16_SNORM = 37] = "DXGI_FORMAT_R16G16_SNORM", t7[t7.DXGI_FORMAT_R16G16_SINT = 38] = "DXGI_FORMAT_R16G16_SINT", t7[t7.DXGI_FORMAT_R32_TYPELESS = 39] = "DXGI_FORMAT_R32_TYPELESS", t7[t7.DXGI_FORMAT_D32_FLOAT = 40] = "DXGI_FORMAT_D32_FLOAT", t7[t7.DXGI_FORMAT_R32_FLOAT = 41] = "DXGI_FORMAT_R32_FLOAT", t7[t7.DXGI_FORMAT_R32_UINT = 42] = "DXGI_FORMAT_R32_UINT", t7[t7.DXGI_FORMAT_R32_SINT = 43] = "DXGI_FORMAT_R32_SINT", t7[t7.DXGI_FORMAT_R24G8_TYPELESS = 44] = "DXGI_FORMAT_R24G8_TYPELESS", t7[t7.DXGI_FORMAT_D24_UNORM_S8_UINT = 45] = "DXGI_FORMAT_D24_UNORM_S8_UINT", t7[t7.DXGI_FORMAT_R24_UNORM_X8_TYPELESS = 46] = "DXGI_FORMAT_R24_UNORM_X8_TYPELESS", t7[t7.DXGI_FORMAT_X24_TYPELESS_G8_UINT = 47] = "DXGI_FORMAT_X24_TYPELESS_G8_UINT", t7[t7.DXGI_FORMAT_R8G8_TYPELESS = 48] = "DXGI_FORMAT_R8G8_TYPELESS", t7[t7.DXGI_FORMAT_R8G8_UNORM = 49] = "DXGI_FORMAT_R8G8_UNORM", t7[t7.DXGI_FORMAT_R8G8_UINT = 50] = "DXGI_FORMAT_R8G8_UINT", t7[t7.DXGI_FORMAT_R8G8_SNORM = 51] = "DXGI_FORMAT_R8G8_SNORM", t7[t7.DXGI_FORMAT_R8G8_SINT = 52] = "DXGI_FORMAT_R8G8_SINT", t7[t7.DXGI_FORMAT_R16_TYPELESS = 53] = "DXGI_FORMAT_R16_TYPELESS", t7[t7.DXGI_FORMAT_R16_FLOAT = 54] = "DXGI_FORMAT_R16_FLOAT", t7[t7.DXGI_FORMAT_D16_UNORM = 55] = "DXGI_FORMAT_D16_UNORM", t7[t7.DXGI_FORMAT_R16_UNORM = 56] = "DXGI_FORMAT_R16_UNORM", t7[t7.DXGI_FORMAT_R16_UINT = 57] = "DXGI_FORMAT_R16_UINT", t7[t7.DXGI_FORMAT_R16_SNORM = 58] = "DXGI_FORMAT_R16_SNORM", t7[t7.DXGI_FORMAT_R16_SINT = 59] = "DXGI_FORMAT_R16_SINT", t7[t7.DXGI_FORMAT_R8_TYPELESS = 60] = "DXGI_FORMAT_R8_TYPELESS", t7[t7.DXGI_FORMAT_R8_UNORM = 61] = "DXGI_FORMAT_R8_UNORM", t7[t7.DXGI_FORMAT_R8_UINT = 62] = "DXGI_FORMAT_R8_UINT", t7[t7.DXGI_FORMAT_R8_SNORM = 63] = "DXGI_FORMAT_R8_SNORM", t7[t7.DXGI_FORMAT_R8_SINT = 64] = "DXGI_FORMAT_R8_SINT", t7[t7.DXGI_FORMAT_A8_UNORM = 65] = "DXGI_FORMAT_A8_UNORM", t7[t7.DXGI_FORMAT_R1_UNORM = 66] = "DXGI_FORMAT_R1_UNORM", t7[t7.DXGI_FORMAT_R9G9B9E5_SHAREDEXP = 67] = "DXGI_FORMAT_R9G9B9E5_SHAREDEXP", t7[t7.DXGI_FORMAT_R8G8_B8G8_UNORM = 68] = "DXGI_FORMAT_R8G8_B8G8_UNORM", t7[t7.DXGI_FORMAT_G8R8_G8B8_UNORM = 69] = "DXGI_FORMAT_G8R8_G8B8_UNORM", t7[t7.DXGI_FORMAT_BC1_TYPELESS = 70] = "DXGI_FORMAT_BC1_TYPELESS", t7[t7.DXGI_FORMAT_BC1_UNORM = 71] = "DXGI_FORMAT_BC1_UNORM", t7[t7.DXGI_FORMAT_BC1_UNORM_SRGB = 72] = "DXGI_FORMAT_BC1_UNORM_SRGB", t7[t7.DXGI_FORMAT_BC2_TYPELESS = 73] = "DXGI_FORMAT_BC2_TYPELESS", t7[t7.DXGI_FORMAT_BC2_UNORM = 74] = "DXGI_FORMAT_BC2_UNORM", t7[t7.DXGI_FORMAT_BC2_UNORM_SRGB = 75] = "DXGI_FORMAT_BC2_UNORM_SRGB", t7[t7.DXGI_FORMAT_BC3_TYPELESS = 76] = "DXGI_FORMAT_BC3_TYPELESS", t7[t7.DXGI_FORMAT_BC3_UNORM = 77] = "DXGI_FORMAT_BC3_UNORM", t7[t7.DXGI_FORMAT_BC3_UNORM_SRGB = 78] = "DXGI_FORMAT_BC3_UNORM_SRGB", t7[t7.DXGI_FORMAT_BC4_TYPELESS = 79] = "DXGI_FORMAT_BC4_TYPELESS", t7[t7.DXGI_FORMAT_BC4_UNORM = 80] = "DXGI_FORMAT_BC4_UNORM", t7[t7.DXGI_FORMAT_BC4_SNORM = 81] = "DXGI_FORMAT_BC4_SNORM", t7[t7.DXGI_FORMAT_BC5_TYPELESS = 82] = "DXGI_FORMAT_BC5_TYPELESS", t7[t7.DXGI_FORMAT_BC5_UNORM = 83] = "DXGI_FORMAT_BC5_UNORM", t7[t7.DXGI_FORMAT_BC5_SNORM = 84] = "DXGI_FORMAT_BC5_SNORM", t7[t7.DXGI_FORMAT_B5G6R5_UNORM = 85] = "DXGI_FORMAT_B5G6R5_UNORM", t7[t7.DXGI_FORMAT_B5G5R5A1_UNORM = 86] = "DXGI_FORMAT_B5G5R5A1_UNORM", t7[t7.DXGI_FORMAT_B8G8R8A8_UNORM = 87] = "DXGI_FORMAT_B8G8R8A8_UNORM", t7[t7.DXGI_FORMAT_B8G8R8X8_UNORM = 88] = "DXGI_FORMAT_B8G8R8X8_UNORM", t7[t7.DXGI_FORMAT_R10G10B10_XR_BIAS_A2_UNORM = 89] = "DXGI_FORMAT_R10G10B10_XR_BIAS_A2_UNORM", t7[t7.DXGI_FORMAT_B8G8R8A8_TYPELESS = 90] = "DXGI_FORMAT_B8G8R8A8_TYPELESS", t7[t7.DXGI_FORMAT_B8G8R8A8_UNORM_SRGB = 91] = "DXGI_FORMAT_B8G8R8A8_UNORM_SRGB", t7[t7.DXGI_FORMAT_B8G8R8X8_TYPELESS = 92] = "DXGI_FORMAT_B8G8R8X8_TYPELESS", t7[t7.DXGI_FORMAT_B8G8R8X8_UNORM_SRGB = 93] = "DXGI_FORMAT_B8G8R8X8_UNORM_SRGB", t7[t7.DXGI_FORMAT_BC6H_TYPELESS = 94] = "DXGI_FORMAT_BC6H_TYPELESS", t7[t7.DXGI_FORMAT_BC6H_UF16 = 95] = "DXGI_FORMAT_BC6H_UF16", t7[t7.DXGI_FORMAT_BC6H_SF16 = 96] = "DXGI_FORMAT_BC6H_SF16", t7[t7.DXGI_FORMAT_BC7_TYPELESS = 97] = "DXGI_FORMAT_BC7_TYPELESS", t7[t7.DXGI_FORMAT_BC7_UNORM = 98] = "DXGI_FORMAT_BC7_UNORM", t7[t7.DXGI_FORMAT_BC7_UNORM_SRGB = 99] = "DXGI_FORMAT_BC7_UNORM_SRGB", t7[t7.DXGI_FORMAT_AYUV = 100] = "DXGI_FORMAT_AYUV", t7[t7.DXGI_FORMAT_Y410 = 101] = "DXGI_FORMAT_Y410", t7[t7.DXGI_FORMAT_Y416 = 102] = "DXGI_FORMAT_Y416", t7[t7.DXGI_FORMAT_NV12 = 103] = "DXGI_FORMAT_NV12", t7[t7.DXGI_FORMAT_P010 = 104] = "DXGI_FORMAT_P010", t7[t7.DXGI_FORMAT_P016 = 105] = "DXGI_FORMAT_P016", t7[t7.DXGI_FORMAT_420_OPAQUE = 106] = "DXGI_FORMAT_420_OPAQUE", t7[t7.DXGI_FORMAT_YUY2 = 107] = "DXGI_FORMAT_YUY2", t7[t7.DXGI_FORMAT_Y210 = 108] = "DXGI_FORMAT_Y210", t7[t7.DXGI_FORMAT_Y216 = 109] = "DXGI_FORMAT_Y216", t7[t7.DXGI_FORMAT_NV11 = 110] = "DXGI_FORMAT_NV11", t7[t7.DXGI_FORMAT_AI44 = 111] = "DXGI_FORMAT_AI44", t7[t7.DXGI_FORMAT_IA44 = 112] = "DXGI_FORMAT_IA44", t7[t7.DXGI_FORMAT_P8 = 113] = "DXGI_FORMAT_P8", t7[t7.DXGI_FORMAT_A8P8 = 114] = "DXGI_FORMAT_A8P8", t7[t7.DXGI_FORMAT_B4G4R4A4_UNORM = 115] = "DXGI_FORMAT_B4G4R4A4_UNORM", t7[t7.DXGI_FORMAT_P208 = 116] = "DXGI_FORMAT_P208", t7[t7.DXGI_FORMAT_V208 = 117] = "DXGI_FORMAT_V208", t7[t7.DXGI_FORMAT_V408 = 118] = "DXGI_FORMAT_V408", t7[t7.DXGI_FORMAT_SAMPLER_FEEDBACK_MIN_MIP_OPAQUE = 119] = "DXGI_FORMAT_SAMPLER_FEEDBACK_MIN_MIP_OPAQUE", t7[t7.DXGI_FORMAT_SAMPLER_FEEDBACK_MIP_REGION_USED_OPAQUE = 120] = "DXGI_FORMAT_SAMPLER_FEEDBACK_MIP_REGION_USED_OPAQUE", t7[t7.DXGI_FORMAT_FORCE_UINT = 121] = "DXGI_FORMAT_FORCE_UINT";
}(Cs || (Cs = {
})), (function(t7) {
    t7[t7.DDS_DIMENSION_TEXTURE1D = 2] = "DDS_DIMENSION_TEXTURE1D", t7[t7.DDS_DIMENSION_TEXTURE2D = 3] = "DDS_DIMENSION_TEXTURE2D", t7[t7.DDS_DIMENSION_TEXTURE3D = 6] = "DDS_DIMENSION_TEXTURE3D";
})(Ns || (Ns = {
}));
var Ls, Fs, Bs, Us = ((Ps = {
})[827611204] = Co.COMPRESSED_RGBA_S3TC_DXT1_EXT, Ps[861165636] = Co.COMPRESSED_RGBA_S3TC_DXT3_EXT, Ps[894720068] = Co.COMPRESSED_RGBA_S3TC_DXT5_EXT, Ps), Gs = ((Is = {
})[Cs.DXGI_FORMAT_BC1_TYPELESS] = Co.COMPRESSED_RGBA_S3TC_DXT1_EXT, Is[Cs.DXGI_FORMAT_BC1_UNORM] = Co.COMPRESSED_RGBA_S3TC_DXT1_EXT, Is[Cs.DXGI_FORMAT_BC2_TYPELESS] = Co.COMPRESSED_RGBA_S3TC_DXT3_EXT, Is[Cs.DXGI_FORMAT_BC2_UNORM] = Co.COMPRESSED_RGBA_S3TC_DXT3_EXT, Is[Cs.DXGI_FORMAT_BC3_TYPELESS] = Co.COMPRESSED_RGBA_S3TC_DXT5_EXT, Is[Cs.DXGI_FORMAT_BC3_UNORM] = Co.COMPRESSED_RGBA_S3TC_DXT5_EXT, Is[Cs.DXGI_FORMAT_BC1_UNORM_SRGB] = Co.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT, Is[Cs.DXGI_FORMAT_BC2_UNORM_SRGB] = Co.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT, Is[Cs.DXGI_FORMAT_BC3_UNORM_SRGB] = Co.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT, Is), Xs = function() {
    function t7() {
    }
    return t7.use = function(e31, r51) {
        if ("dds" === e31.extension && e31.data) try {
            Object.assign(e31, Ds(e31.name || e31.url, t7.parse(e31.data), e31.metadata));
        } catch (t12) {
            return void r51(t12);
        }
        r51();
    }, t7.parse = function(t12) {
        var e31 = new Uint32Array(t12);
        if (542327876 !== e31[0]) throw new Error("Invalid DDS file magic word");
        var r51 = new Uint32Array(t12, 0, 124 / Uint32Array.BYTES_PER_ELEMENT), i56 = r51[3], n43 = r51[4], o42 = r51[7], s37 = new Uint32Array(t12, 19 * Uint32Array.BYTES_PER_ELEMENT, 32 / Uint32Array.BYTES_PER_ELEMENT), a37 = s37[1];
        if (4 & a37) {
            var h36 = s37[2];
            if (808540228 !== h36) {
                var u33 = Us[h36], l24 = new Uint8Array(t12, 128);
                return [
                    new Xo(l24, {
                        format: u33,
                        width: n43,
                        height: i56,
                        levels: o42
                    })
                ];
            }
            var c20 = new Uint32Array(e31.buffer, 128, 20 / Uint32Array.BYTES_PER_ELEMENT), d20 = c20[0], f16 = c20[1], p = c20[2], _6 = c20[3], m6 = Gs[d20];
            if ((void 0) === m6) throw new Error("DDSLoader cannot parse texture data with DXGI format " + d20);
            if (4 === p) throw new Error("DDSLoader does not support cubemap textures");
            if (f16 === Ns.DDS_DIMENSION_TEXTURE3D) throw new Error("DDSLoader does not supported 3D texture data");
            var v4 = new Array;
            if (1 === _6) v4.push(new Uint8Array(t12, 148));
            else {
                for(var y = Fo[m6], g4 = 0, b4 = n43, x3 = i56, T3 = 0; T3 < o42; T3++)g4 += Math.max(1, b4 + 3 & -4) * Math.max(1, x3 + 3 & -4) * y, b4 >>>= 1, x3 >>>= 1;
                var E3 = 148;
                for(T3 = 0; T3 < _6; T3++)v4.push(new Uint8Array(t12, E3, g4)), E3 += g4;
            }
            return v4.map(function(t13) {
                return new Xo(t13, {
                    format: m6,
                    width: n43,
                    height: i56,
                    levels: o42
                });
            });
        }
        if (64 & a37) throw new Error("DDSLoader does not support uncompressed texture data.");
        if (512 & a37) throw new Error("DDSLoader does not supported YUV uncompressed texture data.");
        if (131072 & a37) throw new Error("DDSLoader does not support single-channel (lumninance) texture data!");
        if (2 & a37) throw new Error("DDSLoader does not support single-channel (alpha) texture data!");
        throw new Error("DDSLoader failed to load a texture file due to an unknown reason!");
    }, t7;
}();
Lo.setExtensionXhrType("ktx", Lo.XHR_RESPONSE_TYPE.BUFFER);
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
], js = ((Ls = {
})[zt.UNSIGNED_BYTE] = 1, Ls[zt.UNSIGNED_SHORT] = 2, Ls[zt.FLOAT] = 4, Ls[zt.HALF_FLOAT] = 8, Ls), Hs = ((Fs = {
})[Yt.RGBA] = 4, Fs[Yt.RGB] = 3, Fs[Yt.LUMINANCE] = 1, Fs[Yt.LUMINANCE_ALPHA] = 2, Fs[Yt.ALPHA] = 1, Fs), Ys = ((Bs = {
})[zt.UNSIGNED_SHORT_4_4_4_4] = 2, Bs[zt.UNSIGNED_SHORT_5_5_5_1] = 2, Bs[zt.UNSIGNED_SHORT_5_6_5] = 2, Bs), Vs = function() {
    function t7() {
    }
    return t7.use = function(e31, r51) {
        if ("ktx" === e31.extension && e31.data) try {
            var i56 = e31.name || e31.url;
            Object.assign(e31, Ds(i56, t7.parse(i56, e31.data), e31.metadata));
        } catch (t12) {
            return void r51(t12);
        }
        r51();
    }, t7.parse = function(e31, r51) {
        var i56 = new DataView(r51);
        if (!t7.validate(e31, i56)) return null;
        var n43 = 67305985 === i56.getUint32(12, !0), o42 = i56.getUint32(16, n43), s37 = i56.getUint32(24, n43), a37 = i56.getUint32(28, n43), h37 = i56.getUint32(36, n43), u34 = i56.getUint32(40, n43) || 1, l25 = i56.getUint32(44, n43) || 1, c21 = i56.getUint32(48, n43) || 1, d21 = i56.getUint32(52, n43), f17 = i56.getUint32(56, n43), p = i56.getUint32(60, n43);
        if (0 === u34 || 1 !== l25) throw new Error("Only 2D textures are supported");
        if (1 !== d21) throw new Error("CubeTextures are not supported by KTXLoader yet!");
        if (1 !== c21) throw new Error("WebGL does not support array textures");
        var _7, m7 = h37 + 3 & -4, v5 = u34 + 3 & -4, y = new Array(c21), g5 = h37 * u34;
        if (0 === o42 && (g5 = m7 * v5), (void 0) === (_7 = 0 !== o42 ? js[o42] ? js[o42] * Hs[s37] : Ys[o42] : Fo[a37])) throw new Error("Unable to resolve the pixel format stored in the *.ktx file!");
        for(var b5 = g5 * _7, x4 = h37, T4 = u34, E4 = m7, A3 = v5, S4 = 64 + p, O3 = 0; O3 < f17; O3++){
            for(var R3 = i56.getUint32(S4, n43), w3 = S4 + 4, P3 = 0; P3 < c21; P3++){
                var I1 = y[P3];
                I1 || (I1 = y[P3] = new Array(f17)), I1[O3] = {
                    levelID: O3,
                    levelWidth: f17 > 1 ? x4 : E4,
                    levelHeight: f17 > 1 ? T4 : A3,
                    levelBuffer: new Uint8Array(r51, w3, b5)
                }, w3 += b5;
            }
            S4 = (S4 += R3 + 4) % 4 != 0 ? S4 + 4 - S4 % 4 : S4, b5 = (E4 = (x4 = x4 >> 1 || 1) + 4 - 1 & -4) * (A3 = (T4 = T4 >> 1 || 1) + 4 - 1 & -4) * _7;
        }
        if (0 !== o42) throw new Error("TODO: Uncompressed");
        return y.map(function(t12) {
            return new Xo(null, {
                format: a37,
                width: h37,
                height: u34,
                levels: f17,
                levelBuffers: t12
            });
        });
    }, t7.validate = function(t12, e31) {
        for(var r51 = 0; r51 < ks.length; r51++)if (e31.getUint8(r51) !== ks[r51]) return !1;
        return !0;
    }, t7;
}(), zs = function(t7, e31) {
    return (zs = Object.setPrototypeOf || ({
        __proto__: []
    }) instanceof Array && function(t12, e32) {
        t12.__proto__ = e32;
    } || function(t12, e32) {
        for(var r51 in e32)e32.hasOwnProperty(r51) && (t12[r51] = e32[r51]);
    })(t7, e31);
};
function Ws(t7, e31) {
    function r51() {
        this.constructor = t7;
    }
    zs(t7, e31), t7.prototype = null === e31 ? Object.create(e31) : (r51.prototype = e31.prototype, new r51);
}
var qs, Ks, Zs = function(t7) {
    function e31(e32, r51, i56, n43) {
        (void 0) === e32 && (e32 = 1500), (void 0) === i56 && (i56 = 16384), (void 0) === n43 && (n43 = !1);
        var o42 = t7.call(this) || this;
        return i56 > 16384 && (i56 = 16384), o42._properties = [
            !1,
            !0,
            !1,
            !1,
            !1
        ], o42._maxSize = e32, o42._batchSize = i56, o42._buffers = null, o42._bufferUpdateIDs = [], o42._updateID = 0, o42.interactiveChildren = !1, o42.blendMode = jt.NORMAL, o42.autoResize = n43, o42.roundPixels = !0, o42.baseTexture = null, o42.setProperties(r51), o42._tint = 0, o42.tintRgb = new Float32Array(4), o42.tint = 16777215, o42;
    }
    return Ws(e31, t7), e31.prototype.setProperties = function(t12) {
        t12 && (this._properties[0] = "vertices" in t12 || "scale" in t12 ? !!t12.vertices || !!t12.scale : this._properties[0], this._properties[1] = "position" in t12 ? !!t12.position : this._properties[1], this._properties[2] = "rotation" in t12 ? !!t12.rotation : this._properties[2], this._properties[3] = "uvs" in t12 ? !!t12.uvs : this._properties[3], this._properties[4] = "tint" in t12 || "alpha" in t12 ? !!t12.tint || !!t12.alpha : this._properties[4]);
    }, e31.prototype.updateTransform = function() {
        this.displayObjectUpdateTransform();
    }, Object.defineProperty(e31.prototype, "tint", {
        get: function() {
            return this._tint;
        },
        set: function(t12) {
            this._tint = t12, ue(t12, this.tintRgb);
        },
        enumerable: !1,
        configurable: !0
    }), e31.prototype.render = function(t12) {
        var e32 = this;
        this.visible && !(this.worldAlpha <= 0) && this.children.length && this.renderable && (this.baseTexture || (this.baseTexture = this.children[0]._texture.baseTexture, this.baseTexture.valid || this.baseTexture.once("update", function() {
            return e32.onChildrenChange(0);
        })), t12.batch.setObjectRenderer(t12.plugins.particle), t12.plugins.particle.render(this));
    }, e31.prototype.onChildrenChange = function(t12) {
        for(var e32 = Math.floor(t12 / this._batchSize); this._bufferUpdateIDs.length < e32;)this._bufferUpdateIDs.push(0);
        this._bufferUpdateIDs[e32] = ++this._updateID;
    }, e31.prototype.dispose = function() {
        if (this._buffers) {
            for(var t12 = 0; t12 < this._buffers.length; ++t12)this._buffers[t12].destroy();
            this._buffers = null;
        }
    }, e31.prototype.destroy = function(e32) {
        t7.prototype.destroy.call(this, e32), this.dispose(), this._properties = null, this._buffers = null, this._bufferUpdateIDs = null;
    }, e31;
}(cr), Js = function() {
    function t7(t13, e31, r51) {
        this.geometry = new pi, this.indexBuffer = null, this.size = r51, this.dynamicProperties = [], this.staticProperties = [];
        for(var i56 = 0; i56 < t13.length; ++i56){
            var n43 = t13[i56];
            n43 = {
                attributeName: n43.attributeName,
                size: n43.size,
                uploadFunction: n43.uploadFunction,
                type: n43.type || zt.FLOAT,
                offset: n43.offset
            }, e31[i56] ? this.dynamicProperties.push(n43) : this.staticProperties.push(n43);
        }
        this.staticStride = 0, this.staticBuffer = null, this.staticData = null, this.staticDataUint32 = null, this.dynamicStride = 0, this.dynamicBuffer = null, this.dynamicData = null, this.dynamicDataUint32 = null, this._updateID = 0, this.initBuffers();
    }
    return t7.prototype.initBuffers = function() {
        var t13 = this.geometry, e31 = 0;
        this.indexBuffer = new hi(ve(this.size), !0, !0), t13.addIndex(this.indexBuffer), this.dynamicStride = 0;
        for(var r51 = 0; r51 < this.dynamicProperties.length; ++r51)(s38 = this.dynamicProperties[r51]).offset = e31, e31 += s38.size, this.dynamicStride += s38.size;
        var i56 = new ArrayBuffer(this.size * this.dynamicStride * 4 * 4);
        this.dynamicData = new Float32Array(i56), this.dynamicDataUint32 = new Uint32Array(i56), this.dynamicBuffer = new hi(this.dynamicData, !1, !1);
        var n44 = 0;
        for(this.staticStride = 0, r51 = 0; r51 < this.staticProperties.length; ++r51)(s38 = this.staticProperties[r51]).offset = n44, n44 += s38.size, this.staticStride += s38.size;
        var o42 = new ArrayBuffer(this.size * this.staticStride * 4 * 4);
        for(this.staticData = new Float32Array(o42), this.staticDataUint32 = new Uint32Array(o42), this.staticBuffer = new hi(this.staticData, !0, !1), r51 = 0; r51 < this.dynamicProperties.length; ++r51){
            var s38 = this.dynamicProperties[r51];
            t13.addAttribute(s38.attributeName, this.dynamicBuffer, 0, s38.type === zt.UNSIGNED_BYTE, s38.type, 4 * this.dynamicStride, 4 * s38.offset);
        }
        for(r51 = 0; r51 < this.staticProperties.length; ++r51)s38 = this.staticProperties[r51], t13.addAttribute(s38.attributeName, this.staticBuffer, 0, s38.type === zt.UNSIGNED_BYTE, s38.type, 4 * this.staticStride, 4 * s38.offset);
    }, t7.prototype.uploadDynamic = function(t13, e31, r51) {
        for(var i56 = 0; i56 < this.dynamicProperties.length; i56++){
            var n44 = this.dynamicProperties[i56];
            n44.uploadFunction(t13, e31, r51, n44.type === zt.UNSIGNED_BYTE ? this.dynamicDataUint32 : this.dynamicData, this.dynamicStride, n44.offset);
        }
        this.dynamicBuffer._updateID++;
    }, t7.prototype.uploadStatic = function(t13, e31, r51) {
        for(var i56 = 0; i56 < this.staticProperties.length; i56++){
            var n45 = this.staticProperties[i56];
            n45.uploadFunction(t13, e31, r51, n45.type === zt.UNSIGNED_BYTE ? this.staticDataUint32 : this.staticData, this.staticStride, n45.offset);
        }
        this.staticBuffer._updateID++;
    }, t7.prototype.destroy = function() {
        this.indexBuffer = null, this.dynamicProperties = null, this.dynamicBuffer = null, this.dynamicData = null, this.dynamicDataUint32 = null, this.staticProperties = null, this.staticBuffer = null, this.staticData = null, this.staticDataUint32 = null, this.geometry.destroy();
    }, t7;
}(), Qs = "varying vec2 vTextureCoord;\nvarying vec4 vColor;\n\nuniform sampler2D uSampler;\n\nvoid main(void){\n    vec4 color = texture2D(uSampler, vTextureCoord) * vColor;\n    gl_FragColor = color;\n}", $s = "attribute vec2 aVertexPosition;\nattribute vec2 aTextureCoord;\nattribute vec4 aColor;\n\nattribute vec2 aPositionCoord;\nattribute float aRotation;\n\nuniform mat3 translationMatrix;\nuniform vec4 uColor;\n\nvarying vec2 vTextureCoord;\nvarying vec4 vColor;\n\nvoid main(void){\n    float x = (aVertexPosition.x) * cos(aRotation) - (aVertexPosition.y) * sin(aRotation);\n    float y = (aVertexPosition.x) * sin(aRotation) + (aVertexPosition.y) * cos(aRotation);\n\n    vec2 v = vec2(x, y);\n    v = v + aPositionCoord;\n\n    gl_Position = vec4((translationMatrix * vec3(v, 1.0)).xy, 0.0, 1.0);\n\n    vTextureCoord = aTextureCoord;\n    vColor = aColor * uColor;\n}\n", ta = function(t7) {
    function e31(e32) {
        var r51 = t7.call(this, e32) || this;
        return r51.shader = null, r51.properties = null, r51.tempMatrix = new Ke, r51.properties = [
            {
                attributeName: "aVertexPosition",
                size: 2,
                uploadFunction: r51.uploadVertices,
                offset: 0
            },
            {
                attributeName: "aPositionCoord",
                size: 2,
                uploadFunction: r51.uploadPosition,
                offset: 0
            },
            {
                attributeName: "aRotation",
                size: 1,
                uploadFunction: r51.uploadRotation,
                offset: 0
            },
            {
                attributeName: "aTextureCoord",
                size: 2,
                uploadFunction: r51.uploadUvs,
                offset: 0
            },
            {
                attributeName: "aColor",
                size: 1,
                type: zt.UNSIGNED_BYTE,
                uploadFunction: r51.uploadTint,
                offset: 0
            }
        ], r51.shader = on.from($s, Qs, {
        }), r51.state = sn.for2d(), r51;
    }
    return Ws(e31, t7), e31.prototype.render = function(t13) {
        var e32 = t13.children, r51 = t13._maxSize, i56 = t13._batchSize, n46 = this.renderer, o42 = e32.length;
        if (0 !== o42) {
            o42 > r51 && !t13.autoResize && (o42 = r51);
            var s39 = t13._buffers;
            s39 || (s39 = t13._buffers = this.generateBuffers(t13));
            var a37 = e32[0]._texture.baseTexture;
            this.state.blendMode = fe(t13.blendMode, a37.alphaMode), n46.state.set(this.state);
            var h37 = n46.gl, u34 = t13.worldTransform.copyTo(this.tempMatrix);
            u34.prepend(n46.globalUniforms.uniforms.projectionMatrix), this.shader.uniforms.translationMatrix = u34.toArray(!0), this.shader.uniforms.uColor = pe(t13.tintRgb, t13.worldAlpha, this.shader.uniforms.uColor, a37.alphaMode), this.shader.uniforms.uSampler = a37, this.renderer.shader.bind(this.shader);
            for(var l25 = !1, c21 = 0, d21 = 0; c21 < o42; c21 += i56, d21 += 1){
                var f17 = o42 - c21;
                f17 > i56 && (f17 = i56), d21 >= s39.length && s39.push(this._generateOneMoreBuffer(t13));
                var p = s39[d21];
                p.uploadDynamic(e32, c21, f17);
                var _7 = t13._bufferUpdateIDs[d21] || 0;
                (l25 = l25 || p._updateID < _7) && (p._updateID = t13._updateID, p.uploadStatic(e32, c21, f17)), n46.geometry.bind(p.geometry), h37.drawElements(h37.TRIANGLES, 6 * f17, h37.UNSIGNED_SHORT, 0);
            }
        }
    }, e31.prototype.generateBuffers = function(t13) {
        for(var e32 = [], r51 = t13._maxSize, i56 = t13._batchSize, n46 = t13._properties, o42 = 0; o42 < r51; o42 += i56)e32.push(new Js(this.properties, n46, i56));
        return e32;
    }, e31.prototype._generateOneMoreBuffer = function(t13) {
        var e32 = t13._batchSize, r51 = t13._properties;
        return new Js(this.properties, r51, e32);
    }, e31.prototype.uploadVertices = function(t13, e32, r51, i56, n46, o42) {
        for(var s40 = 0, a38 = 0, h38 = 0, u35 = 0, l26 = 0; l26 < r51; ++l26){
            var c22 = t13[e32 + l26], d22 = c22._texture, f18 = c22.scale.x, p = c22.scale.y, _8 = d22.trim, m7 = d22.orig;
            _8 ? (s40 = (a38 = _8.x - c22.anchor.x * m7.width) + _8.width, h38 = (u35 = _8.y - c22.anchor.y * m7.height) + _8.height) : (s40 = m7.width * (1 - c22.anchor.x), a38 = m7.width * -c22.anchor.x, h38 = m7.height * (1 - c22.anchor.y), u35 = m7.height * -c22.anchor.y), i56[o42] = a38 * f18, i56[o42 + 1] = u35 * p, i56[o42 + n46] = s40 * f18, i56[o42 + n46 + 1] = u35 * p, i56[o42 + 2 * n46] = s40 * f18, i56[o42 + 2 * n46 + 1] = h38 * p, i56[o42 + 3 * n46] = a38 * f18, i56[o42 + 3 * n46 + 1] = h38 * p, o42 += 4 * n46;
        }
    }, e31.prototype.uploadPosition = function(t13, e32, r51, i56, n46, o42) {
        for(var s40 = 0; s40 < r51; s40++){
            var a38 = t13[e32 + s40].position;
            i56[o42] = a38.x, i56[o42 + 1] = a38.y, i56[o42 + n46] = a38.x, i56[o42 + n46 + 1] = a38.y, i56[o42 + 2 * n46] = a38.x, i56[o42 + 2 * n46 + 1] = a38.y, i56[o42 + 3 * n46] = a38.x, i56[o42 + 3 * n46 + 1] = a38.y, o42 += 4 * n46;
        }
    }, e31.prototype.uploadRotation = function(t13, e32, r51, i56, n46, o42) {
        for(var s40 = 0; s40 < r51; s40++){
            var a39 = t13[e32 + s40].rotation;
            i56[o42] = a39, i56[o42 + n46] = a39, i56[o42 + 2 * n46] = a39, i56[o42 + 3 * n46] = a39, o42 += 4 * n46;
        }
    }, e31.prototype.uploadUvs = function(t13, e32, r51, i56, n46, o42) {
        for(var s40 = 0; s40 < r51; ++s40){
            var a40 = t13[e32 + s40]._texture._uvs;
            a40 ? (i56[o42] = a40.x0, i56[o42 + 1] = a40.y0, i56[o42 + n46] = a40.x1, i56[o42 + n46 + 1] = a40.y1, i56[o42 + 2 * n46] = a40.x2, i56[o42 + 2 * n46 + 1] = a40.y2, i56[o42 + 3 * n46] = a40.x3, i56[o42 + 3 * n46 + 1] = a40.y3, o42 += 4 * n46) : (i56[o42] = 0, i56[o42 + 1] = 0, i56[o42 + n46] = 0, i56[o42 + n46 + 1] = 0, i56[o42 + 2 * n46] = 0, i56[o42 + 2 * n46 + 1] = 0, i56[o42 + 3 * n46] = 0, i56[o42 + 3 * n46 + 1] = 0, o42 += 4 * n46);
        }
    }, e31.prototype.uploadTint = function(t13, e32, r51, i56, n46, o42) {
        for(var s40 = 0; s40 < r51; ++s40){
            var a41 = t13[e32 + s40], h38 = a41._texture.baseTexture.alphaMode > 0, u35 = a41.alpha, l26 = u35 < 1 && h38 ? _e(a41._tintRGB, u35) : a41._tintRGB + (255 * u35 << 24);
            i56[o42] = l26, i56[o42 + n46] = l26, i56[o42 + 2 * n46] = l26, i56[o42 + 3 * n46] = l26, o42 += 4 * n46;
        }
    }, e31.prototype.destroy = function() {
        t7.prototype.destroy.call(this), this.shader && (this.shader.destroy(), this.shader = null), this.tempMatrix = null;
    }, e31;
}(Ei);
!function(t7) {
    t7.MITER = "miter", t7.BEVEL = "bevel", t7.ROUND = "round";
}(qs || (qs = {
})), (function(t7) {
    t7.BUTT = "butt", t7.ROUND = "round", t7.SQUARE = "square";
})(Ks || (Ks = {
}));
var ea = {
    adaptive: !0,
    maxLength: 10,
    minSegments: 8,
    maxSegments: 2048,
    epsilon: 0.0001,
    _segmentsCount: function(t7, e31) {
        if ((void 0) === e31 && (e31 = 20), !this.adaptive || !t7 || isNaN(t7)) return e31;
        var r51 = Math.ceil(t7 / this.maxLength);
        return r51 < this.minSegments ? r51 = this.minSegments : r51 > this.maxSegments && (r51 = this.maxSegments), r51;
    }
}, ra = function() {
    function t7() {
        this.color = 16777215, this.alpha = 1, this.texture = ri.WHITE, this.matrix = null, this.visible = !1, this.reset();
    }
    return t7.prototype.clone = function() {
        var e31 = new t7;
        return e31.color = this.color, e31.alpha = this.alpha, e31.texture = this.texture, e31.matrix = this.matrix, e31.visible = this.visible, e31;
    }, t7.prototype.reset = function() {
        this.color = 16777215, this.alpha = 1, this.texture = ri.WHITE, this.matrix = null, this.visible = !1;
    }, t7.prototype.destroy = function() {
        this.texture = null, this.matrix = null;
    }, t7;
}(), ia = function(t7, e31) {
    return (ia = Object.setPrototypeOf || ({
        __proto__: []
    }) instanceof Array && function(t13, e32) {
        t13.__proto__ = e32;
    } || function(t13, e32) {
        for(var r51 in e32)e32.hasOwnProperty(r51) && (t13[r51] = e32[r51]);
    })(t7, e31);
};
function na(t7, e31) {
    function r51() {
        this.constructor = t7;
    }
    ia(t7, e31), t7.prototype = null === e31 ? Object.create(e31) : (r51.prototype = e31.prototype, new r51);
}
var oa = {
    build: function(t7) {
        t7.points = t7.shape.points.slice();
    },
    triangulate: function(t7, e31) {
        var r51 = t7.points, i56 = t7.holes, n46 = e31.points, o42 = e31.indices;
        if (r51.length >= 6) {
            for(var s40 = [], a42 = 0; a42 < i56.length; a42++){
                var h39 = i56[a42];
                s40.push(r51.length / 2), r51 = r51.concat(h39.points);
            }
            var u36 = k(r51, s40, 2);
            if (!u36) return;
            var l27 = n46.length / 2;
            for(a42 = 0; a42 < u36.length; a42 += 3)o42.push(u36[a42] + l27), o42.push(u36[a42 + 1] + l27), o42.push(u36[a42 + 2] + l27);
            for(a42 = 0; a42 < r51.length; a42++)n46.push(r51[a42]);
        }
    }
}, sa = {
    build: function(t7) {
        var e31, r51, i56 = t7.shape, n46 = t7.points, o42 = i56.x, s41 = i56.y;
        if (n46.length = 0, t7.type === Be.CIRC) e31 = i56.radius, r51 = i56.radius;
        else {
            var a43 = t7.shape;
            e31 = a43.width, r51 = a43.height;
        }
        if (0 !== e31 && 0 !== r51) {
            var h40 = Math.floor(30 * Math.sqrt(i56.radius)) || Math.floor(15 * Math.sqrt(e31 + r51));
            h40 /= 2.3;
            for(var u37 = 2 * Math.PI / h40, l28 = 0; l28 < h40 - 0.5; l28++)n46.push(o42 + Math.sin(-u37 * l28) * e31, s41 + Math.cos(-u37 * l28) * r51);
            n46.push(n46[0], n46[1]);
        }
    },
    triangulate: function(t7, e31) {
        var r51 = t7.points, i56 = e31.points, n46 = e31.indices, o42 = i56.length / 2, s41 = o42, a44 = t7.shape, h41 = t7.matrix, u38 = a44.x, l29 = a44.y;
        i56.push(t7.matrix ? h41.a * u38 + h41.c * l29 + h41.tx : u38, t7.matrix ? h41.b * u38 + h41.d * l29 + h41.ty : l29);
        for(var c23 = 0; c23 < r51.length; c23 += 2)i56.push(r51[c23], r51[c23 + 1]), n46.push(o42++, s41, o42);
    }
}, aa = {
    build: function(t7) {
        var e31 = t7.shape, r51 = e31.x, i56 = e31.y, n46 = e31.width, o42 = e31.height, s41 = t7.points;
        s41.length = 0, s41.push(r51, i56, r51 + n46, i56, r51 + n46, i56 + o42, r51, i56 + o42);
    },
    triangulate: function(t7, e31) {
        var r51 = t7.points, i56 = e31.points, n46 = i56.length / 2;
        i56.push(r51[0], r51[1], r51[2], r51[3], r51[6], r51[7], r51[4], r51[5]), e31.indices.push(n46, n46 + 1, n46 + 2, n46 + 1, n46 + 2, n46 + 3);
    }
};
function ha(t7, e31, r51) {
    return t7 + (e31 - t7) * r51;
}
function ua(t7, e31, r51, i56, n46, o42, s41) {
    (void 0) === s41 && (s41 = []);
    for(var a44 = s41, h41 = 0, u38 = 0, l29 = 0, c23 = 0, d23 = 0, f19 = 0, p = 0, _9 = 0; p <= 20; ++p)h41 = ha(t7, r51, _9 = p / 20), u38 = ha(e31, i56, _9), l29 = ha(r51, n46, _9), c23 = ha(i56, o42, _9), d23 = ha(h41, l29, _9), f19 = ha(u38, c23, _9), a44.push(d23, f19);
    return a44;
}
var la = {
    build: function(t7) {
        var e31 = t7.shape, r51 = t7.points, i56 = e31.x, n46 = e31.y, o42 = e31.width, s41 = e31.height, a44 = Math.max(0, Math.min(e31.radius, Math.min(o42, s41) / 2));
        r51.length = 0, a44 ? (ua(i56, n46 + a44, i56, n46, i56 + a44, n46, r51), ua(i56 + o42 - a44, n46, i56 + o42, n46, i56 + o42, n46 + a44, r51), ua(i56 + o42, n46 + s41 - a44, i56 + o42, n46 + s41, i56 + o42 - a44, n46 + s41, r51), ua(i56 + a44, n46 + s41, i56, n46 + s41, i56, n46 + s41 - a44, r51)) : r51.push(i56, n46, i56 + o42, n46, i56 + o42, n46 + s41, i56, n46 + s41);
    },
    triangulate: function(t7, e31) {
        for(var r51 = t7.points, i56 = e31.points, n46 = e31.indices, o42 = i56.length / 2, s41 = k(r51, null, 2), a44 = 0, h41 = s41.length; a44 < h41; a44 += 3)n46.push(s41[a44] + o42), n46.push(s41[a44 + 1] + o42), n46.push(s41[a44 + 2] + o42);
        for(a44 = 0, h41 = r51.length; a44 < h41; a44++)i56.push(r51[a44], r51[++a44]);
    }
};
function ca(t7, e31, r51, i56, n46, o42, s41, a44) {
    var h41, u38;
    s41 ? (h41 = i56, u38 = -r51) : (h41 = -i56, u38 = r51);
    var l29 = t7 - r51 * n46 + h41, c23 = e31 - i56 * n46 + u38, d23 = t7 + r51 * o42 + h41, f19 = e31 + i56 * o42 + u38;
    return a44.push(l29, c23), a44.push(d23, f19), 2;
}
function da(t7, e31, r51, i56, n46, o42, s41, a44) {
    var h41 = r51 - t7, u38 = i56 - e31, l29 = Math.atan2(h41, u38), c23 = Math.atan2(n46 - t7, o42 - e31);
    a44 && l29 < c23 ? l29 += 2 * Math.PI : !a44 && l29 > c23 && (c23 += 2 * Math.PI);
    var d23 = l29, f19 = c23 - l29, p = Math.abs(f19), _9 = Math.sqrt(h41 * h41 + u38 * u38), m8 = 1 + (15 * p * Math.sqrt(_9) / Math.PI >> 0), v5 = f19 / m8;
    if (d23 += v5, a44) {
        s41.push(t7, e31), s41.push(r51, i56);
        for(var y = 1, g5 = d23; y < m8; y++, g5 += v5)s41.push(t7, e31), s41.push(t7 + Math.sin(g5) * _9, e31 + Math.cos(g5) * _9);
        s41.push(t7, e31), s41.push(n46, o42);
    } else {
        for(s41.push(r51, i56), s41.push(t7, e31), y = 1, g5 = d23; y < m8; y++, g5 += v5)s41.push(t7 + Math.sin(g5) * _9, e31 + Math.cos(g5) * _9), s41.push(t7, e31);
        s41.push(n46, o42), s41.push(t7, e31);
    }
    return 2 * m8;
}
function fa(t7, e31) {
    t7.lineStyle.native ? (function(t13, e32) {
        var r51 = 0, i56 = t13.shape, n46 = t13.points || i56.points, o42 = i56.type !== Be.POLY || i56.closeStroke;
        if (0 !== n46.length) {
            var s41 = e32.points, a44 = e32.indices, h41 = n46.length / 2, u38 = s41.length / 2, l29 = u38;
            for(s41.push(n46[0], n46[1]), r51 = 1; r51 < h41; r51++)s41.push(n46[2 * r51], n46[2 * r51 + 1]), a44.push(l29, l29 + 1), l29++;
            o42 && a44.push(l29, u38);
        }
    })(t7, e31) : (function(t13, e32) {
        var r51 = t13.shape, i56 = t13.points || r51.points.slice(), n46 = e32.closePointEps;
        if (0 !== i56.length) {
            var o42 = t13.lineStyle, s42 = new We(i56[0], i56[1]), a45 = new We(i56[i56.length - 2], i56[i56.length - 1]), h42 = r51.type !== Be.POLY || r51.closeStroke, u39 = Math.abs(s42.x - a45.x) < n46 && Math.abs(s42.y - a45.y) < n46;
            if (h42) {
                i56 = i56.slice(), u39 && (i56.pop(), i56.pop(), a45.set(i56[i56.length - 2], i56[i56.length - 1]));
                var l30 = 0.5 * (s42.x + a45.x), c23 = 0.5 * (a45.y + s42.y);
                i56.unshift(l30, c23), i56.push(l30, c23);
            }
            var d23 = e32.points, f19 = i56.length / 2, p = i56.length, _9 = d23.length / 2, m8 = o42.width / 2, v5 = m8 * m8, y = o42.miterLimit * o42.miterLimit, g6 = i56[0], b5 = i56[1], x4 = i56[2], T4 = i56[3], E4 = 0, A3 = 0, S4 = -(b5 - T4), O3 = g6 - x4, R4 = 0, w4 = 0, P4 = Math.sqrt(S4 * S4 + O3 * O3);
            S4 /= P4, O3 /= P4, S4 *= m8, O3 *= m8;
            var I2 = o42.alignment, M1 = 2 * (1 - I2), D3 = 2 * I2;
            h42 || (o42.cap === Ks.ROUND ? p += da(g6 - S4 * (M1 - D3) * 0.5, b5 - O3 * (M1 - D3) * 0.5, g6 - S4 * M1, b5 - O3 * M1, g6 + S4 * D3, b5 + O3 * D3, d23, !0) + 2 : o42.cap === Ks.SQUARE && (p += ca(g6, b5, S4, O3, M1, D3, !0, d23))), d23.push(g6 - S4 * M1, b5 - O3 * M1), d23.push(g6 + S4 * D3, b5 + O3 * D3);
            for(var C1 = 1; C1 < f19 - 1; ++C1){
                g6 = i56[2 * (C1 - 1)], b5 = i56[2 * (C1 - 1) + 1], x4 = i56[2 * C1], T4 = i56[2 * C1 + 1], E4 = i56[2 * (C1 + 1)], A3 = i56[2 * (C1 + 1) + 1], S4 = -(b5 - T4), O3 = g6 - x4, S4 /= P4 = Math.sqrt(S4 * S4 + O3 * O3), O3 /= P4, S4 *= m8, O3 *= m8, R4 = -(T4 - A3), w4 = x4 - E4, R4 /= P4 = Math.sqrt(R4 * R4 + w4 * w4), w4 /= P4, R4 *= m8, w4 *= m8;
                var N1 = x4 - g6, L1 = b5 - T4, F1 = x4 - E4, B1 = A3 - T4, U1 = L1 * F1 - B1 * N1, G1 = U1 < 0;
                if (Math.abs(U1) < 0.1) d23.push(x4 - S4 * M1, T4 - O3 * M1), d23.push(x4 + S4 * D3, T4 + O3 * D3);
                else {
                    var X1 = (-S4 + g6) * (-O3 + T4) - (-S4 + x4) * (-O3 + b5), k1 = (-R4 + E4) * (-w4 + T4) - (-R4 + x4) * (-w4 + A3), j1 = (N1 * k1 - F1 * X1) / U1, H1 = (B1 * X1 - L1 * k1) / U1, Y1 = (j1 - x4) * (j1 - x4) + (H1 - T4) * (H1 - T4), V1 = x4 + (j1 - x4) * M1, z1 = T4 + (H1 - T4) * M1, W1 = x4 - (j1 - x4) * D3, q1 = T4 - (H1 - T4) * D3, K1 = G1 ? M1 : D3;
                    Y1 <= Math.min(N1 * N1 + L1 * L1, F1 * F1 + B1 * B1) + K1 * K1 * v5 ? o42.join === qs.BEVEL || Y1 / v5 > y ? (G1 ? (d23.push(V1, z1), d23.push(x4 + S4 * D3, T4 + O3 * D3), d23.push(V1, z1), d23.push(x4 + R4 * D3, T4 + w4 * D3)) : (d23.push(x4 - S4 * M1, T4 - O3 * M1), d23.push(W1, q1), d23.push(x4 - R4 * M1, T4 - w4 * M1), d23.push(W1, q1)), p += 2) : o42.join === qs.ROUND ? G1 ? (d23.push(V1, z1), d23.push(x4 + S4 * D3, T4 + O3 * D3), p += da(x4, T4, x4 + S4 * D3, T4 + O3 * D3, x4 + R4 * D3, T4 + w4 * D3, d23, !0) + 4, d23.push(V1, z1), d23.push(x4 + R4 * D3, T4 + w4 * D3)) : (d23.push(x4 - S4 * M1, T4 - O3 * M1), d23.push(W1, q1), p += da(x4, T4, x4 - S4 * M1, T4 - O3 * M1, x4 - R4 * M1, T4 - w4 * M1, d23, !1) + 4, d23.push(x4 - R4 * M1, T4 - w4 * M1), d23.push(W1, q1)) : (d23.push(V1, z1), d23.push(W1, q1)) : (d23.push(x4 - S4 * M1, T4 - O3 * M1), d23.push(x4 + S4 * D3, T4 + O3 * D3), o42.join === qs.BEVEL || Y1 / v5 > y || (o42.join === qs.ROUND ? p += G1 ? da(x4, T4, x4 + S4 * D3, T4 + O3 * D3, x4 + R4 * D3, T4 + w4 * D3, d23, !0) + 2 : da(x4, T4, x4 - S4 * M1, T4 - O3 * M1, x4 - R4 * M1, T4 - w4 * M1, d23, !1) + 2 : (G1 ? (d23.push(W1, q1), d23.push(W1, q1)) : (d23.push(V1, z1), d23.push(V1, z1)), p += 2)), d23.push(x4 - R4 * M1, T4 - w4 * M1), d23.push(x4 + R4 * D3, T4 + w4 * D3), p += 2);
                }
            }
            g6 = i56[2 * (f19 - 2)], b5 = i56[2 * (f19 - 2) + 1], x4 = i56[2 * (f19 - 1)], S4 = -(b5 - (T4 = i56[2 * (f19 - 1) + 1])), O3 = g6 - x4, S4 /= P4 = Math.sqrt(S4 * S4 + O3 * O3), O3 /= P4, S4 *= m8, O3 *= m8, d23.push(x4 - S4 * M1, T4 - O3 * M1), d23.push(x4 + S4 * D3, T4 + O3 * D3), h42 || (o42.cap === Ks.ROUND ? p += da(x4 - S4 * (M1 - D3) * 0.5, T4 - O3 * (M1 - D3) * 0.5, x4 - S4 * M1, T4 - O3 * M1, x4 + S4 * D3, T4 + O3 * D3, d23, !1) + 2 : o42.cap === Ks.SQUARE && (p += ca(x4, T4, S4, O3, M1, D3, !1, d23)));
            var Z1 = e32.indices, J1 = ea.epsilon * ea.epsilon;
            for(C1 = _9; C1 < p + _9 - 2; ++C1)g6 = d23[2 * C1], b5 = d23[2 * C1 + 1], x4 = d23[2 * (C1 + 1)], T4 = d23[2 * (C1 + 1) + 1], E4 = d23[2 * (C1 + 2)], A3 = d23[2 * (C1 + 2) + 1], Math.abs(g6 * (T4 - A3) + x4 * (A3 - b5) + E4 * (b5 - T4)) < J1 || Z1.push(C1, C1 + 1, C1 + 2);
        }
    })(t7, e31);
}
var pa, _a, ma = function() {
    function t7() {
    }
    return t7.curveTo = function(t13, e31, r51, i56, n46, o43) {
        var s43 = o43[o43.length - 2], a46 = o43[o43.length - 1] - e31, h43 = s43 - t13, u40 = i56 - e31, l31 = r51 - t13, c24 = Math.abs(a46 * l31 - h43 * u40);
        if (c24 < 0.00000001 || 0 === n46) return o43[o43.length - 2] === t13 && o43[o43.length - 1] === e31 || o43.push(t13, e31), null;
        var d24 = a46 * a46 + h43 * h43, f20 = u40 * u40 + l31 * l31, p = a46 * u40 + h43 * l31, _10 = n46 * Math.sqrt(d24) / c24, m9 = n46 * Math.sqrt(f20) / c24, v6 = _10 * p / d24, y = m9 * p / f20, g7 = _10 * l31 + m9 * h43, b6 = _10 * u40 + m9 * a46, x5 = h43 * (m9 + v6), T5 = a46 * (m9 + v6), E5 = l31 * (_10 + y), A4 = u40 * (_10 + y);
        return {
            cx: g7 + t13,
            cy: b6 + e31,
            radius: n46,
            startAngle: Math.atan2(T5 - b6, x5 - g7),
            endAngle: Math.atan2(A4 - b6, E5 - g7),
            anticlockwise: h43 * u40 > l31 * a46
        };
    }, t7.arc = function(t13, e31, r51, i56, n46, o43, s43, a46, h43) {
        for(var u40 = s43 - o43, l31 = ea._segmentsCount(Math.abs(u40) * n46, 40 * Math.ceil(Math.abs(u40) / Ge)), c24 = u40 / (2 * l31), d24 = 2 * c24, f20 = Math.cos(c24), p = Math.sin(c24), _10 = l31 - 1, m9 = _10 % 1 / _10, v6 = 0; v6 <= _10; ++v6){
            var y = c24 + o43 + d24 * (v6 + m9 * v6), g7 = Math.cos(y), b6 = -Math.sin(y);
            h43.push((f20 * g7 + p * b6) * n46 + r51, (f20 * -b6 + p * g7) * n46 + i56);
        }
    }, t7;
}(), va = function() {
    function t7() {
    }
    return t7.curveLength = function(t13, e31, r51, i56, n46, o43, s43, a46) {
        for(var h43 = 0, u40 = 0, l31 = 0, c24 = 0, d24 = 0, f20 = 0, p = 0, _10 = 0, m9 = 0, v6 = 0, y = 0, g8 = t13, b7 = e31, x5 = 1; x5 <= 10; ++x5)v6 = g8 - (_10 = (p = (f20 = (d24 = 1 - (u40 = x5 / 10)) * d24) * d24) * t13 + 3 * f20 * u40 * r51 + 3 * d24 * (l31 = u40 * u40) * n46 + (c24 = l31 * u40) * s43), y = b7 - (m9 = p * e31 + 3 * f20 * u40 * i56 + 3 * d24 * l31 * o43 + c24 * a46), g8 = _10, b7 = m9, h43 += Math.sqrt(v6 * v6 + y * y);
        return h43;
    }, t7.curveTo = function(e31, r51, i56, n46, o43, s43, a46) {
        var h43 = a46[a46.length - 2], u40 = a46[a46.length - 1];
        a46.length -= 2;
        var l31 = ea._segmentsCount(t7.curveLength(h43, u40, e31, r51, i56, n46, o43, s43)), c24 = 0, d24 = 0, f20 = 0, p = 0, _10 = 0;
        a46.push(h43, u40);
        for(var m9 = 1, v6 = 0; m9 <= l31; ++m9)f20 = (d24 = (c24 = 1 - (v6 = m9 / l31)) * c24) * c24, _10 = (p = v6 * v6) * v6, a46.push(f20 * h43 + 3 * d24 * v6 * e31 + 3 * c24 * p * i56 + _10 * o43, f20 * u40 + 3 * d24 * v6 * r51 + 3 * c24 * p * n46 + _10 * s43);
    }, t7;
}(), ya = function() {
    function t7() {
    }
    return t7.curveLength = function(t13, e31, r51, i56, n46, o43) {
        var s43 = t13 - 2 * r51 + n46, a46 = e31 - 2 * i56 + o43, h43 = 2 * r51 - 2 * t13, u40 = 2 * i56 - 2 * e31, l31 = 4 * (s43 * s43 + a46 * a46), c24 = 4 * (s43 * h43 + a46 * u40), d24 = h43 * h43 + u40 * u40, f20 = 2 * Math.sqrt(l31 + c24 + d24), p = Math.sqrt(l31), _10 = 2 * l31 * p, m9 = 2 * Math.sqrt(d24), v6 = c24 / p;
        return (_10 * f20 + p * c24 * (f20 - m9) + (4 * d24 * l31 - c24 * c24) * Math.log((2 * p + v6 + f20) / (v6 + m9))) / (4 * _10);
    }, t7.curveTo = function(e31, r51, i56, n46, o43) {
        for(var s43 = o43[o43.length - 2], a46 = o43[o43.length - 1], h43 = ea._segmentsCount(t7.curveLength(s43, a46, e31, r51, i56, n46)), u40 = 0, l31 = 0, c24 = 1; c24 <= h43; ++c24){
            var d24 = c24 / h43;
            u40 = s43 + (e31 - s43) * d24, l31 = a46 + (r51 - a46) * d24, o43.push(u40 + (e31 + (i56 - e31) * d24 - u40) * d24, l31 + (r51 + (n46 - r51) * d24 - l31) * d24);
        }
    }, t7;
}(), ga = function() {
    function t7() {
        this.reset();
    }
    return t7.prototype.begin = function(t13, e31, r51) {
        this.reset(), this.style = t13, this.start = e31, this.attribStart = r51;
    }, t7.prototype.end = function(t13, e31) {
        this.attribSize = e31 - this.attribStart, this.size = t13 - this.start;
    }, t7.prototype.reset = function() {
        this.style = null, this.size = 0, this.start = 0, this.attribStart = 0, this.attribSize = 0;
    }, t7;
}(), ba = ((pa = {
})[Be.POLY] = oa, pa[Be.CIRC] = sa, pa[Be.ELIP] = sa, pa[Be.RECT] = aa, pa[Be.RREC] = la, pa), xa = [], Ta = [], Ea = function() {
    function t7(t13, e31, r51, i56) {
        (void 0) === e31 && (e31 = null), (void 0) === r51 && (r51 = null), (void 0) === i56 && (i56 = null), this.shape = t13, this.lineStyle = r51, this.fillStyle = e31, this.matrix = i56, this.type = t13.type, this.points = [], this.holes = [];
    }
    return t7.prototype.clone = function() {
        return new t7(this.shape, this.fillStyle, this.lineStyle, this.matrix);
    }, t7.prototype.destroy = function() {
        this.shape = null, this.holes.length = 0, this.holes = null, this.points.length = 0, this.points = null, this.lineStyle = null, this.fillStyle = null;
    }, t7;
}(), Aa = new We, Sa = new or, Oa = function(t7) {
    function e31() {
        var e32 = t7.call(this) || this;
        return e32.uvsFloat32 = null, e32.indicesUint16 = null, e32.points = [], e32.colors = [], e32.uvs = [], e32.indices = [], e32.textureIds = [], e32.graphicsData = [], e32.dirty = 0, e32.batchDirty = -1, e32.cacheDirty = -1, e32.clearDirty = 0, e32.drawCalls = [], e32.batches = [], e32.shapeIndex = 0, e32._bounds = new or, e32.boundsDirty = -1, e32.boundsPadding = 0, e32.batchable = !1, e32.indicesUint16 = null, e32.uvsFloat32 = null, e32.closePointEps = 0.0001, e32;
    }
    return na(e31, t7), Object.defineProperty(e31.prototype, "bounds", {
        get: function() {
            return this.boundsDirty !== this.dirty && (this.boundsDirty = this.dirty, this.calculateBounds()), this._bounds;
        },
        enumerable: !1,
        configurable: !0
    }), e31.prototype.invalidate = function() {
        this.boundsDirty = -1, this.dirty++, this.batchDirty++, this.shapeIndex = 0, this.points.length = 0, this.colors.length = 0, this.uvs.length = 0, this.indices.length = 0, this.textureIds.length = 0;
        for(var t13 = 0; t13 < this.drawCalls.length; t13++)this.drawCalls[t13].texArray.clear(), Ta.push(this.drawCalls[t13]);
        for(this.drawCalls.length = 0, t13 = 0; t13 < this.batches.length; t13++){
            var e32 = this.batches[t13];
            e32.reset(), xa.push(e32);
        }
        this.batches.length = 0;
    }, e31.prototype.clear = function() {
        return this.graphicsData.length > 0 && (this.invalidate(), this.clearDirty++, this.graphicsData.length = 0), this;
    }, e31.prototype.drawShape = function(t13, e33, r51, i56) {
        (void 0) === e33 && (e33 = null), (void 0) === r51 && (r51 = null), (void 0) === i56 && (i56 = null);
        var n46 = new Ea(t13, e33, r51, i56);
        return this.graphicsData.push(n46), this.dirty++, this;
    }, e31.prototype.drawHole = function(t13, e33) {
        if ((void 0) === e33 && (e33 = null), !this.graphicsData.length) return null;
        var r51 = new Ea(t13, null, null, e33), i56 = this.graphicsData[this.graphicsData.length - 1];
        return r51.lineStyle = i56.lineStyle, i56.holes.push(r51), this.dirty++, this;
    }, e31.prototype.destroy = function() {
        t7.prototype.destroy.call(this);
        for(var e33 = 0; e33 < this.graphicsData.length; ++e33)this.graphicsData[e33].destroy();
        this.points.length = 0, this.points = null, this.colors.length = 0, this.colors = null, this.uvs.length = 0, this.uvs = null, this.indices.length = 0, this.indices = null, this.indexBuffer.destroy(), this.indexBuffer = null, this.graphicsData.length = 0, this.graphicsData = null, this.drawCalls.length = 0, this.drawCalls = null, this.batches.length = 0, this.batches = null, this._bounds = null;
    }, e31.prototype.containsPoint = function(t13) {
        for(var e33 = this.graphicsData, r51 = 0; r51 < e33.length; ++r51){
            var i56 = e33[r51];
            if (i56.fillStyle.visible && i56.shape && (i56.matrix ? i56.matrix.applyInverse(t13, Aa) : Aa.copyFrom(t13), i56.shape.contains(Aa.x, Aa.y))) {
                var n46 = !1;
                if (i56.holes) for(var o43 = 0; o43 < i56.holes.length; o43++)if (i56.holes[o43].shape.contains(Aa.x, Aa.y)) {
                    n46 = !0;
                    break;
                }
                if (!n46) return !0;
            }
        }
        return !1;
    }, e31.prototype.updateBatches = function(t13) {
        if (this.graphicsData.length) {
            if (this.validateBatching()) {
                this.cacheDirty = this.dirty;
                var e33 = this.uvs, r51 = this.graphicsData, i57 = null, n47 = null;
                this.batches.length > 0 && (n47 = (i57 = this.batches[this.batches.length - 1]).style);
                for(var o44 = this.shapeIndex; o44 < r51.length; o44++){
                    this.shapeIndex++;
                    var s43 = r51[o44], a46 = s43.fillStyle, h43 = s43.lineStyle;
                    ba[s43.type].build(s43), s43.matrix && this.transformPoints(s43.points, s43.matrix);
                    for(var u40 = 0; u40 < 2; u40++){
                        var l31 = 0 === u40 ? a46 : h43;
                        if (l31.visible) {
                            var c24 = l31.texture.baseTexture, d25 = this.indices.length, f20 = this.points.length / 2;
                            c24.wrapMode = qt.REPEAT, 0 === u40 ? this.processFill(s43) : this.processLine(s43);
                            var p = this.points.length / 2 - f20;
                            0 !== p && (i57 && !this._compareStyles(n47, l31) && (i57.end(d25, f20), i57 = null), i57 || ((i57 = xa.pop() || new ga).begin(l31, d25, f20), this.batches.push(i57), n47 = l31), this.addUvs(this.points, e33, l31.texture, f20, p, l31.matrix));
                        }
                    }
                }
                var _10 = this.indices.length, m9 = this.points.length / 2;
                if (i57 && i57.end(_10, m9), 0 !== this.batches.length) {
                    if (this.indicesUint16 && this.indices.length === this.indicesUint16.length) this.indicesUint16.set(this.indices);
                    else {
                        var v6 = m9 > 65535 && t13;
                        this.indicesUint16 = v6 ? new Uint32Array(this.indices) : new Uint16Array(this.indices);
                    }
                    this.batchable = this.isBatchable(), this.batchable ? this.packBatches() : this.buildDrawCalls();
                } else this.batchable = !0;
            }
        } else this.batchable = !0;
    }, e31.prototype._compareStyles = function(t13, e34) {
        return !(!t13 || !e34) && t13.texture.baseTexture === e34.texture.baseTexture && t13.color + t13.alpha === e34.color + e34.alpha && !!t13.native == !!e34.native;
    }, e31.prototype.validateBatching = function() {
        if (this.dirty === this.cacheDirty || !this.graphicsData.length) return !1;
        for(var t13 = 0, e34 = this.graphicsData.length; t13 < e34; t13++){
            var r52 = this.graphicsData[t13], i58 = r52.fillStyle, n48 = r52.lineStyle;
            if (i58 && !i58.texture.baseTexture.valid) return !1;
            if (n48 && !n48.texture.baseTexture.valid) return !1;
        }
        return !0;
    }, e31.prototype.packBatches = function() {
        this.batchDirty++, this.uvsFloat32 = new Float32Array(this.uvs);
        for(var t13 = this.batches, e34 = 0, r53 = t13.length; e34 < r53; e34++)for(var i59 = t13[e34], n49 = 0; n49 < i59.size; n49++){
            var o45 = i59.start + n49;
            this.indicesUint16[o45] = this.indicesUint16[o45] - i59.attribStart;
        }
    }, e31.prototype.isBatchable = function() {
        if (this.points.length > 131070) return !1;
        for(var t13 = this.batches, r53 = 0; r53 < t13.length; r53++)if (t13[r53].style.native) return !1;
        return this.points.length < 2 * e31.BATCHABLE_SIZE;
    }, e31.prototype.buildDrawCalls = function() {
        for(var t13 = ++Gr._globalBatch, e34 = 0; e34 < this.drawCalls.length; e34++)this.drawCalls[e34].texArray.clear(), Ta.push(this.drawCalls[e34]);
        this.drawCalls.length = 0;
        var r53 = this.colors, i59 = this.textureIds, n49 = Ta.pop();
        n49 || ((n49 = new Hn).texArray = new Yn), n49.texArray.count = 0, n49.start = 0, n49.size = 0, n49.type = Ht.TRIANGLES;
        var o46 = 0, s44 = null, a47 = 0, h44 = !1, u41 = Ht.TRIANGLES, l32 = 0;
        for(this.drawCalls.push(n49), e34 = 0; e34 < this.batches.length; e34++){
            var c25 = this.batches[e34], d26 = c25.style, f21 = d26.texture.baseTexture;
            h44 !== !!d26.native && (u41 = (h44 = !!d26.native) ? Ht.LINES : Ht.TRIANGLES, s44 = null, o46 = 8, t13++), s44 !== f21 && (s44 = f21, f21._batchEnabled !== t13 && (8 === o46 && (t13++, o46 = 0, n49.size > 0 && ((n49 = Ta.pop()) || ((n49 = new Hn).texArray = new Yn), this.drawCalls.push(n49)), n49.start = l32, n49.size = 0, n49.texArray.count = 0, n49.type = u41), f21.touched = 1, f21._batchEnabled = t13, f21._batchLocation = o46, f21.wrapMode = 10497, n49.texArray.elements[n49.texArray.count++] = f21, o46++)), n49.size += c25.size, l32 += c25.size, a47 = f21._batchLocation, this.addColors(r53, d26.color, d26.alpha, c25.attribSize), this.addTextureIds(i59, a47, c25.attribSize);
        }
        Gr._globalBatch = t13, this.packAttributes();
    }, e31.prototype.packAttributes = function() {
        for(var t13 = this.points, e34 = this.uvs, r53 = this.colors, i59 = this.textureIds, n49 = new ArrayBuffer(3 * t13.length * 4), o46 = new Float32Array(n49), s44 = new Uint32Array(n49), a47 = 0, h44 = 0; h44 < t13.length / 2; h44++)o46[a47++] = t13[2 * h44], o46[a47++] = t13[2 * h44 + 1], o46[a47++] = e34[2 * h44], o46[a47++] = e34[2 * h44 + 1], s44[a47++] = r53[h44], o46[a47++] = i59[h44];
        this._buffer.update(n49), this._indexBuffer.update(this.indicesUint16);
    }, e31.prototype.processFill = function(t13) {
        t13.holes.length ? (this.processHoles(t13.holes), oa.triangulate(t13, this)) : ba[t13.type].triangulate(t13, this);
    }, e31.prototype.processLine = function(t13) {
        fa(t13, this);
        for(var e34 = 0; e34 < t13.holes.length; e34++)fa(t13.holes[e34], this);
    }, e31.prototype.processHoles = function(t13) {
        for(var e34 = 0; e34 < t13.length; e34++){
            var r53 = t13[e34];
            ba[r53.type].build(r53), r53.matrix && this.transformPoints(r53.points, r53.matrix);
        }
    }, e31.prototype.calculateBounds = function() {
        var t13 = this._bounds, e34 = Sa, r54 = Ke.IDENTITY;
        this._bounds.clear(), e34.clear();
        for(var i59 = 0; i59 < this.graphicsData.length; i59++){
            var n49 = this.graphicsData[i59], o46 = n49.shape, s44 = n49.type, a47 = n49.lineStyle, h44 = n49.matrix || Ke.IDENTITY, u41 = 0;
            if (a47 && a47.visible) {
                var l32 = a47.alignment;
                u41 = a47.width, s44 === Be.POLY ? u41 *= 0.5 + Math.abs(0.5 - l32) : u41 *= Math.max(0, l32);
            }
            if (r54 !== h44 && (e34.isEmpty() || (t13.addBoundsMatrix(e34, r54), e34.clear()), r54 = h44), s44 === Be.RECT || s44 === Be.RREC) {
                var c26 = o46;
                e34.addFramePad(c26.x, c26.y, c26.x + c26.width, c26.y + c26.height, u41, u41);
            } else if (s44 === Be.CIRC) {
                var d27 = o46;
                e34.addFramePad(d27.x, d27.y, d27.x, d27.y, d27.radius + u41, d27.radius + u41);
            } else if (s44 === Be.ELIP) {
                var f22 = o46;
                e34.addFramePad(f22.x, f22.y, f22.x, f22.y, f22.width + u41, f22.height + u41);
            } else {
                var p = o46;
                t13.addVerticesMatrix(r54, p.points, 0, p.points.length, u41, u41);
            }
        }
        e34.isEmpty() || t13.addBoundsMatrix(e34, r54), t13.pad(this.boundsPadding, this.boundsPadding);
    }, e31.prototype.transformPoints = function(t13, e34) {
        for(var r54 = 0; r54 < t13.length / 2; r54++){
            var i59 = t13[2 * r54], n50 = t13[2 * r54 + 1];
            t13[2 * r54] = e34.a * i59 + e34.c * n50 + e34.tx, t13[2 * r54 + 1] = e34.b * i59 + e34.d * n50 + e34.ty;
        }
    }, e31.prototype.addColors = function(t13, e34, r54, i60) {
        for(var n51 = _e((e34 >> 16) + (65280 & e34) + ((255 & e34) << 16), r54); (i60--) > 0;)t13.push(n51);
    }, e31.prototype.addTextureIds = function(t13, e34, r54) {
        for(; (r54--) > 0;)t13.push(e34);
    }, e31.prototype.addUvs = function(t13, e34, r54, i60, n51, o47) {
        (void 0) === o47 && (o47 = null);
        for(var s45 = 0, a48 = e34.length, h45 = r54.frame; s45 < n51;){
            var u42 = t13[2 * (i60 + s45)], l33 = t13[2 * (i60 + s45) + 1];
            if (o47) {
                var c27 = o47.a * u42 + o47.c * l33 + o47.tx;
                l33 = o47.b * u42 + o47.d * l33 + o47.ty, u42 = c27;
            }
            s45++, e34.push(u42 / h45.width, l33 / h45.height);
        }
        var d28 = r54.baseTexture;
        (h45.width < d28.width || h45.height < d28.height) && this.adjustUvs(e34, r54, a48, n51);
    }, e31.prototype.adjustUvs = function(t13, e34, r54, i60) {
        for(var n51 = e34.baseTexture, o47 = r54 + 2 * i60, s45 = e34.frame, a48 = s45.width / n51.width, h45 = s45.height / n51.height, u43 = s45.x / s45.width, l34 = s45.y / s45.height, c28 = Math.floor(t13[r54] + 0.000001), d28 = Math.floor(t13[r54 + 1] + 0.000001), f23 = r54 + 2; f23 < o47; f23 += 2)c28 = Math.min(c28, Math.floor(t13[f23] + 0.000001)), d28 = Math.min(d28, Math.floor(t13[f23 + 1] + 0.000001));
        for(u43 -= c28, l34 -= d28, f23 = r54; f23 < o47; f23 += 2)t13[f23] = (t13[f23] + u43) * a48, t13[f23 + 1] = (t13[f23 + 1] + l34) * h45;
    }, e31.BATCHABLE_SIZE = 100, e31;
}(qn), Ra = function(t7) {
    function e31() {
        var e34 = null !== t7 && t7.apply(this, arguments) || this;
        return e34.width = 0, e34.alignment = 0.5, e34.native = !1, e34.cap = Ks.BUTT, e34.join = qs.MITER, e34.miterLimit = 10, e34;
    }
    return na(e31, t7), e31.prototype.clone = function() {
        var t13 = new e31;
        return t13.color = this.color, t13.alpha = this.alpha, t13.texture = this.texture, t13.matrix = this.matrix, t13.visible = this.visible, t13.width = this.width, t13.alignment = this.alignment, t13.native = this.native, t13.cap = this.cap, t13.join = this.join, t13.miterLimit = this.miterLimit, t13;
    }, e31.prototype.reset = function() {
        t7.prototype.reset.call(this), this.color = 0, this.alignment = 0.5, this.width = 0, this.native = !1;
    }, e31;
}(ra), wa = new Float32Array(3), Pa = {
}, Ia = function(t7) {
    function e31(e34) {
        (void 0) === e34 && (e34 = null);
        var r54 = t7.call(this) || this;
        return r54._geometry = e34 || new Oa, r54._geometry.refCount++, r54.shader = null, r54.state = sn.for2d(), r54._fillStyle = new ra, r54._lineStyle = new Ra, r54._matrix = null, r54._holeMode = !1, r54.currentPath = null, r54.batches = [], r54.batchTint = -1, r54.batchDirty = -1, r54.vertexData = null, r54.pluginName = "batch", r54._transformID = -1, r54.tint = 16777215, r54.blendMode = jt.NORMAL, r54;
    }
    return na(e31, t7), Object.defineProperty(e31.prototype, "geometry", {
        get: function() {
            return this._geometry;
        },
        enumerable: !1,
        configurable: !0
    }), e31.prototype.clone = function() {
        return this.finishPoly(), new e31(this._geometry);
    }, Object.defineProperty(e31.prototype, "blendMode", {
        get: function() {
            return this.state.blendMode;
        },
        set: function(t13) {
            this.state.blendMode = t13;
        },
        enumerable: !1,
        configurable: !0
    }), Object.defineProperty(e31.prototype, "tint", {
        get: function() {
            return this._tint;
        },
        set: function(t13) {
            this._tint = t13;
        },
        enumerable: !1,
        configurable: !0
    }), Object.defineProperty(e31.prototype, "fill", {
        get: function() {
            return this._fillStyle;
        },
        enumerable: !1,
        configurable: !0
    }), Object.defineProperty(e31.prototype, "line", {
        get: function() {
            return this._lineStyle;
        },
        enumerable: !1,
        configurable: !0
    }), e31.prototype.lineStyle = function(t13, e34, r54, i60, n51) {
        return (void 0) === t13 && (t13 = null), (void 0) === e34 && (e34 = 0), (void 0) === r54 && (r54 = 1), (void 0) === i60 && (i60 = 0.5), (void 0) === n51 && (n51 = !1), "number" == typeof t13 && (t13 = {
            width: t13,
            color: e34,
            alpha: r54,
            alignment: i60,
            native: n51
        }), this.lineTextureStyle(t13);
    }, e31.prototype.lineTextureStyle = function(t13) {
        t13 = Object.assign({
            width: 0,
            texture: ri.WHITE,
            color: t13 && t13.texture ? 16777215 : 0,
            alpha: 1,
            matrix: null,
            alignment: 0.5,
            native: !1,
            cap: Ks.BUTT,
            join: qs.MITER,
            miterLimit: 10
        }, t13), this.currentPath && this.startPoly();
        var e34 = t13.width > 0 && t13.alpha > 0;
        return e34 ? (t13.matrix && (t13.matrix = t13.matrix.clone(), t13.matrix.invert()), Object.assign(this._lineStyle, {
            visible: e34
        }, t13)) : this._lineStyle.reset(), this;
    }, e31.prototype.startPoly = function() {
        if (this.currentPath) {
            var t13 = this.currentPath.points, e34 = this.currentPath.points.length;
            e34 > 2 && (this.drawShape(this.currentPath), this.currentPath = new Ve, this.currentPath.closeStroke = !1, this.currentPath.points.push(t13[e34 - 2], t13[e34 - 1]));
        } else this.currentPath = new Ve, this.currentPath.closeStroke = !1;
    }, e31.prototype.finishPoly = function() {
        this.currentPath && (this.currentPath.points.length > 2 ? (this.drawShape(this.currentPath), this.currentPath = null) : this.currentPath.points.length = 0);
    }, e31.prototype.moveTo = function(t14, e35) {
        return this.startPoly(), this.currentPath.points[0] = t14, this.currentPath.points[1] = e35, this;
    }, e31.prototype.lineTo = function(t14, e35) {
        this.currentPath || this.moveTo(0, 0);
        var r54 = this.currentPath.points, i60 = r54[r54.length - 2], n51 = r54[r54.length - 1];
        return i60 === t14 && n51 === e35 || r54.push(t14, e35), this;
    }, e31.prototype._initCurve = function(t14, e35) {
        (void 0) === t14 && (t14 = 0), (void 0) === e35 && (e35 = 0), this.currentPath ? 0 === this.currentPath.points.length && (this.currentPath.points = [
            t14,
            e35
        ]) : this.moveTo(t14, e35);
    }, e31.prototype.quadraticCurveTo = function(t14, e35, r54, i60) {
        this._initCurve();
        var n51 = this.currentPath.points;
        return 0 === n51.length && this.moveTo(0, 0), ya.curveTo(t14, e35, r54, i60, n51), this;
    }, e31.prototype.bezierCurveTo = function(t14, e35, r54, i60, n51, o47) {
        return this._initCurve(), va.curveTo(t14, e35, r54, i60, n51, o47, this.currentPath.points), this;
    }, e31.prototype.arcTo = function(t14, e35, r54, i60, n51) {
        this._initCurve(t14, e35);
        var o47 = this.currentPath.points, s45 = ma.curveTo(t14, e35, r54, i60, n51, o47);
        if (s45) {
            var a48 = s45.cx, h45 = s45.cy, u43 = s45.radius, l34 = s45.startAngle, c28 = s45.endAngle, d28 = s45.anticlockwise;
            this.arc(a48, h45, u43, l34, c28, d28);
        }
        return this;
    }, e31.prototype.arc = function(t14, e35, r54, i60, n51, o47) {
        if ((void 0) === o47 && (o47 = !1), i60 === n51) return this;
        if (!o47 && n51 <= i60 ? n51 += Ge : o47 && i60 <= n51 && (i60 += Ge), 0 == n51 - i60) return this;
        var s45 = t14 + Math.cos(i60) * r54, a49 = e35 + Math.sin(i60) * r54, h46 = this._geometry.closePointEps, u44 = this.currentPath ? this.currentPath.points : null;
        if (u44) {
            var l35 = Math.abs(u44[u44.length - 2] - s45), c29 = Math.abs(u44[u44.length - 1] - a49);
            l35 < h46 && c29 < h46 || u44.push(s45, a49);
        } else this.moveTo(s45, a49), u44 = this.currentPath.points;
        return ma.arc(s45, a49, t14, e35, r54, i60, n51, o47, u44), this;
    }, e31.prototype.beginFill = function(t14, e35) {
        return (void 0) === t14 && (t14 = 0), (void 0) === e35 && (e35 = 1), this.beginTextureFill({
            texture: ri.WHITE,
            color: t14,
            alpha: e35
        });
    }, e31.prototype.beginTextureFill = function(t14) {
        t14 = Object.assign({
            texture: ri.WHITE,
            color: 16777215,
            alpha: 1,
            matrix: null
        }, t14), this.currentPath && this.startPoly();
        var e35 = t14.alpha > 0;
        return e35 ? (t14.matrix && (t14.matrix = t14.matrix.clone(), t14.matrix.invert()), Object.assign(this._fillStyle, {
            visible: e35
        }, t14)) : this._fillStyle.reset(), this;
    }, e31.prototype.endFill = function() {
        return this.finishPoly(), this._fillStyle.reset(), this;
    }, e31.prototype.drawRect = function(t14, e35, r54, i60) {
        return this.drawShape(new je(t14, e35, r54, i60));
    }, e31.prototype.drawRoundedRect = function(t14, e35, r54, i60, n51) {
        return this.drawShape(new ze(t14, e35, r54, i60, n51));
    }, e31.prototype.drawCircle = function(t14, e35, r54) {
        return this.drawShape(new He(t14, e35, r54));
    }, e31.prototype.drawEllipse = function(t14, e35, r54, i60) {
        return this.drawShape(new Ye(t14, e35, r54, i60));
    }, e31.prototype.drawPolygon = function() {
        for(var t14, e35 = arguments, r54 = [], i60 = 0; i60 < arguments.length; i60++)r54[i60] = e35[i60];
        var n51 = !0, o47 = r54[0];
        o47.points ? (n51 = o47.closeStroke, t14 = o47.points) : t14 = Array.isArray(r54[0]) ? r54[0] : r54;
        var s45 = new Ve(t14);
        return s45.closeStroke = n51, this.drawShape(s45), this;
    }, e31.prototype.drawShape = function(t14) {
        return this._holeMode ? this._geometry.drawHole(t14, this._matrix) : this._geometry.drawShape(t14, this._fillStyle.clone(), this._lineStyle.clone(), this._matrix), this;
    }, e31.prototype.clear = function() {
        return this._geometry.clear(), this._lineStyle.reset(), this._fillStyle.reset(), this._boundsID++, this._matrix = null, this._holeMode = !1, this.currentPath = null, this;
    }, e31.prototype.isFastRect = function() {
        var t14 = this._geometry.graphicsData;
        return 1 === t14.length && t14[0].shape.type === Be.RECT && !(t14[0].lineStyle.visible && t14[0].lineStyle.width);
    }, e31.prototype._render = function(t14) {
        this.finishPoly();
        var e35 = this._geometry, r54 = t14.context.supports.uint32Indices;
        e35.updateBatches(r54), e35.batchable ? (this.batchDirty !== e35.batchDirty && this._populateBatches(), this._renderBatched(t14)) : (t14.batch.flush(), this._renderDirect(t14));
    }, e31.prototype._populateBatches = function() {
        var t14 = this._geometry, e35 = this.blendMode, r54 = t14.batches.length;
        this.batchTint = -1, this._transformID = -1, this.batchDirty = t14.batchDirty, this.batches.length = r54, this.vertexData = new Float32Array(t14.points);
        for(var i60 = 0; i60 < r54; i60++){
            var n51 = t14.batches[i60], o47 = n51.style.color, s45 = new Float32Array(this.vertexData.buffer, 4 * n51.attribStart * 2, 2 * n51.attribSize), a49 = new Float32Array(t14.uvsFloat32.buffer, 4 * n51.attribStart * 2, 2 * n51.attribSize), h46 = {
                vertexData: s45,
                blendMode: e35,
                indices: new Uint16Array(t14.indicesUint16.buffer, 2 * n51.start, n51.size),
                uvs: a49,
                _batchRGB: ue(o47),
                _tintRGB: o47,
                _texture: n51.style.texture,
                alpha: n51.style.alpha,
                worldAlpha: 1
            };
            this.batches[i60] = h46;
        }
    }, e31.prototype._renderBatched = function(t14) {
        if (this.batches.length) {
            t14.batch.setObjectRenderer(t14.plugins[this.pluginName]), this.calculateVertices(), this.calculateTints();
            for(var e35 = 0, r54 = this.batches.length; e35 < r54; e35++){
                var i60 = this.batches[e35];
                i60.worldAlpha = this.worldAlpha * i60.alpha, t14.plugins[this.pluginName].render(i60);
            }
        }
    }, e31.prototype._renderDirect = function(t14) {
        var e36 = this._resolveDirectShader(t14), r55 = this._geometry, i61 = this.tint, n52 = this.worldAlpha, o48 = e36.uniforms, s46 = r55.drawCalls;
        o48.translationMatrix = this.transform.worldTransform, o48.tint[0] = (i61 >> 16 & 255) / 255 * n52, o48.tint[1] = (i61 >> 8 & 255) / 255 * n52, o48.tint[2] = (255 & i61) / 255 * n52, o48.tint[3] = n52, t14.shader.bind(e36), t14.geometry.bind(r55, e36), t14.state.set(this.state);
        for(var a50 = 0, h47 = s46.length; a50 < h47; a50++)this._renderDrawCallDirect(t14, r55.drawCalls[a50]);
    }, e31.prototype._renderDrawCallDirect = function(t14, e36) {
        for(var r55 = e36.texArray, i61 = e36.type, n52 = e36.size, o48 = e36.start, s46 = r55.count, a50 = 0; a50 < s46; a50++)t14.texture.bind(r55.elements[a50], a50);
        t14.geometry.draw(i61, n52, o48);
    }, e31.prototype._resolveDirectShader = function(t14) {
        var e36 = this.shader, r55 = this.pluginName;
        if (!e36) {
            if (!Pa[r55]) {
                for(var i61 = t14.plugins.batch.MAX_TEXTURES, n52 = new Int32Array(i61), o48 = 0; o48 < i61; o48++)n52[o48] = o48;
                var s46 = {
                    tint: new Float32Array([
                        1,
                        1,
                        1,
                        1
                    ]),
                    translationMatrix: new Ke,
                    default: yi.from({
                        uSamplers: n52
                    }, !0)
                }, a50 = t14.plugins[r55]._shader.program;
                Pa[r55] = new on(a50, s46);
            }
            e36 = Pa[r55];
        }
        return e36;
    }, e31.prototype._calculateBounds = function() {
        this.finishPoly();
        var t14 = this._geometry;
        if (t14.graphicsData.length) {
            var e36 = t14.bounds, r55 = e36.minX, i62 = e36.minY, n53 = e36.maxX, o49 = e36.maxY;
            this._bounds.addFrame(this.transform, r55, i62, n53, o49);
        }
    }, e31.prototype.containsPoint = function(t14) {
        return this.worldTransform.applyInverse(t14, e31._TEMP_POINT), this._geometry.containsPoint(e31._TEMP_POINT);
    }, e31.prototype.calculateTints = function() {
        if (this.batchTint !== this.tint) {
            this.batchTint = this.tint;
            for(var t14 = ue(this.tint, wa), e37 = 0; e37 < this.batches.length; e37++){
                var r56 = this.batches[e37], i63 = r56._batchRGB, n54 = (t14[0] * i63[0] * 255 << 16) + (t14[1] * i63[1] * 255 << 8) + (0 | t14[2] * i63[2] * 255);
                r56._tintRGB = (n54 >> 16) + (65280 & n54) + ((255 & n54) << 16);
            }
        }
    }, e31.prototype.calculateVertices = function() {
        var t15 = this.transform._worldID;
        if (this._transformID !== t15) {
            this._transformID = t15;
            for(var e38 = this.transform.worldTransform, r57 = e38.a, i64 = e38.b, n55 = e38.c, o50 = e38.d, s47 = e38.tx, a51 = e38.ty, h47 = this._geometry.points, u44 = this.vertexData, l36 = 0, c30 = 0; c30 < h47.length; c30 += 2){
                var d29 = h47[c30], f23 = h47[c30 + 1];
                u44[l36++] = r57 * d29 + n55 * f23 + s47, u44[l36++] = o50 * f23 + i64 * d29 + a51;
            }
        }
    }, e31.prototype.closePath = function() {
        var t15 = this.currentPath;
        return t15 && (t15.closeStroke = !0), this;
    }, e31.prototype.setMatrix = function(t15) {
        return this._matrix = t15, this;
    }, e31.prototype.beginHole = function() {
        return this.finishPoly(), this._holeMode = !0, this;
    }, e31.prototype.endHole = function() {
        return this.finishPoly(), this._holeMode = !1, this;
    }, e31.prototype.destroy = function(e39) {
        this._geometry.refCount--, 0 === this._geometry.refCount && this._geometry.dispose(), this._matrix = null, this.currentPath = null, this._lineStyle.destroy(), this._lineStyle = null, this._fillStyle.destroy(), this._fillStyle = null, this._geometry = null, this.shader = null, this.vertexData = null, this.batches.length = 0, this.batches = null, t7.prototype.destroy.call(this, e39);
    }, e31._TEMP_POINT = new We, e31;
}(cr), Ma = {
    buildPoly: oa,
    buildCircle: sa,
    buildRectangle: aa,
    buildRoundedRectangle: la,
    buildLine: fa,
    ArcUtils: ma,
    BezierUtils: va,
    QuadraticUtils: ya,
    BatchPart: ga,
    FILL_COMMANDS: ba,
    BATCH_POOL: xa,
    DRAW_CALL_POOL: Ta
}, Da = function(t7, e31) {
    return (Da = Object.setPrototypeOf || ({
        __proto__: []
    }) instanceof Array && function(t15, e39) {
        t15.__proto__ = e39;
    } || function(t15, e39) {
        for(var r58 in e39)e39.hasOwnProperty(r58) && (t15[r58] = e39[r58]);
    })(t7, e31);
}, Ca = new We, Na = new Uint16Array([
    0,
    1,
    2,
    0,
    2,
    3
]), La = function(t7) {
    function e31(e39) {
        var r58 = t7.call(this) || this;
        return r58._anchor = new qe(r58._onAnchorUpdate, r58, e39 ? e39.defaultAnchor.x : 0, e39 ? e39.defaultAnchor.y : 0), r58._texture = null, r58._width = 0, r58._height = 0, r58._tint = null, r58._tintRGB = null, r58.tint = 16777215, r58.blendMode = jt.NORMAL, r58._cachedTint = 16777215, r58.uvs = null, r58.texture = e39 || ri.EMPTY, r58.vertexData = new Float32Array(8), r58.vertexTrimmedData = null, r58._transformID = -1, r58._textureID = -1, r58._transformTrimmedID = -1, r58._textureTrimmedID = -1, r58.indices = Na, r58.pluginName = "batch", r58.isSprite = !0, r58._roundPixels = F.ROUND_PIXELS, r58;
    }
    return (function(t15, e39) {
        function r58() {
            this.constructor = t15;
        }
        Da(t15, e39), t15.prototype = null === e39 ? Object.create(e39) : (r58.prototype = e39.prototype, new r58);
    })(e31, t7), e31.prototype._onTextureUpdate = function() {
        this._textureID = -1, this._textureTrimmedID = -1, this._cachedTint = 16777215, this._width && (this.scale.x = Ae(this.scale.x) * this._width / this._texture.orig.width), this._height && (this.scale.y = Ae(this.scale.y) * this._height / this._texture.orig.height);
    }, e31.prototype._onAnchorUpdate = function() {
        this._transformID = -1, this._transformTrimmedID = -1;
    }, e31.prototype.calculateVertices = function() {
        var t15 = this._texture;
        if (this._transformID !== this.transform._worldID || this._textureID !== t15._updateID) {
            this._textureID !== t15._updateID && (this.uvs = this._texture._uvs.uvsFloat32), this._transformID = this.transform._worldID, this._textureID = t15._updateID;
            var e39 = this.transform.worldTransform, r58 = e39.a, i65 = e39.b, n56 = e39.c, o51 = e39.d, s48 = e39.tx, a52 = e39.ty, h48 = this.vertexData, u45 = t15.trim, l37 = t15.orig, c31 = this._anchor, d30 = 0, f24 = 0, p = 0, _11 = 0;
            if (u45 ? (d30 = (f24 = u45.x - c31._x * l37.width) + u45.width, p = (_11 = u45.y - c31._y * l37.height) + u45.height) : (d30 = (f24 = -c31._x * l37.width) + l37.width, p = (_11 = -c31._y * l37.height) + l37.height), h48[0] = r58 * f24 + n56 * _11 + s48, h48[1] = o51 * _11 + i65 * f24 + a52, h48[2] = r58 * d30 + n56 * _11 + s48, h48[3] = o51 * _11 + i65 * d30 + a52, h48[4] = r58 * d30 + n56 * p + s48, h48[5] = o51 * p + i65 * d30 + a52, h48[6] = r58 * f24 + n56 * p + s48, h48[7] = o51 * p + i65 * f24 + a52, this._roundPixels) for(var m10 = F.RESOLUTION, v7 = 0; v7 < h48.length; ++v7)h48[v7] = Math.round((h48[v7] * m10 | 0) / m10);
        }
    }, e31.prototype.calculateTrimmedVertices = function() {
        if (this.vertexTrimmedData) {
            if (this._transformTrimmedID === this.transform._worldID && this._textureTrimmedID === this._texture._updateID) return;
        } else this.vertexTrimmedData = new Float32Array(8);
        this._transformTrimmedID = this.transform._worldID, this._textureTrimmedID = this._texture._updateID;
        var t15 = this._texture, e40 = this.vertexTrimmedData, r59 = t15.orig, i66 = this._anchor, n57 = this.transform.worldTransform, o52 = n57.a, s49 = n57.b, a53 = n57.c, h49 = n57.d, u46 = n57.tx, l38 = n57.ty, c32 = -i66._x * r59.width, d31 = c32 + r59.width, f25 = -i66._y * r59.height, p = f25 + r59.height;
        e40[0] = o52 * c32 + a53 * f25 + u46, e40[1] = h49 * f25 + s49 * c32 + l38, e40[2] = o52 * d31 + a53 * f25 + u46, e40[3] = h49 * f25 + s49 * d31 + l38, e40[4] = o52 * d31 + a53 * p + u46, e40[5] = h49 * p + s49 * d31 + l38, e40[6] = o52 * c32 + a53 * p + u46, e40[7] = h49 * p + s49 * c32 + l38;
    }, e31.prototype._render = function(t15) {
        this.calculateVertices(), t15.batch.setObjectRenderer(t15.plugins[this.pluginName]), t15.plugins[this.pluginName].render(this);
    }, e31.prototype._calculateBounds = function() {
        var t15 = this._texture.trim, e40 = this._texture.orig;
        !t15 || t15.width === e40.width && t15.height === e40.height ? (this.calculateVertices(), this._bounds.addQuad(this.vertexData)) : (this.calculateTrimmedVertices(), this._bounds.addQuad(this.vertexTrimmedData));
    }, e31.prototype.getLocalBounds = function(e40) {
        return 0 === this.children.length ? (this._bounds.minX = this._texture.orig.width * -this._anchor._x, this._bounds.minY = this._texture.orig.height * -this._anchor._y, this._bounds.maxX = this._texture.orig.width * (1 - this._anchor._x), this._bounds.maxY = this._texture.orig.height * (1 - this._anchor._y), e40 || (this._localBoundsRect || (this._localBoundsRect = new je), e40 = this._localBoundsRect), this._bounds.getRectangle(e40)) : t7.prototype.getLocalBounds.call(this, e40);
    }, e31.prototype.containsPoint = function(t15) {
        this.worldTransform.applyInverse(t15, Ca);
        var e40 = this._texture.orig.width, r59 = this._texture.orig.height, i66 = -e40 * this.anchor.x, n57 = 0;
        return Ca.x >= i66 && Ca.x < i66 + e40 && (n57 = -r59 * this.anchor.y, Ca.y >= n57 && Ca.y < n57 + r59);
    }, e31.prototype.destroy = function(e40) {
        if (t7.prototype.destroy.call(this, e40), this._texture.off("update", this._onTextureUpdate, this), this._anchor = null, "boolean" == typeof e40 ? e40 : e40 && e40.texture) {
            var r59 = "boolean" == typeof e40 ? e40 : e40 && e40.baseTexture;
            this._texture.destroy(!!r59);
        }
        this._texture = null;
    }, e31.from = function(t15, r60) {
        return new e31(t15 instanceof ri ? t15 : ri.from(t15, r60));
    }, Object.defineProperty(e31.prototype, "roundPixels", {
        get: function() {
            return this._roundPixels;
        },
        set: function(t15) {
            this._roundPixels !== t15 && (this._transformID = -1), this._roundPixels = t15;
        },
        enumerable: !1,
        configurable: !0
    }), Object.defineProperty(e31.prototype, "width", {
        get: function() {
            return Math.abs(this.scale.x) * this._texture.orig.width;
        },
        set: function(t15) {
            var e40 = Ae(this.scale.x) || 1;
            this.scale.x = e40 * t15 / this._texture.orig.width, this._width = t15;
        },
        enumerable: !1,
        configurable: !0
    }), Object.defineProperty(e31.prototype, "height", {
        get: function() {
            return Math.abs(this.scale.y) * this._texture.orig.height;
        },
        set: function(t15) {
            var e40 = Ae(this.scale.y) || 1;
            this.scale.y = e40 * t15 / this._texture.orig.height, this._height = t15;
        },
        enumerable: !1,
        configurable: !0
    }), Object.defineProperty(e31.prototype, "anchor", {
        get: function() {
            return this._anchor;
        },
        set: function(t15) {
            this._anchor.copyFrom(t15);
        },
        enumerable: !1,
        configurable: !0
    }), Object.defineProperty(e31.prototype, "tint", {
        get: function() {
            return this._tint;
        },
        set: function(t15) {
            this._tint = t15, this._tintRGB = (t15 >> 16) + (65280 & t15) + ((255 & t15) << 16);
        },
        enumerable: !1,
        configurable: !0
    }), Object.defineProperty(e31.prototype, "texture", {
        get: function() {
            return this._texture;
        },
        set: function(t15) {
            this._texture !== t15 && (this._texture && this._texture.off("update", this._onTextureUpdate, this), this._texture = t15 || ri.EMPTY, this._cachedTint = 16777215, this._textureID = -1, this._textureTrimmedID = -1, t15 && (t15.baseTexture.valid ? this._onTextureUpdate() : t15.once("update", this._onTextureUpdate, this)));
        },
        enumerable: !1,
        configurable: !0
    }), e31;
}(cr), Fa = function(t7, e31) {
    return (Fa = Object.setPrototypeOf || ({
        __proto__: []
    }) instanceof Array && function(t15, e40) {
        t15.__proto__ = e40;
    } || function(t15, e40) {
        for(var r60 in e40)e40.hasOwnProperty(r60) && (t15[r60] = e40[r60]);
    })(t7, e31);
};
!function(t7) {
    t7[t7.LINEAR_VERTICAL = 0] = "LINEAR_VERTICAL", t7[t7.LINEAR_HORIZONTAL = 1] = "LINEAR_HORIZONTAL";
}(_a || (_a = {
}));
var Ba = {
    align: "left",
    breakWords: !1,
    dropShadow: !1,
    dropShadowAlpha: 1,
    dropShadowAngle: Math.PI / 6,
    dropShadowBlur: 0,
    dropShadowColor: "black",
    dropShadowDistance: 5,
    fill: "black",
    fillGradientType: _a.LINEAR_VERTICAL,
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
}, Ua = [
    "serif",
    "sans-serif",
    "monospace",
    "cursive",
    "fantasy",
    "system-ui"
], Ga = function() {
    function t7(t15) {
        this.styleID = 0, this.reset(), ja(this, t15, t15);
    }
    return t7.prototype.clone = function() {
        var e31 = {
        };
        return ja(e31, this, Ba), new t7(e31);
    }, t7.prototype.reset = function() {
        ja(this, Ba, Ba);
    }, Object.defineProperty(t7.prototype, "align", {
        get: function() {
            return this._align;
        },
        set: function(t15) {
            this._align !== t15 && (this._align = t15, this.styleID++);
        },
        enumerable: !1,
        configurable: !0
    }), Object.defineProperty(t7.prototype, "breakWords", {
        get: function() {
            return this._breakWords;
        },
        set: function(t15) {
            this._breakWords !== t15 && (this._breakWords = t15, this.styleID++);
        },
        enumerable: !1,
        configurable: !0
    }), Object.defineProperty(t7.prototype, "dropShadow", {
        get: function() {
            return this._dropShadow;
        },
        set: function(t15) {
            this._dropShadow !== t15 && (this._dropShadow = t15, this.styleID++);
        },
        enumerable: !1,
        configurable: !0
    }), Object.defineProperty(t7.prototype, "dropShadowAlpha", {
        get: function() {
            return this._dropShadowAlpha;
        },
        set: function(t15) {
            this._dropShadowAlpha !== t15 && (this._dropShadowAlpha = t15, this.styleID++);
        },
        enumerable: !1,
        configurable: !0
    }), Object.defineProperty(t7.prototype, "dropShadowAngle", {
        get: function() {
            return this._dropShadowAngle;
        },
        set: function(t15) {
            this._dropShadowAngle !== t15 && (this._dropShadowAngle = t15, this.styleID++);
        },
        enumerable: !1,
        configurable: !0
    }), Object.defineProperty(t7.prototype, "dropShadowBlur", {
        get: function() {
            return this._dropShadowBlur;
        },
        set: function(t15) {
            this._dropShadowBlur !== t15 && (this._dropShadowBlur = t15, this.styleID++);
        },
        enumerable: !1,
        configurable: !0
    }), Object.defineProperty(t7.prototype, "dropShadowColor", {
        get: function() {
            return this._dropShadowColor;
        },
        set: function(t15) {
            var e31 = ka(t15);
            this._dropShadowColor !== e31 && (this._dropShadowColor = e31, this.styleID++);
        },
        enumerable: !1,
        configurable: !0
    }), Object.defineProperty(t7.prototype, "dropShadowDistance", {
        get: function() {
            return this._dropShadowDistance;
        },
        set: function(t15) {
            this._dropShadowDistance !== t15 && (this._dropShadowDistance = t15, this.styleID++);
        },
        enumerable: !1,
        configurable: !0
    }), Object.defineProperty(t7.prototype, "fill", {
        get: function() {
            return this._fill;
        },
        set: function(t15) {
            var e31 = ka(t15);
            this._fill !== e31 && (this._fill = e31, this.styleID++);
        },
        enumerable: !1,
        configurable: !0
    }), Object.defineProperty(t7.prototype, "fillGradientType", {
        get: function() {
            return this._fillGradientType;
        },
        set: function(t15) {
            this._fillGradientType !== t15 && (this._fillGradientType = t15, this.styleID++);
        },
        enumerable: !1,
        configurable: !0
    }), Object.defineProperty(t7.prototype, "fillGradientStops", {
        get: function() {
            return this._fillGradientStops;
        },
        set: function(t15) {
            (function(t16, e31) {
                if (!Array.isArray(t16) || !Array.isArray(e31)) return !1;
                if (t16.length !== e31.length) return !1;
                for(var r60 = 0; r60 < t16.length; ++r60)if (t16[r60] !== e31[r60]) return !1;
                return !0;
            })(this._fillGradientStops, t15) || (this._fillGradientStops = t15, this.styleID++);
        },
        enumerable: !1,
        configurable: !0
    }), Object.defineProperty(t7.prototype, "fontFamily", {
        get: function() {
            return this._fontFamily;
        },
        set: function(t15) {
            this.fontFamily !== t15 && (this._fontFamily = t15, this.styleID++);
        },
        enumerable: !1,
        configurable: !0
    }), Object.defineProperty(t7.prototype, "fontSize", {
        get: function() {
            return this._fontSize;
        },
        set: function(t15) {
            this._fontSize !== t15 && (this._fontSize = t15, this.styleID++);
        },
        enumerable: !1,
        configurable: !0
    }), Object.defineProperty(t7.prototype, "fontStyle", {
        get: function() {
            return this._fontStyle;
        },
        set: function(t15) {
            this._fontStyle !== t15 && (this._fontStyle = t15, this.styleID++);
        },
        enumerable: !1,
        configurable: !0
    }), Object.defineProperty(t7.prototype, "fontVariant", {
        get: function() {
            return this._fontVariant;
        },
        set: function(t15) {
            this._fontVariant !== t15 && (this._fontVariant = t15, this.styleID++);
        },
        enumerable: !1,
        configurable: !0
    }), Object.defineProperty(t7.prototype, "fontWeight", {
        get: function() {
            return this._fontWeight;
        },
        set: function(t15) {
            this._fontWeight !== t15 && (this._fontWeight = t15, this.styleID++);
        },
        enumerable: !1,
        configurable: !0
    }), Object.defineProperty(t7.prototype, "letterSpacing", {
        get: function() {
            return this._letterSpacing;
        },
        set: function(t15) {
            this._letterSpacing !== t15 && (this._letterSpacing = t15, this.styleID++);
        },
        enumerable: !1,
        configurable: !0
    }), Object.defineProperty(t7.prototype, "lineHeight", {
        get: function() {
            return this._lineHeight;
        },
        set: function(t15) {
            this._lineHeight !== t15 && (this._lineHeight = t15, this.styleID++);
        },
        enumerable: !1,
        configurable: !0
    }), Object.defineProperty(t7.prototype, "leading", {
        get: function() {
            return this._leading;
        },
        set: function(t15) {
            this._leading !== t15 && (this._leading = t15, this.styleID++);
        },
        enumerable: !1,
        configurable: !0
    }), Object.defineProperty(t7.prototype, "lineJoin", {
        get: function() {
            return this._lineJoin;
        },
        set: function(t15) {
            this._lineJoin !== t15 && (this._lineJoin = t15, this.styleID++);
        },
        enumerable: !1,
        configurable: !0
    }), Object.defineProperty(t7.prototype, "miterLimit", {
        get: function() {
            return this._miterLimit;
        },
        set: function(t15) {
            this._miterLimit !== t15 && (this._miterLimit = t15, this.styleID++);
        },
        enumerable: !1,
        configurable: !0
    }), Object.defineProperty(t7.prototype, "padding", {
        get: function() {
            return this._padding;
        },
        set: function(t15) {
            this._padding !== t15 && (this._padding = t15, this.styleID++);
        },
        enumerable: !1,
        configurable: !0
    }), Object.defineProperty(t7.prototype, "stroke", {
        get: function() {
            return this._stroke;
        },
        set: function(t15) {
            var e31 = ka(t15);
            this._stroke !== e31 && (this._stroke = e31, this.styleID++);
        },
        enumerable: !1,
        configurable: !0
    }), Object.defineProperty(t7.prototype, "strokeThickness", {
        get: function() {
            return this._strokeThickness;
        },
        set: function(t15) {
            this._strokeThickness !== t15 && (this._strokeThickness = t15, this.styleID++);
        },
        enumerable: !1,
        configurable: !0
    }), Object.defineProperty(t7.prototype, "textBaseline", {
        get: function() {
            return this._textBaseline;
        },
        set: function(t15) {
            this._textBaseline !== t15 && (this._textBaseline = t15, this.styleID++);
        },
        enumerable: !1,
        configurable: !0
    }), Object.defineProperty(t7.prototype, "trim", {
        get: function() {
            return this._trim;
        },
        set: function(t15) {
            this._trim !== t15 && (this._trim = t15, this.styleID++);
        },
        enumerable: !1,
        configurable: !0
    }), Object.defineProperty(t7.prototype, "whiteSpace", {
        get: function() {
            return this._whiteSpace;
        },
        set: function(t15) {
            this._whiteSpace !== t15 && (this._whiteSpace = t15, this.styleID++);
        },
        enumerable: !1,
        configurable: !0
    }), Object.defineProperty(t7.prototype, "wordWrap", {
        get: function() {
            return this._wordWrap;
        },
        set: function(t15) {
            this._wordWrap !== t15 && (this._wordWrap = t15, this.styleID++);
        },
        enumerable: !1,
        configurable: !0
    }), Object.defineProperty(t7.prototype, "wordWrapWidth", {
        get: function() {
            return this._wordWrapWidth;
        },
        set: function(t15) {
            this._wordWrapWidth !== t15 && (this._wordWrapWidth = t15, this.styleID++);
        },
        enumerable: !1,
        configurable: !0
    }), t7.prototype.toFontString = function() {
        var t15 = "number" == typeof this.fontSize ? this.fontSize + "px" : this.fontSize, e31 = this.fontFamily;
        Array.isArray(this.fontFamily) || (e31 = this.fontFamily.split(","));
        for(var r60 = e31.length - 1; r60 >= 0; r60--){
            var i66 = e31[r60].trim();
            !/([\"\'])[^\'\"]+\1/.test(i66) && Ua.indexOf(i66) < 0 && (i66 = '"' + i66 + '"'), e31[r60] = i66;
        }
        return this.fontStyle + " " + this.fontVariant + " " + this.fontWeight + " " + t15 + " " + e31.join(",");
    }, t7;
}();
function Xa(t7) {
    return "number" == typeof t7 ? le(t7) : ("string" == typeof t7 && 0 === t7.indexOf("0x") && (t7 = t7.replace("0x", "#")), t7);
}
function ka(t7) {
    if (Array.isArray(t7)) {
        for(var e31 = 0; e31 < t7.length; ++e31)t7[e31] = Xa(t7[e31]);
        return t7;
    }
    return Xa(t7);
}
function ja(t7, e40, r60) {
    for(var i67 in r60)Array.isArray(e40[i67]) ? t7[i67] = e40[i67].slice() : t7[i67] = e40[i67];
}
var Ha = function() {
    function t7(t15, e40, r60, i67, n57, o52, s49, a53, h49) {
        this.text = t15, this.style = e40, this.width = r60, this.height = i67, this.lines = n57, this.lineWidths = o52, this.lineHeight = s49, this.maxLineWidth = a53, this.fontProperties = h49;
    }
    return t7.measureText = function(e40, r60, i67, n57) {
        (void 0) === n57 && (n57 = t7._canvas), i67 = null == i67 ? r60.wordWrap : i67;
        var o52 = r60.toFontString(), s49 = t7.measureFont(o52);
        0 === s49.fontSize && (s49.fontSize = r60.fontSize, s49.ascent = r60.fontSize);
        var a53 = n57.getContext("2d");
        a53.font = o52;
        for(var h49 = (i67 ? t7.wordWrap(e40, r60, n57) : e40).split(/(?:\r\n|\r|\n)/), u46 = new Array(h49.length), l38 = 0, c32 = 0; c32 < h49.length; c32++){
            var d31 = a53.measureText(h49[c32]).width + (h49[c32].length - 1) * r60.letterSpacing;
            u46[c32] = d31, l38 = Math.max(l38, d31);
        }
        var f25 = l38 + r60.strokeThickness;
        r60.dropShadow && (f25 += r60.dropShadowDistance);
        var p = r60.lineHeight || s49.fontSize + r60.strokeThickness, _12 = Math.max(p, s49.fontSize + r60.strokeThickness) + (h49.length - 1) * (p + r60.leading);
        return r60.dropShadow && (_12 += r60.dropShadowDistance), new t7(e40, r60, f25, _12, h49, u46, p + r60.leading, l38, s49);
    }, t7.wordWrap = function(e40, r60, i67) {
        (void 0) === i67 && (i67 = t7._canvas);
        for(var n57 = i67.getContext("2d"), o52 = 0, s49 = "", a53 = "", h49 = Object.create(null), u46 = r60.letterSpacing, l38 = r60.whiteSpace, c32 = t7.collapseSpaces(l38), d32 = t7.collapseNewlines(l38), f25 = !c32, p = r60.wordWrapWidth + u46, _12 = t7.tokenize(e40), m11 = 0; m11 < _12.length; m11++){
            var v8 = _12[m11];
            if (t7.isNewline(v8)) {
                if (!d32) {
                    a53 += t7.addLine(s49), f25 = !c32, s49 = "", o52 = 0;
                    continue;
                }
                v8 = " ";
            }
            if (c32) {
                var y = t7.isBreakingSpace(v8), g8 = t7.isBreakingSpace(s49[s49.length - 1]);
                if (y && g8) continue;
            }
            var b7 = t7.getFromCache(v8, u46, h49, n57);
            if (b7 > p) {
                if ("" !== s49 && (a53 += t7.addLine(s49), s49 = "", o52 = 0), t7.canBreakWords(v8, r60.breakWords)) for(var x5 = t7.wordWrapSplit(v8), T5 = 0; T5 < x5.length; T5++){
                    for(var E5 = x5[T5], A4 = 1; x5[T5 + A4];){
                        var S5 = x5[T5 + A4], O4 = E5[E5.length - 1];
                        if (t7.canBreakChars(O4, S5, v8, T5, r60.breakWords)) break;
                        E5 += S5, A4++;
                    }
                    T5 += E5.length - 1;
                    var R5 = t7.getFromCache(E5, u46, h49, n57);
                    R5 + o52 > p && (a53 += t7.addLine(s49), f25 = !1, s49 = "", o52 = 0), s49 += E5, o52 += R5;
                }
                else {
                    s49.length > 0 && (a53 += t7.addLine(s49), s49 = "", o52 = 0);
                    var w5 = m11 === _12.length - 1;
                    a53 += t7.addLine(v8, !w5), f25 = !1, s49 = "", o52 = 0;
                }
            } else b7 + o52 > p && (f25 = !1, a53 += t7.addLine(s49), s49 = "", o52 = 0), (s49.length > 0 || !t7.isBreakingSpace(v8) || f25) && (s49 += v8, o52 += b7);
        }
        return a53 + t7.addLine(s49, !1);
    }, t7.addLine = function(e40, r60) {
        return (void 0) === r60 && (r60 = !0), e40 = t7.trimRight(e40), r60 ? e40 + "\n" : e40;
    }, t7.getFromCache = function(t15, e40, r60, i67) {
        var n57 = r60[t15];
        if ("number" != typeof n57) {
            var o52 = t15.length * e40;
            n57 = i67.measureText(t15).width + o52, r60[t15] = n57;
        }
        return n57;
    }, t7.collapseSpaces = function(t15) {
        return "normal" === t15 || "pre-line" === t15;
    }, t7.collapseNewlines = function(t15) {
        return "normal" === t15;
    }, t7.trimRight = function(e40) {
        if ("string" != typeof e40) return "";
        for(var r60 = e40.length - 1; r60 >= 0; r60--){
            var i67 = e40[r60];
            if (!t7.isBreakingSpace(i67)) break;
            e40 = e40.slice(0, -1);
        }
        return e40;
    }, t7.isNewline = function(e40) {
        return "string" == typeof e40 && t7._newlines.indexOf(e40.charCodeAt(0)) >= 0;
    }, t7.isBreakingSpace = function(e40, r60) {
        return "string" == typeof e40 && t7._breakingSpaces.indexOf(e40.charCodeAt(0)) >= 0;
    }, t7.tokenize = function(e40) {
        var r60 = [], i68 = "";
        if ("string" != typeof e40) return r60;
        for(var n57 = 0; n57 < e40.length; n57++){
            var o53 = e40[n57], s49 = e40[n57 + 1];
            t7.isBreakingSpace(o53, s49) || t7.isNewline(o53) ? ("" !== i68 && (r60.push(i68), i68 = ""), r60.push(o53)) : i68 += o53;
        }
        return "" !== i68 && r60.push(i68), r60;
    }, t7.canBreakWords = function(t15, e40) {
        return e40;
    }, t7.canBreakChars = function(t15, e40, r60, i68, n57) {
        return !0;
    }, t7.wordWrapSplit = function(t15) {
        return t15.split("");
    }, t7.measureFont = function(e40) {
        if (t7._fonts[e40]) return t7._fonts[e40];
        var r60 = {
            ascent: 0,
            descent: 0,
            fontSize: 0
        }, i68 = t7._canvas, n57 = t7._context;
        n57.font = e40;
        var o54 = t7.METRICS_STRING + t7.BASELINE_SYMBOL, s50 = Math.ceil(n57.measureText(o54).width), a53 = Math.ceil(n57.measureText(t7.BASELINE_SYMBOL).width), h49 = t7.HEIGHT_MULTIPLIER * a53;
        a53 = a53 * t7.BASELINE_MULTIPLIER | 0, i68.width = s50, i68.height = h49, n57.fillStyle = "#f00", n57.fillRect(0, 0, s50, h49), n57.font = e40, n57.textBaseline = "alphabetic", n57.fillStyle = "#000", n57.fillText(o54, 0, a53);
        var u46 = n57.getImageData(0, 0, s50, h49).data, l38 = u46.length, c32 = 4 * s50, d32 = 0, f25 = 0, p = !1;
        for(d32 = 0; d32 < a53; ++d32){
            for(var _12 = 0; _12 < c32; _12 += 4)if (255 !== u46[f25 + _12]) {
                p = !0;
                break;
            }
            if (p) break;
            f25 += c32;
        }
        for(r60.ascent = a53 - d32, f25 = l38 - c32, p = !1, d32 = h49; d32 > a53; --d32){
            for(_12 = 0; _12 < c32; _12 += 4)if (255 !== u46[f25 + _12]) {
                p = !0;
                break;
            }
            if (p) break;
            f25 -= c32;
        }
        return r60.descent = d32 - a53, r60.fontSize = r60.ascent + r60.descent, t7._fonts[e40] = r60, r60;
    }, t7.clearMetrics = function(e40) {
        (void 0) === e40 && (e40 = ""), e40 ? delete t7._fonts[e40] : t7._fonts = {
        };
    }, t7;
}(), Ya = function() {
    try {
        var t7 = new OffscreenCanvas(0, 0), e40 = t7.getContext("2d");
        return e40 && e40.measureText ? t7 : document.createElement("canvas");
    } catch (t15) {
        return document.createElement("canvas");
    }
}();
Ya.width = Ya.height = 10, Ha._canvas = Ya, Ha._context = Ya.getContext("2d"), Ha._fonts = {
}, Ha.METRICS_STRING = "|ÉqÅ", Ha.BASELINE_SYMBOL = "M", Ha.BASELINE_MULTIPLIER = 1.4, Ha.HEIGHT_MULTIPLIER = 2, Ha._newlines = [
    10,
    13
], Ha._breakingSpaces = [
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
var Va = {
    texture: !0,
    children: !1,
    baseTexture: !0
}, za = function(t7) {
    function e40(e41, r60, i68) {
        var n57 = this, o54 = !1;
        i68 || (i68 = document.createElement("canvas"), o54 = !0), i68.width = 3, i68.height = 3;
        var s50 = ri.from(i68);
        return s50.orig = new je, s50.trim = new je, (n57 = t7.call(this, s50) || this)._ownCanvas = o54, n57.canvas = i68, n57.context = n57.canvas.getContext("2d"), n57._resolution = F.RESOLUTION, n57._autoResolution = !0, n57._text = null, n57._style = null, n57._styleListener = null, n57._font = "", n57.text = e41, n57.style = r60, n57.localStyleID = -1, n57;
    }
    return (function(t15, e41) {
        function r60() {
            this.constructor = t15;
        }
        Fa(t15, e41), t15.prototype = null === e41 ? Object.create(e41) : (r60.prototype = e41.prototype, new r60);
    })(e40, t7), e40.prototype.updateText = function(t15) {
        var e41 = this._style;
        if (this.localStyleID !== e41.styleID && (this.dirty = !0, this.localStyleID = e41.styleID), this.dirty || !t15) {
            this._font = this._style.toFontString();
            var r60, i68, n57 = this.context, o54 = Ha.measureText(this._text || " ", this._style, this._style.wordWrap, this.canvas), s50 = o54.width, a53 = o54.height, h49 = o54.lines, u46 = o54.lineHeight, l38 = o54.lineWidths, c32 = o54.maxLineWidth, d32 = o54.fontProperties;
            this.canvas.width = Math.ceil((Math.max(1, s50) + 2 * e41.padding) * this._resolution), this.canvas.height = Math.ceil((Math.max(1, a53) + 2 * e41.padding) * this._resolution), n57.scale(this._resolution, this._resolution), n57.clearRect(0, 0, this.canvas.width, this.canvas.height), n57.font = this._font, n57.lineWidth = e41.strokeThickness, n57.textBaseline = e41.textBaseline, n57.lineJoin = e41.lineJoin, n57.miterLimit = e41.miterLimit;
            for(var f25 = e41.dropShadow ? 2 : 1, p = 0; p < f25; ++p){
                var _13 = e41.dropShadow && 0 === p, m11 = _13 ? Math.ceil(Math.max(1, a53) + 2 * e41.padding) : 0, v9 = m11 * this._resolution;
                if (_13) {
                    n57.fillStyle = "black", n57.strokeStyle = "black";
                    var y = e41.dropShadowColor, g9 = ue("number" == typeof y ? y : ce(y));
                    n57.shadowColor = "rgba(" + 255 * g9[0] + "," + 255 * g9[1] + "," + 255 * g9[2] + "," + e41.dropShadowAlpha + ")", n57.shadowBlur = e41.dropShadowBlur, n57.shadowOffsetX = Math.cos(e41.dropShadowAngle) * e41.dropShadowDistance, n57.shadowOffsetY = Math.sin(e41.dropShadowAngle) * e41.dropShadowDistance + v9;
                } else n57.fillStyle = this._generateFillStyle(e41, h49, o54), n57.strokeStyle = e41.stroke, n57.shadowColor = "black", n57.shadowBlur = 0, n57.shadowOffsetX = 0, n57.shadowOffsetY = 0;
                for(var b8 = 0; b8 < h49.length; b8++)r60 = e41.strokeThickness / 2, i68 = e41.strokeThickness / 2 + b8 * u46 + d32.ascent, "right" === e41.align ? r60 += c32 - l38[b8] : "center" === e41.align && (r60 += (c32 - l38[b8]) / 2), e41.stroke && e41.strokeThickness && this.drawLetterSpacing(h49[b8], r60 + e41.padding, i68 + e41.padding - m11, !0), e41.fill && this.drawLetterSpacing(h49[b8], r60 + e41.padding, i68 + e41.padding - m11);
            }
            this.updateTexture();
        }
    }, e40.prototype.drawLetterSpacing = function(t15, e41, r61, i69) {
        (void 0) === i69 && (i69 = !1);
        var n58 = this._style.letterSpacing;
        if (0 !== n58) for(var o55 = e41, s51 = Array.from ? Array.from(t15) : t15.split(""), a54 = this.context.measureText(t15).width, h50 = 0, u47 = 0; u47 < s51.length; ++u47){
            var l39 = s51[u47];
            i69 ? this.context.strokeText(l39, o55, r61) : this.context.fillText(l39, o55, r61), o55 += a54 - (h50 = this.context.measureText(t15.substring(u47 + 1)).width) + n58, a54 = h50;
        }
        else i69 ? this.context.strokeText(t15, e41, r61) : this.context.fillText(t15, e41, r61);
    }, e40.prototype.updateTexture = function() {
        var t15 = this.canvas;
        if (this._style.trim) {
            var e41 = De(t15);
            e41.data && (t15.width = e41.width, t15.height = e41.height, this.context.putImageData(e41.data, 0, 0));
        }
        var r61 = this._texture, i69 = this._style, n58 = i69.trim ? 0 : i69.padding, o55 = r61.baseTexture;
        r61.trim.width = r61._frame.width = Math.ceil(t15.width / this._resolution), r61.trim.height = r61._frame.height = Math.ceil(t15.height / this._resolution), r61.trim.x = -n58, r61.trim.y = -n58, r61.orig.width = r61._frame.width - 2 * n58, r61.orig.height = r61._frame.height - 2 * n58, this._onTextureUpdate(), o55.setRealSize(t15.width, t15.height, this._resolution), this._recursivePostUpdateTransform(), this.dirty = !1;
    }, e40.prototype._render = function(e42) {
        this._autoResolution && this._resolution !== e42.resolution && (this._resolution = e42.resolution, this.dirty = !0), this.updateText(!0), t7.prototype._render.call(this, e42);
    }, e40.prototype.getLocalBounds = function(e42) {
        return this.updateText(!0), t7.prototype.getLocalBounds.call(this, e42);
    }, e40.prototype._calculateBounds = function() {
        this.updateText(!0), this.calculateVertices(), this._bounds.addQuad(this.vertexData);
    }, e40.prototype._generateFillStyle = function(t15, e42, r61) {
        var i69, n58 = t15.fill;
        if (!Array.isArray(n58)) return n58;
        if (1 === n58.length) return n58[0];
        var o55 = t15.dropShadow ? t15.dropShadowDistance : 0, s51 = t15.padding || 0, a54 = Math.ceil(this.canvas.width / this._resolution) - o55 - 2 * s51, h50 = Math.ceil(this.canvas.height / this._resolution) - o55 - 2 * s51, u47 = n58.slice(), l40 = t15.fillGradientStops.slice();
        if (!l40.length) for(var c33 = u47.length + 1, d33 = 1; d33 < c33; ++d33)l40.push(d33 / c33);
        if (u47.unshift(n58[0]), l40.unshift(0), u47.push(n58[n58.length - 1]), l40.push(1), t15.fillGradientType === _a.LINEAR_VERTICAL) {
            i69 = this.context.createLinearGradient(a54 / 2, s51, a54 / 2, h50 + s51);
            var f26 = (r61.fontProperties.fontSize + t15.strokeThickness) / h50;
            for(d33 = 0; d33 < e42.length; d33++)for(var p = r61.lineHeight * d33, _14 = 0; _14 < u47.length; _14++){
                var m12;
                m12 = "number" == typeof l40[_14] ? l40[_14] : _14 / u47.length;
                var v10 = Math.min(1, Math.max(0, p / h50 + m12 * f26));
                v10 = Number(v10.toFixed(5)), i69.addColorStop(v10, u47[_14]);
            }
        } else {
            i69 = this.context.createLinearGradient(s51, h50 / 2, a54 + s51, h50 / 2);
            var y = u47.length + 1, g10 = 1;
            for(d33 = 0; d33 < u47.length; d33++){
                var b9;
                b9 = "number" == typeof l40[d33] ? l40[d33] : g10 / y, i69.addColorStop(b9, u47[d33]), g10++;
            }
        }
        return i69;
    }, e40.prototype.destroy = function(e42) {
        "boolean" == typeof e42 && (e42 = {
            children: e42
        }), e42 = Object.assign({
        }, Va, e42), t7.prototype.destroy.call(this, e42), this._ownCanvas && (this.canvas.height = this.canvas.width = 0), this.context = null, this.canvas = null, this._style = null;
    }, Object.defineProperty(e40.prototype, "width", {
        get: function() {
            return this.updateText(!0), Math.abs(this.scale.x) * this._texture.orig.width;
        },
        set: function(t15) {
            this.updateText(!0);
            var e42 = Ae(this.scale.x) || 1;
            this.scale.x = e42 * t15 / this._texture.orig.width, this._width = t15;
        },
        enumerable: !1,
        configurable: !0
    }), Object.defineProperty(e40.prototype, "height", {
        get: function() {
            return this.updateText(!0), Math.abs(this.scale.y) * this._texture.orig.height;
        },
        set: function(t15) {
            this.updateText(!0);
            var e42 = Ae(this.scale.y) || 1;
            this.scale.y = e42 * t15 / this._texture.orig.height, this._height = t15;
        },
        enumerable: !1,
        configurable: !0
    }), Object.defineProperty(e40.prototype, "style", {
        get: function() {
            return this._style;
        },
        set: function(t15) {
            t15 = t15 || {
            }, this._style = t15 instanceof Ga ? t15 : new Ga(t15), this.localStyleID = -1, this.dirty = !0;
        },
        enumerable: !1,
        configurable: !0
    }), Object.defineProperty(e40.prototype, "text", {
        get: function() {
            return this._text;
        },
        set: function(t15) {
            t15 = String(null == t15 ? "" : t15), this._text !== t15 && (this._text = t15, this.dirty = !0);
        },
        enumerable: !1,
        configurable: !0
    }), Object.defineProperty(e40.prototype, "resolution", {
        get: function() {
            return this._resolution;
        },
        set: function(t15) {
            this._autoResolution = !1, this._resolution !== t15 && (this._resolution = t15, this.dirty = !0);
        },
        enumerable: !1,
        configurable: !0
    }), e40;
}(La);
F.UPLOADS_PER_FRAME = 4;
var Wa = function(t7, e40) {
    return (Wa = Object.setPrototypeOf || ({
        __proto__: []
    }) instanceof Array && function(t15, e42) {
        t15.__proto__ = e42;
    } || function(t15, e42) {
        for(var r61 in e42)e42.hasOwnProperty(r61) && (t15[r61] = e42[r61]);
    })(t7, e40);
}, qa = function() {
    function t7(t15) {
        this.maxItemsPerFrame = t15, this.itemsLeft = 0;
    }
    return t7.prototype.beginFrame = function() {
        this.itemsLeft = this.maxItemsPerFrame;
    }, t7.prototype.allowedToUpload = function() {
        return (this.itemsLeft--) > 0;
    }, t7;
}();
function Ka(t7, e40) {
    var r61 = !1;
    if (t7 && t7._textures && t7._textures.length) for(var i69 = 0; i69 < t7._textures.length; i69++)if (t7._textures[i69] instanceof ri) {
        var n58 = t7._textures[i69].baseTexture;
        -1 === e40.indexOf(n58) && (e40.push(n58), r61 = !0);
    }
    return r61;
}
function Za(t7, e40) {
    if (t7.baseTexture instanceof Gr) {
        var r61 = t7.baseTexture;
        return -1 === e40.indexOf(r61) && e40.push(r61), !0;
    }
    return !1;
}
function Ja(t7, e40) {
    if (t7._texture && t7._texture instanceof ri) {
        var r62 = t7._texture.baseTexture;
        return -1 === e40.indexOf(r62) && e40.push(r62), !0;
    }
    return !1;
}
function Qa(t7, e40) {
    return e40 instanceof za && (e40.updateText(!0), !0);
}
function $a(t7, e40) {
    if (e40 instanceof Ga) {
        var r63 = e40.toFontString();
        return Ha.measureFont(r63), !0;
    }
    return !1;
}
function th(t7, e40) {
    if (t7 instanceof za) {
        -1 === e40.indexOf(t7.style) && e40.push(t7.style), -1 === e40.indexOf(t7) && e40.push(t7);
        var r64 = t7._texture.baseTexture;
        return -1 === e40.indexOf(r64) && e40.push(r64), !0;
    }
    return !1;
}
function eh(t7, e40) {
    return t7 instanceof Ga && (-1 === e40.indexOf(t7) && e40.push(t7), !0);
}
var rh = function() {
    function t7(t15) {
        var e40 = this;
        this.limiter = new qa(F.UPLOADS_PER_FRAME), this.renderer = t15, this.uploadHookHelper = null, this.queue = [], this.addHooks = [], this.uploadHooks = [], this.completes = [], this.ticking = !1, this.delayedTick = function() {
            e40.queue && e40.prepareItems();
        }, this.registerFindHook(th), this.registerFindHook(eh), this.registerFindHook(Ka), this.registerFindHook(Za), this.registerFindHook(Ja), this.registerUploadHook(Qa), this.registerUploadHook($a);
    }
    return t7.prototype.upload = function(t15, e40) {
        "function" == typeof t15 && (e40 = t15, t15 = null), t15 && this.add(t15), this.queue.length ? (e40 && this.completes.push(e40), this.ticking || (this.ticking = !0, br.system.addOnce(this.tick, this, fr.UTILITY))) : e40 && e40();
    }, t7.prototype.tick = function() {
        setTimeout(this.delayedTick, 0);
    }, t7.prototype.prepareItems = function() {
        for(this.limiter.beginFrame(); this.queue.length && this.limiter.allowedToUpload();){
            var t15 = this.queue[0], e40 = !1;
            if (t15 && !t15._destroyed) for(var r65 = 0, i69 = this.uploadHooks.length; r65 < i69; r65++)if (this.uploadHooks[r65](this.uploadHookHelper, t15)) {
                this.queue.shift(), e40 = !0;
                break;
            }
            e40 || this.queue.shift();
        }
        if (this.queue.length) br.system.addOnce(this.tick, this, fr.UTILITY);
        else {
            this.ticking = !1;
            var n59 = this.completes.slice(0);
            for(this.completes.length = 0, r65 = 0, i69 = n59.length; r65 < i69; r65++)n59[r65]();
        }
    }, t7.prototype.registerFindHook = function(t16) {
        return t16 && this.addHooks.push(t16), this;
    }, t7.prototype.registerUploadHook = function(t16) {
        return t16 && this.uploadHooks.push(t16), this;
    }, t7.prototype.add = function(t16) {
        for(var e42 = 0, r66 = this.addHooks.length; e42 < r66 && !this.addHooks[e42](t16, this.queue); e42++);
        if (t16 instanceof cr) for(e42 = t16.children.length - 1; e42 >= 0; e42--)this.add(t16.children[e42]);
        return this;
    }, t7.prototype.destroy = function() {
        this.ticking && br.system.remove(this.tick, this), this.ticking = !1, this.addHooks = null, this.uploadHooks = null, this.renderer = null, this.completes = null, this.queue = null, this.limiter = null, this.uploadHookHelper = null;
    }, t7;
}();
function ih(t7, e42) {
    return e42 instanceof Gr && (e42._glTextures[t7.CONTEXT_UID] || t7.texture.bind(e42), !0);
}
function nh(t7, e42) {
    if (!(e42 instanceof Ia)) return !1;
    var r66 = e42.geometry;
    e42.finishPoly(), r66.updateBatches();
    for(var i70 = r66.batches, n60 = 0; n60 < i70.length; n60++){
        var o55 = i70[n60].style.texture;
        o55 && ih(t7, o55.baseTexture);
    }
    return r66.batchable || t7.geometry.bind(r66, e42._resolveDirectShader(t7)), !0;
}
function oh(t7, e42) {
    return t7 instanceof Ia && (e42.push(t7), !0);
}
var sh = function(t7) {
    function e42(e43) {
        var r66 = t7.call(this, e43) || this;
        return r66.uploadHookHelper = r66.renderer, r66.registerFindHook(oh), r66.registerUploadHook(ih), r66.registerUploadHook(nh), r66;
    }
    return (function(t16, e43) {
        function r66() {
            this.constructor = t16;
        }
        Wa(t16, e43), t16.prototype = null === e43 ? Object.create(e43) : (r66.prototype = e43.prototype, new r66);
    })(e42, t7), e42;
}(rh), ah = function() {
    function t7(t16) {
        this.maxMilliseconds = t16, this.frameStart = 0;
    }
    return t7.prototype.beginFrame = function() {
        this.frameStart = Date.now();
    }, t7.prototype.allowedToUpload = function() {
        return Date.now() - this.frameStart < this.maxMilliseconds;
    }, t7;
}(), hh = function() {
    function t7(t16, e42, r66) {
        (void 0) === r66 && (r66 = null), this._texture = t16 instanceof ri ? t16 : null, this.baseTexture = t16 instanceof Gr ? t16 : this._texture.baseTexture, this.textures = {
        }, this.animations = {
        }, this.data = e42;
        var i70 = this.baseTexture.resource;
        this.resolution = this._updateResolution(r66 || (i70 ? i70.url : null)), this._frames = this.data.frames, this._frameKeys = Object.keys(this._frames), this._batchIndex = 0, this._callback = null;
    }
    return t7.prototype._updateResolution = function(t16) {
        (void 0) === t16 && (t16 = null);
        var e42 = this.data.meta.scale, r66 = Fe(t16, null);
        return null === r66 && (r66 = (void 0) !== e42 ? parseFloat(e42) : 1), 1 !== r66 && this.baseTexture.setResolution(r66), r66;
    }, t7.prototype.parse = function(e42) {
        this._batchIndex = 0, this._callback = e42, this._frameKeys.length <= t7.BATCH_SIZE ? (this._processFrames(0), this._processAnimations(), this._parseComplete()) : this._nextBatch();
    }, t7.prototype._processFrames = function(e42) {
        for(var r66 = e42, i70 = t7.BATCH_SIZE; r66 - e42 < i70 && r66 < this._frameKeys.length;){
            var n60 = this._frameKeys[r66], o56 = this._frames[n60], s51 = o56.frame;
            if (s51) {
                var a54, h50 = null, u47 = !1 !== o56.trimmed && o56.sourceSize ? o56.sourceSize : o56.frame, l40 = new je(0, 0, Math.floor(u47.w) / this.resolution, Math.floor(u47.h) / this.resolution);
                a54 = o56.rotated ? new je(Math.floor(s51.x) / this.resolution, Math.floor(s51.y) / this.resolution, Math.floor(s51.h) / this.resolution, Math.floor(s51.w) / this.resolution) : new je(Math.floor(s51.x) / this.resolution, Math.floor(s51.y) / this.resolution, Math.floor(s51.w) / this.resolution, Math.floor(s51.h) / this.resolution), !1 !== o56.trimmed && o56.spriteSourceSize && (h50 = new je(Math.floor(o56.spriteSourceSize.x) / this.resolution, Math.floor(o56.spriteSourceSize.y) / this.resolution, Math.floor(s51.w) / this.resolution, Math.floor(s51.h) / this.resolution)), this.textures[n60] = new ri(this.baseTexture, a54, l40, h50, o56.rotated ? 2 : 0, o56.anchor), ri.addToCache(this.textures[n60], n60);
            }
            r66++;
        }
    }, t7.prototype._processAnimations = function() {
        var t16 = this.data.animations || {
        };
        for(var e42 in t16){
            this.animations[e42] = [];
            for(var r66 = 0; r66 < t16[e42].length; r66++){
                var i70 = t16[e42][r66];
                this.animations[e42].push(this.textures[i70]);
            }
        }
    }, t7.prototype._parseComplete = function() {
        var t16 = this._callback;
        this._callback = null, this._batchIndex = 0, t16.call(this, this.textures);
    }, t7.prototype._nextBatch = function() {
        var e42 = this;
        this._processFrames(this._batchIndex * t7.BATCH_SIZE), this._batchIndex++, setTimeout(function() {
            e42._batchIndex * t7.BATCH_SIZE < e42._frameKeys.length ? e42._nextBatch() : (e42._processAnimations(), e42._parseComplete());
        }, 0);
    }, t7.prototype.destroy = function(t16) {
        var e42;
        for(var r67 in (void 0) === t16 && (t16 = !1), this.textures)this.textures[r67].destroy();
        this._frames = null, this._frameKeys = null, this.data = null, this.textures = null, t16 && (null === (e42 = this._texture) || (void 0) === e42 || e42.destroy(), this.baseTexture.destroy()), this._texture = null, this.baseTexture = null;
    }, t7.BATCH_SIZE = 1000, t7;
}(), uh = function() {
    function t7() {
    }
    return t7.use = function(e42, r67) {
        var i71, n61, o57 = this, s52 = e42.name + "_image";
        if (e42.data && e42.type === Lo.TYPE.JSON && e42.data.frames && !o57.resources[s52]) {
            var a55 = null === (n61 = null === (i71 = e42.data) || (void 0) === i71 ? void 0 : i71.meta) || (void 0) === n61 ? void 0 : n61.related_multi_packs;
            if (Array.isArray(a55)) for(var h51 = function(t16) {
                if ("string" != typeof t16) return "continue";
                var r68 = t16.replace(".json", ""), i72 = re.resolve(e42.url.replace(o57.baseUrl, ""), t16);
                if (o57.resources[r68] || Object.values(o57.resources).some(function(t17) {
                    return re.format(re.parse(t17.url)) === i72;
                })) return "continue";
                var n62 = {
                    crossOrigin: e42.crossOrigin,
                    loadType: Lo.LOAD_TYPE.XHR,
                    xhrType: Lo.XHR_RESPONSE_TYPE.JSON,
                    parentResource: e42
                };
                o57.add(r68, i72, n62);
            }, u48 = 0, l41 = a55; u48 < l41.length; u48++)h51(l41[u48]);
            var c33 = {
                crossOrigin: e42.crossOrigin,
                metadata: e42.metadata.imageMetadata,
                parentResource: e42
            }, d33 = t7.getResourcePath(e42, o57.baseUrl);
            o57.add(s52, d33, c33, function(t16) {
                if (t16.error) r67(t16.error);
                else {
                    var i72 = new hh(t16.texture, e42.data, e42.url);
                    i72.parse(function() {
                        e42.spritesheet = i72, e42.textures = i72.textures, r67();
                    });
                }
            });
        } else r67();
    }, t7.getResourcePath = function(t16, e42) {
        return t16.isDataUrl ? t16.data.meta.image : re.resolve(t16.url.replace(e42, ""), t16.data.meta.image);
    }, t7;
}(), lh = function(t7, e42) {
    return (lh = Object.setPrototypeOf || ({
        __proto__: []
    }) instanceof Array && function(t16, e43) {
        t16.__proto__ = e43;
    } || function(t16, e43) {
        for(var r67 in e43)e43.hasOwnProperty(r67) && (t16[r67] = e43[r67]);
    })(t7, e42);
};
function ch(t7, e42) {
    function r67() {
        this.constructor = t7;
    }
    lh(t7, e42), t7.prototype = null === e42 ? Object.create(e42) : (r67.prototype = e42.prototype, new r67);
}
var dh = new We, fh = function(t7) {
    function e42(e43, r67, i71) {
        (void 0) === r67 && (r67 = 100), (void 0) === i71 && (i71 = 100);
        var n61 = t7.call(this, e43) || this;
        return n61.tileTransform = new nr, n61._width = r67, n61._height = i71, n61.uvMatrix = n61.texture.uvMatrix || new cn(e43), n61.pluginName = "tilingSprite", n61.uvRespectAnchor = !1, n61;
    }
    return ch(e42, t7), Object.defineProperty(e42.prototype, "clampMargin", {
        get: function() {
            return this.uvMatrix.clampMargin;
        },
        set: function(t16) {
            this.uvMatrix.clampMargin = t16, this.uvMatrix.update(!0);
        },
        enumerable: !1,
        configurable: !0
    }), Object.defineProperty(e42.prototype, "tileScale", {
        get: function() {
            return this.tileTransform.scale;
        },
        set: function(t16) {
            this.tileTransform.scale.copyFrom(t16);
        },
        enumerable: !1,
        configurable: !0
    }), Object.defineProperty(e42.prototype, "tilePosition", {
        get: function() {
            return this.tileTransform.position;
        },
        set: function(t16) {
            this.tileTransform.position.copyFrom(t16);
        },
        enumerable: !1,
        configurable: !0
    }), e42.prototype._onTextureUpdate = function() {
        this.uvMatrix && (this.uvMatrix.texture = this._texture), this._cachedTint = 16777215;
    }, e42.prototype._render = function(t16) {
        var e43 = this._texture;
        e43 && e43.valid && (this.tileTransform.updateLocalTransform(), this.uvMatrix.update(), t16.batch.setObjectRenderer(t16.plugins[this.pluginName]), t16.plugins[this.pluginName].render(this));
    }, e42.prototype._calculateBounds = function() {
        var t16 = this._width * -this._anchor._x, e43 = this._height * -this._anchor._y, r67 = this._width * (1 - this._anchor._x), i71 = this._height * (1 - this._anchor._y);
        this._bounds.addFrame(this.transform, t16, e43, r67, i71);
    }, e42.prototype.getLocalBounds = function(e43) {
        return 0 === this.children.length ? (this._bounds.minX = this._width * -this._anchor._x, this._bounds.minY = this._height * -this._anchor._y, this._bounds.maxX = this._width * (1 - this._anchor._x), this._bounds.maxY = this._height * (1 - this._anchor._y), e43 || (this._localBoundsRect || (this._localBoundsRect = new je), e43 = this._localBoundsRect), this._bounds.getRectangle(e43)) : t7.prototype.getLocalBounds.call(this, e43);
    }, e42.prototype.containsPoint = function(t16) {
        this.worldTransform.applyInverse(t16, dh);
        var e43 = this._width, r67 = this._height, i71 = -e43 * this.anchor._x;
        if (dh.x >= i71 && dh.x < i71 + e43) {
            var n61 = -r67 * this.anchor._y;
            if (dh.y >= n61 && dh.y < n61 + r67) return !0;
        }
        return !1;
    }, e42.prototype.destroy = function(e43) {
        t7.prototype.destroy.call(this, e43), this.tileTransform = null, this.uvMatrix = null;
    }, e42.from = function(t16, r67) {
        return new e42(ri.from(t16, r67), r67.width, r67.height);
    }, Object.defineProperty(e42.prototype, "width", {
        get: function() {
            return this._width;
        },
        set: function(t16) {
            this._width = t16;
        },
        enumerable: !1,
        configurable: !0
    }), Object.defineProperty(e42.prototype, "height", {
        get: function() {
            return this._height;
        },
        set: function(t16) {
            this._height = t16;
        },
        enumerable: !1,
        configurable: !0
    }), e42;
}(La), ph = "attribute vec2 aVertexPosition;\nattribute vec2 aTextureCoord;\n\nuniform mat3 projectionMatrix;\nuniform mat3 translationMatrix;\nuniform mat3 uTransform;\n\nvarying vec2 vTextureCoord;\n\nvoid main(void)\n{\n    gl_Position = vec4((projectionMatrix * translationMatrix * vec3(aVertexPosition, 1.0)).xy, 0.0, 1.0);\n\n    vTextureCoord = (uTransform * vec3(aTextureCoord, 1.0)).xy;\n}\n", _h = "varying vec2 vTextureCoord;\n\nuniform sampler2D uSampler;\nuniform vec4 uColor;\nuniform mat3 uMapCoord;\nuniform vec4 uClampFrame;\nuniform vec2 uClampOffset;\n\nvoid main(void)\n{\n    vec2 coord = vTextureCoord + ceil(uClampOffset - vTextureCoord);\n    coord = (uMapCoord * vec3(coord, 1.0)).xy;\n    coord = clamp(coord, uClampFrame.xy, uClampFrame.zw);\n\n    vec4 texSample = texture2D(uSampler, coord);\n    gl_FragColor = texSample * uColor;\n}\n", mh = "varying vec2 vTextureCoord;\n\nuniform sampler2D uSampler;\nuniform vec4 uColor;\n\nvoid main(void)\n{\n    vec4 sample = texture2D(uSampler, vTextureCoord);\n    gl_FragColor = sample * uColor;\n}\n", vh = new Ke, yh = function(t7) {
    function e42(e43) {
        var r67 = t7.call(this, e43) || this, i71 = {
            globals: r67.renderer.globalUniforms
        };
        return r67.shader = on.from(ph, _h, i71), r67.simpleShader = on.from(ph, mh, i71), r67.quad = new mi, r67.state = sn.for2d(), r67;
    }
    return ch(e42, t7), e42.prototype.render = function(t16) {
        var e43 = this.renderer, r67 = this.quad, i71 = r67.vertices;
        i71[0] = i71[6] = t16._width * -t16.anchor.x, i71[1] = i71[3] = t16._height * -t16.anchor.y, i71[2] = i71[4] = t16._width * (1 - t16.anchor.x), i71[5] = i71[7] = t16._height * (1 - t16.anchor.y);
        var n62 = t16.uvRespectAnchor ? t16.anchor.x : 0, o57 = t16.uvRespectAnchor ? t16.anchor.y : 0;
        (i71 = r67.uvs)[0] = i71[6] = -n62, i71[1] = i71[3] = -o57, i71[2] = i71[4] = 1 - n62, i71[5] = i71[7] = 1 - o57, r67.invalidate();
        var s52 = t16._texture, a56 = s52.baseTexture, h52 = t16.tileTransform.localTransform, u49 = t16.uvMatrix, l42 = a56.isPowerOfTwo && s52.frame.width === a56.width && s52.frame.height === a56.height;
        l42 && (a56._glTextures[e43.CONTEXT_UID] ? l42 = a56.wrapMode !== qt.CLAMP : a56.wrapMode === qt.CLAMP && (a56.wrapMode = qt.REPEAT));
        var c34 = l42 ? this.simpleShader : this.shader, d34 = s52.width, f27 = s52.height, p = t16._width, _15 = t16._height;
        vh.set(h52.a * d34 / p, h52.b * d34 / _15, h52.c * f27 / p, h52.d * f27 / _15, h52.tx / p, h52.ty / _15), vh.invert(), l42 ? vh.prepend(u49.mapCoord) : (c34.uniforms.uMapCoord = u49.mapCoord.toArray(!0), c34.uniforms.uClampFrame = u49.uClampFrame, c34.uniforms.uClampOffset = u49.uClampOffset), c34.uniforms.uTransform = vh.toArray(!0), c34.uniforms.uColor = me(t16.tint, t16.worldAlpha, c34.uniforms.uColor, a56.alphaMode), c34.uniforms.translationMatrix = t16.transform.worldTransform.toArray(!0), c34.uniforms.uSampler = s52, e43.shader.bind(c34), e43.geometry.bind(r67), this.state.blendMode = fe(t16.blendMode, a56.alphaMode), e43.state.set(this.state), e43.geometry.draw(this.renderer.gl.TRIANGLES, 6, 0);
    }, e42;
}(Ei), gh = function(t7, e42) {
    return (gh = Object.setPrototypeOf || ({
        __proto__: []
    }) instanceof Array && function(t16, e43) {
        t16.__proto__ = e43;
    } || function(t16, e43) {
        for(var r67 in e43)e43.hasOwnProperty(r67) && (t16[r67] = e43[r67]);
    })(t7, e42);
};
function bh(t7, e42) {
    function r67() {
        this.constructor = t7;
    }
    gh(t7, e42), t7.prototype = null === e42 ? Object.create(e42) : (r67.prototype = e42.prototype, new r67);
}
var xh = function() {
    function t7(t16, e42) {
        this.uvBuffer = t16, this.uvMatrix = e42, this.data = null, this._bufferUpdateId = -1, this._textureUpdateId = -1, this._updateID = 0;
    }
    return t7.prototype.update = function(t16) {
        if (t16 || this._bufferUpdateId !== this.uvBuffer._updateID || this._textureUpdateId !== this.uvMatrix._updateID) {
            this._bufferUpdateId = this.uvBuffer._updateID, this._textureUpdateId = this.uvMatrix._updateID;
            var e42 = this.uvBuffer.data;
            this.data && this.data.length === e42.length || (this.data = new Float32Array(e42.length)), this.uvMatrix.multiplyUvs(e42, this.data), this._updateID++;
        }
    }, t7;
}(), Th = new We, Eh = new Ve, Ah = function(t7) {
    function e43(e44, r67, i71, n62) {
        (void 0) === n62 && (n62 = Ht.TRIANGLES);
        var o57 = t7.call(this) || this;
        return o57.geometry = e44, e44.refCount++, o57.shader = r67, o57.state = i71 || sn.for2d(), o57.drawMode = n62, o57.start = 0, o57.size = 0, o57.uvs = null, o57.indices = null, o57.vertexData = new Float32Array(1), o57.vertexDirty = 0, o57._transformID = -1, o57._roundPixels = F.ROUND_PIXELS, o57.batchUvs = null, o57;
    }
    return bh(e43, t7), Object.defineProperty(e43.prototype, "uvBuffer", {
        get: function() {
            return this.geometry.buffers[1];
        },
        enumerable: !1,
        configurable: !0
    }), Object.defineProperty(e43.prototype, "verticesBuffer", {
        get: function() {
            return this.geometry.buffers[0];
        },
        enumerable: !1,
        configurable: !0
    }), Object.defineProperty(e43.prototype, "material", {
        get: function() {
            return this.shader;
        },
        set: function(t16) {
            this.shader = t16;
        },
        enumerable: !1,
        configurable: !0
    }), Object.defineProperty(e43.prototype, "blendMode", {
        get: function() {
            return this.state.blendMode;
        },
        set: function(t16) {
            this.state.blendMode = t16;
        },
        enumerable: !1,
        configurable: !0
    }), Object.defineProperty(e43.prototype, "roundPixels", {
        get: function() {
            return this._roundPixels;
        },
        set: function(t16) {
            this._roundPixels !== t16 && (this._transformID = -1), this._roundPixels = t16;
        },
        enumerable: !1,
        configurable: !0
    }), Object.defineProperty(e43.prototype, "tint", {
        get: function() {
            return "tint" in this.shader ? this.shader.tint : null;
        },
        set: function(t16) {
            this.shader.tint = t16;
        },
        enumerable: !1,
        configurable: !0
    }), Object.defineProperty(e43.prototype, "texture", {
        get: function() {
            return "texture" in this.shader ? this.shader.texture : null;
        },
        set: function(t16) {
            this.shader.texture = t16;
        },
        enumerable: !1,
        configurable: !0
    }), e43.prototype._render = function(t16) {
        var r67 = this.geometry.buffers[0].data;
        this.shader.batchable && this.drawMode === Ht.TRIANGLES && r67.length < 2 * e43.BATCHABLE_SIZE ? this._renderToBatch(t16) : this._renderDefault(t16);
    }, e43.prototype._renderDefault = function(t16) {
        var e44 = this.shader;
        e44.alpha = this.worldAlpha, e44.update && e44.update(), t16.batch.flush(), e44.program.uniformData.translationMatrix && (e44.uniforms.translationMatrix = this.transform.worldTransform.toArray(!0)), t16.shader.bind(e44), t16.state.set(this.state), t16.geometry.bind(this.geometry, e44), t16.geometry.draw(this.drawMode, this.size, this.start, this.geometry.instanceCount);
    }, e43.prototype._renderToBatch = function(t16) {
        var e44 = this.geometry, r67 = this.shader;
        r67.uvMatrix && (r67.uvMatrix.update(), this.calculateUvs()), this.calculateVertices(), this.indices = e44.indexBuffer.data, this._tintRGB = r67._tintRGB, this._texture = r67.texture;
        var i71 = this.material.pluginName;
        t16.batch.setObjectRenderer(t16.plugins[i71]), t16.plugins[i71].render(this);
    }, e43.prototype.calculateVertices = function() {
        var t16 = this.geometry, e44 = t16.buffers[0].data;
        if (t16.vertexDirtyId !== this.vertexDirty || this._transformID !== this.transform._worldID) {
            this._transformID = this.transform._worldID, this.vertexData.length !== e44.length && (this.vertexData = new Float32Array(e44.length));
            for(var r67 = this.transform.worldTransform, i71 = r67.a, n62 = r67.b, o57 = r67.c, s52 = r67.d, a56 = r67.tx, h52 = r67.ty, u49 = this.vertexData, l42 = 0; l42 < u49.length / 2; l42++){
                var c34 = e44[2 * l42], d34 = e44[2 * l42 + 1];
                u49[2 * l42] = i71 * c34 + o57 * d34 + a56, u49[2 * l42 + 1] = n62 * c34 + s52 * d34 + h52;
            }
            if (this._roundPixels) {
                var f27 = F.RESOLUTION;
                for(l42 = 0; l42 < u49.length; ++l42)u49[l42] = Math.round((u49[l42] * f27 | 0) / f27);
            }
            this.vertexDirty = t16.vertexDirtyId;
        }
    }, e43.prototype.calculateUvs = function() {
        var t16 = this.geometry.buffers[1], e44 = this.shader;
        e44.uvMatrix.isSimple ? this.uvs = t16.data : (this.batchUvs || (this.batchUvs = new xh(t16, e44.uvMatrix)), this.batchUvs.update(), this.uvs = this.batchUvs.data);
    }, e43.prototype._calculateBounds = function() {
        this.calculateVertices(), this._bounds.addVertexData(this.vertexData, 0, this.vertexData.length);
    }, e43.prototype.containsPoint = function(t16) {
        if (!this.getBounds().contains(t16.x, t16.y)) return !1;
        this.worldTransform.applyInverse(t16, Th);
        for(var e44 = this.geometry.getBuffer("aVertexPosition").data, r68 = Eh.points, i73 = this.geometry.getIndex().data, n63 = i73.length, o58 = 4 === this.drawMode ? 3 : 1, s53 = 0; s53 + 2 < n63; s53 += o58){
            var a57 = 2 * i73[s53], h53 = 2 * i73[s53 + 1], u50 = 2 * i73[s53 + 2];
            if (r68[0] = e44[a57], r68[1] = e44[a57 + 1], r68[2] = e44[h53], r68[3] = e44[h53 + 1], r68[4] = e44[u50], r68[5] = e44[u50 + 1], Eh.contains(Th.x, Th.y)) return !0;
        }
        return !1;
    }, e43.prototype.destroy = function(e44) {
        t7.prototype.destroy.call(this, e44), this.geometry.refCount--, 0 === this.geometry.refCount && this.geometry.dispose(), this._cachedTexture && (this._cachedTexture.destroy(), this._cachedTexture = null), this.geometry = null, this.shader = null, this.state = null, this.uvs = null, this.indices = null, this.vertexData = null;
    }, e43.BATCHABLE_SIZE = 100, e43;
}(cr), Sh = "varying vec2 vTextureCoord;\nuniform vec4 uColor;\n\nuniform sampler2D uSampler;\n\nvoid main(void)\n{\n    gl_FragColor = texture2D(uSampler, vTextureCoord) * uColor;\n}\n", Oh = "attribute vec2 aVertexPosition;\nattribute vec2 aTextureCoord;\n\nuniform mat3 projectionMatrix;\nuniform mat3 translationMatrix;\nuniform mat3 uTextureMatrix;\n\nvarying vec2 vTextureCoord;\n\nvoid main(void)\n{\n    gl_Position = vec4((projectionMatrix * translationMatrix * vec3(aVertexPosition, 1.0)).xy, 0.0, 1.0);\n\n    vTextureCoord = (uTextureMatrix * vec3(aTextureCoord, 1.0)).xy;\n}\n", Rh = function(t7) {
    function e43(e44, r68) {
        var i73 = this, n63 = {
            uSampler: e44,
            alpha: 1,
            uTextureMatrix: Ke.IDENTITY,
            uColor: new Float32Array([
                1,
                1,
                1,
                1
            ])
        };
        return (r68 = Object.assign({
            tint: 16777215,
            alpha: 1,
            pluginName: "batch"
        }, r68)).uniforms && Object.assign(n63, r68.uniforms), (i73 = t7.call(this, r68.program || nn.from(Oh, Sh), n63) || this)._colorDirty = !1, i73.uvMatrix = new cn(e44), i73.batchable = (void 0) === r68.program, i73.pluginName = r68.pluginName, i73.tint = r68.tint, i73.alpha = r68.alpha, i73;
    }
    return bh(e43, t7), Object.defineProperty(e43.prototype, "texture", {
        get: function() {
            return this.uniforms.uSampler;
        },
        set: function(t16) {
            this.uniforms.uSampler !== t16 && (this.uniforms.uSampler = t16, this.uvMatrix.texture = t16);
        },
        enumerable: !1,
        configurable: !0
    }), Object.defineProperty(e43.prototype, "alpha", {
        get: function() {
            return this._alpha;
        },
        set: function(t16) {
            t16 !== this._alpha && (this._alpha = t16, this._colorDirty = !0);
        },
        enumerable: !1,
        configurable: !0
    }), Object.defineProperty(e43.prototype, "tint", {
        get: function() {
            return this._tint;
        },
        set: function(t16) {
            t16 !== this._tint && (this._tint = t16, this._tintRGB = (t16 >> 16) + (65280 & t16) + ((255 & t16) << 16), this._colorDirty = !0);
        },
        enumerable: !1,
        configurable: !0
    }), e43.prototype.update = function() {
        if (this._colorDirty) {
            this._colorDirty = !1;
            var t16 = this.texture.baseTexture;
            me(this._tint, this._alpha, this.uniforms.uColor, t16.alphaMode);
        }
        this.uvMatrix.update() && (this.uniforms.uTextureMatrix = this.uvMatrix.mapCoord);
    }, e43;
}(on), wh = function(t7) {
    function e43(e44, r68, i73) {
        var n63 = t7.call(this) || this, o58 = new hi(e44), s53 = new hi(r68, !0), a58 = new hi(i73, !0, !0);
        return n63.addAttribute("aVertexPosition", o58, 2, !1, zt.FLOAT).addAttribute("aTextureCoord", s53, 2, !1, zt.FLOAT).addIndex(a58), n63._updateId = -1, n63;
    }
    return bh(e43, t7), Object.defineProperty(e43.prototype, "vertexDirtyId", {
        get: function() {
            return this.buffers[0]._updateID;
        },
        enumerable: !1,
        configurable: !0
    }), e43;
}(pi), Ph = function(t7, e43) {
    return (Ph = Object.setPrototypeOf || ({
        __proto__: []
    }) instanceof Array && function(t17, e44) {
        t17.__proto__ = e44;
    } || function(t17, e44) {
        for(var r68 in e44)e44.hasOwnProperty(r68) && (t17[r68] = e44[r68]);
    })(t7, e43);
}, Ih = function() {
    this.info = [], this.common = [], this.page = [], this.char = [], this.kerning = [];
}, Mh = function() {
    function t7() {
    }
    return t7.test = function(t17) {
        return "string" == typeof t17 && 0 === t17.indexOf("info face=");
    }, t7.parse = function(t17) {
        var e43 = t17.match(/^[a-z]+\s+.+$/gm), r68 = {
            info: [],
            common: [],
            page: [],
            char: [],
            chars: [],
            kerning: [],
            kernings: []
        };
        for(var i73 in e43){
            var n63 = e43[i73].match(/^[a-z]+/gm)[0], o58 = e43[i73].match(/[a-zA-Z]+=([^\s"']+|"([^"]*)")/gm), s53 = {
            };
            for(var a58 in o58){
                var h54 = o58[a58].split("="), u51 = h54[0], l43 = h54[1].replace(/"/gm, ""), c35 = parseFloat(l43), d35 = isNaN(c35) ? l43 : c35;
                s53[u51] = d35;
            }
            r68[n63].push(s53);
        }
        var f28 = new Ih;
        return r68.info.forEach(function(t18) {
            return f28.info.push({
                face: t18.face,
                size: parseInt(t18.size, 10)
            });
        }), r68.common.forEach(function(t18) {
            return f28.common.push({
                lineHeight: parseInt(t18.lineHeight, 10)
            });
        }), r68.page.forEach(function(t18) {
            return f28.page.push({
                id: parseInt(t18.id, 10),
                file: t18.file
            });
        }), r68.char.forEach(function(t18) {
            return f28.char.push({
                id: parseInt(t18.id, 10),
                page: parseInt(t18.page, 10),
                x: parseInt(t18.x, 10),
                y: parseInt(t18.y, 10),
                width: parseInt(t18.width, 10),
                height: parseInt(t18.height, 10),
                xoffset: parseInt(t18.xoffset, 10),
                yoffset: parseInt(t18.yoffset, 10),
                xadvance: parseInt(t18.xadvance, 10)
            });
        }), r68.kerning.forEach(function(t18) {
            return f28.kerning.push({
                first: parseInt(t18.first, 10),
                second: parseInt(t18.second, 10),
                amount: parseInt(t18.amount, 10)
            });
        }), f28;
    }, t7;
}(), Dh = function() {
    function t7() {
    }
    return t7.test = function(t17) {
        return t17 instanceof XMLDocument && t17.getElementsByTagName("page").length && null !== t17.getElementsByTagName("info")[0].getAttribute("face");
    }, t7.parse = function(t17) {
        for(var e43 = new Ih, r68 = t17.getElementsByTagName("info"), i73 = t17.getElementsByTagName("common"), n64 = t17.getElementsByTagName("page"), o59 = t17.getElementsByTagName("char"), s54 = t17.getElementsByTagName("kerning"), a59 = 0; a59 < r68.length; a59++)e43.info.push({
            face: r68[a59].getAttribute("face"),
            size: parseInt(r68[a59].getAttribute("size"), 10)
        });
        for(a59 = 0; a59 < i73.length; a59++)e43.common.push({
            lineHeight: parseInt(i73[a59].getAttribute("lineHeight"), 10)
        });
        for(a59 = 0; a59 < n64.length; a59++)e43.page.push({
            id: parseInt(n64[a59].getAttribute("id"), 10) || 0,
            file: n64[a59].getAttribute("file")
        });
        for(a59 = 0; a59 < o59.length; a59++){
            var h55 = o59[a59];
            e43.char.push({
                id: parseInt(h55.getAttribute("id"), 10),
                page: parseInt(h55.getAttribute("page"), 10) || 0,
                x: parseInt(h55.getAttribute("x"), 10),
                y: parseInt(h55.getAttribute("y"), 10),
                width: parseInt(h55.getAttribute("width"), 10),
                height: parseInt(h55.getAttribute("height"), 10),
                xoffset: parseInt(h55.getAttribute("xoffset"), 10),
                yoffset: parseInt(h55.getAttribute("yoffset"), 10),
                xadvance: parseInt(h55.getAttribute("xadvance"), 10)
            });
        }
        for(a59 = 0; a59 < s54.length; a59++)e43.kerning.push({
            first: parseInt(s54[a59].getAttribute("first"), 10),
            second: parseInt(s54[a59].getAttribute("second"), 10),
            amount: parseInt(s54[a59].getAttribute("amount"), 10)
        });
        return e43;
    }, t7;
}(), Ch = function() {
    function t7() {
    }
    return t7.test = function(t17) {
        if ("string" == typeof t17 && t17.indexOf("<font>") > -1) {
            var e43 = (new self.DOMParser).parseFromString(t17, "text/xml");
            return Dh.test(e43);
        }
        return !1;
    }, t7.parse = function(t17) {
        var e44 = (new self.DOMParser).parseFromString(t17, "text/xml");
        return Dh.parse(e44);
    }, t7;
}(), Nh = [
    Mh,
    Dh,
    Ch
];
function Lh(t7) {
    for(var e44 = 0; e44 < Nh.length; e44++)if (Nh[e44].test(t7)) return Nh[e44];
    return null;
}
function Fh(t7, e44, r68, i73, n64, o59) {
    var s54, a59 = r68.fill;
    if (!Array.isArray(a59)) return a59;
    if (1 === a59.length) return a59[0];
    var h56 = r68.dropShadow ? r68.dropShadowDistance : 0, u52 = r68.padding || 0, l44 = Math.ceil(t7.width / i73) - h56 - 2 * u52, c36 = Math.ceil(t7.height / i73) - h56 - 2 * u52, d36 = a59.slice(), f28 = r68.fillGradientStops.slice();
    if (!f28.length) for(var p = d36.length + 1, _15 = 1; _15 < p; ++_15)f28.push(_15 / p);
    if (d36.unshift(a59[0]), f28.unshift(0), d36.push(a59[a59.length - 1]), f28.push(1), r68.fillGradientType === _a.LINEAR_VERTICAL) {
        s54 = e44.createLinearGradient(l44 / 2, u52, l44 / 2, c36 + u52);
        var m13 = 0, v11 = (o59.fontProperties.fontSize + r68.strokeThickness) / c36;
        for(_15 = 0; _15 < n64.length; _15++)for(var y = o59.lineHeight * _15, g11 = 0; g11 < d36.length; g11++){
            var b10 = y / c36 + ("number" == typeof f28[g11] ? f28[g11] : g11 / d36.length) * v11, x6 = Math.max(m13, b10);
            x6 = Math.min(x6, 1), s54.addColorStop(x6, d36[g11]), m13 = x6;
        }
    } else {
        s54 = e44.createLinearGradient(u52, c36 / 2, l44 + u52, c36 / 2);
        var T6 = d36.length + 1, E6 = 1;
        for(_15 = 0; _15 < d36.length; _15++){
            var A5;
            A5 = "number" == typeof f28[_15] ? f28[_15] : E6 / T6, s54.addColorStop(A5, d36[_15]), E6++;
        }
    }
    return s54;
}
function Bh(t7, e44, r68, i73, n64, o59, s54) {
    var a59 = r68.text, h56 = r68.fontProperties;
    e44.translate(i73, n64), e44.scale(o59, o59);
    var u52 = s54.strokeThickness / 2, l44 = -s54.strokeThickness / 2;
    e44.font = s54.toFontString(), e44.lineWidth = s54.strokeThickness, e44.textBaseline = s54.textBaseline, e44.lineJoin = s54.lineJoin, e44.miterLimit = s54.miterLimit, e44.fillStyle = Fh(t7, e44, s54, o59, [
        a59
    ], r68), e44.strokeStyle = s54.stroke, e44.font = s54.toFontString(), e44.lineWidth = s54.strokeThickness, e44.textBaseline = s54.textBaseline, e44.lineJoin = s54.lineJoin, e44.miterLimit = s54.miterLimit, e44.fillStyle = Fh(t7, e44, s54, o59, [
        a59
    ], r68), e44.strokeStyle = s54.stroke;
    var c36 = s54.dropShadowColor, d36 = ue("number" == typeof c36 ? c36 : ce(c36));
    s54.dropShadow ? (e44.shadowColor = "rgba(" + 255 * d36[0] + "," + 255 * d36[1] + "," + 255 * d36[2] + "," + s54.dropShadowAlpha + ")", e44.shadowBlur = s54.dropShadowBlur, e44.shadowOffsetX = Math.cos(s54.dropShadowAngle) * s54.dropShadowDistance, e44.shadowOffsetY = Math.sin(s54.dropShadowAngle) * s54.dropShadowDistance) : (e44.shadowColor = "black", e44.shadowBlur = 0, e44.shadowOffsetX = 0, e44.shadowOffsetY = 0), s54.stroke && s54.strokeThickness && e44.strokeText(a59, u52, l44 + r68.lineHeight - h56.descent), s54.fill && e44.fillText(a59, u52, l44 + r68.lineHeight - h56.descent), e44.setTransform(1, 0, 0, 1, 0, 0), e44.fillStyle = "rgba(0, 0, 0, 0)";
}
var Uh = function() {
    function t7(t17, e44, r68) {
        var i73 = t17.info[0], n64 = t17.common[0], o59 = Fe(t17.page[0].file), s54 = {
        };
        this._ownsTextures = r68, this.font = i73.face, this.size = i73.size, this.lineHeight = n64.lineHeight / o59, this.chars = {
        }, this.pageTextures = s54;
        for(var a59 = 0; a59 < t17.page.length; a59++){
            var h56 = t17.page[a59], u52 = h56.id, l44 = h56.file;
            s54[u52] = e44 instanceof Array ? e44[a59] : e44[l44];
        }
        for(a59 = 0; a59 < t17.char.length; a59++){
            var c36 = t17.char[a59], d36 = (u52 = c36.id, c36.page), f28 = t17.char[a59], p = f28.x, _15 = f28.y, m14 = f28.width, v12 = f28.height, y = f28.xoffset, g12 = f28.yoffset, b11 = f28.xadvance;
            _15 /= o59, m14 /= o59, v12 /= o59, y /= o59, g12 /= o59, b11 /= o59;
            var x7 = new je((p /= o59) + s54[d36].frame.x / o59, _15 + s54[d36].frame.y / o59, m14, v12);
            this.chars[u52] = {
                xOffset: y,
                yOffset: g12,
                xAdvance: b11,
                kerning: {
                },
                texture: new ri(s54[d36].baseTexture, x7),
                page: d36
            };
        }
        for(a59 = 0; a59 < t17.kerning.length; a59++){
            var T7 = t17.kerning[a59], E7 = T7.first, A6 = T7.second, S6 = T7.amount;
            E7 /= o59, A6 /= o59, S6 /= o59, this.chars[A6] && (this.chars[A6].kerning[E7] = S6);
        }
    }
    return t7.prototype.destroy = function() {
        for(var t17 in this.chars)this.chars[t17].texture.destroy(), this.chars[t17].texture = null;
        for(var t17 in this.pageTextures)this._ownsTextures && this.pageTextures[t17].destroy(!0), this.pageTextures[t17] = null;
        this.chars = null, this.pageTextures = null;
    }, t7.install = function(e44, r68, i73) {
        var n64;
        if (e44 instanceof Ih) n64 = e44;
        else {
            var o59 = Lh(e44);
            if (!o59) throw new Error("Unrecognized data format for font.");
            n64 = o59.parse(e44);
        }
        r68 instanceof ri && (r68 = [
            r68
        ]);
        var s54 = new t7(n64, r68, i73);
        return t7.available[s54.font] = s54, s54;
    }, t7.uninstall = function(e44) {
        var r68 = t7.available[e44];
        if (!r68) throw new Error("No font found named '" + e44 + "'");
        r68.destroy(), delete t7.available[e44];
    }, t7.from = function(e44, r68, i73) {
        if (!e44) throw new Error("[BitmapFont] Property `name` is required.");
        var n64 = Object.assign({
        }, t7.defaultOptions, i73), o60 = n64.chars, s54 = n64.padding, a59 = n64.resolution, h57 = n64.textureWidth, u53 = n64.textureHeight, l45 = function(t17) {
            "string" == typeof t17 && (t17 = [
                t17
            ]);
            for(var e45 = [], r69 = 0, i74 = t17.length; r69 < i74; r69++){
                var n65 = t17[r69];
                if (Array.isArray(n65)) {
                    if (2 !== n65.length) throw new Error("[BitmapFont]: Invalid character range length, expecting 2 got " + n65.length + ".");
                    var o61 = n65[0].charCodeAt(0), s55 = n65[1].charCodeAt(0);
                    if (s55 < o61) throw new Error("[BitmapFont]: Invalid character range.");
                    for(var a60 = o61, h58 = s55; a60 <= h58; a60++)e45.push(String.fromCharCode(a60));
                } else e45.push.apply(e45, n65.split(""));
            }
            if (0 === e45.length) throw new Error("[BitmapFont]: Empty set when resolving characters.");
            return e45;
        }(o60), c37 = r68 instanceof Ga ? r68 : new Ga(r68), d37 = h57, f29 = new Ih;
        f29.info[0] = {
            face: c37.fontFamily,
            size: c37.fontSize
        }, f29.common[0] = {
            lineHeight: c37.fontSize
        };
        for(var p, _16, m15, v13 = 0, y = 0, g13 = 0, b12 = [], x8 = 0; x8 < l45.length; x8++){
            p || ((p = document.createElement("canvas")).width = h57, p.height = u53, _16 = p.getContext("2d"), m15 = new Gr(p, {
                resolution: a59
            }), b12.push(new ri(m15)), f29.page.push({
                id: b12.length - 1,
                file: ""
            }));
            var T8 = Ha.measureText(l45[x8], c37, !1, p), E8 = T8.width, A7 = Math.ceil(T8.height), S7 = Math.ceil(("italic" === c37.fontStyle ? 2 : 1) * E8);
            if (y >= u53 - A7 * a59) {
                if (0 === y) throw new Error("[BitmapFont] textureHeight " + u53 + "px is too small for " + c37.fontSize + "px fonts");
                --x8, p = null, _16 = null, m15 = null, y = 0, v13 = 0, g13 = 0;
            } else if (g13 = Math.max(A7 + T8.fontProperties.descent, g13), S7 * a59 + v13 >= d37) --x8, y += g13 * a59, y = Math.ceil(y), v13 = 0, g13 = 0;
            else {
                Bh(p, _16, T8, v13, y, a59, c37);
                var O5 = T8.text.charCodeAt(0);
                f29.char.push({
                    id: O5,
                    page: b12.length - 1,
                    x: v13 / a59,
                    y: y / a59,
                    width: S7,
                    height: A7,
                    xoffset: 0,
                    yoffset: 0,
                    xadvance: Math.ceil(E8 - (c37.dropShadow ? c37.dropShadowDistance : 0) - (c37.stroke ? c37.strokeThickness : 0))
                }), v13 += (S7 + 2 * s54) * a59, v13 = Math.ceil(v13);
            }
        }
        x8 = 0;
        for(var R6 = l45.length; x8 < R6; x8++)for(var w6 = l45[x8], P5 = 0; P5 < R6; P5++){
            var I3 = l45[P5], M2 = _16.measureText(w6).width, D4 = _16.measureText(I3).width, C2 = _16.measureText(w6 + I3).width - (M2 + D4);
            C2 && f29.kerning.push({
                first: w6.charCodeAt(0),
                second: I3.charCodeAt(0),
                amount: C2
            });
        }
        var N2 = new t7(f29, b12, !0);
        return (void 0) !== t7.available[e44] && t7.uninstall(e44), t7.available[e44] = N2, N2;
    }, t7.ALPHA = [
        [
            "a",
            "z"
        ],
        [
            "A",
            "Z"
        ],
        " "
    ], t7.NUMERIC = [
        [
            "0",
            "9"
        ]
    ], t7.ALPHANUMERIC = [
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
    ], t7.ASCII = [
        [
            " ",
            "~"
        ]
    ], t7.defaultOptions = {
        resolution: 1,
        textureWidth: 512,
        textureHeight: 512,
        padding: 4,
        chars: t7.ALPHANUMERIC
    }, t7.available = {
    }, t7;
}(), Gh = [], Xh = [], kh = function(t7) {
    function e44(r68, i73) {
        (void 0) === i73 && (i73 = {
        });
        var n64 = t7.call(this) || this;
        n64._tint = 16777215;
        var o60 = Object.assign({
        }, e44.styleDefaults, i73), s54 = o60.align, a59 = o60.tint, h57 = o60.maxWidth, u53 = o60.letterSpacing, l45 = o60.fontName, c37 = o60.fontSize;
        if (!Uh.available[l45]) throw new Error('Missing BitmapFont "' + l45 + '"');
        return n64._activePagesMeshData = [], n64._textWidth = 0, n64._textHeight = 0, n64._align = s54, n64._tint = a59, n64._fontName = l45, n64._fontSize = c37 || Uh.available[l45].size, n64._text = r68, n64._maxWidth = h57, n64._maxLineHeight = 0, n64._letterSpacing = u53, n64._anchor = new qe(function() {
            n64.dirty = !0;
        }, n64, 0, 0), n64._roundPixels = F.ROUND_PIXELS, n64.dirty = !0, n64._textureCache = {
        }, n64;
    }
    return (function(t17, e45) {
        function r68() {
            this.constructor = t17;
        }
        Ph(t17, e45), t17.prototype = null === e45 ? Object.create(e45) : (r68.prototype = e45.prototype, new r68);
    })(e44, t7), e44.prototype.updateText = function() {
        for(var t17, e45 = Uh.available[this._fontName], r68 = this._fontSize / e45.size, i73 = new We, n64 = [], o60 = [], s54 = [], a59 = this._text.replace(/(?:\r\n|\r)/g, "\n") || " ", h57 = a59.length, u53 = this._maxWidth * e45.size / this._fontSize, l45 = null, c37 = 0, d37 = 0, f29 = 0, p = -1, _16 = 0, m15 = 0, v13 = 0, y = 0, g13 = 0; g13 < h57; g13++){
            var b12 = a59.charCodeAt(g13), x8 = a59.charAt(g13);
            if (/(?:\s)/.test(x8) && (p = g13, _16 = c37, y++), "\r" !== x8 && "\n" !== x8) {
                var T9 = e45.chars[b12];
                if (T9) {
                    l45 && T9.kerning[l45] && (i73.x += T9.kerning[l45]);
                    var E9 = Xh.pop() || {
                        texture: ri.EMPTY,
                        line: 0,
                        charCode: 0,
                        prevSpaces: 0,
                        position: new We
                    };
                    E9.texture = T9.texture, E9.line = f29, E9.charCode = b12, E9.position.x = i73.x + T9.xOffset + this._letterSpacing / 2, E9.position.y = i73.y + T9.yOffset, E9.prevSpaces = y, n64.push(E9), i73.x += T9.xAdvance + this._letterSpacing, c37 = i73.x, v13 = Math.max(v13, T9.yOffset + T9.texture.height), l45 = b12, -1 !== p && u53 > 0 && i73.x > u53 && (Ee(n64, 1 + p - ++m15, 1 + g13 - p), g13 = p, p = -1, o60.push(_16), s54.push(n64.length > 0 ? n64[n64.length - 1].prevSpaces : 0), d37 = Math.max(d37, _16), f29++, i73.x = 0, i73.y += e45.lineHeight, l45 = null, y = 0);
                }
            } else o60.push(c37), s54.push(-1), d37 = Math.max(d37, c37), ++f29, ++m15, i73.x = 0, i73.y += e45.lineHeight, l45 = null, y = 0;
        }
        var A8 = a59.charAt(a59.length - 1);
        "\r" !== A8 && "\n" !== A8 && (/(?:\s)/.test(A8) && (c37 = _16), o60.push(c37), d37 = Math.max(d37, c37), s54.push(-1));
        var S8 = [];
        for(g13 = 0; g13 <= f29; g13++){
            var O6 = 0;
            "right" === this._align ? O6 = d37 - o60[g13] : "center" === this._align ? O6 = (d37 - o60[g13]) / 2 : "justify" === this._align && (O6 = s54[g13] < 0 ? 0 : (d37 - o60[g13]) / s54[g13]), S8.push(O6);
        }
        var R6 = n64.length, w6 = {
        }, P5 = [], I4 = this._activePagesMeshData;
        for(g13 = 0; g13 < I4.length; g13++)Gh.push(I4[g13]);
        for(g13 = 0; g13 < R6; g13++){
            var M3 = (X3 = n64[g13].texture).baseTexture.uid;
            if (!w6[M3]) {
                if (!(W3 = Gh.pop())) {
                    var D5 = new wh, C3 = new Rh(ri.EMPTY);
                    W3 = {
                        index: 0,
                        indexCount: 0,
                        vertexCount: 0,
                        uvsCount: 0,
                        total: 0,
                        mesh: new Ah(D5, C3),
                        vertices: null,
                        uvs: null,
                        indices: null
                    };
                }
                W3.index = 0, W3.indexCount = 0, W3.vertexCount = 0, W3.uvsCount = 0, W3.total = 0;
                var N2 = this._textureCache;
                N2[M3] = N2[M3] || new ri(X3.baseTexture), W3.mesh.texture = N2[M3], W3.mesh.tint = this._tint, P5.push(W3), w6[M3] = W3;
            }
            w6[M3].total++;
        }
        for(g13 = 0; g13 < I4.length; g13++)-1 === P5.indexOf(I4[g13]) && this.removeChild(I4[g13].mesh);
        for(g13 = 0; g13 < P5.length; g13++)P5[g13].mesh.parent !== this && this.addChild(P5[g13].mesh);
        for(var g13 in this._activePagesMeshData = P5, w6){
            var L2 = (W3 = w6[g13]).total;
            if (!((null === (t17 = W3.indices) || (void 0) === t17 ? void 0 : t17.length) > 6 * L2) || W3.vertices.length < 2 * Ah.BATCHABLE_SIZE) W3.vertices = new Float32Array(8 * L2), W3.uvs = new Float32Array(8 * L2), W3.indices = new Uint16Array(6 * L2);
            else for(var F2 = W3.total, B2 = W3.vertices, U2 = 4 * F2 * 2; U2 < B2.length; U2++)B2[U2] = 0;
            W3.mesh.size = 6 * L2;
        }
        for(g13 = 0; g13 < R6; g13++){
            var G2 = (x8 = n64[g13]).position.x + S8[x8.line] * ("justify" === this._align ? x8.prevSpaces : 1);
            this._roundPixels && (G2 = Math.round(G2));
            var X3, k2 = G2 * r68, j2 = x8.position.y * r68, H2 = w6[(X3 = x8.texture).baseTexture.uid], Y2 = X3.frame, V2 = X3._uvs, z2 = H2.index++;
            H2.indices[6 * z2 + 0] = 0 + 4 * z2, H2.indices[6 * z2 + 1] = 1 + 4 * z2, H2.indices[6 * z2 + 2] = 2 + 4 * z2, H2.indices[6 * z2 + 3] = 0 + 4 * z2, H2.indices[6 * z2 + 4] = 2 + 4 * z2, H2.indices[6 * z2 + 5] = 3 + 4 * z2, H2.vertices[8 * z2 + 0] = k2, H2.vertices[8 * z2 + 1] = j2, H2.vertices[8 * z2 + 2] = k2 + Y2.width * r68, H2.vertices[8 * z2 + 3] = j2, H2.vertices[8 * z2 + 4] = k2 + Y2.width * r68, H2.vertices[8 * z2 + 5] = j2 + Y2.height * r68, H2.vertices[8 * z2 + 6] = k2, H2.vertices[8 * z2 + 7] = j2 + Y2.height * r68, H2.uvs[8 * z2 + 0] = V2.x0, H2.uvs[8 * z2 + 1] = V2.y0, H2.uvs[8 * z2 + 2] = V2.x1, H2.uvs[8 * z2 + 3] = V2.y1, H2.uvs[8 * z2 + 4] = V2.x2, H2.uvs[8 * z2 + 5] = V2.y2, H2.uvs[8 * z2 + 6] = V2.x3, H2.uvs[8 * z2 + 7] = V2.y3;
        }
        for(var g13 in this._textWidth = d37 * r68, this._textHeight = (i73.y + e45.lineHeight) * r68, w6){
            var W3 = w6[g13];
            if (0 !== this.anchor.x || 0 !== this.anchor.y) for(var q2 = 0, K2 = this._textWidth * this.anchor.x, Z2 = this._textHeight * this.anchor.y, J2 = 0; J2 < W3.total; J2++)W3.vertices[q2++] -= K2, W3.vertices[q2++] -= Z2, W3.vertices[q2++] -= K2, W3.vertices[q2++] -= Z2, W3.vertices[q2++] -= K2, W3.vertices[q2++] -= Z2, W3.vertices[q2++] -= K2, W3.vertices[q2++] -= Z2;
            this._maxLineHeight = v13 * r68;
            var Q1 = W3.mesh.geometry.getBuffer("aVertexPosition"), $1 = W3.mesh.geometry.getBuffer("aTextureCoord"), tt1 = W3.mesh.geometry.getIndex();
            Q1.data = W3.vertices, $1.data = W3.uvs, tt1.data = W3.indices, Q1.update(), $1.update(), tt1.update();
        }
        for(g13 = 0; g13 < n64.length; g13++)Xh.push(n64[g13]);
    }, e44.prototype.updateTransform = function() {
        this.validate(), this.containerUpdateTransform();
    }, e44.prototype.getLocalBounds = function() {
        return this.validate(), t7.prototype.getLocalBounds.call(this);
    }, e44.prototype.validate = function() {
        this.dirty && (this.updateText(), this.dirty = !1);
    }, Object.defineProperty(e44.prototype, "tint", {
        get: function() {
            return this._tint;
        },
        set: function(t17) {
            if (this._tint !== t17) {
                this._tint = t17;
                for(var e45 = 0; e45 < this._activePagesMeshData.length; e45++)this._activePagesMeshData[e45].mesh.tint = t17;
            }
        },
        enumerable: !1,
        configurable: !0
    }), Object.defineProperty(e44.prototype, "align", {
        get: function() {
            return this._align;
        },
        set: function(t17) {
            this._align !== t17 && (this._align = t17, this.dirty = !0);
        },
        enumerable: !1,
        configurable: !0
    }), Object.defineProperty(e44.prototype, "fontName", {
        get: function() {
            return this._fontName;
        },
        set: function(t17) {
            if (!Uh.available[t17]) throw new Error('Missing BitmapFont "' + t17 + '"');
            this._fontName !== t17 && (this._fontName = t17, this.dirty = !0);
        },
        enumerable: !1,
        configurable: !0
    }), Object.defineProperty(e44.prototype, "fontSize", {
        get: function() {
            return this._fontSize;
        },
        set: function(t17) {
            this._fontSize !== t17 && (this._fontSize = t17, this.dirty = !0);
        },
        enumerable: !1,
        configurable: !0
    }), Object.defineProperty(e44.prototype, "anchor", {
        get: function() {
            return this._anchor;
        },
        set: function(t17) {
            "number" == typeof t17 ? this._anchor.set(t17) : this._anchor.copyFrom(t17);
        },
        enumerable: !1,
        configurable: !0
    }), Object.defineProperty(e44.prototype, "text", {
        get: function() {
            return this._text;
        },
        set: function(t17) {
            t17 = String(null == t17 ? "" : t17), this._text !== t17 && (this._text = t17, this.dirty = !0);
        },
        enumerable: !1,
        configurable: !0
    }), Object.defineProperty(e44.prototype, "maxWidth", {
        get: function() {
            return this._maxWidth;
        },
        set: function(t17) {
            this._maxWidth !== t17 && (this._maxWidth = t17, this.dirty = !0);
        },
        enumerable: !1,
        configurable: !0
    }), Object.defineProperty(e44.prototype, "maxLineHeight", {
        get: function() {
            return this.validate(), this._maxLineHeight;
        },
        enumerable: !1,
        configurable: !0
    }), Object.defineProperty(e44.prototype, "textWidth", {
        get: function() {
            return this.validate(), this._textWidth;
        },
        enumerable: !1,
        configurable: !0
    }), Object.defineProperty(e44.prototype, "letterSpacing", {
        get: function() {
            return this._letterSpacing;
        },
        set: function(t17) {
            this._letterSpacing !== t17 && (this._letterSpacing = t17, this.dirty = !0);
        },
        enumerable: !1,
        configurable: !0
    }), Object.defineProperty(e44.prototype, "roundPixels", {
        get: function() {
            return this._roundPixels;
        },
        set: function(t17) {
            t17 !== this._roundPixels && (this._roundPixels = t17, this.dirty = !0);
        },
        enumerable: !1,
        configurable: !0
    }), Object.defineProperty(e44.prototype, "textHeight", {
        get: function() {
            return this.validate(), this._textHeight;
        },
        enumerable: !1,
        configurable: !0
    }), e44.prototype.destroy = function(e46) {
        var r68 = this._textureCache;
        for(var i73 in r68)r68[i73].destroy(), delete r68[i73];
        this._textureCache = null, t7.prototype.destroy.call(this, e46);
    }, e44.styleDefaults = {
        align: "left",
        tint: 16777215,
        maxWidth: 0,
        letterSpacing: 0
    }, e44;
}(cr), jh = function() {
    function t7() {
    }
    return t7.add = function() {
        Lo.setExtensionXhrType("fnt", Lo.XHR_RESPONSE_TYPE.TEXT);
    }, t7.use = function(e44, r68) {
        var i73 = Lh(e44.data);
        if (i73) for(var n64 = t7.getBaseUrl(this, e44), o60 = i73.parse(e44.data), s54 = {
        }, a59 = function(t17) {
            s54[t17.metadata.pageFile] = t17.texture, Object.keys(s54).length === o60.page.length && (e44.bitmapFont = Uh.install(o60, s54, !0), r68());
        }, h57 = 0; h57 < o60.page.length; ++h57){
            var u53 = o60.page[h57].file, l45 = n64 + u53, c37 = !1;
            for(var d37 in this.resources){
                var f29 = this.resources[d37];
                if (f29.url === l45) {
                    f29.metadata.pageFile = u53, f29.texture ? a59(f29) : f29.onAfterMiddleware.add(a59), c37 = !0;
                    break;
                }
            }
            if (!c37) {
                var p = {
                    crossOrigin: e44.crossOrigin,
                    loadType: Lo.LOAD_TYPE.IMAGE,
                    metadata: Object.assign({
                        pageFile: u53
                    }, e44.metadata.imageMetadata),
                    parentResource: e44
                };
                this.add(l45, p, a59);
            }
        }
        else r68();
    }, t7.getBaseUrl = function(e44, r68) {
        var i73 = r68.isDataUrl ? "" : t7.dirname(r68.url);
        return r68.isDataUrl && ("." === i73 && (i73 = ""), e44.baseUrl && i73 && "/" === e44.baseUrl.charAt(e44.baseUrl.length - 1) && (i73 += "/")), (i73 = i73.replace(e44.baseUrl, "")) && "/" !== i73.charAt(i73.length - 1) && (i73 += "/"), i73;
    }, t7.dirname = function(t17) {
        var e44 = t17.replace(/\\/g, "/").replace(/\/$/, "").replace(/\/[^\/]*$/, "");
        return e44 === t17 ? "." : "" === e44 ? "/" : e44;
    }, t7;
}(), Hh = function(t7, e44) {
    return (Hh = Object.setPrototypeOf || ({
        __proto__: []
    }) instanceof Array && function(t17, e46) {
        t17.__proto__ = e46;
    } || function(t17, e46) {
        for(var r68 in e46)e46.hasOwnProperty(r68) && (t17[r68] = e46[r68]);
    })(t7, e44);
}, Yh = "varying vec2 vTextureCoord;\n\nuniform sampler2D uSampler;\nuniform float uAlpha;\n\nvoid main(void)\n{\n   gl_FragColor = texture2D(uSampler, vTextureCoord) * uAlpha;\n}\n", Vh = function(t7) {
    function e44(e46) {
        (void 0) === e46 && (e46 = 1);
        var r68 = t7.call(this, kn, Yh, {
            uAlpha: 1
        }) || this;
        return r68.alpha = e46, r68;
    }
    return (function(t17, e46) {
        function r68() {
            this.constructor = t17;
        }
        Hh(t17, e46), t17.prototype = null === e46 ? Object.create(e46) : (r68.prototype = e46.prototype, new r68);
    })(e44, t7), Object.defineProperty(e44.prototype, "alpha", {
        get: function() {
            return this.uniforms.uAlpha;
        },
        set: function(t17) {
            this.uniforms.uAlpha = t17;
        },
        enumerable: !1,
        configurable: !0
    }), e44;
}(an), zh = function(t7, e44) {
    return (zh = Object.setPrototypeOf || ({
        __proto__: []
    }) instanceof Array && function(t17, e46) {
        t17.__proto__ = e46;
    } || function(t17, e46) {
        for(var r68 in e46)e46.hasOwnProperty(r68) && (t17[r68] = e46[r68]);
    })(t7, e44);
};
function Wh(t7, e44) {
    function r68() {
        this.constructor = t7;
    }
    zh(t7, e44), t7.prototype = null === e44 ? Object.create(e44) : (r68.prototype = e44.prototype, new r68);
}
var qh, Kh, Zh, Jh, Qh, $h, tu, eu, ru, iu, nu, ou, su, au, hu, uu, lu, cu = "\n    attribute vec2 aVertexPosition;\n\n    uniform mat3 projectionMatrix;\n\n    uniform float strength;\n\n    varying vec2 vBlurTexCoords[%size%];\n\n    uniform vec4 inputSize;\n    uniform vec4 outputFrame;\n\n    vec4 filterVertexPosition( void )\n    {\n        vec2 position = aVertexPosition * max(outputFrame.zw, vec2(0.)) + outputFrame.xy;\n\n        return vec4((projectionMatrix * vec3(position, 1.0)).xy, 0.0, 1.0);\n    }\n\n    vec2 filterTextureCoord( void )\n    {\n        return aVertexPosition * (outputFrame.zw * inputSize.zw);\n    }\n\n    void main(void)\n    {\n        gl_Position = filterVertexPosition();\n\n        vec2 textureCoord = filterTextureCoord();\n        %blur%\n    }", du = {
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
}, fu = [
    "varying vec2 vBlurTexCoords[%size%];",
    "uniform sampler2D uSampler;",
    "void main(void)",
    "{",
    "    gl_FragColor = vec4(0.0);",
    "    %blur%",
    "}"
].join("\n");
!function(t7) {
    t7[t7.WEBGL_LEGACY = 0] = "WEBGL_LEGACY", t7[t7.WEBGL = 1] = "WEBGL", t7[t7.WEBGL2 = 2] = "WEBGL2";
}(qh || (qh = {
})), (function(t7) {
    t7[t7.UNKNOWN = 0] = "UNKNOWN", t7[t7.WEBGL = 1] = "WEBGL", t7[t7.CANVAS = 2] = "CANVAS";
})(Kh || (Kh = {
})), (function(t7) {
    t7[t7.COLOR = 16384] = "COLOR", t7[t7.DEPTH = 256] = "DEPTH", t7[t7.STENCIL = 1024] = "STENCIL";
})(Zh || (Zh = {
})), (function(t7) {
    t7[t7.NORMAL = 0] = "NORMAL", t7[t7.ADD = 1] = "ADD", t7[t7.MULTIPLY = 2] = "MULTIPLY", t7[t7.SCREEN = 3] = "SCREEN", t7[t7.OVERLAY = 4] = "OVERLAY", t7[t7.DARKEN = 5] = "DARKEN", t7[t7.LIGHTEN = 6] = "LIGHTEN", t7[t7.COLOR_DODGE = 7] = "COLOR_DODGE", t7[t7.COLOR_BURN = 8] = "COLOR_BURN", t7[t7.HARD_LIGHT = 9] = "HARD_LIGHT", t7[t7.SOFT_LIGHT = 10] = "SOFT_LIGHT", t7[t7.DIFFERENCE = 11] = "DIFFERENCE", t7[t7.EXCLUSION = 12] = "EXCLUSION", t7[t7.HUE = 13] = "HUE", t7[t7.SATURATION = 14] = "SATURATION", t7[t7.COLOR = 15] = "COLOR", t7[t7.LUMINOSITY = 16] = "LUMINOSITY", t7[t7.NORMAL_NPM = 17] = "NORMAL_NPM", t7[t7.ADD_NPM = 18] = "ADD_NPM", t7[t7.SCREEN_NPM = 19] = "SCREEN_NPM", t7[t7.NONE = 20] = "NONE", t7[t7.SRC_OVER = 0] = "SRC_OVER", t7[t7.SRC_IN = 21] = "SRC_IN", t7[t7.SRC_OUT = 22] = "SRC_OUT", t7[t7.SRC_ATOP = 23] = "SRC_ATOP", t7[t7.DST_OVER = 24] = "DST_OVER", t7[t7.DST_IN = 25] = "DST_IN", t7[t7.DST_OUT = 26] = "DST_OUT", t7[t7.DST_ATOP = 27] = "DST_ATOP", t7[t7.ERASE = 26] = "ERASE", t7[t7.SUBTRACT = 28] = "SUBTRACT", t7[t7.XOR = 29] = "XOR";
})(Jh || (Jh = {
})), (function(t7) {
    t7[t7.POINTS = 0] = "POINTS", t7[t7.LINES = 1] = "LINES", t7[t7.LINE_LOOP = 2] = "LINE_LOOP", t7[t7.LINE_STRIP = 3] = "LINE_STRIP", t7[t7.TRIANGLES = 4] = "TRIANGLES", t7[t7.TRIANGLE_STRIP = 5] = "TRIANGLE_STRIP", t7[t7.TRIANGLE_FAN = 6] = "TRIANGLE_FAN";
})(Qh || (Qh = {
})), (function(t7) {
    t7[t7.RGBA = 6408] = "RGBA", t7[t7.RGB = 6407] = "RGB", t7[t7.ALPHA = 6406] = "ALPHA", t7[t7.LUMINANCE = 6409] = "LUMINANCE", t7[t7.LUMINANCE_ALPHA = 6410] = "LUMINANCE_ALPHA", t7[t7.DEPTH_COMPONENT = 6402] = "DEPTH_COMPONENT", t7[t7.DEPTH_STENCIL = 34041] = "DEPTH_STENCIL";
})($h || ($h = {
})), (function(t7) {
    t7[t7.TEXTURE_2D = 3553] = "TEXTURE_2D", t7[t7.TEXTURE_CUBE_MAP = 34067] = "TEXTURE_CUBE_MAP", t7[t7.TEXTURE_2D_ARRAY = 35866] = "TEXTURE_2D_ARRAY", t7[t7.TEXTURE_CUBE_MAP_POSITIVE_X = 34069] = "TEXTURE_CUBE_MAP_POSITIVE_X", t7[t7.TEXTURE_CUBE_MAP_NEGATIVE_X = 34070] = "TEXTURE_CUBE_MAP_NEGATIVE_X", t7[t7.TEXTURE_CUBE_MAP_POSITIVE_Y = 34071] = "TEXTURE_CUBE_MAP_POSITIVE_Y", t7[t7.TEXTURE_CUBE_MAP_NEGATIVE_Y = 34072] = "TEXTURE_CUBE_MAP_NEGATIVE_Y", t7[t7.TEXTURE_CUBE_MAP_POSITIVE_Z = 34073] = "TEXTURE_CUBE_MAP_POSITIVE_Z", t7[t7.TEXTURE_CUBE_MAP_NEGATIVE_Z = 34074] = "TEXTURE_CUBE_MAP_NEGATIVE_Z";
})(tu || (tu = {
})), (function(t7) {
    t7[t7.UNSIGNED_BYTE = 5121] = "UNSIGNED_BYTE", t7[t7.UNSIGNED_SHORT = 5123] = "UNSIGNED_SHORT", t7[t7.UNSIGNED_SHORT_5_6_5 = 33635] = "UNSIGNED_SHORT_5_6_5", t7[t7.UNSIGNED_SHORT_4_4_4_4 = 32819] = "UNSIGNED_SHORT_4_4_4_4", t7[t7.UNSIGNED_SHORT_5_5_5_1 = 32820] = "UNSIGNED_SHORT_5_5_5_1", t7[t7.FLOAT = 5126] = "FLOAT", t7[t7.HALF_FLOAT = 36193] = "HALF_FLOAT";
})(eu || (eu = {
})), (function(t7) {
    t7[t7.NEAREST = 0] = "NEAREST", t7[t7.LINEAR = 1] = "LINEAR";
})(ru || (ru = {
})), (function(t7) {
    t7[t7.CLAMP = 33071] = "CLAMP", t7[t7.REPEAT = 10497] = "REPEAT", t7[t7.MIRRORED_REPEAT = 33648] = "MIRRORED_REPEAT";
})(iu || (iu = {
})), (function(t7) {
    t7[t7.OFF = 0] = "OFF", t7[t7.POW2 = 1] = "POW2", t7[t7.ON = 2] = "ON", t7[t7.ON_MANUAL = 3] = "ON_MANUAL";
})(nu || (nu = {
})), (function(t7) {
    t7[t7.NPM = 0] = "NPM", t7[t7.UNPACK = 1] = "UNPACK", t7[t7.PMA = 2] = "PMA", t7[t7.NO_PREMULTIPLIED_ALPHA = 0] = "NO_PREMULTIPLIED_ALPHA", t7[t7.PREMULTIPLY_ON_UPLOAD = 1] = "PREMULTIPLY_ON_UPLOAD", t7[t7.PREMULTIPLY_ALPHA = 2] = "PREMULTIPLY_ALPHA";
})(ou || (ou = {
})), (function(t7) {
    t7[t7.NO = 0] = "NO", t7[t7.YES = 1] = "YES", t7[t7.AUTO = 2] = "AUTO", t7[t7.BLEND = 0] = "BLEND", t7[t7.CLEAR = 1] = "CLEAR", t7[t7.BLIT = 2] = "BLIT";
})(su || (su = {
})), (function(t7) {
    t7[t7.AUTO = 0] = "AUTO", t7[t7.MANUAL = 1] = "MANUAL";
})(au || (au = {
})), (function(t7) {
    t7.LOW = "lowp", t7.MEDIUM = "mediump", t7.HIGH = "highp";
})(hu || (hu = {
})), (function(t7) {
    t7[t7.NONE = 0] = "NONE", t7[t7.SCISSOR = 1] = "SCISSOR", t7[t7.STENCIL = 2] = "STENCIL", t7[t7.SPRITE = 3] = "SPRITE";
})(uu || (uu = {
})), (function(t7) {
    t7[t7.NONE = 0] = "NONE", t7[t7.LOW = 2] = "LOW", t7[t7.MEDIUM = 4] = "MEDIUM", t7[t7.HIGH = 8] = "HIGH";
})(lu || (lu = {
}));
var pu = function(t7) {
    function e44(e46, r68, i73, n64, o60) {
        (void 0) === r68 && (r68 = 8), (void 0) === i73 && (i73 = 4), (void 0) === n64 && (n64 = F.FILTER_RESOLUTION), (void 0) === o60 && (o60 = 5);
        var s54 = this, a59 = function(t17, e47) {
            var r69, i74 = Math.ceil(t17 / 2), n66 = cu, o62 = "";
            r69 = e47 ? "vBlurTexCoords[%index%] =  textureCoord + vec2(%sampleIndex% * strength, 0.0);" : "vBlurTexCoords[%index%] =  textureCoord + vec2(0.0, %sampleIndex% * strength);";
            for(var s56 = 0; s56 < t17; s56++){
                var a61 = r69.replace("%index%", s56.toString());
                o62 += a61 = a61.replace("%sampleIndex%", s56 - (i74 - 1) + ".0"), o62 += "\n";
            }
            return (n66 = n66.replace("%blur%", o62)).replace("%size%", t17.toString());
        }(o60, e46), h57 = function(t17) {
            for(var e47, r69 = du[t17], i74 = r69.length, n66 = fu, o62 = "", s56 = 0; s56 < t17; s56++){
                var a62 = "gl_FragColor += texture2D(uSampler, vBlurTexCoords[%index%]) * %value%;".replace("%index%", s56.toString());
                e47 = s56, s56 >= i74 && (e47 = t17 - s56 - 1), o62 += a62 = a62.replace("%value%", r69[e47].toString()), o62 += "\n";
            }
            return (n66 = n66.replace("%blur%", o62)).replace("%size%", t17.toString());
        }(o60);
        return (s54 = t7.call(this, a59, h57) || this).horizontal = e46, s54.resolution = n64, s54._quality = 0, s54.quality = i73, s54.blur = r68, s54;
    }
    return Wh(e44, t7), e44.prototype.apply = function(t17, e46, r68, i73) {
        if (r68 ? this.horizontal ? this.uniforms.strength = 1 / r68.width * (r68.width / e46.width) : this.uniforms.strength = 1 / r68.height * (r68.height / e46.height) : this.horizontal ? this.uniforms.strength = 1 / t17.renderer.width * (t17.renderer.width / e46.width) : this.uniforms.strength = 1 / t17.renderer.height * (t17.renderer.height / e46.height), this.uniforms.strength *= this.strength, this.uniforms.strength /= this.passes, 1 === this.passes) t17.applyFilter(this, e46, r68, i73);
        else {
            var n64 = t17.getFilterTexture(), o60 = t17.renderer, s54 = e46, a59 = n64;
            this.state.blend = !1, t17.applyFilter(this, s54, a59, su.CLEAR);
            for(var h57 = 1; h57 < this.passes - 1; h57++){
                t17.bindAndClear(s54, su.BLIT), this.uniforms.uSampler = a59;
                var u54 = a59;
                a59 = s54, s54 = u54, o60.shader.bind(this), o60.geometry.draw(5);
            }
            this.state.blend = !0, t17.applyFilter(this, a59, r68, i73), t17.returnFilterTexture(n64);
        }
    }, Object.defineProperty(e44.prototype, "blur", {
        get: function() {
            return this.strength;
        },
        set: function(t17) {
            this.padding = 1 + 2 * Math.abs(t17), this.strength = t17;
        },
        enumerable: !1,
        configurable: !0
    }), Object.defineProperty(e44.prototype, "quality", {
        get: function() {
            return this._quality;
        },
        set: function(t17) {
            this._quality = t17, this.passes = t17;
        },
        enumerable: !1,
        configurable: !0
    }), e44;
}(an), _u = function(t7) {
    function e44(e46, r68, i73, n66) {
        (void 0) === e46 && (e46 = 8), (void 0) === r68 && (r68 = 4), (void 0) === i73 && (i73 = F.FILTER_RESOLUTION), (void 0) === n66 && (n66 = 5);
        var o62 = t7.call(this) || this;
        return o62.blurXFilter = new pu(!0, e46, r68, i73, n66), o62.blurYFilter = new pu(!1, e46, r68, i73, n66), o62.resolution = i73, o62.quality = r68, o62.blur = e46, o62.repeatEdgePixels = !1, o62;
    }
    return Wh(e44, t7), e44.prototype.apply = function(t17, e46, r68, i73) {
        var n66 = Math.abs(this.blurXFilter.strength), o62 = Math.abs(this.blurYFilter.strength);
        if (n66 && o62) {
            var s56 = t17.getFilterTexture();
            this.blurXFilter.apply(t17, e46, s56, su.CLEAR), this.blurYFilter.apply(t17, s56, r68, i73), t17.returnFilterTexture(s56);
        } else o62 ? this.blurYFilter.apply(t17, e46, r68, i73) : this.blurXFilter.apply(t17, e46, r68, i73);
    }, e44.prototype.updatePadding = function() {
        this._repeatEdgePixels ? this.padding = 0 : this.padding = 2 * Math.max(Math.abs(this.blurXFilter.strength), Math.abs(this.blurYFilter.strength));
    }, Object.defineProperty(e44.prototype, "blur", {
        get: function() {
            return this.blurXFilter.blur;
        },
        set: function(t17) {
            this.blurXFilter.blur = this.blurYFilter.blur = t17, this.updatePadding();
        },
        enumerable: !1,
        configurable: !0
    }), Object.defineProperty(e44.prototype, "quality", {
        get: function() {
            return this.blurXFilter.quality;
        },
        set: function(t17) {
            this.blurXFilter.quality = this.blurYFilter.quality = t17;
        },
        enumerable: !1,
        configurable: !0
    }), Object.defineProperty(e44.prototype, "blurX", {
        get: function() {
            return this.blurXFilter.blur;
        },
        set: function(t17) {
            this.blurXFilter.blur = t17, this.updatePadding();
        },
        enumerable: !1,
        configurable: !0
    }), Object.defineProperty(e44.prototype, "blurY", {
        get: function() {
            return this.blurYFilter.blur;
        },
        set: function(t17) {
            this.blurYFilter.blur = t17, this.updatePadding();
        },
        enumerable: !1,
        configurable: !0
    }), Object.defineProperty(e44.prototype, "blendMode", {
        get: function() {
            return this.blurYFilter.blendMode;
        },
        set: function(t17) {
            this.blurYFilter.blendMode = t17;
        },
        enumerable: !1,
        configurable: !0
    }), Object.defineProperty(e44.prototype, "repeatEdgePixels", {
        get: function() {
            return this._repeatEdgePixels;
        },
        set: function(t17) {
            this._repeatEdgePixels = t17, this.updatePadding();
        },
        enumerable: !1,
        configurable: !0
    }), e44;
}(an), mu = function(t7, e44) {
    return (mu = Object.setPrototypeOf || ({
        __proto__: []
    }) instanceof Array && function(t17, e46) {
        t17.__proto__ = e46;
    } || function(t17, e46) {
        for(var r68 in e46)e46.hasOwnProperty(r68) && (t17[r68] = e46[r68]);
    })(t7, e44);
}, vu = "varying vec2 vTextureCoord;\nuniform sampler2D uSampler;\nuniform float m[20];\nuniform float uAlpha;\n\nvoid main(void)\n{\n    vec4 c = texture2D(uSampler, vTextureCoord);\n\n    if (uAlpha == 0.0) {\n        gl_FragColor = c;\n        return;\n    }\n\n    // Un-premultiply alpha before applying the color matrix. See issue #3539.\n    if (c.a > 0.0) {\n      c.rgb /= c.a;\n    }\n\n    vec4 result;\n\n    result.r = (m[0] * c.r);\n        result.r += (m[1] * c.g);\n        result.r += (m[2] * c.b);\n        result.r += (m[3] * c.a);\n        result.r += m[4];\n\n    result.g = (m[5] * c.r);\n        result.g += (m[6] * c.g);\n        result.g += (m[7] * c.b);\n        result.g += (m[8] * c.a);\n        result.g += m[9];\n\n    result.b = (m[10] * c.r);\n       result.b += (m[11] * c.g);\n       result.b += (m[12] * c.b);\n       result.b += (m[13] * c.a);\n       result.b += m[14];\n\n    result.a = (m[15] * c.r);\n       result.a += (m[16] * c.g);\n       result.a += (m[17] * c.b);\n       result.a += (m[18] * c.a);\n       result.a += m[19];\n\n    vec3 rgb = mix(c.rgb, result.rgb, uAlpha);\n\n    // Premultiply alpha again.\n    rgb *= result.a;\n\n    gl_FragColor = vec4(rgb, result.a);\n}\n", yu = function(t7) {
    function e44() {
        var e46 = this, r68 = {
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
        return (e46 = t7.call(this, jn, vu, r68) || this).alpha = 1, e46;
    }
    return (function(t17, e46) {
        function r68() {
            this.constructor = t17;
        }
        mu(t17, e46), t17.prototype = null === e46 ? Object.create(e46) : (r68.prototype = e46.prototype, new r68);
    })(e44, t7), e44.prototype._loadMatrix = function(t17, e46) {
        (void 0) === e46 && (e46 = !1);
        var r68 = t17;
        e46 && (this._multiply(r68, this.uniforms.m, t17), r68 = this._colorMatrix(r68)), this.uniforms.m = r68;
    }, e44.prototype._multiply = function(t17, e46, r68) {
        return t17[0] = e46[0] * r68[0] + e46[1] * r68[5] + e46[2] * r68[10] + e46[3] * r68[15], t17[1] = e46[0] * r68[1] + e46[1] * r68[6] + e46[2] * r68[11] + e46[3] * r68[16], t17[2] = e46[0] * r68[2] + e46[1] * r68[7] + e46[2] * r68[12] + e46[3] * r68[17], t17[3] = e46[0] * r68[3] + e46[1] * r68[8] + e46[2] * r68[13] + e46[3] * r68[18], t17[4] = e46[0] * r68[4] + e46[1] * r68[9] + e46[2] * r68[14] + e46[3] * r68[19] + e46[4], t17[5] = e46[5] * r68[0] + e46[6] * r68[5] + e46[7] * r68[10] + e46[8] * r68[15], t17[6] = e46[5] * r68[1] + e46[6] * r68[6] + e46[7] * r68[11] + e46[8] * r68[16], t17[7] = e46[5] * r68[2] + e46[6] * r68[7] + e46[7] * r68[12] + e46[8] * r68[17], t17[8] = e46[5] * r68[3] + e46[6] * r68[8] + e46[7] * r68[13] + e46[8] * r68[18], t17[9] = e46[5] * r68[4] + e46[6] * r68[9] + e46[7] * r68[14] + e46[8] * r68[19] + e46[9], t17[10] = e46[10] * r68[0] + e46[11] * r68[5] + e46[12] * r68[10] + e46[13] * r68[15], t17[11] = e46[10] * r68[1] + e46[11] * r68[6] + e46[12] * r68[11] + e46[13] * r68[16], t17[12] = e46[10] * r68[2] + e46[11] * r68[7] + e46[12] * r68[12] + e46[13] * r68[17], t17[13] = e46[10] * r68[3] + e46[11] * r68[8] + e46[12] * r68[13] + e46[13] * r68[18], t17[14] = e46[10] * r68[4] + e46[11] * r68[9] + e46[12] * r68[14] + e46[13] * r68[19] + e46[14], t17[15] = e46[15] * r68[0] + e46[16] * r68[5] + e46[17] * r68[10] + e46[18] * r68[15], t17[16] = e46[15] * r68[1] + e46[16] * r68[6] + e46[17] * r68[11] + e46[18] * r68[16], t17[17] = e46[15] * r68[2] + e46[16] * r68[7] + e46[17] * r68[12] + e46[18] * r68[17], t17[18] = e46[15] * r68[3] + e46[16] * r68[8] + e46[17] * r68[13] + e46[18] * r68[18], t17[19] = e46[15] * r68[4] + e46[16] * r68[9] + e46[17] * r68[14] + e46[18] * r68[19] + e46[19], t17;
    }, e44.prototype._colorMatrix = function(t17) {
        var e46 = new Float32Array(t17);
        return e46[4] /= 255, e46[9] /= 255, e46[14] /= 255, e46[19] /= 255, e46;
    }, e44.prototype.brightness = function(t17, e46) {
        var r68 = [
            t17,
            0,
            0,
            0,
            0,
            0,
            t17,
            0,
            0,
            0,
            0,
            0,
            t17,
            0,
            0,
            0,
            0,
            0,
            1,
            0
        ];
        this._loadMatrix(r68, e46);
    }, e44.prototype.greyscale = function(t17, e46) {
        var r68 = [
            t17,
            t17,
            t17,
            0,
            0,
            t17,
            t17,
            t17,
            0,
            0,
            t17,
            t17,
            t17,
            0,
            0,
            0,
            0,
            0,
            1,
            0
        ];
        this._loadMatrix(r68, e46);
    }, e44.prototype.blackAndWhite = function(t17) {
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
        ], t17);
    }, e44.prototype.hue = function(t17, e46) {
        t17 = (t17 || 0) / 180 * Math.PI;
        var r68 = Math.cos(t17), i73 = Math.sin(t17), n66 = 1 / 3, o62 = (0, Math.sqrt)(n66), s57 = [
            r68 + (1 - r68) * n66,
            n66 * (1 - r68) - o62 * i73,
            n66 * (1 - r68) + o62 * i73,
            0,
            0,
            n66 * (1 - r68) + o62 * i73,
            r68 + n66 * (1 - r68),
            n66 * (1 - r68) - o62 * i73,
            0,
            0,
            n66 * (1 - r68) - o62 * i73,
            n66 * (1 - r68) + o62 * i73,
            r68 + n66 * (1 - r68),
            0,
            0,
            0,
            0,
            0,
            1,
            0
        ];
        this._loadMatrix(s57, e46);
    }, e44.prototype.contrast = function(t17, e46) {
        var r68 = (t17 || 0) + 1, i73 = -0.5 * (r68 - 1), n66 = [
            r68,
            0,
            0,
            0,
            i73,
            0,
            r68,
            0,
            0,
            i73,
            0,
            0,
            r68,
            0,
            i73,
            0,
            0,
            0,
            1,
            0
        ];
        this._loadMatrix(n66, e46);
    }, e44.prototype.saturate = function(t17, e46) {
        (void 0) === t17 && (t17 = 0);
        var r68 = 2 * t17 / 3 + 1, i73 = -0.5 * (r68 - 1), n66 = [
            r68,
            i73,
            i73,
            0,
            0,
            i73,
            r68,
            i73,
            0,
            0,
            i73,
            i73,
            r68,
            0,
            0,
            0,
            0,
            0,
            1,
            0
        ];
        this._loadMatrix(n66, e46);
    }, e44.prototype.desaturate = function() {
        this.saturate(-1);
    }, e44.prototype.negative = function(t17) {
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
        ], t17);
    }, e44.prototype.sepia = function(t17) {
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
        ], t17);
    }, e44.prototype.technicolor = function(t17) {
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
        ], t17);
    }, e44.prototype.polaroid = function(t17) {
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
        ], t17);
    }, e44.prototype.toBGR = function(t17) {
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
        ], t17);
    }, e44.prototype.kodachrome = function(t17) {
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
        ], t17);
    }, e44.prototype.browni = function(t17) {
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
        ], t17);
    }, e44.prototype.vintage = function(t17) {
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
        ], t17);
    }, e44.prototype.colorTone = function(t17, e46, r68, i73, n66) {
        var o62 = ((r68 = r68 || 16770432) >> 16 & 255) / 255, s57 = (r68 >> 8 & 255) / 255, a63 = (255 & r68) / 255, h59 = ((i73 = i73 || 3375104) >> 16 & 255) / 255, u55 = (i73 >> 8 & 255) / 255, l46 = (255 & i73) / 255, c38 = [
            0.3,
            0.59,
            0.11,
            0,
            0,
            o62,
            s57,
            a63,
            t17 = t17 || 0.2,
            0,
            h59,
            u55,
            l46,
            e46 = e46 || 0.15,
            0,
            o62 - h59,
            s57 - u55,
            a63 - l46,
            0,
            0
        ];
        this._loadMatrix(c38, n66);
    }, e44.prototype.night = function(t17, e46) {
        var r68 = [
            -2 * (t17 = t17 || 0.1),
            -t17,
            0,
            0,
            0,
            -t17,
            0,
            t17,
            0,
            0,
            0,
            t17,
            2 * t17,
            0,
            0,
            0,
            0,
            0,
            1,
            0
        ];
        this._loadMatrix(r68, e46);
    }, e44.prototype.predator = function(t17, e46) {
        var r68 = [
            11.224130630493164 * t17,
            -4.794486999511719 * t17,
            -2.8746118545532227 * t17,
            0 * t17,
            0.40342438220977783 * t17,
            -3.6330697536468506 * t17,
            9.193157196044922 * t17,
            -2.951810836791992 * t17,
            0 * t17,
            -1.316135048866272 * t17,
            -3.2184197902679443 * t17,
            -4.2375030517578125 * t17,
            7.476448059082031 * t17,
            0 * t17,
            0.8044459223747253 * t17,
            0,
            0,
            0,
            1,
            0
        ];
        this._loadMatrix(r68, e46);
    }, e44.prototype.lsd = function(t17) {
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
        ], t17);
    }, e44.prototype.reset = function() {
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
    }, Object.defineProperty(e44.prototype, "matrix", {
        get: function() {
            return this.uniforms.m;
        },
        set: function(t17) {
            this.uniforms.m = t17;
        },
        enumerable: !1,
        configurable: !0
    }), Object.defineProperty(e44.prototype, "alpha", {
        get: function() {
            return this.uniforms.uAlpha;
        },
        set: function(t17) {
            this.uniforms.uAlpha = t17;
        },
        enumerable: !1,
        configurable: !0
    }), e44;
}(an);
yu.prototype.grayscale = yu.prototype.greyscale;
var gu = function(t7, e44) {
    return (gu = Object.setPrototypeOf || ({
        __proto__: []
    }) instanceof Array && function(t17, e46) {
        t17.__proto__ = e46;
    } || function(t17, e46) {
        for(var r68 in e46)e46.hasOwnProperty(r68) && (t17[r68] = e46[r68]);
    })(t7, e44);
}, bu = "varying vec2 vFilterCoord;\nvarying vec2 vTextureCoord;\n\nuniform vec2 scale;\nuniform mat2 rotation;\nuniform sampler2D uSampler;\nuniform sampler2D mapSampler;\n\nuniform highp vec4 inputSize;\nuniform vec4 inputClamp;\n\nvoid main(void)\n{\n  vec4 map =  texture2D(mapSampler, vFilterCoord);\n\n  map -= 0.5;\n  map.xy = scale * inputSize.zw * (rotation * map.xy);\n\n  gl_FragColor = texture2D(uSampler, clamp(vec2(vTextureCoord.x + map.x, vTextureCoord.y + map.y), inputClamp.xy, inputClamp.zw));\n}\n", xu = "attribute vec2 aVertexPosition;\n\nuniform mat3 projectionMatrix;\nuniform mat3 filterMatrix;\n\nvarying vec2 vTextureCoord;\nvarying vec2 vFilterCoord;\n\nuniform vec4 inputSize;\nuniform vec4 outputFrame;\n\nvec4 filterVertexPosition( void )\n{\n    vec2 position = aVertexPosition * max(outputFrame.zw, vec2(0.)) + outputFrame.xy;\n\n    return vec4((projectionMatrix * vec3(position, 1.0)).xy, 0.0, 1.0);\n}\n\nvec2 filterTextureCoord( void )\n{\n    return aVertexPosition * (outputFrame.zw * inputSize.zw);\n}\n\nvoid main(void)\n{\n\tgl_Position = filterVertexPosition();\n\tvTextureCoord = filterTextureCoord();\n\tvFilterCoord = ( filterMatrix * vec3( vTextureCoord, 1.0)  ).xy;\n}\n", Tu = function(t7) {
    function e44(e46, r68) {
        var i73 = this, n66 = new Ke;
        return e46.renderable = !1, (i73 = t7.call(this, xu, bu, {
            mapSampler: e46._texture,
            filterMatrix: n66,
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
        }) || this).maskSprite = e46, i73.maskMatrix = n66, null == r68 && (r68 = 20), i73.scale = new We(r68, r68), i73;
    }
    return (function(t17, e46) {
        function r68() {
            this.constructor = t17;
        }
        gu(t17, e46), t17.prototype = null === e46 ? Object.create(e46) : (r68.prototype = e46.prototype, new r68);
    })(e44, t7), e44.prototype.apply = function(t17, e46, r68, i73) {
        this.uniforms.filterMatrix = t17.calculateSpriteMatrix(this.maskMatrix, this.maskSprite), this.uniforms.scale.x = this.scale.x, this.uniforms.scale.y = this.scale.y;
        var n66 = this.maskSprite.worldTransform, o62 = Math.sqrt(n66.a * n66.a + n66.b * n66.b), s57 = Math.sqrt(n66.c * n66.c + n66.d * n66.d);
        0 !== o62 && 0 !== s57 && (this.uniforms.rotation[0] = n66.a / o62, this.uniforms.rotation[1] = n66.b / o62, this.uniforms.rotation[2] = n66.c / s57, this.uniforms.rotation[3] = n66.d / s57), t17.applyFilter(this, e46, r68, i73);
    }, Object.defineProperty(e44.prototype, "map", {
        get: function() {
            return this.uniforms.mapSampler;
        },
        set: function(t17) {
            this.uniforms.mapSampler = t17;
        },
        enumerable: !1,
        configurable: !0
    }), e44;
}(an), Eu = function(t7, e44) {
    return (Eu = Object.setPrototypeOf || ({
        __proto__: []
    }) instanceof Array && function(t17, e46) {
        t17.__proto__ = e46;
    } || function(t17, e46) {
        for(var r68 in e46)e46.hasOwnProperty(r68) && (t17[r68] = e46[r68]);
    })(t7, e44);
}, Au = "\nattribute vec2 aVertexPosition;\n\nuniform mat3 projectionMatrix;\n\nvarying vec2 v_rgbNW;\nvarying vec2 v_rgbNE;\nvarying vec2 v_rgbSW;\nvarying vec2 v_rgbSE;\nvarying vec2 v_rgbM;\n\nvarying vec2 vFragCoord;\n\nuniform vec4 inputPixel;\nuniform vec4 outputFrame;\n\nvec4 filterVertexPosition( void )\n{\n    vec2 position = aVertexPosition * max(outputFrame.zw, vec2(0.)) + outputFrame.xy;\n\n    return vec4((projectionMatrix * vec3(position, 1.0)).xy, 0.0, 1.0);\n}\n\nvoid texcoords(vec2 fragCoord, vec2 inverseVP,\n               out vec2 v_rgbNW, out vec2 v_rgbNE,\n               out vec2 v_rgbSW, out vec2 v_rgbSE,\n               out vec2 v_rgbM) {\n    v_rgbNW = (fragCoord + vec2(-1.0, -1.0)) * inverseVP;\n    v_rgbNE = (fragCoord + vec2(1.0, -1.0)) * inverseVP;\n    v_rgbSW = (fragCoord + vec2(-1.0, 1.0)) * inverseVP;\n    v_rgbSE = (fragCoord + vec2(1.0, 1.0)) * inverseVP;\n    v_rgbM = vec2(fragCoord * inverseVP);\n}\n\nvoid main(void) {\n\n   gl_Position = filterVertexPosition();\n\n   vFragCoord = aVertexPosition * outputFrame.zw;\n\n   texcoords(vFragCoord, inputPixel.zw, v_rgbNW, v_rgbNE, v_rgbSW, v_rgbSE, v_rgbM);\n}\n", Su = 'varying vec2 v_rgbNW;\nvarying vec2 v_rgbNE;\nvarying vec2 v_rgbSW;\nvarying vec2 v_rgbSE;\nvarying vec2 v_rgbM;\n\nvarying vec2 vFragCoord;\nuniform sampler2D uSampler;\nuniform highp vec4 inputPixel;\n\n\n/**\n Basic FXAA implementation based on the code on geeks3d.com with the\n modification that the texture2DLod stuff was removed since it\'s\n unsupported by WebGL.\n\n --\n\n From:\n https://github.com/mitsuhiko/webgl-meincraft\n\n Copyright (c) 2011 by Armin Ronacher.\n\n Some rights reserved.\n\n Redistribution and use in source and binary forms, with or without\n modification, are permitted provided that the following conditions are\n met:\n\n * Redistributions of source code must retain the above copyright\n notice, this list of conditions and the following disclaimer.\n\n * Redistributions in binary form must reproduce the above\n copyright notice, this list of conditions and the following\n disclaimer in the documentation and/or other materials provided\n with the distribution.\n\n * The names of the contributors may not be used to endorse or\n promote products derived from this software without specific\n prior written permission.\n\n THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS\n "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT\n LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR\n A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT\n OWNER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL,\n SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT\n LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE,\n DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY\n THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT\n (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE\n OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.\n */\n\n#ifndef FXAA_REDUCE_MIN\n#define FXAA_REDUCE_MIN   (1.0/ 128.0)\n#endif\n#ifndef FXAA_REDUCE_MUL\n#define FXAA_REDUCE_MUL   (1.0 / 8.0)\n#endif\n#ifndef FXAA_SPAN_MAX\n#define FXAA_SPAN_MAX     8.0\n#endif\n\n//optimized version for mobile, where dependent\n//texture reads can be a bottleneck\nvec4 fxaa(sampler2D tex, vec2 fragCoord, vec2 inverseVP,\n          vec2 v_rgbNW, vec2 v_rgbNE,\n          vec2 v_rgbSW, vec2 v_rgbSE,\n          vec2 v_rgbM) {\n    vec4 color;\n    vec3 rgbNW = texture2D(tex, v_rgbNW).xyz;\n    vec3 rgbNE = texture2D(tex, v_rgbNE).xyz;\n    vec3 rgbSW = texture2D(tex, v_rgbSW).xyz;\n    vec3 rgbSE = texture2D(tex, v_rgbSE).xyz;\n    vec4 texColor = texture2D(tex, v_rgbM);\n    vec3 rgbM  = texColor.xyz;\n    vec3 luma = vec3(0.299, 0.587, 0.114);\n    float lumaNW = dot(rgbNW, luma);\n    float lumaNE = dot(rgbNE, luma);\n    float lumaSW = dot(rgbSW, luma);\n    float lumaSE = dot(rgbSE, luma);\n    float lumaM  = dot(rgbM,  luma);\n    float lumaMin = min(lumaM, min(min(lumaNW, lumaNE), min(lumaSW, lumaSE)));\n    float lumaMax = max(lumaM, max(max(lumaNW, lumaNE), max(lumaSW, lumaSE)));\n\n    mediump vec2 dir;\n    dir.x = -((lumaNW + lumaNE) - (lumaSW + lumaSE));\n    dir.y =  ((lumaNW + lumaSW) - (lumaNE + lumaSE));\n\n    float dirReduce = max((lumaNW + lumaNE + lumaSW + lumaSE) *\n                          (0.25 * FXAA_REDUCE_MUL), FXAA_REDUCE_MIN);\n\n    float rcpDirMin = 1.0 / (min(abs(dir.x), abs(dir.y)) + dirReduce);\n    dir = min(vec2(FXAA_SPAN_MAX, FXAA_SPAN_MAX),\n              max(vec2(-FXAA_SPAN_MAX, -FXAA_SPAN_MAX),\n                  dir * rcpDirMin)) * inverseVP;\n\n    vec3 rgbA = 0.5 * (\n                       texture2D(tex, fragCoord * inverseVP + dir * (1.0 / 3.0 - 0.5)).xyz +\n                       texture2D(tex, fragCoord * inverseVP + dir * (2.0 / 3.0 - 0.5)).xyz);\n    vec3 rgbB = rgbA * 0.5 + 0.25 * (\n                                     texture2D(tex, fragCoord * inverseVP + dir * -0.5).xyz +\n                                     texture2D(tex, fragCoord * inverseVP + dir * 0.5).xyz);\n\n    float lumaB = dot(rgbB, luma);\n    if ((lumaB < lumaMin) || (lumaB > lumaMax))\n        color = vec4(rgbA, texColor.a);\n    else\n        color = vec4(rgbB, texColor.a);\n    return color;\n}\n\nvoid main() {\n\n      vec4 color;\n\n      color = fxaa(uSampler, vFragCoord, inputPixel.zw, v_rgbNW, v_rgbNE, v_rgbSW, v_rgbSE, v_rgbM);\n\n      gl_FragColor = color;\n}\n', Ou = function(t7) {
    function e44() {
        return t7.call(this, Au, Su) || this;
    }
    return (function(t17, e46) {
        function r68() {
            this.constructor = t17;
        }
        Eu(t17, e46), t17.prototype = null === e46 ? Object.create(e46) : (r68.prototype = e46.prototype, new r68);
    })(e44, t7), e44;
}(an), Ru = function(t7, e44) {
    return (Ru = Object.setPrototypeOf || ({
        __proto__: []
    }) instanceof Array && function(t17, e46) {
        t17.__proto__ = e46;
    } || function(t17, e46) {
        for(var r68 in e46)e46.hasOwnProperty(r68) && (t17[r68] = e46[r68]);
    })(t7, e44);
}, wu = "precision highp float;\n\nvarying vec2 vTextureCoord;\nvarying vec4 vColor;\n\nuniform float uNoise;\nuniform float uSeed;\nuniform sampler2D uSampler;\n\nfloat rand(vec2 co)\n{\n    return fract(sin(dot(co.xy, vec2(12.9898, 78.233))) * 43758.5453);\n}\n\nvoid main()\n{\n    vec4 color = texture2D(uSampler, vTextureCoord);\n    float randomValue = rand(gl_FragCoord.xy * uSeed);\n    float diff = (randomValue - 0.5) * uNoise;\n\n    // Un-premultiply alpha before applying the color matrix. See issue #3539.\n    if (color.a > 0.0) {\n        color.rgb /= color.a;\n    }\n\n    color.r += diff;\n    color.g += diff;\n    color.b += diff;\n\n    // Premultiply alpha again.\n    color.rgb *= color.a;\n\n    gl_FragColor = color;\n}\n", Pu = function(t7) {
    function e44(e46, r68) {
        (void 0) === e46 && (e46 = 0.5), (void 0) === r68 && (r68 = Math.random());
        var i73 = t7.call(this, jn, wu, {
            uNoise: 0,
            uSeed: 0
        }) || this;
        return i73.noise = e46, i73.seed = r68, i73;
    }
    return (function(t17, e46) {
        function r68() {
            this.constructor = t17;
        }
        Ru(t17, e46), t17.prototype = null === e46 ? Object.create(e46) : (r68.prototype = e46.prototype, new r68);
    })(e44, t7), Object.defineProperty(e44.prototype, "noise", {
        get: function() {
            return this.uniforms.uNoise;
        },
        set: function(t17) {
            this.uniforms.uNoise = t17;
        },
        enumerable: !1,
        configurable: !0
    }), Object.defineProperty(e44.prototype, "seed", {
        get: function() {
            return this.uniforms.uSeed;
        },
        set: function(t17) {
            this.uniforms.uSeed = t17;
        },
        enumerable: !1,
        configurable: !0
    }), e44;
}(an), Iu = new Ke;
hr.prototype._cacheAsBitmap = !1, hr.prototype._cacheData = null, hr.prototype._cacheAsBitmapResolution = null;
var Mu = function() {
    this.textureCacheId = null, this.originalRender = null, this.originalRenderCanvas = null, this.originalCalculateBounds = null, this.originalGetLocalBounds = null, this.originalUpdateTransform = null, this.originalDestroy = null, this.originalMask = null, this.originalFilterArea = null, this.originalContainsPoint = null, this.sprite = null;
};
Object.defineProperties(hr.prototype, {
    cacheAsBitmapResolution: {
        get: function() {
            return this._cacheAsBitmapResolution;
        },
        set: function(t7) {
            t7 !== this._cacheAsBitmapResolution && (this._cacheAsBitmapResolution = t7, this.cacheAsBitmap && (this.cacheAsBitmap = !1, this.cacheAsBitmap = !0));
        }
    },
    cacheAsBitmap: {
        get: function() {
            return this._cacheAsBitmap;
        },
        set: function(t7) {
            var e44;
            this._cacheAsBitmap !== t7 && (this._cacheAsBitmap = t7, t7 ? (this._cacheData || (this._cacheData = new Mu), (e44 = this._cacheData).originalRender = this.render, e44.originalRenderCanvas = this.renderCanvas, e44.originalUpdateTransform = this.updateTransform, e44.originalCalculateBounds = this.calculateBounds, e44.originalGetLocalBounds = this.getLocalBounds, e44.originalDestroy = this.destroy, e44.originalContainsPoint = this.containsPoint, e44.originalMask = this._mask, e44.originalFilterArea = this.filterArea, this.render = this._renderCached, this.renderCanvas = this._renderCachedCanvas, this.destroy = this._cacheAsBitmapDestroy) : ((e44 = this._cacheData).sprite && this._destroyCachedDisplayObject(), this.render = e44.originalRender, this.renderCanvas = e44.originalRenderCanvas, this.calculateBounds = e44.originalCalculateBounds, this.getLocalBounds = e44.originalGetLocalBounds, this.destroy = e44.originalDestroy, this.updateTransform = e44.originalUpdateTransform, this.containsPoint = e44.originalContainsPoint, this._mask = e44.originalMask, this.filterArea = e44.originalFilterArea));
        }
    }
}), hr.prototype._renderCached = function(t7) {
    !this.visible || this.worldAlpha <= 0 || !this.renderable || (this._initCachedDisplayObject(t7), this._cacheData.sprite.transform._worldID = this.transform._worldID, this._cacheData.sprite.worldAlpha = this.worldAlpha, this._cacheData.sprite._render(t7));
}, hr.prototype._initCachedDisplayObject = function(t7) {
    if (!this._cacheData || !this._cacheData.sprite) {
        var e44 = this.alpha;
        this.alpha = 1, t7.batch.flush();
        var r68 = this.getLocalBounds(null, !0).clone();
        if (this.filters) {
            var i73 = this.filters[0].padding;
            r68.pad(i73);
        }
        r68.ceil(F.RESOLUTION);
        var n66 = t7.renderTexture.current, o62 = t7.renderTexture.sourceFrame.clone(), s57 = t7.renderTexture.destinationFrame.clone(), a63 = t7.projection.transform, h59 = ni.create({
            width: r68.width,
            height: r68.height,
            resolution: this.cacheAsBitmapResolution || t7.resolution
        }), u55 = "cacheAsBitmap_" + Oe();
        this._cacheData.textureCacheId = u55, Gr.addToCache(h59.baseTexture, u55), ri.addToCache(h59, u55);
        var l46 = this.transform.localTransform.copyTo(Iu).invert().translate(-r68.x, -r68.y);
        this.render = this._cacheData.originalRender, t7.render(this, {
            renderTexture: h59,
            clear: !0,
            transform: l46,
            skipUpdateTransform: !1
        }), t7.projection.transform = a63, t7.renderTexture.bind(n66, o62, s57), this.render = this._renderCached, this.updateTransform = this.displayObjectUpdateTransform, this.calculateBounds = this._calculateCachedBounds, this.getLocalBounds = this._getCachedLocalBounds, this._mask = null, this.filterArea = null;
        var c38 = new La(h59);
        c38.transform.worldTransform = this.transform.worldTransform, c38.anchor.x = -r68.x / r68.width, c38.anchor.y = -r68.y / r68.height, c38.alpha = e44, c38._bounds = this._bounds, this._cacheData.sprite = c38, this.transform._parentID = -1, this.parent ? this.updateTransform() : (this.enableTempParent(), this.updateTransform(), this.disableTempParent(null)), this.containsPoint = c38.containsPoint.bind(c38);
    }
}, hr.prototype._renderCachedCanvas = function(t7) {
    !this.visible || this.worldAlpha <= 0 || !this.renderable || (this._initCachedDisplayObjectCanvas(t7), this._cacheData.sprite.worldAlpha = this.worldAlpha, this._cacheData.sprite._renderCanvas(t7));
}, hr.prototype._initCachedDisplayObjectCanvas = function(t7) {
    if (!this._cacheData || !this._cacheData.sprite) {
        var e46 = this.getLocalBounds(null, !0), r69 = this.alpha;
        this.alpha = 1;
        var i74 = t7.context, n67 = t7._projTransform;
        e46.ceil(F.RESOLUTION);
        var o63 = ni.create({
            width: e46.width,
            height: e46.height
        }), s58 = "cacheAsBitmap_" + Oe();
        this._cacheData.textureCacheId = s58, Gr.addToCache(o63.baseTexture, s58), ri.addToCache(o63, s58);
        var a64 = Iu;
        this.transform.localTransform.copyTo(a64), a64.invert(), a64.tx -= e46.x, a64.ty -= e46.y, this.renderCanvas = this._cacheData.originalRenderCanvas, t7.render(this, {
            renderTexture: o63,
            clear: !0,
            transform: a64,
            skipUpdateTransform: !1
        }), t7.context = i74, t7._projTransform = n67, this.renderCanvas = this._renderCachedCanvas, this.updateTransform = this.displayObjectUpdateTransform, this.calculateBounds = this._calculateCachedBounds, this.getLocalBounds = this._getCachedLocalBounds, this._mask = null, this.filterArea = null;
        var h60 = new La(o63);
        h60.transform.worldTransform = this.transform.worldTransform, h60.anchor.x = -e46.x / e46.width, h60.anchor.y = -e46.y / e46.height, h60.alpha = r69, h60._bounds = this._bounds, this._cacheData.sprite = h60, this.transform._parentID = -1, this.parent ? this.updateTransform() : (this.parent = t7._tempDisplayObjectParent, this.updateTransform(), this.parent = null), this.containsPoint = h60.containsPoint.bind(h60);
    }
}, hr.prototype._calculateCachedBounds = function() {
    this._bounds.clear(), this._cacheData.sprite.transform._worldID = this.transform._worldID, this._cacheData.sprite._calculateBounds(), this._bounds.updateID = this._boundsID;
}, hr.prototype._getCachedLocalBounds = function() {
    return this._cacheData.sprite.getLocalBounds(null);
}, hr.prototype._destroyCachedDisplayObject = function() {
    this._cacheData.sprite._texture.destroy(!0), this._cacheData.sprite = null, Gr.removeFromCache(this._cacheData.textureCacheId), ri.removeFromCache(this._cacheData.textureCacheId), this._cacheData.textureCacheId = null;
}, hr.prototype._cacheAsBitmapDestroy = function(t7) {
    this.cacheAsBitmap = !1, this.destroy(t7);
}, hr.prototype.name = null, cr.prototype.getChildByName = function(t7, e47) {
    for(var r70 = 0, i75 = this.children.length; r70 < i75; r70++)if (this.children[r70].name === t7) return this.children[r70];
    if (e47) for(r70 = 0, i75 = this.children.length; r70 < i75; r70++)if (this.children[r70].getChildByName) {
        var n68 = this.children[r70].getChildByName(t7, !0);
        if (n68) return n68;
    }
    return null;
}, hr.prototype.getGlobalPosition = function(t7, e47) {
    return (void 0) === t7 && (t7 = new We), (void 0) === e47 && (e47 = !1), this.parent ? this.parent.toGlobal(this.position, t7, e47) : (t7.x = this.position.x, t7.y = this.position.y), t7;
};
var Du = function(t7, e47) {
    return (Du = Object.setPrototypeOf || ({
        __proto__: []
    }) instanceof Array && function(t17, e48) {
        t17.__proto__ = e48;
    } || function(t17, e48) {
        for(var r70 in e48)e48.hasOwnProperty(r70) && (t17[r70] = e48[r70]);
    })(t7, e47);
};
function Cu(t7, e47) {
    function r70() {
        this.constructor = t7;
    }
    Du(t7, e47), t7.prototype = null === e47 ? Object.create(e47) : (r70.prototype = e47.prototype, new r70);
}
var Nu = function(t7) {
    function e47(e48, r70, i75, n69) {
        (void 0) === e48 && (e48 = 100), (void 0) === r70 && (r70 = 100), (void 0) === i75 && (i75 = 10), (void 0) === n69 && (n69 = 10);
        var o64 = t7.call(this) || this;
        return o64.segWidth = i75, o64.segHeight = n69, o64.width = e48, o64.height = r70, o64.build(), o64;
    }
    return Cu(e47, t7), e47.prototype.build = function() {
        for(var t17 = this.segWidth * this.segHeight, e48 = [], r70 = [], i75 = [], n69 = this.segWidth - 1, o64 = this.segHeight - 1, s59 = this.width / n69, a65 = this.height / o64, h61 = 0; h61 < t17; h61++){
            var u56 = h61 % this.segWidth, l47 = h61 / this.segWidth | 0;
            e48.push(u56 * s59, l47 * a65), r70.push(u56 / n69, l47 / o64);
        }
        var c39 = n69 * o64;
        for(h61 = 0; h61 < c39; h61++){
            var d38 = h61 % n69, f30 = h61 / n69 | 0, p = f30 * this.segWidth + d38, _16 = f30 * this.segWidth + d38 + 1, m15 = (f30 + 1) * this.segWidth + d38, v13 = (f30 + 1) * this.segWidth + d38 + 1;
            i75.push(p, _16, m15, _16, v13, m15);
        }
        this.buffers[0].data = new Float32Array(e48), this.buffers[1].data = new Float32Array(r70), this.indexBuffer.data = new Uint16Array(i75), this.buffers[0].update(), this.buffers[1].update(), this.indexBuffer.update();
    }, e47;
}(wh), Lu = function(t7) {
    function e47(e48, r70, i75) {
        (void 0) === e48 && (e48 = 200), (void 0) === i75 && (i75 = 0);
        var n69 = t7.call(this, new Float32Array(4 * r70.length), new Float32Array(4 * r70.length), new Uint16Array(6 * (r70.length - 1))) || this;
        return n69.points = r70, n69._width = e48, n69.textureScale = i75, n69.build(), n69;
    }
    return Cu(e47, t7), Object.defineProperty(e47.prototype, "width", {
        get: function() {
            return this._width;
        },
        enumerable: !1,
        configurable: !0
    }), e47.prototype.build = function() {
        var t17 = this.points;
        if (t17) {
            var e48 = this.getBuffer("aVertexPosition"), r70 = this.getBuffer("aTextureCoord"), i75 = this.getIndex();
            if (!(t17.length < 1)) {
                e48.data.length / 4 !== t17.length && (e48.data = new Float32Array(4 * t17.length), r70.data = new Float32Array(4 * t17.length), i75.data = new Uint16Array(6 * (t17.length - 1)));
                var n69 = r70.data, o64 = i75.data;
                n69[0] = 0, n69[1] = 0, n69[2] = 0, n69[3] = 1;
                for(var s59 = 0, a65 = t17[0], h61 = this._width * this.textureScale, u57 = t17.length, l48 = 0; l48 < u57; l48++){
                    var c39 = 4 * l48;
                    if (this.textureScale > 0) {
                        var d39 = a65.x - t17[l48].x, f31 = a65.y - t17[l48].y, p = Math.sqrt(d39 * d39 + f31 * f31);
                        a65 = t17[l48], s59 += p / h61;
                    } else s59 = l48 / (u57 - 1);
                    n69[c39] = s59, n69[c39 + 1] = 0, n69[c39 + 2] = s59, n69[c39 + 3] = 1;
                }
                var _17 = 0;
                for(l48 = 0; l48 < u57 - 1; l48++)c39 = 2 * l48, o64[_17++] = c39, o64[_17++] = c39 + 1, o64[_17++] = c39 + 2, o64[_17++] = c39 + 2, o64[_17++] = c39 + 1, o64[_17++] = c39 + 3;
                r70.update(), i75.update(), this.updateVertices();
            }
        }
    }, e47.prototype.updateVertices = function() {
        var t17 = this.points;
        if (!(t17.length < 1)) {
            for(var e49, r71 = t17[0], i76 = 0, n70 = 0, o65 = this.buffers[0].data, s60 = t17.length, a66 = 0; a66 < s60; a66++){
                var h62 = t17[a66], u58 = 4 * a66;
                n70 = -((e49 = a66 < t17.length - 1 ? t17[a66 + 1] : h62).x - r71.x), i76 = e49.y - r71.y;
                var l49 = Math.sqrt(i76 * i76 + n70 * n70), c40 = this.textureScale > 0 ? this.textureScale * this._width / 2 : this._width / 2;
                i76 /= l49, n70 /= l49, i76 *= c40, n70 *= c40, o65[u58] = h62.x + i76, o65[u58 + 1] = h62.y + n70, o65[u58 + 2] = h62.x - i76, o65[u58 + 3] = h62.y - n70, r71 = h62;
            }
            this.buffers[0].update();
        }
    }, e47.prototype.update = function() {
        this.textureScale > 0 ? this.build() : this.updateVertices();
    }, e47;
}(wh), Fu = function(t7) {
    function e47(e50, r72, i77) {
        (void 0) === i77 && (i77 = 0);
        var n71 = this, o66 = new Lu(e50.height, r72, i77), s61 = new Rh(e50);
        return i77 > 0 && (e50.baseTexture.wrapMode = qt.REPEAT), (n71 = t7.call(this, o66, s61) || this).autoUpdate = !0, n71;
    }
    return Cu(e47, t7), e47.prototype._render = function(e50) {
        var r72 = this.geometry;
        (this.autoUpdate || r72._width !== this.shader.texture.height) && (r72._width = this.shader.texture.height, r72.update()), t7.prototype._render.call(this, e50);
    }, e47;
}(Ah), Bu = function(t7) {
    function e47(e50, r72, i77) {
        var n71 = this, o66 = new Nu(e50.width, e50.height, r72, i77), s61 = new Rh(ri.WHITE);
        return (n71 = t7.call(this, o66, s61) || this).texture = e50, n71;
    }
    return Cu(e47, t7), e47.prototype.textureUpdated = function() {
        this._textureID = this.shader.texture._updateID;
        var t17 = this.geometry;
        t17.width = this.shader.texture.width, t17.height = this.shader.texture.height, t17.build();
    }, Object.defineProperty(e47.prototype, "texture", {
        get: function() {
            return this.shader.texture;
        },
        set: function(t17) {
            this.shader.texture !== t17 && (this.shader.texture = t17, this._textureID = -1, t17.baseTexture.valid ? this.textureUpdated() : t17.once("update", this.textureUpdated, this));
        },
        enumerable: !1,
        configurable: !0
    }), e47.prototype._render = function(e50) {
        this._textureID !== this.shader.texture._updateID && this.textureUpdated(), t7.prototype._render.call(this, e50);
    }, e47.prototype.destroy = function(e50) {
        this.shader.texture.off("update", this.textureUpdated, this), t7.prototype.destroy.call(this, e50);
    }, e47;
}(Ah), Uu = function(t7) {
    function e47(e50, r72, i77, n71, o66) {
        (void 0) === e50 && (e50 = ri.EMPTY);
        var s61 = this, a67 = new wh(r72, i77, n71);
        a67.getBuffer("aVertexPosition").static = !1;
        var h63 = new Rh(e50);
        return (s61 = t7.call(this, a67, h63, null, o66) || this).autoUpdate = !0, s61;
    }
    return Cu(e47, t7), Object.defineProperty(e47.prototype, "vertices", {
        get: function() {
            return this.geometry.getBuffer("aVertexPosition").data;
        },
        set: function(t17) {
            this.geometry.getBuffer("aVertexPosition").data = t17;
        },
        enumerable: !1,
        configurable: !0
    }), e47.prototype._render = function(e50) {
        this.autoUpdate && this.geometry.getBuffer("aVertexPosition").update(), t7.prototype._render.call(this, e50);
    }, e47;
}(Ah), Gu = 10, Xu = function(t7) {
    function e47(e50, r72, i77, n71, o66) {
        (void 0) === r72 && (r72 = Gu), (void 0) === i77 && (i77 = Gu), (void 0) === n71 && (n71 = Gu), (void 0) === o66 && (o66 = Gu);
        var s61 = t7.call(this, ri.WHITE, 4, 4) || this;
        return s61._origWidth = e50.orig.width, s61._origHeight = e50.orig.height, s61._width = s61._origWidth, s61._height = s61._origHeight, s61._leftWidth = r72, s61._rightWidth = n71, s61._topHeight = i77, s61._bottomHeight = o66, s61.texture = e50, s61;
    }
    return Cu(e47, t7), e47.prototype.textureUpdated = function() {
        this._textureID = this.shader.texture._updateID, this._refresh();
    }, Object.defineProperty(e47.prototype, "vertices", {
        get: function() {
            return this.geometry.getBuffer("aVertexPosition").data;
        },
        set: function(t17) {
            this.geometry.getBuffer("aVertexPosition").data = t17;
        },
        enumerable: !1,
        configurable: !0
    }), e47.prototype.updateHorizontalVertices = function() {
        var t17 = this.vertices, e50 = this._getMinScale();
        t17[9] = t17[11] = t17[13] = t17[15] = this._topHeight * e50, t17[17] = t17[19] = t17[21] = t17[23] = this._height - this._bottomHeight * e50, t17[25] = t17[27] = t17[29] = t17[31] = this._height;
    }, e47.prototype.updateVerticalVertices = function() {
        var t17 = this.vertices, e50 = this._getMinScale();
        t17[2] = t17[10] = t17[18] = t17[26] = this._leftWidth * e50, t17[4] = t17[12] = t17[20] = t17[28] = this._width - this._rightWidth * e50, t17[6] = t17[14] = t17[22] = t17[30] = this._width;
    }, e47.prototype._getMinScale = function() {
        var t17 = this._leftWidth + this._rightWidth, e50 = this._width > t17 ? 1 : this._width / t17, r72 = this._topHeight + this._bottomHeight, i77 = this._height > r72 ? 1 : this._height / r72;
        return Math.min(e50, i77);
    }, Object.defineProperty(e47.prototype, "width", {
        get: function() {
            return this._width;
        },
        set: function(t17) {
            this._width = t17, this._refresh();
        },
        enumerable: !1,
        configurable: !0
    }), Object.defineProperty(e47.prototype, "height", {
        get: function() {
            return this._height;
        },
        set: function(t17) {
            this._height = t17, this._refresh();
        },
        enumerable: !1,
        configurable: !0
    }), Object.defineProperty(e47.prototype, "leftWidth", {
        get: function() {
            return this._leftWidth;
        },
        set: function(t17) {
            this._leftWidth = t17, this._refresh();
        },
        enumerable: !1,
        configurable: !0
    }), Object.defineProperty(e47.prototype, "rightWidth", {
        get: function() {
            return this._rightWidth;
        },
        set: function(t17) {
            this._rightWidth = t17, this._refresh();
        },
        enumerable: !1,
        configurable: !0
    }), Object.defineProperty(e47.prototype, "topHeight", {
        get: function() {
            return this._topHeight;
        },
        set: function(t17) {
            this._topHeight = t17, this._refresh();
        },
        enumerable: !1,
        configurable: !0
    }), Object.defineProperty(e47.prototype, "bottomHeight", {
        get: function() {
            return this._bottomHeight;
        },
        set: function(t17) {
            this._bottomHeight = t17, this._refresh();
        },
        enumerable: !1,
        configurable: !0
    }), e47.prototype._refresh = function() {
        var t17 = this.texture, e50 = this.geometry.buffers[1].data;
        this._origWidth = t17.orig.width, this._origHeight = t17.orig.height;
        var r72 = 1 / this._origWidth, i77 = 1 / this._origHeight;
        e50[0] = e50[8] = e50[16] = e50[24] = 0, e50[1] = e50[3] = e50[5] = e50[7] = 0, e50[6] = e50[14] = e50[22] = e50[30] = 1, e50[25] = e50[27] = e50[29] = e50[31] = 1, e50[2] = e50[10] = e50[18] = e50[26] = r72 * this._leftWidth, e50[4] = e50[12] = e50[20] = e50[28] = 1 - r72 * this._rightWidth, e50[9] = e50[11] = e50[13] = e50[15] = i77 * this._topHeight, e50[17] = e50[19] = e50[21] = e50[23] = 1 - i77 * this._bottomHeight, this.updateHorizontalVertices(), this.updateVerticalVertices(), this.geometry.buffers[0].update(), this.geometry.buffers[1].update();
    }, e47;
}(Bu), ku = function(t7, e47) {
    return (ku = Object.setPrototypeOf || ({
        __proto__: []
    }) instanceof Array && function(t17, e50) {
        t17.__proto__ = e50;
    } || function(t17, e50) {
        for(var r72 in e50)e50.hasOwnProperty(r72) && (t17[r72] = e50[r72]);
    })(t7, e47);
}, ju = function(t7) {
    function e47(e50, r72) {
        (void 0) === r72 && (r72 = !0);
        var i77 = t7.call(this, e50[0] instanceof ri ? e50[0] : e50[0].texture) || this;
        return i77._textures = null, i77._durations = null, i77._autoUpdate = r72, i77._isConnectedToTicker = !1, i77.animationSpeed = 1, i77.loop = !0, i77.updateAnchor = !1, i77.onComplete = null, i77.onFrameChange = null, i77.onLoop = null, i77._currentTime = 0, i77._playing = !1, i77._previousFrame = null, i77.textures = e50, i77;
    }
    return (function(t17, e50) {
        function r72() {
            this.constructor = t17;
        }
        ku(t17, e50), t17.prototype = null === e50 ? Object.create(e50) : (r72.prototype = e50.prototype, new r72);
    })(e47, t7), e47.prototype.stop = function() {
        this._playing && (this._playing = !1, this._autoUpdate && this._isConnectedToTicker && (br.shared.remove(this.update, this), this._isConnectedToTicker = !1));
    }, e47.prototype.play = function() {
        this._playing || (this._playing = !0, this._autoUpdate && !this._isConnectedToTicker && (br.shared.add(this.update, this, fr.HIGH), this._isConnectedToTicker = !0));
    }, e47.prototype.gotoAndStop = function(t17) {
        this.stop();
        var e50 = this.currentFrame;
        this._currentTime = t17, e50 !== this.currentFrame && this.updateTexture();
    }, e47.prototype.gotoAndPlay = function(t17) {
        var e50 = this.currentFrame;
        this._currentTime = t17, e50 !== this.currentFrame && this.updateTexture(), this.play();
    }, e47.prototype.update = function(t17) {
        if (this._playing) {
            var e50 = this.animationSpeed * t17, r72 = this.currentFrame;
            if (null !== this._durations) {
                var i77 = this._currentTime % 1 * this._durations[this.currentFrame];
                for(i77 += e50 / 60 * 1000; i77 < 0;)this._currentTime--, i77 += this._durations[this.currentFrame];
                var n71 = Math.sign(this.animationSpeed * t17);
                for(this._currentTime = Math.floor(this._currentTime); i77 >= this._durations[this.currentFrame];)i77 -= this._durations[this.currentFrame] * n71, this._currentTime += n71;
                this._currentTime += i77 / this._durations[this.currentFrame];
            } else this._currentTime += e50;
            this._currentTime < 0 && !this.loop ? (this.gotoAndStop(0), this.onComplete && this.onComplete()) : this._currentTime >= this._textures.length && !this.loop ? (this.gotoAndStop(this._textures.length - 1), this.onComplete && this.onComplete()) : r72 !== this.currentFrame && (this.loop && this.onLoop && (this.animationSpeed > 0 && this.currentFrame < r72 ? this.onLoop() : this.animationSpeed < 0 && this.currentFrame > r72 && this.onLoop()), this.updateTexture());
        }
    }, e47.prototype.updateTexture = function() {
        var t17 = this.currentFrame;
        this._previousFrame !== t17 && (this._previousFrame = t17, this._texture = this._textures[t17], this._textureID = -1, this._textureTrimmedID = -1, this._cachedTint = 16777215, this.uvs = this._texture._uvs.uvsFloat32, this.updateAnchor && this._anchor.copyFrom(this._texture.defaultAnchor), this.onFrameChange && this.onFrameChange(this.currentFrame));
    }, e47.prototype.destroy = function(e51) {
        this.stop(), t7.prototype.destroy.call(this, e51), this.onComplete = null, this.onFrameChange = null, this.onLoop = null;
    }, e47.fromFrames = function(t17) {
        for(var r73 = [], i78 = 0; i78 < t17.length; ++i78)r73.push(ri.from(t17[i78]));
        return new e47(r73);
    }, e47.fromImages = function(t17) {
        for(var r73 = [], i78 = 0; i78 < t17.length; ++i78)r73.push(ri.from(t17[i78]));
        return new e47(r73);
    }, Object.defineProperty(e47.prototype, "totalFrames", {
        get: function() {
            return this._textures.length;
        },
        enumerable: !1,
        configurable: !0
    }), Object.defineProperty(e47.prototype, "textures", {
        get: function() {
            return this._textures;
        },
        set: function(t17) {
            if (t17[0] instanceof ri) this._textures = t17, this._durations = null;
            else {
                this._textures = [], this._durations = [];
                for(var e51 = 0; e51 < t17.length; e51++)this._textures.push(t17[e51].texture), this._durations.push(t17[e51].time);
            }
            this._previousFrame = null, this.gotoAndStop(0), this.updateTexture();
        },
        enumerable: !1,
        configurable: !0
    }), Object.defineProperty(e47.prototype, "currentFrame", {
        get: function() {
            var t17 = Math.floor(this._currentTime) % this._textures.length;
            return t17 < 0 && (t17 += this._textures.length), t17;
        },
        enumerable: !1,
        configurable: !0
    }), Object.defineProperty(e47.prototype, "playing", {
        get: function() {
            return this._playing;
        },
        enumerable: !1,
        configurable: !0
    }), Object.defineProperty(e47.prototype, "autoUpdate", {
        get: function() {
            return this._autoUpdate;
        },
        set: function(t17) {
            t17 !== this._autoUpdate && (this._autoUpdate = t17, !this._autoUpdate && this._isConnectedToTicker ? (br.shared.remove(this.update, this), this._isConnectedToTicker = !1) : this._autoUpdate && !this._isConnectedToTicker && this._playing && (br.shared.add(this.update, this), this._isConnectedToTicker = !0));
        },
        enumerable: !1,
        configurable: !0
    }), e47;
}(La);
Gn.registerPlugin("accessibility", yr), Gn.registerPlugin("extract", ao), Gn.registerPlugin("interaction", Ir), Gn.registerPlugin("particle", ta), Gn.registerPlugin("prepare", sh), Gn.registerPlugin("batch", Qn), Gn.registerPlugin("tilingSprite", yh), Mo.registerPlugin(jh), Mo.registerPlugin(Ms), Mo.registerPlugin(Xs), Mo.registerPlugin(Vs), Mo.registerPlugin(uh), no.registerPlugin(xr), no.registerPlugin(No);
var Hu = "6.0.2", Yu = {
    AlphaFilter: Vh,
    BlurFilter: _u,
    BlurFilterPass: pu,
    ColorMatrixFilter: yu,
    DisplacementFilter: Tu,
    FXAAFilter: Ou,
    NoiseFilter: Pu
};
const mod = function() {
    return {
        ALPHA_MODES: Zt,
        AbstractBatchRenderer: zn,
        AbstractMultiResource: Xr,
        AbstractRenderer: Un,
        AccessibilityManager: yr,
        AnimatedSprite: ju,
        AppLoaderPlugin: No,
        Application: no,
        ArrayResource: kr,
        Attribute: si,
        BLEND_MODES: jt,
        BUFFER_BITS: kt,
        BaseImageResource: jr,
        BasePrepare: rh,
        BaseRenderTexture: $r,
        BaseTexture: Gr,
        BatchDrawCall: Hn,
        BatchGeometry: qn,
        BatchPluginFactory: Jn,
        BatchRenderer: Qn,
        BatchShaderGenerator: Wn,
        BatchSystem: Ai,
        BatchTextureArray: Yn,
        BitmapFont: Uh,
        BitmapFontData: Ih,
        BitmapFontLoader: jh,
        BitmapText: kh,
        BlobResource: Go,
        Bounds: or,
        Buffer: hi,
        BufferResource: Br,
        CLEAR_MODES: Jt,
        CanvasResource: Hr,
        Circle: He,
        CompressedTextureLoader: Ms,
        CompressedTextureResource: Xo,
        Container: cr,
        ContextSystem: Oi,
        CountLimiter: qa,
        CubeResource: Yr,
        DDSLoader: Xs,
        DEG_TO_RAD: ke,
        DRAW_MODES: Ht,
        DisplayObject: hr,
        ENV: Gt,
        Ellipse: Ye,
        Extract: ao,
        FORMATS: Yt,
        FORMATS_TO_COMPONENTS: Hs,
        FillStyle: ra,
        Filter: an,
        FilterState: gi,
        FilterSystem: Ti,
        Framebuffer: Qr,
        FramebufferSystem: Pi,
        GC_MODES: Qt,
        GLFramebuffer: Ri,
        GLProgram: Tn,
        GLTexture: Nn,
        GRAPHICS_CURVES: ea,
        Geometry: pi,
        GeometrySystem: Di,
        Graphics: Ia,
        GraphicsData: Ea,
        GraphicsGeometry: Oa,
        IGLUniformData: xn,
        INSTALLED: Dr,
        INTERNAL_FORMATS: Co,
        INTERNAL_FORMAT_TO_BYTES_PER_PIXEL: Fo,
        ImageBitmapResource: qr,
        ImageResource: Vr,
        InteractionData: Tr,
        InteractionEvent: Ar,
        InteractionManager: Ir,
        InteractionTrackingData: Sr,
        KTXLoader: Vs,
        LINE_CAP: Ks,
        LINE_JOIN: qs,
        LineStyle: Ra,
        Loader: Mo,
        LoaderResource: Lo,
        MASK_TYPES: te,
        MIPMAP_MODES: Kt,
        MSAA_QUALITY: ee,
        MaskData: Ci,
        MaskSystem: fn,
        Matrix: Ke,
        Mesh: Ah,
        MeshBatchUvs: xh,
        MeshGeometry: wh,
        MeshMaterial: Rh,
        NineSlicePlane: Xu,
        ObjectRenderer: Ei,
        ObservablePoint: qe,
        PI_2: Ge,
        PRECISION: $t,
        ParticleContainer: Zs,
        ParticleRenderer: ta,
        PlaneGeometry: Nu,
        Point: We,
        Polygon: Ve,
        Prepare: sh,
        Program: nn,
        ProjectionSystem: vn,
        Quad: _i,
        QuadUv: mi,
        RAD_TO_DEG: Xe,
        RENDERER_TYPE: Xt,
        Rectangle: je,
        RenderTexture: ni,
        RenderTexturePool: oi,
        RenderTextureSystem: bn,
        Renderer: Gn,
        Resource: Fr,
        RopeGeometry: Lu,
        RoundedRectangle: ze,
        Runner: Mr,
        SCALE_MODES: Wt,
        SHAPES: Be,
        SVGResource: zr,
        ScissorSystem: _n,
        Shader: on,
        ShaderSystem: Sn,
        SimpleMesh: Uu,
        SimplePlane: Bu,
        SimpleRope: Fu,
        Sprite: La,
        SpriteMaskFilter: dn,
        Spritesheet: hh,
        SpritesheetLoader: uh,
        State: sn,
        StateSystem: Dn,
        StencilSystem: mn,
        System: Zr,
        TARGETS: Vt,
        TEXT_GRADIENT: _a,
        TYPES: zt,
        TYPES_TO_BYTES_PER_COMPONENT: js,
        TYPES_TO_BYTES_PER_PIXEL: Ys,
        TemporaryDisplayObject: ur,
        Text: za,
        TextMetrics: Ha,
        TextStyle: Ga,
        Texture: ri,
        TextureGCSystem: Cn,
        TextureLoader: Io,
        TextureMatrix: cn,
        TextureSystem: Ln,
        TextureUvs: ti,
        Ticker: br,
        TickerPlugin: xr,
        TilingSprite: fh,
        TilingSpriteRenderer: yh,
        TimeLimiter: ah,
        Transform: nr,
        UPDATE_PRIORITY: fr,
        UniformGroup: yi,
        VERSION: Hu,
        VideoResource: Wr,
        ViewableBuffer: Vn,
        WRAP_MODES: qt,
        accessibleTarget: dr,
        autoDetectRenderer: Xn,
        autoDetectResource: Cr,
        checkMaxIfStatementsInShader: tn,
        defaultFilterVertex: jn,
        defaultVertex: kn,
        filters: Yu,
        graphicsUtils: Ma,
        groupD8: ir,
        interactiveTarget: Rr,
        isMobile: L,
        resources: $n,
        settings: F,
        systems: ro,
        uniformParsers: Ki,
        utils: Ue
    };
}();
class Render {
    static engine;
    static app;
    static async setup() {
        this.engine = mod;
        this.engine.settings.SCALE_MODE = this.engine.SCALE_MODES.NEAREST;
        this.engine.settings.ROUND_PIXELS = true;
        const loader = Render.engine.Loader.shared;
        loader.add("/textures/tileset3.json", {
            crossOrigin: "anonymous"
        });
        loader.add("/textures/creatures.json", {
            crossOrigin: "anonymous"
        });
        this.app = new Render.engine.Application({
            width: global1.document.body.clientWidth,
            height: global1.document.body.clientHeight,
            resizeTo: global1.window,
            autoDensity: true,
            resolution: global1.devicePixelRatio,
            backgroundAlpha: 0
        });
        global1.document.querySelector("body").appendChild(this.app.view);
        await new Promise((solve)=>loader.load(()=>solve(null)
            )
        );
    }
    static Polygon(points) {
        return new Render.engine.Polygon(...points.map((n72)=>n72 * 16
        ));
    }
    static Graphics({ z =NaN , stroke , fill , text , textStyle , textPosition , rect , circle , ellipse , polygon  }) {
        const graphics = new Render.engine.Graphics();
        if (stroke) graphics.lineStyle(...stroke);
        if (fill) graphics.beginFill(...fill);
        if (rect) graphics.drawRect(...rect.map((n72)=>n72 * 16
        ));
        if (circle) graphics.drawCircle(...circle.map((n72)=>n72 * 16
        ));
        if (ellipse) graphics.drawEllipse(...ellipse.map((n72)=>n72 * 16
        ));
        if (polygon) {
            if (polygon instanceof Render.engine.Polygon) graphics.drawPolygon(polygon);
            else graphics.drawPolygon(...polygon.map((n72)=>n72 * 16
            ));
        }
        graphics.endFill();
        if (text) {
            const textSprite = graphics.addChild(new Render.engine.Text(text, textStyle));
            textSprite.anchor.set(0.5);
            if (textPosition) textSprite.position.set(textPosition.x, textPosition.y);
        }
        if (!Number.isNaN(z)) graphics.zIndex = z;
        return graphics;
    }
    static ParticleContainer({ x =0 , y =0  } = {
    }) {
        const container = new Render.engine.ParticleContainer();
        container.position.set(x * 16, y * 16);
        return container;
    }
    static Container({ x =0 , y =0 , z =NaN , sorted =false  } = {
    }) {
        const container = new Render.engine.ParticleContainer.__proto__();
        container.position.set(x * 16, y * 16);
        if (!Number.isNaN(z)) container.zIndex = z;
        if (sorted) container.sortableChildren = true;
        return container;
    }
    static Texture({ frame =Render.engine.Texture.EMPTY  }) {
        return Render.engine.Texture.from(`${frame}`);
    }
    static TilingSprite({ frame =Render.engine.Texture.EMPTY , x =0 , y =0 , z =NaN , width =0 , height =0  }) {
        const sprite = Render.engine.TilingSprite.from(`${frame}`, {
            width: width * 16,
            height: height * 16
        });
        sprite.position.set(x * 16, y * 16);
        if (!Number.isNaN(z)) sprite.zIndex = z;
        return sprite;
    }
    static Sprite({ frame =Render.engine.Texture.EMPTY , x =0 , y =0 , z =NaN , anchor , scale  } = {
    }) {
        let sprite;
        if (frame instanceof Render.engine.Texture) sprite = new Render.engine.Sprite.from(frame);
        else if (`${frame}` in ANIMATED) {
            sprite = new Render.engine.AnimatedSprite.fromFrames(ANIMATED[frame].frames);
            sprite.animationSpeed = ANIMATED[frame].speed;
            sprite.play();
        } else sprite = new Render.engine.Sprite.from(`${frame}`);
        sprite.position.set(x * 16, y * 16);
        if (anchor) sprite.anchor.set(...anchor);
        if (scale) sprite.scale.set(...scale);
        if (!Number.isNaN(z)) sprite.zIndex = z;
        return sprite;
    }
    static get filters() {
        return Render.engine.filters;
    }
}
class Positionable {
    world;
    x;
    y;
    width;
    height;
    constructor({ world: world3 , x: x10 = 0 , y: y1 = 0 , width =0 , height =0  }){
        this.world = world3;
        this.x = x10;
        this.y = y1;
        this.width = width;
        this.height = height;
    }
}
class Renderable extends Positionable {
    sprite;
    rendered = false;
    destroyed = false;
    _debug;
    hide() {
        this.sprite.visible = false;
    }
    show() {
        if (this.destroyed) return;
        if (!this.rendered) {
            this.rendered = true;
            this.render();
        }
        this.sprite.visible = true;
        this.debug();
    }
    toggle() {
        return this.sprite.visible ? this.hide() : this.show();
    }
    debug(visible = false) {
        if (this._debug) {
            this._debug.visible = visible;
            this._debug.position.set(this.x * 16, this.y * 16);
        }
    }
    destructor() {
        this.destroyed = true;
        this.rendered = false;
        this.sprite.visible = false;
        this.sprite.removeChildren().forEach((child)=>child.destroy({
                children: true
            })
        );
        this.debug(false);
    }
}
class Minimap extends Renderable {
    sprite;
    data = null;
    constructor({ world: world1  }){
        super({
            world: world1
        });
        this.sprite = this.world.sprites.minimap.addChild(Render.Container());
        this.hide();
    }
    hide() {
        this.world.sprites.world.filters = null;
        return super.hide();
    }
    show() {
        this.world.sprites.world.filters = [
            new Render.filters.BlurFilter(),
            new Render.filters.ColorMatrixFilter()
        ];
        this.world.sprites.world.filters[1].brightness(0.5);
        return super.show();
    }
    get open() {
        return this.sprite.visible;
    }
    async render() {
        this.sprite.scale.set(1.5);
        if (!this.data) this.data = await fetch(`/map/${this.world.name}/pins`).then((res)=>res.json()
        );
        for (const [name, { mx , my , pins  }] of Object.entries(this.data.regions)){
            const sprite = this.sprite.addChild(Render.Sprite({
                frame: `imgs/regions/${name}.png`
            }));
            sprite.position.set(mx, my);
            for (const { x: x11 , y: y1 , mx: mx1 , my: my1  } of pins){
                const pin = sprite.addChild(Render.Graphics({
                    fill: [
                        16711680,
                        0.5
                    ],
                    rect: [
                        0,
                        0,
                        0.5,
                        0.5
                    ]
                }));
                pin.interactive = true;
                pin.position.set(mx1, my1);
                pin.on("mouseover", ()=>pin.tint = 65280
                );
                pin.on("mouseout", ()=>pin.tint = 16777215
                );
                pin.on("click", ()=>this.moveTo({
                        x: x11,
                        y: y1
                    })
                );
                pin.on("tap", ()=>this.moveTo({
                        x: x11,
                        y: y1
                    })
                );
            }
        }
        let mx1 = Infinity, my1 = Infinity, Mx = -Infinity, My = -Infinity;
        this.sprite.children.forEach((sprite)=>{
            mx1 = Math.min(mx1, sprite.x);
            my1 = Math.min(my1, sprite.y);
            Mx = Math.max(Mx, sprite.x + sprite.width);
            My = Math.max(My, sprite.y + sprite.height);
        });
        const width1 = (Mx - mx1) / 2, height1 = (My - my1) / 2;
        this.sprite.position.set(-mx1 + (width1 + global1.document.body.clientWidth / 2) / 2, -my1 + (height1 - global1.document.body.clientHeight / 2) / 2);
    }
    moveTo({ x , y  }) {
        this.world.camera.moveTo({
            x,
            y
        });
        this.hide();
    }
}
var Pattern;
(function(Pattern1) {
    Pattern1["patrol"] = "patrol";
    Pattern1["loop"] = "loop";
    Pattern1["wander"] = "wander";
    Pattern1["fixed"] = "fixed";
})(Pattern || (Pattern = {
}));
class NPC extends Renderable {
    sprite;
    sprites;
    offset = {
        x: 0,
        y: 0
    };
    area;
    track = [];
    _track_index = 0;
    pattern = "fixed";
    constructor({ world: world2 , area  }){
        super({
            world: world2
        });
        this.area = area;
        this.sprite = Render.Container();
        this.sprites = {
            main: this.sprite.addChild(Render.Sprite({
                frame: "regular/mew",
                anchor: [
                    0.5,
                    1
                ]
            })),
            mask: null,
            shadow: null
        };
        console.debug(`loaded npc:`);
        this.x = this.area.polygon.points[0] / TILE_SIZE;
        this.y = this.area.polygon.points[1] / TILE_SIZE;
        this.area.npcs.add(this);
        if (this.pattern === "loop" || this.pattern === "patrol") {
            const points = this.area.polygon.points.map((n72)=>n72 / 16
            );
            points.push(points[0], points[1]);
            this.track = [
                points[0],
                points[1]
            ];
            for(let i78 = 2; i78 < points.length; i78 += 2){
                const [px, py, nx, ny] = [
                    points[i78 - 2],
                    points[i78 - 1],
                    points[i78],
                    points[i78 + 1]
                ];
                const dx = nx - px;
                const dy = ny - py;
                let [x11, y2] = [
                    px,
                    py
                ];
                for(let j3 = 0; j3 < Math.abs(dx); j3++)this.track.push(x11 += Math.sign(dx), y2);
                for(let j4 = 0; j4 < Math.abs(dy); j4++)this.track.push(x11, y2 += Math.sign(dy));
            }
            if (this.pattern === "patrol") {
                const points1 = this.track.slice();
                for(let i79 = points1.length - 4; i79 > 0; i79 -= 2)this.track.push(points1[i79], points1[i79 + 1]);
            }
            if (this.pattern === "loop" && this.track[0] === this.track[this.track.length - 2] && this.track[1] === this.track[this.track.length - 1]) {
                this.track.pop();
                this.track.pop();
            }
        }
    }
    update(tick) {
        if (Number.isInteger(tick)) {
            this[this.pattern]();
            this.render();
        }
    }
    fixed() {
    }
    loop() {
        this._track_index = (this._track_index + 2) % this.track.length;
        this.x = this.track[this._track_index];
        this.y = this.track[this._track_index + 1];
    }
    patrol() {
        this.loop();
    }
    wander() {
        const { dx , dy  } = [
            {
                dx: 0,
                dy: 0
            },
            {
                dx: -1,
                dy: 0
            },
            {
                dx: +1,
                dy: 0
            },
            {
                dx: 0,
                dy: -1
            },
            {
                dx: 0,
                dy: +1
            }
        ][Math.floor(Math.random() / 0.2)];
        if (this.area.contains({
            x: this.x + dx,
            y: this.y + dy
        })) {
            this.x += dx;
            this.y += dy;
        }
    }
    lookaround() {
    }
    render() {
        const chunk = this.world.chunkAt(this);
        if (chunk) {
            const rx = this.x - chunk.x, ry = this.y - chunk.y;
            this.sprite.position.set((rx + 0.5) * 16 + this.offset.x, (ry + 1) * 16 + this.offset.y);
            chunk?.layers.get("2X")?.addChild(this.sprite);
            this.sprite.zIndex = ry * CHUNK_SIZE;
        }
    }
}
class App1 {
    world;
    controller;
    ready;
    constructor(){
        const that = this;
        this.world = null;
        this.controller = null;
        this.ready = new Promise(async (solve)=>{
            await Render.setup();
            that.world = new World({
                app: this
            });
            that.controller = new Controller({
                app: this,
                world: this.world
            });
            that.world.camera.moveTo({
                x: 329,
                y: -924
            });
            solve();
        });
    }
    static debug = {
        logs: true,
        chunks: true,
        areas: true,
        camera: true
    };
}
class Controller {
    app;
    world;
    constructor({ app: app1 , world: world4  }){
        this.app = app1;
        this.world = world4;
        Render.app.view.addEventListener("wheel", (event)=>{
            event.preventDefault();
            if (!this.world.minimap.open) {
                this.world.sprites.world.position.set(Math.round(this.world.sprites.world.position.x - event.deltaX), Math.round(this.world.sprites.world.position.y - event.deltaY));
            } else {
                this.world.minimap.sprite.position.set(Math.round(this.world.minimap.sprite.position.x - event.deltaX), Math.round(this.world.minimap.sprite.position.y - event.deltaY));
            }
            this.world.camera.render();
        });
        global1.document.addEventListener("keydown", ({ code  })=>{
            switch(code){
                case "ArrowLeft":
                    this.world.camera.x--;
                    this.world.camera.render();
                    break;
                case "ArrowRight":
                    this.world.camera.x++;
                    this.world.camera.render();
                    break;
                case "ArrowUp":
                    this.world.camera.y--;
                    this.world.camera.render();
                    break;
                case "ArrowDown":
                    this.world.camera.y++;
                    this.world.camera.render();
                    break;
            }
        });
        global1.document.querySelector("[data-control-for='map']")?.addEventListener("click", ()=>this.world.minimap.toggle()
        );
        global1.document.querySelector("[data-control-for='debug']")?.addEventListener("click", ()=>{
            global1.document.querySelector("nav.debug").style.display = global1.document.querySelector("nav.debug").style.display === "flex" ? "none" : "flex";
        });
        Object.keys(App1.debug).forEach((key)=>{
            const input = global1.document.createElement("input");
            input.setAttribute("data-control-for", key);
            input.setAttribute("type", "checkbox");
            input.checked = App1.debug[key];
            input.addEventListener("change", ()=>App1.debug[key] = input.checked
            );
            const label = global1.document.createElement("label");
            label.innerText = key;
            label.prepend(input);
            global1.document.querySelector(".debug")?.append(label);
        });
        console.log(App1.debug);
    }
    updateDOM() {
        const location = global1.document.querySelector("#location .name");
        if (location) location.innerHTML = this.world.camera.location[0] ?? "-  ";
        const position = global1.document.querySelector("#location .position");
        if (position) position.innerHTML = `${this.world.camera.x};${this.world.camera.y}`;
    }
}
class Area extends Renderable {
    id;
    sprite;
    data;
    polygon;
    npcs = new Set();
    constructor({ id: id1 , data: data1 , world: world5  }){
        super({
            world: world5
        });
        this.id = id1;
        this.data = data1;
        this.polygon = Render.Polygon(this.data.points);
        this.sprite = Render.Container();
        if (App1.debug.logs) console.debug(`loaded area: ${this.id}`);
    }
    contains({ x , y  }) {
        return this.polygon.contains(x * 16, y * 16);
    }
    debug() {
        if (!this._debug) this._debug = this.world.sprites.debug.addChild(Render.Graphics({
            text: this.id,
            textStyle: {
                fontSize: 12,
                fill: "white"
            },
            stroke: [
                1,
                65280,
                0.5
            ],
            fill: [
                65280,
                0.25
            ],
            polygon: this.polygon
        }));
        if (this._debug && App1.debug.areas) this._debug.tint = this.contains(this.world.camera) ? 16777215 : 16711935;
        return super.debug(App1.debug.areas);
    }
    render() {
        setTimeout(()=>this.spawn()
        , 1000);
    }
    destructor() {
        if (App1.debug.logs) console.debug(`unloaded loaded area: ${this.id}`);
        this.npcs.forEach((npc)=>npc.destructor()
        );
        this.npcs.clear();
        return super.destructor();
    }
    static from({ data , chunk  }) {
        const id1 = `${data.id}`;
        if (!chunk.world.loaded.areas.has(id1)) chunk.world.loaded.areas.set(id1, new Area({
            id: id1,
            data,
            world: chunk.world
        }));
        const area1 = chunk.world.loaded.areas.get(id1);
        chunk.areas.add(area1);
        return area1;
    }
    spawn() {
        console.log(this.data.properties);
        new NPC({
            world: this.world,
            area: this
        }).show();
    }
}
class Chunk extends Renderable {
    id;
    sprite;
    data = null;
    layers = new Map();
    areas = new Set();
    world;
    constructor({ id: id2 , world: world6  }){
        super({
            world: world6
        });
        this.id = id2;
        this.world = world6;
        [this.x, this.y] = this.id.split(";").map((n72)=>Number(n72) * CHUNK_SIZE
        );
        this.width = this.height = CHUNK_SIZE;
        this.sprite = this.world.sprites.chunks.addChild(Render.Container({
            x: this.x,
            y: this.y
        }));
        if (App1.debug.chunks) console.debug(`loaded chunk: ${this.id}`);
    }
    destructor() {
        if (App1.debug.chunks) console.debug(`unloaded loaded chunk: ${this.id}`);
        this.layers.clear();
        this.areas.clear();
        return super.destructor();
    }
    show() {
        super.show();
        this.data?.areas?.forEach((area1)=>Area.from({
                data: area1,
                chunk: this
            })?.show()
        );
    }
    debug() {
        if (!this._debug) this._debug = this.world.sprites.debug.addChild(Render.Graphics({
            text: this.id,
            textStyle: {
                fontSize: 12,
                fill: "white"
            },
            stroke: [
                1,
                255,
                0.5
            ],
            fill: [
                255,
                0.25
            ],
            rect: [
                0,
                0,
                this.width,
                this.height
            ]
        }));
        return super.debug(App1.debug.chunks);
    }
    async render() {
        if (!this.data) this.data = await fetch(`/map/overworld/${this.id}`).then((res)=>res.json()
        );
        this.layers.set("0X", this.sprite.addChild(Render.TilingSprite({
            frame: 0,
            width: 32,
            height: 32
        })));
        for (const { name , sublayers , sorted =false  } of [
            {
                name: "1X",
                sublayers: [
                    "1A",
                    "1B",
                    "1C"
                ]
            },
            {
                name: "2X",
                sublayers: [
                    "2A",
                    "2B",
                    "2C"
                ],
                sorted: true
            }, 
        ]){
            if (!this.layers.has(name)) this.layers.set(name, this.sprite.addChild(Render.Container({
                z: 0,
                sorted
            })));
            const layer = this.layers.get(name);
            for(let z4 = 0; z4 < sublayers.length; z4++){
                const tiles = this.data?.chunk?.layers?.[sublayers[z4]];
                if (!tiles) continue;
                for(let i78 = 0; i78 < tiles.length; i78++){
                    const tile = tiles[i78];
                    if (tile >= 0) {
                        const y2 = i78 % 32, x11 = Math.floor(i78 / 32);
                        layer.addChild(Render.Sprite({
                            frame: tile,
                            x: x11,
                            y: y2,
                            z: y2 * 32 + z4
                        }));
                    }
                }
            }
        }
    }
}
class Camera extends Renderable {
    sprite;
    constructor({ world: world7  }){
        super({
            world: world7
        });
        this.sprite = this.world.sprites.world.addChild(Render.Container());
        Object.defineProperties(this, {
            x: {
                get: ()=>Math.floor((-this.world.sprites.world.position.x + global1.document.body.clientWidth / 2) / 16)
                ,
                set: (x11)=>this.moveTo({
                        x: x11,
                        y: this.y
                    })
            },
            y: {
                get: ()=>Math.floor((-this.world.sprites.world.position.y + global1.document.body.clientHeight / 2) / 16)
                ,
                set: (y2)=>this.moveTo({
                        x: this.x,
                        y: y2
                    })
            }
        });
        this.render();
    }
    throttle = false;
    debounce = false;
    debug() {
        if (!this._debug) this._debug = this.world.sprites.debug.addChild(Render.Graphics({
            fill: [
                16711680,
                0.5
            ],
            rect: [
                0,
                0,
                1,
                1
            ]
        }));
        return super.debug(App1.debug.camera);
    }
    render({ DX =1 , DY =1 , DM =3  } = {
    }) {
        if (this.throttle) {
            this.debounce = true;
            return;
        }
        this.throttle = true;
        this.debug();
        const { x: x11 , y: y2  } = this;
        const X4 = Math.floor(x11 / 32);
        const Y3 = Math.floor(y2 / 32);
        const visible = [];
        for(let x12 = X4 - DX; x12 <= X4 + DX; x12++)for(let y3 = Y3 - DY; y3 <= Y3 + DY; y3++)visible.push(`${x12};${y3}`);
        visible.forEach((id3)=>{
            if (!this.world.loaded.chunks.has(id3)) this.world.loaded.chunks.set(id3, new Chunk({
                id: id3,
                world: this.world
            }));
            this.world.loaded.chunks.get(id3)?.show();
        });
        this.world.loaded.chunks.forEach((chunk, id3)=>{
            if (!visible.includes(id3)) {
                chunk.hide();
                if (Math.sqrt((chunk.x - X4) ** 2 + (chunk.y - Y3) ** 2) > DM) {
                    this.world.loaded.chunks.delete(id3);
                    chunk.destructor();
                }
            }
        });
        const areas = new Set();
        this.world.loaded.chunks.forEach((chunk)=>chunk.areas.forEach((area1)=>areas.add(area1)
            )
        );
        this.world.loaded.areas.forEach((area1, id3)=>{
            if (!areas.has(area1)) {
                this.world.loaded.areas.delete(id3);
                area1.destructor();
            }
        });
        this.world.app?.controller?.updateDOM();
        setTimeout(()=>{
            this.throttle = false;
            if (this.debounce) {
                this.debounce = false;
                this.render();
            }
        }, 200);
    }
    get location() {
        return [
            ...this.world.loaded.areas.values()
        ].filter((area1)=>(area1.data.type === "locations" || area1.data.type === "regions") && area1.contains(this)
        ).map(({ data: data2  })=>data2.name
        );
    }
    moveTo({ x , y  }) {
        this.world.sprites.world.position.set(-x * 16 + global1.document.body.clientWidth / 2, -y * 16 + global1.document.body.clientHeight / 2);
        this.render();
    }
}
class World {
    sprites;
    loaded = {
        chunks: new Map(),
        areas: new Map()
    };
    camera;
    minimap;
    name = "overworld";
    app;
    constructor({ app: app2  }){
        this.app = app2;
        const sprite = Render.app.stage.addChild(Render.Container());
        this.sprites = {
            world: sprite,
            chunks: sprite.addChild(Render.Container()),
            locations: sprite.addChild(Render.Container()),
            debug: sprite.addChild(Render.Container()),
            minimap: Render.app.stage.addChild(Render.Container())
        };
        this.camera = new Camera({
            world: this
        });
        this.minimap = new Minimap({
            world: this
        });
        const textures = [
            2374,
            2375,
            2376,
            2377,
            2378,
            2379,
            2380,
            2381
        ].map((frame)=>Render.Texture({
                frame
            })
        );
        let tick = 0;
        Render.engine.Ticker.shared.add(()=>{
            tick += 0.0625;
            if (Number.isInteger(tick)) this.loaded.chunks.forEach((chunk)=>{
                if (chunk.layers.has("0X")) chunk.layers.get("0X").texture = textures[tick % textures.length];
            });
            this.loaded.areas.forEach((area1)=>area1.npcs.forEach((npc)=>npc.update(tick)
                )
            );
        });
    }
    chunkAt({ x , y  }) {
        return this.loaded.chunks.get(`${Math.floor(x / 32)};${Math.floor(y / 32)}`);
    }
}
globalThis.app = new App1();
export { App1 as App };
