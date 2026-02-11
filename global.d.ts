// Allow side-effect imports like `import './globals.css'`
declare module "*.css";

// For CSS modules imported as bindings: `import styles from './something.module.css'`
declare module "*.module.css" {
  const classes: {readonly [key: string]: string};
  export default classes;
}
