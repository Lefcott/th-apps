/** @format */
import React from "react";
import BaseCell, { BaseCellValue } from "./BaseCell";

function normalize(phone) {
  return phone.replace(/(\d{3})(\d{3})(\d{4})/, "($1) $2-$3");
}

export default function PhoneCell({ value, globalFilterValue, ...props }) {
  return (
    <BaseCell>
      <BaseCellValue searchWords={globalFilterValue}>
        {value && normalize(value)}
      </BaseCellValue>
    </BaseCell>
  );
}
