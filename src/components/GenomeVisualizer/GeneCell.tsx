import React from "react";
import styled from "styled-components";
import Rgba from "../../lib/color";
import { Gene } from "../../lib/genome";
import { GENE_CELL_SIZE as CELL_SIZE } from "../../settings";

const GeneCellWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: ${CELL_SIZE}px;
  height: ${CELL_SIZE}px;
`;

type GeneCellProps = {
  gene: Gene;
  state: null | "activeLast" | "active";
  onClick?: React.MouseEventHandler<HTMLDivElement>;
  children?: React.ReactNode;
  selected?: boolean;
};

const transitionVariants: GeneCellProps["state"][] = ["active", "activeLast"];

export const GeneCell = (props: GeneCellProps) => {
  const backgroundColor = props.gene.template.color
    ? props.gene.template.color
        .interpolate(
          props.state === "active"
            ? props.gene.template.color
            : new Rgba(50, 50, 50, 127),
          0.75
        )
        .toString()
    : "rgba(127, 127, 127, 0.1)";
  const border = props.state
    ? props.state === "active"
      ? "3px solid white"
      : "2px solid rgba(255, 255, 255, 0.5)"
    : "none";
  const size =
    props.state === "active" ? `${CELL_SIZE * 0.9}px` : `${CELL_SIZE * 0.6}px`;
  const transition = transitionVariants.includes(props.state)
    ? "box-shadow 0.5s"
    : "background-color 0.2s, transform 0.5s, min-width 0.2s, min-height 0.2s, box-shadow 0.5s";
  const colorIfActive =
    props.gene.template.color
      ?.interpolate(new Rgba(255, 255, 255, 255), 0.5)
      .toString() || "gray";
  const boxShadow = props.selected ? `0 0 10px 0 ${colorIfActive}` : "none";
  const zIndex = props.state === "active" ? 1 : 0;
  return (
    <GeneCellWrapper>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          boxSizing: "border-box",
          backgroundColor,
          border,
          transition,
          boxShadow,
          zIndex,
          borderRadius: "100%",
          minWidth: size,
          minHeight: size,
          maxWidth: size,
          maxHeight: size,
          cursor: "pointer",
          fontSize: "8px",
        }}
        onClick={props.onClick}
      >
        <span>{props.children}</span>
      </div>
    </GeneCellWrapper>
  );
};
