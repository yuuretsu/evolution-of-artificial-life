import type { ComponentType, FC } from 'react';

export const bindReactProps = <OriginalProps, PartialProps extends Partial<OriginalProps>>(
  Component: ComponentType<OriginalProps>,
  partialProps: PartialProps
) => {
  type RestProps = Omit<OriginalProps, keyof PartialProps>;
  const Bound: FC<RestProps> = (props) => {
    // @ts-ignore
    return <Component {...partialProps} {...props} />;
  };

  return Bound;
};
