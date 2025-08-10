const inquirer = require('inquirer');
const path = require('path');
const globby = require('globby');
const ejs = require('ejs');
const fs = require('fs');
const fsExtra = require('fs-extra');

const SERVER_FILE = path.join(process.cwd(), 'server');
const TEMPLATE_SRC = path.join(__dirname, 'template');

const files = [];
function create() {
      inquirer
      .prompt([
        { 
          name: 'name',
          message: 'modeule name'
        }
      ])
      .then(async (answers) => {
        // 获取template文件下的所有文件列表
        const _files = await globby(['**/*'], { cwd: TEMPLATE_SRC, dot: true });

        // 遍历文件列表获取文件数据
        for(const rawPath of _files) {
            const sourcePath = path.resolve(TEMPLATE_SRC, rawPath);
            // 解析文件内容
            const content = renderFile(sourcePath, { name: 'trastorTest' });
            files[rawPath] = content;

            // 生成新文件
            const targetDir = path.resolve(SERVER_FILE, 'test', rawPath);
            generate(targetDir, content);
        }
      
      }).catch((error) => {
        console.error('出错啦！', error);
      });
};

// 使用ejs替换文件内容
function renderFile(name, data) {
    // 返回文件内容
    const template = fs.readFileSync(name, 'utf-8');
    return ejs.render(template, data);
}

// 生成文件内容
async function generate(filePath, data) {
    await fsExtra.ensureDirSync(path.dirname(filePath));
    await fs.writeFileSync(filePath, data);
}

module.exports = create;