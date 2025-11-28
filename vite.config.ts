import { resolve } from 'path';
import { defineConfig, IndexHtmlTransformContext, PluginOption } from 'vite';
import FullReload from 'vite-plugin-full-reload'
import { readFileSync } from 'fs';

const srcRoot = resolve(__dirname, 'src');
const root = resolve(__dirname, '');
const outDir = resolve(__dirname, 'dist');

const serverRoot = "https://ascent-racing.com/";

enum FileType {
    TS = "ts",
    JSON = "json",
    HTML = "html",
    CSS = "css"
}

type Replcement = {
    fileType?: FileType|FileType[];
    replacement: string|File;
}

type File = {
    file: string;
}

type Replacements = {
    [key: string]: Replcement
};

const DEFAULT_REPLACEMENTS: Replacements = {

    "{{{FOOTER}}}": {
        fileType: FileType.HTML,
        replacement: {
            file: resolve(root, "./footer/index.html")
        }
    },
    "{{{LOGO_SVG}}}": {
        fileType: FileType.HTML,
        replacement: {
            file: resolve(root, "./src/icons/Logo.svg")
        }
    },
    "{{{CONTACT_FORMULAR}}}": {
        fileType: FileType.HTML,
        replacement: {
            file: resolve(root, "./contactFormular/index.html")
        }
    },
    "{{{SPONSORING_ROW_WORLD}}}": {
        fileType: FileType.HTML,
        replacement: {
            file: resolve(root, "./sponsoringRows/world.html")
        }
    },
    "{{{SPONSORING_ROW_GERMAN}}}": {
        fileType: FileType.HTML,
        replacement: {
            file: resolve(root, "./sponsoringRows/german.html")
        }
    },
    "{{{SPONSORING_ROW_HAMBURG}}}": {
        fileType: FileType.HTML,
        replacement: {
            file: resolve(root, "./sponsoringRows/hamburg.html")
        }
    },
    "{{{SPONSORING_ROW_RESIZE_LISTENER_AND_SCRIPT}}}": {
        fileType: FileType.HTML,
        replacement: {
            file: resolve(root, "./sponsoringRows/resizeListener.html")
        }
    },
    "{{{ABS}}}":{
        fileType: FileType.TS,
        replacement: "/new/"
    }

};


export default defineConfig({
    root: root,
    base: "/",
    server: {
        port: 3000,
        watch: {
            usePolling: true
        }
    },
    plugins: [
        FullReload(['**/*.ts', '**/*.json'], {
            always: false
        }),
        transformDefaults(),
        transformJsons(),
        transformPaths()
    ],
    build: {
        outDir: outDir,
        emptyOutDir: true,
        minify: true,
        rollupOptions: {
            input: {
                index: resolve(root, "index.html"),
                main: resolve(root, "main.html"),
                // sponsors: "/sponsors/index.html",
                aboutUs: resolve(root, "aboutUs", "index.html"),
                gallery: resolve(root, "gallery", "index.html"),
                impressum: resolve(root, "impressum", "index.html"),
                policy: resolve(root, "policy", "index.html"),
                theCar: resolve(root, "theCar", "index.html"),
                sponsoring: resolve(root, "sponsorings", "index.html"),
                gofundme: resolve(root, "gofundme", "index.html"),
                whatIsStemracing: resolve(root, "whatIsStemracing", "index.html"),
            }
        }
    }
});

const compile = (src: string, fileType: FileType) => {
    const hadInclude = src.includes("{{{SPONSORING_ROW_GERMAN}}}");
    for(const key in DEFAULT_REPLACEMENTS){
        const replacement = DEFAULT_REPLACEMENTS[key];
        if(replacement.fileType){
            if(replacement.fileType !== fileType && !replacement.fileType.includes(fileType))continue;
        }
        if(typeof replacement.replacement === "object"){
            if((replacement.replacement as File).file){
                const file = resolve(root, (replacement.replacement as File).file);
                const content = readFileSync(file, "utf-8");
                src = src.replaceAll(new RegExp(key, "gi"), content);
            }
        }
        if(typeof replacement.replacement === "string"){
            src = src.replaceAll(new RegExp(key, "gi"), replacement.replacement);
        }
    }

    return src;
};

