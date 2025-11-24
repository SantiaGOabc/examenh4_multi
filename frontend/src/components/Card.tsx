import React from "react";
import "./Card.css"

type Props = {
title: string;
description?: string;
price?: number | string;
};
export default function Card({ title, description, price }: Props) {
return (
<article className="card">
<div className="card-body">
<h3>{title}</h3>
{description && <p>{description}</p>}
</div>
{price !== undefined && <div className="card-footer">{price} Bs</div>}
</article>
);
}