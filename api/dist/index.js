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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const myanimelist_1 = __importDefault(require("./lib/myanimelist"));
const cors_1 = __importDefault(require("cors"));
const path_1 = __importDefault(require("path"));
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use((0, cors_1.default)());
app.post("/api/myanimelist", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const url = req.body.url;
        if (!url)
            return res.sendStatus(400);
        const result = yield (0, myanimelist_1.default)(url);
        res.json(result);
    }
    catch (error) {
        console.error(error);
        res.sendStatus(500);
    }
}));
app.use(express_1.default.static(path_1.default.join(__dirname, './public')));
app.listen(3001, () => {
    console.log(`server berjalan di http://localhost:3001`);
});
