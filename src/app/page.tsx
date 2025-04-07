"use client";
import React, { useContext, useEffect, useRef, useState } from 'react';
import styles from "./page.module.css";
import TableData from "./table/index";
export default function Home() {
  return (
    <div className={styles.page}>
      <TableData />
    </div>
  );
}
