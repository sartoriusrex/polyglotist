declare module '*.svg' {
  const content: any;
  export default content;
}

declare module '*.png' {
  const content: any;
  export default content;
}

declare module '*.scss' {
  const classNames: { [className: string]: string };
  export default classNames;
}

declare module "test-utils";

declare module "test-router";

declare module "states";
