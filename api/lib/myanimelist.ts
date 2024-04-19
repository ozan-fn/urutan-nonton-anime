import axios from "axios";
import * as cheerio from "cheerio";

async function getData(url: string) {
    const html = (await axios.get(url)).data;
    const $ = cheerio.load(html);

    let data: { type?: string; title?: string; link?: string }[] = [];

    $(".anime_detail_related_anime > tbody > tr").each((index, element) => {
        let row: { type?: string; title?: string; link?: string } = {};

        $(element)
            .find("td")
            .each((i, el) => {
                if (i === 0) {
                    row["type"] = $(el).text().trim();
                } else {
                    row["title"] = $(el).find("a").text().trim();
                    row["link"] = "https://myanimelist.net" + $(el).find("a").attr("href");
                }
            });

        data.push(row);
    });

    let title = $('div[itemprop="name"]  > h1 > strong').text()
    let thumb = $('img[itemprop="image"]').attr('data-src')
    let eps = $('span:contains("Episodes:")').parent().text().split(':')[1].trim()
    let genre = $('span[itemprop="genre"]').map((i, e) => $(e).text()).toArray()
    let theme = $('span:contains("Theme:")').next().text()
    let link = $('.horiznav_active').attr('href')
    let status = $('span:contains("Status:")').parent().text().split(':')[1].trim()
    let prequel = data.find((f) => f.type == "Prequel:")?.link
    let sequel = data.find((f) => f.type == "Sequel:")?.link;

    return { title, thumb, link, eps, status, genre, theme, prequel, sequel };
}

async function getPrequel(url: string) {
    var result = [];
    var newUrl = url;
    var loop = true;

    while (loop && newUrl) {
        const data = await getData(newUrl);
        const prequel = data.prequel

        result.unshift(data);

        if (!prequel) {
            loop = false;
        }

        if (prequel) {
            newUrl = prequel;
        }

    }

    return result;
}

async function getSequel(url: string) {
    var result = [];
    var newUrl = url;
    var loop = true;

    while (loop && newUrl) {
        const data = await getData(newUrl);
        const sequel = data.sequel

        result.push(data);

        if (!sequel) {
            loop = false;
        }

        if (sequel) {
            newUrl = sequel;
        }

    }

    return result;
}

async function myanimelist(url: string) {
    const data = await getData(url);
    const prequel = data.prequel
    const sequel = data.sequel

    const data2 = data

    const [data1, data3] = await Promise.all([
        (prequel && getPrequel(prequel)) || [],
        (sequel && getSequel(sequel)) || []
    ]);

    return [...data1, data2, ...data3];
}

export default myanimelist
