import {asPath, deleteFolder, getParentPath, globSearch} from './filesystem.ts';

const main = async () => {
    const args = process.argv.slice(2);
    const foldersToFind = ['bin/'];
    let path = '';

    if (args.length > 2) {
        throw new Error('Please, provide up to 2 arguments, but not more.');
    }

    args.forEach((a) => {
        if (a === '-f' || a === '--full') {
            foldersToFind.push('packages/');
            return;
        }

        path = a;
    });

    const folders = await globSearch(path, false, foldersToFind);
    let matches:string[] = []
    console.debug("All matched folders", folders);
    console.info(`Matched ${folders.length} items. Validating...`);
    
    for (const folder of folders) {
        const parentPath = getParentPath(folder);
        if (folder.endsWith('bin')) {
            matches = await globSearch(parentPath, true, ['obj/', '*.csproj']);
            const objPath = matches.find((m) => asPath(m).endsWith('/obj'));
            if (objPath != null && matches.length > 1) {
                await deleteFolder(folder);
                await deleteFolder(objPath);
            } else{
                console.info(`Keeping ${folder} because it doesn't have a sibling .csproj file AND/OR obj folder`);
            }

            continue;
        }

        matches = await globSearch(parentPath, true, ['*.sln']);
        if (matches.length > 1){
            await deleteFolder(folder);
        }
    }
    
    console.info("Done!");
};

await main();