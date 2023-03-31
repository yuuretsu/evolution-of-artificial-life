import styled from 'styled-components';

const Wrapper = styled.div`
    &:not(:last-child) {
        margin-bottom: 20px;
    }
`;

const Title = styled.div`
    font-weight: bold;
    margin-bottom: 10px;
    font-size: 1.25em;
    text-transform: uppercase;
`;

type BlockProps = {
    name?: string;
    children?: React.ReactNode;
};

const Block = (props: BlockProps) => {
    return (
        <Wrapper>
            {props.name && <Title>{props.name}</Title>}
            {props.children}
        </Wrapper>
    );
};

export default Block;