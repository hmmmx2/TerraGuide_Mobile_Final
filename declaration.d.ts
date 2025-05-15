declare module '*.svg' {
    import type { FunctionComponent, SVGProps } from 'react';
    const SvgComponent: FunctionComponent<
        SVGProps<SVGSVGElement> & {
        width?: number | string;
        height?: number | string;
    }
    >;
    export default SvgComponent;
}