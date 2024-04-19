"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = __importDefault(require("axios"));
const cheerio = __importStar(require("cheerio"));
function getData(url) {
    var _a, _b;
    return __awaiter(this, void 0, void 0, function* () {
        const html = (yield axios_1.default.get(url)).data;
        const $ = cheerio.load(html);
        let data = [];
        $(".anime_detail_related_anime > tbody > tr").each((index, element) => {
            let row = {};
            $(element)
                .find("td")
                .each((i, el) => {
                if (i === 0) {
                    row["type"] = $(el).text().trim();
                }
                else {
                    row["title"] = $(el).find("a").text().trim();
                    row["link"] = "https://myanimelist.net" + $(el).find("a").attr("href");
                }
            });
            data.push(row);
        });
        let title = $('div[itemprop="name"]  > h1 > strong').text();
        let thumb = $('img[itemprop="image"]').attr('data-src');
        let eps = $('span:contains("Episodes:")').parent().text().split(':')[1].trim();
        let genre = $('span[itemprop="genre"]').map((i, e) => $(e).text()).toArray();
        let theme = $('span:contains("Theme:")').next().text();
        let link = $('.horiznav_active').attr('href');
        let prequel = (_a = data.find((f) => f.type == "Prequel:")) === null || _a === void 0 ? void 0 : _a.link;
        let sequel = (_b = data.find((f) => f.type == "Sequel:")) === null || _b === void 0 ? void 0 : _b.link;
        return { title, thumb, link, eps, genre, theme, prequel, sequel };
    });
}
function getPrequel(url) {
    return __awaiter(this, void 0, void 0, function* () {
        var result = [];
        var newUrl = url;
        var loop = true;
        while (loop && newUrl) {
            const data = yield getData(newUrl);
            const prequel = data.prequel;
            result.unshift(data);
            if (!prequel) {
                loop = false;
            }
            if (prequel) {
                newUrl = prequel;
            }
        }
        return result;
    });
}
function getSequel(url) {
    return __awaiter(this, void 0, void 0, function* () {
        var result = [];
        var newUrl = url;
        var loop = true;
        while (loop && newUrl) {
            const data = yield getData(newUrl);
            const sequel = data.sequel;
            result.push(data);
            if (!sequel) {
                loop = false;
            }
            if (sequel) {
                newUrl = sequel;
            }
        }
        return result;
    });
}
function myanimelist(url) {
    return __awaiter(this, void 0, void 0, function* () {
        const data = yield getData(url);
        const prequel = data.prequel;
        const sequel = data.sequel;
        const data2 = data;
        const [data1, data3] = yield Promise.all([
            (prequel && getPrequel(prequel)) || [],
            (sequel && getSequel(sequel)) || []
        ]);
        return [...data1, data2, ...data3];
    });
}
exports.default = myanimelist;
