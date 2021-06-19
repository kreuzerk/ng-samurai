import { Rule, Tree } from '@angular-devkit/schematics';
import { WorkspaceProject, WorkspaceSchema } from '@schematics/angular/utility/workspace-models';
import { logError } from '../shared/log-helper';

export function addTsconfigPaths(): Rule {
  return (tree: Tree) => {
    try {
      // While reading the tsconfig, use a regex replacement https://www.regextester.com/94245
      // to ensure no **JSON comments** are present. Comments lead to a JSON.parse error.
      const tsconfig = JSON.parse(
        tree
          .read('tsconfig.json')
          .toString()
          .replace(/\/\*[\s\S]*?\*\/|([^:]|^)\/\/.*$/gm, '')
      );
      const angularJSON = JSON.parse(tree.read('angular.json').toString());
      const libraryProjectNames = getLibraryProjectNames(angularJSON);

      if (!tsconfig.compilerOptions.paths) {
        tsconfig.compilerOptions.paths = {};
      }

      libraryProjectNames.forEach((libraryProjectName: string) => {
        tsconfig.compilerOptions.paths[`${libraryProjectName}/*`] = [
          `projects/${libraryProjectName}/*`,
          `projects/${libraryProjectName}`
        ];
      });

      tree.overwrite('tsconfig.json', JSON.stringify(tsconfig, null, 2));
    } catch (e) {
      logError(
        `Something went wrong while ng-samurai tried to update your tsconfig.json, ${e.toString()}`
      );
    }
  };
}

function getLibraryProjectNames(angularJSON: WorkspaceSchema): string[] {
  return Object.values(angularJSON.projects)
    .filter((project: WorkspaceProject) => project.projectType === 'library')
    .map((project: WorkspaceProject) => project.root.split('/')[1]);
}
