"use client";

import axe from "@axe-core/react";
import React from "react";
import ReactDOM from "react-dom";
import { useEffect } from "react";

export function AxeBuilder() {
  useEffect(() => {
    if (process.env.NODE_ENV !== "production") {
      axe(React, ReactDOM, 1000);
    }
  }, []);
  return null;
}