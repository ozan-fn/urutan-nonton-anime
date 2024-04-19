import axios from "axios";
import { useState } from "react";

export default function App() {
    const [loading, setLoading] = useState(false);
    const [input, setInput] = useState("");
    const [result, setResult] = useState<{ title: string; thumb: string; link: string; eps: string; genre: string[]; theme: string; sequel: string }[]>([]);

    async function getData(url: string) {
        setLoading(true);

        try {
            const req = await axios.post(
                "/api/myanimelist",
                {
                    url: url,
                },
                {
                    headers: {
                        "Content-Type": "application/json",
                    },
                },
            );

            setResult([]);
            setResult(req.data);
        } catch (error) {
        } finally {
            setLoading(false);
        }
    }
    return (
        <div className="flex min-h-screen flex-col bg-zinc-800 p-4 text-zinc-200">
            <p className="text-2xl font-bold">URUTAN NONTON ANIME</p>

            <div className="mt-4 flex flex-row items-center">
                <input type="text" onChange={(e) => setInput(e.target.value)} placeholder="https://myanimelist.net/..." className="inline h-8 w-full max-w-sm rounded-md px-2 text-zinc-800 outline-none md:max-w-md" />
                <button onClick={() => getData(input)} className="ml-2 h-8 w-fit rounded-md border border-zinc-600 bg-zinc-700 px-2">
                    URUTKAN
                </button>
            </div>

            {input != "" && !input.includes("myanimelist.net") && <p className="italic text-red-400">url invalid</p>}
            {loading && (
                <div className="mt-4">
                    <Loading />
                </div>
            )}

            <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-7">
                {result.map((v, i) => (
                    <div key={i} className="flex flex-col">
                        <img src={v.thumb} alt="" className="rounded-md object-cover" style={{ aspectRatio: "3.5/5" }} />

                        <div className="mt-2 flex flex-col">
                            <a href={v.link} target="_blank" className="line-clamp-2 h-12 text-base font-semibold text-blue-400 hover:underline">
                                {i + 1}. {v.title}
                            </a>
                            <p className="text-zinc-300">Episodes: {v.eps}</p>
                            <p className="line-clamp-2 h-10 flex-1 text-sm italic text-zinc-400">{v.genre.join(", ")}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

function Loading() {
    return (
        <>
            <div className="h-6 w-6 animate-spin rounded-md bg-zinc-200"></div>
        </>
    );
}
