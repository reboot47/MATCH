const fs = require('fs').promises;
const path = require('path');

// 必要なパッケージをpackage.jsonに追加する関数
async function updatePackageJson() {
  try {
    const packageJsonPath = path.join(process.cwd(), 'package.json');
    const data = await fs.readFile(packageJsonPath, 'utf8');
    const packageJson = JSON.parse(data);

    // 必要なパッケージを確認し、足りなければ追加する
    const requiredDeps = {
      '@radix-ui/react-slot': '^1.0.2',
      '@radix-ui/react-dialog': '^1.0.5',
      'class-variance-authority': '^0.7.0',
    };

    let updated = false;

    // 依存関係を確認して更新
    for (const [pkg, version] of Object.entries(requiredDeps)) {
      if (!packageJson.dependencies[pkg]) {
        console.log(`Adding missing dependency: ${pkg}@${version}`);
        packageJson.dependencies[pkg] = version;
        updated = true;
      }
    }

    if (updated) {
      // package.jsonを更新
      await fs.writeFile(
        packageJsonPath,
        JSON.stringify(packageJson, null, 2),
        'utf8'
      );
      console.log('Updated package.json with missing dependencies');
    } else {
      console.log('All required dependencies are already in package.json');
    }
  } catch (error) {
    console.error('Error updating package.json:', error);
  }
}

// UIコンポーネントのインポートパスを修正する関数
async function fixComponentImports() {
  try {
    const componentsDir = path.join(process.cwd(), 'components', 'ui');
    const files = await fs.readdir(componentsDir);
    
    for (const file of files) {
      if (file.endsWith('.tsx') || file.endsWith('.ts')) {
        const filePath = path.join(componentsDir, file);
        let content = await fs.readFile(filePath, 'utf8');
        
        // @/lib/utils や @/components/ui/ へのインポートを相対パスに変更
        let updated = false;
        
        if (content.includes('@/lib/utils')) {
          content = content.replace(
            /from\s+['"]@\/lib\/utils['"]/g,
            'from "../../lib/utils"'
          );
          updated = true;
        }
        
        if (content.includes('@/components/ui/')) {
          content = content.replace(
            /from\s+['"]@\/components\/ui\/(.+)['"]/g,
            'from "./$1"'
          );
          updated = true;
        }
        
        if (updated) {
          await fs.writeFile(filePath, content, 'utf8');
          console.log(`Fixed imports in ${file}`);
        }
      }
    }
    
    console.log('All component imports have been fixed');
  } catch (error) {
    console.error('Error fixing component imports:', error);
  }
}

// 実行
async function run() {
  await updatePackageJson();
  await fixComponentImports();
}

run();
