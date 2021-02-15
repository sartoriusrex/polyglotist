import '@testing-library/jest-dom/extend-expect';

declare module '*.module.scss' {
    const content: object;
    export default content;
}