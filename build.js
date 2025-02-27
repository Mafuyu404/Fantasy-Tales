import svgtofont from "svgtofont";
import fs from "fs";
import Fontmin from "fontmin";
import rename from "gulp-rename";

const resource = [];

!fs.existsSync("./public/build/fonts") && fs.mkdirSync("./public/build/fonts");
let appContent = fs.readFileSync("./public/build/bundle.js", { encoding: "utf-8" });
appContent = [...new Set(Array.from(appContent))].join("");
const fontlist = {
  remark: "站酷仓耳渔阳体-W03",
  title: "ChillRoundGothic_Medium",
  normal: "SanJiSuXianJianTi-2",
  write: "ChillZhuo",
  penetrate: "TiejiliSC-Regular"
}
for (let key in fontlist) {
  const fontmin = new Fontmin()
    .src(`./public/fonts/${fontlist[key]}.ttf`)
    .use(Fontmin.glyph({
      text: appContent,
    }))
    .use(rename(`${key}.ttf`))
    .use(Fontmin.ttf2woff2())
    .dest('./public/build/fonts');
  fontmin.run(_ => {
    console.log('Fontmin done!');
  });
}

!fs.existsSync("cache") && fs.mkdirSync("cache");
!fs.existsSync("cache/svg") && fs.mkdirSync("cache/svg");
const svg = fs.readdirSync("public/svg");
for (let s of svg) {
  if (s.split(".")[1] == "svg") {
    fs.copyFileSync(`public/svg/${s}`, `cache/svg/${s}`);
  }
  else {
    const dir = fs.readdirSync(`public/svg/${s}`);
    for (let ss of dir) {
      fs.copyFileSync(`public/svg/${s}/${ss}`, `cache/svg/${ss}`);
    }
  }
}
svgtofont({
  src: 'cache/svg', // svg path
  dist: 'public/build/icon', // output path
  fontName: 'icon', // font name
  css: true, // Create CSS files.
}).then(_ => {
  console.log('Svgtofont done!');
  handle();
});

function handle() {
  fs.readdirSync("cache/svg").forEach(s => {
    fs.unlinkSync(`cache/svg/${s}`);
  });
  fs.rmdirSync("cache/svg");
  fs.readdirSync("./public/build/fonts").forEach(s => {
    if (s.includes(".ttf")) fs.unlinkSync(`./public/build/fonts/${s}`);
  });
  version();
  // if (fs.existsSync(`./public/resource.json`)) fs.unlinkSync(`./public/resource.json`);
  fn("./public");
  fs.writeFileSync("./resource.json", JSON.stringify(resource), { encodeing: "utf-8" });
  fs.writeFileSync("./public/resource.json", JSON.stringify(resource), { encodeing: "utf-8" });
  console.log("Created resource.json");
  console.log("Done!");
}

function version() {
  let _info = fs.readFileSync("package.json", { encoding: "utf-8" });
  let info = JSON.parse(_info);
  let ver = info.version.split(".");
  _info = _info.replace(ver[3], Number(ver[3]) + 1);
  fs.writeFileSync("package.json", _info);
  console.log("Package version updated!");
}

function fn(path) {
  let blacklist = [
    ".git",
    "svg",
    "js",
    "css",
    "img/something",
    "fonts",
    "img/cover.png"
    // "build/bundle.css",
    // "build/bundle.js",
    // "build/bundle.js.map",
    // "index.html",
  ];
  let files = fs.readdirSync(path);
  for (let item of files) {
    item = `${path}/${item}`;
    if (blacklist.includes(item.replace("./public/", ""))) continue;
    let data = fs.statSync(item);
    if (data.isFile()) {
      // console.log('文件名', item.replace("./public", ""));
      resource.push(item.replace("./public/", ""));
    } else {
      fn(item);
    }
  }
}