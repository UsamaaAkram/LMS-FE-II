import React from "react";
import { all_routes } from "../../../feature-module/router/all_routes";
import { Link } from "react-router-dom";

interface BreadcrumbProps {
  title: string;
}

const Breadcrumb: React.FC<BreadcrumbProps> = ({ title }) => {
  return (
    <div className="page-banner">
      <div className="container">
        <nav aria-label="breadcrumb" className="page-banner-breadcrumb">
          <Link to={all_routes.root}>Home</Link>
          <i className="isax isax-arrow-right-3" />
          <span aria-current="page">{title}</span>
        </nav>
        <h1 className="page-banner-title">{title}</h1>
      </div>
    </div>
  );
};

export default Breadcrumb;
