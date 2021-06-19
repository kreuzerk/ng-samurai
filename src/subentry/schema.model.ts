export interface Schema {
  name: string;
  filesPath?: string;
  path?: string;
  project?: string;
  generateComponent?: boolean;
  generateModule?: boolean;
  style?: string;
  inlineStyle?: boolean;
  inlineTemplate?: boolean;
  skipTests?: boolean;
}
