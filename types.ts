import { PropsWithChildren } from 'react'

export type BaseProps = PropsWithChildren<{ className?: string }>

interface Thumbnail {
  url: string;
  width: number;
  height: number;
}

interface Logo {
  id: string;
  url: string;
  filename: string;
  size: number;
  type: string;
  thumbnails?: {
    small: Thumbnail;
    large: Thumbnail;
    full: Thumbnail;
  };
}

export interface Certificate {
  id: string;
  fields: {
    name: string;
    marcas: string[];
    url: string;
    logo: Logo[];
  }
}

export interface Brand {
  id: string;

  fields: {
    // Basic info
    name: string;
    status: "accepted" | "pending" | "rejected";
    description: string;
    logo: Logo[];
    location: string;
    production: string[];
    type: string;
    otherTypes?: string[];
    sustainability?: string[];

    // Extra info
    language: string[];
    notes?: string;
    freeShipmentFrom: number;
    shipmentPolicy: string;
    freeChanges?: boolean; // Airtable only returns fields that are true, and hide false ones
    freeReturns?: boolean;
    highlight?: boolean;
    certificates: string[];
    allCertificates?: Certificate[]

    // URLs
    url: string;
    manifest?: string;
    faqs?: string;
    blog?: string;

    // Social media
    facebook?: string;
    instagram?: string;
    pinterest?: string;
    twitter?: string;
    youtube?: string;
  };
}

export interface BrandProps {
  brand: Brand
}

export interface BrandsProps {
  brands: Brand[]
}