function transformDefaults(){
    return {
        name: 'transform-defaults',
        transformIndexHtml: {
            handler: function(this: void, html: string, ctx: IndexHtmlTransformContext) {
                return compile(html, FileType.HTML);
            }
        },
        transform: {
            handler: function(this: any, code: string, id: string) {
                if(!id.includes(".html"))return code;
                return compile(code, getFileType(id));
            }
        }
    } as PluginOption;
}

function getFileType(id: string): FileType{
    if(id.includes(".ts"))return FileType.TS;
    if(id.includes(".json"))return FileType.JSON;
    if(id.includes(".css") || id.includes(".scss"))return FileType.CSS;
    return FileType.HTML;
}

function transformPaths() {
    return {
        name: 'transform-paths',
        transformIndexHtml: {
            handler: function(this: void, html: string, ctx: IndexHtmlTransformContext) {
                html = compilePaths(html, FileType.HTML);
                if(ctx.chunk)ctx.chunk.code = ctx.chunk?compilePaths(ctx.chunk?.code, FileType.HTML):ctx.chunk;
                return html;
            }
        },
        transform: {
            handler: function(this: any, code: string, id: string) {
                if(id.includes(".json") || id.includes("node_modules"))return code;
                code = compilePaths(code, id.includes(".ts") ? FileType.TS : (id.includes(".css")||id.includes(".scss")?FileType.CSS:FileType.HTML));
                return code;
            }
        }
    } as PluginOption;
}

function transformJsons() {
    return {
        name: 'transform-paths',
        transform: {
            order: "pre",
            handler: function(this: any, code: string, id: string) {
                if(!id.includes(".json") || id.includes("node_modules"))return code;
                code = compilePaths(code, FileType.JSON);
                return code;
            }
        }
    } as PluginOption;
}

function compilePaths(src: string, type: FileType){
    let result = src;
    if(type === FileType.TS){
        const s = src.replace(/(["`'])([\s\S]*?)\1/gs, (match, p1, p2) => {
            if(!p2.startsWith("//"))return `${p1}${p2}${p1}`;
            let content = p2.replace("//", serverRoot.endsWith("/") ? serverRoot : serverRoot + "/");
            return `${p1}${content}${p1}`;
        });
        result = s;
    }else if(type === FileType.JSON){
        const json = JSON.parse(src);
        const loop = (obj: any) => {
            for(const key in obj){
                if(typeof obj[key] === "string"){
                    if(obj[key].startsWith("//") && !obj[key].match(/^(?:[A-Za-z0-9+\/]{4})*(?:[A-Za-z0-9+\/]{2}==|[A-Za-z0-9+\/]{3}=)?$/gs)){
                        obj[key] = serverRoot.endsWith("/") ? serverRoot : serverRoot + "/" + obj[key].substring(2);
                    }
                }else if(typeof obj[key] === "object"){
                    loop(obj[key]);
                }
            }
        };
        loop(json);
        result = JSON.stringify(json);
    }else if(type === FileType.HTML){
        const s = src.replace((/(href|src|content)=(["`'])([\s\S]*?)\2/gs), (match, p1, p2, p3) => {
            if(!p3.startsWith("//"))return `${p1}=${p2}${p3}${p2}`;
            let content = p3.replace("//", serverRoot.endsWith("/") ? serverRoot : serverRoot + "/");
            return `${p1}=${p2}${content}${p2}`;
        });
        result = s;
    }else{
        const s = src.replace((/url\((["'`]?)([\s\S]*?)\1\)/gs), (match, p1, p2) => {
            if(!p2.startsWith("//"))return `url(${p1}${p2}${p1})`;
            let content = p2.replace("//", serverRoot.endsWith("/") ? serverRoot : serverRoot + "/");
            return `url(${p1}${content}${p1})`;
        });
        result = s;
    }
    return result;
}