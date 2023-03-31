import styled from 'styled-components';

const Wrapper = styled.div`
    &:not(:last-child) {
        margin-bottom: 10px;
    }
`;

const Title = styled.div`
    margin-bottom: 5px;
`;

type SubBlockProps = {
    name?: string;
    children?: React.ReactNode;
};

const SubBlock = (props: SubBlockProps) => {
    return (
        <Wrapper>
            {props.name && <Title>{props.name}</Title>}
            {props.children}
        </Wrapper>
    );
};

export default SubBlock;