"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.initGallery = initGallery;
var IMAGES = [];
var IMAGES_TO_SHOW_PRE_BUTTON_PRESS = 20;
var IMAGES_TO_SHOW_AUTO_LOAD = 5;
var index = 0;
var loadedFirst = false;
function initGallery() {
    return __awaiter(this, void 0, void 0, function () {
        var gallery, heightCalcRowHeight, widthCalcRowHeight, rowHeight, btn;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    gallery = document.getElementById("gallery");
                    return [4 /*yield*/, initLightGallery()];
                case 1:
                    _a.sent();
                    window.addEventListener("message", function (event) {
                        if (event.data === "startloading" && !loadedFirst) {
                            showNextOnes(gallery);
                            //@ts-ignore
                            // $('#gallery').justifiedGallery('norewind');
                            $('#gallery').justifiedGallery({
                                rowHeight: rowHeight,
                                margins: 15,
                                lastRow: 'center',
                                captions: true
                            });
                            loadedFirst = true;
                        }
                    });
                    heightCalcRowHeight = window.parent ? window.parent.innerHeight / 3 : window.innerHeight / 3;
                    widthCalcRowHeight = window.parent ? window.parent.innerWidth / 3 : window.innerWidth / 3;
                    rowHeight = Math.max(heightCalcRowHeight, widthCalcRowHeight);
                    btn = document.getElementById("loadMore");
                    if ("ontouchstart" in window || navigator.maxTouchPoints || window.matchMedia("(pointer: coarse)").matches) {
                        btn.addEventListener("click", function () {
                            showNextOnes(gallery);
                            //@ts-ignore
                            $('#gallery').justifiedGallery('norewind');
                            if (index >= IMAGES.length) {
                                btn.style.display = "none";
                            }
                        });
                    }
                    else {
                        btn.style.display = "none";
                        $(window).on("scroll", function () {
                            var scrollTop = $(window).scrollTop();
                            var windowHeight = $(window).height();
                            var docHeight = $(document).height();
                            if (scrollTop + windowHeight === docHeight) {
                                add(IMAGES.slice(index, Math.min(index + IMAGES_TO_SHOW_AUTO_LOAD, IMAGES.length)), gallery);
                                index += IMAGES_TO_SHOW_AUTO_LOAD;
                                //@ts-ignore
                                $('#gallery').justifiedGallery('norewind');
                            }
                        });
                    }
                    return [2 /*return*/];
            }
        });
    });
}
initGallery();
function showNextOnes(gallery) {
    console.log(index);
    console.log(IMAGES);
    add(IMAGES.slice(index, Math.min(index + IMAGES_TO_SHOW_PRE_BUTTON_PRESS, IMAGES.length)), gallery);
    index += IMAGES_TO_SHOW_PRE_BUTTON_PRESS;
}
function initLightGallery() {
    return __awaiter(this, void 0, void 0, function () {
        var data, shuffle;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, fetch("./galleryImages.json")];
                case 1: return [4 /*yield*/, (_a.sent()).json()];
                case 2:
                    data = _a.sent();
                    shuffle = function (arr) {
                        var _a;
                        for (var i = arr.length - 1; i > 0; i--) {
                            var j = Math.floor(Math.random() * (i + 1));
                            _a = [arr[j], arr[i]], arr[i] = _a[0], arr[j] = _a[1];
                        }
                    };
                    shuffle(data);
                    IMAGES.push.apply(IMAGES, data);
                    return [2 /*return*/];
            }
        });
    });
}
function add(data, gallery) {
    var bigImagePercentage = 0.1;
    var random = function (min, max) { return Math.random() * (max - min) + min; };
    console.log(data);
    for (var _i = 0, data_1 = data; _i < data_1.length; _i++) {
        var image = data_1[_i];
        var img = document.createElement("img");
        img.src = image.src;
        img.alt = image.title;
        img.loading = "lazy";
        img.classList.add("gallery-image");
        img.setAttribute("data-src", image.src);
        img.setAttribute("data-sub-html", image.title);
        var a = document.createElement("a");
        if (random(0, 100) < bigImagePercentage * 100) {
            var width = image.width;
            var height = image.height;
            var aspectRatio = width / height;
            var randomMultiplier = random(1.2, 1.6);
            var newWidth = Math.floor(width * randomMultiplier);
            var newHeight = width / aspectRatio;
            img.setAttribute("width", newWidth.toString());
            img.setAttribute("height", newHeight.toString());
        }
        a.classList.add("gallery-image");
        a.href = image.src;
        a.appendChild(img);
        gallery.appendChild(a);
    }
}
