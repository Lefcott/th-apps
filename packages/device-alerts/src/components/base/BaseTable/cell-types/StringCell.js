/** @format */
import React from "react";
import BaseCell, { BaseCellValue } from "./BaseCell";

export default function StringCell({ value, globalFilterValue }) {
  return (
    <BaseCell>
      <BaseCellValue searchWords={globalFilterValue}>{value}</BaseCellValue>
    </BaseCell>
  );
}
