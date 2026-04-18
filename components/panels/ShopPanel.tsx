"use client";

import { useState } from "react";
import type { PanelId } from "@/lib/types";
import { useGumroad } from "@/lib/hooks/useGumroad";

interface ShopPanelProps {
  open: boolean;
  onClose: () => void;
  onNav: (p: PanelId) => void;
}

export default function ShopPanel({ open, onClose }: ShopPanelProps) {
  const { products } = useGumroad();
  const [bought, setBought] = useState<Record<number, boolean>>({});

  return (
    <div className={`panel${open ? " open" : ""}`}>
      <div className="panel-inner">
        <div className="panel-head">
          <div className="ph-left">
            <span className="ph-num">06</span>
            <span className="ph-sep" />
            <span className="ph-title">Shop</span>
            <span className="ph-badge">{products.length} products</span>
          </div>
          <div className="ph-actions">
            <button className="panel-close" onClick={onClose}><i className="ri-close-line" /> close</button>
          </div>
        </div>

        <div className="sgrid">
          {products.map((p, i) => (
            <div key={i} className="scard">
              <div className={`sc-vis ${p.vis}`}>
                <span className="sc-vis-n">{p.n}</span>
                {p.badge && (
                  <span className={`sc-badge ${p.badge}`}>{p.badge.toUpperCase()}</span>
                )}
                <span className={`sc-type ${p.type}`}>{p.typeLabel}</span>
                <h3>{p.title}</h3>
              </div>
              <div className="sc-body">
                <p>{p.desc}</p>
                <div className="sc-ft">
                  <div className="sc-price">{p.price}<sub>{p.sub}</sub></div>
                  <a
                    className={`bbuy${bought[i] ? " ok" : ""}`}
                    href={p.url ?? "#"}
                    target={p.url && p.url !== "#" ? "_blank" : undefined}
                    rel="noopener noreferrer"
                    onClick={p.url && p.url !== "#"
                      ? () => setBought((prev) => ({ ...prev, [i]: true }))
                      : (e) => { e.preventDefault(); setBought((prev) => ({ ...prev, [i]: true })); }
                    }
                  >
                    {bought[i] ? <><i className="ri-check-line" /> Added</> : "Buy now"}
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
