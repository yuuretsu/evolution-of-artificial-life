import React from "react";
import styled from 'styled-components';
import Radio from "./Radio";

const Wrapper = styled.div`
    display: block;
    &:not(:last-child) {
        margin-bottom: 5px;
    }
`;

type RadioGrpoupProps = {
    name: string;
    list: { value: string, title: string }[];
    onChange: (value: string) => any;
    defaultChecked?: string;
};

const RadioGroup = (props: RadioGrpoupProps) => {
    return (
        <Wrapper>
            {
                props.list.map(
                    variant =>
                        <Radio
                            key={variant.value}
                            name={props.name}
                            title={variant.title}
                            defaultChecked={variant.value == props.defaultChecked}
                            value={variant.value}
                            onChange={props.onChange}
                        />
                )
            }
        </Wrapper>
    );
};

export default RadioGroup;