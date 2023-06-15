import * as React from 'react';
import { SVGProps } from 'react';

export const SearchEmpty = (props: SVGProps<SVGSVGElement>) => (
  <svg
    viewBox="0 0 100 100"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    width={100}
    {...props}
  >
    <circle cx={50} cy={50} r={41} fill="#F2F4FF" />
    <circle
      cx={50}
      cy={50}
      r={46.811}
      transform="rotate(3.357 50 50)"
      stroke="#B5B9FB"
    />
    <circle cx={50.5} cy={49.5} r={37} stroke="#ACB1FA" />
    <rect
      x={6.801}
      y={23.836}
      width={48.346}
      height={69.494}
      rx={1.5}
      fill="#fff"
      stroke="#DADADA"
    />
    <path
      stroke="#DADADA"
      d="M13.801 33.836h35M13.801 45.836h35M13.801 57.836h35M13.801 69.836h35M13.801 81.836h35"
    />
    <circle cx={31.963} cy={93.33} r={3.5} fill="#4D6AF2" />
    <rect
      x={34.523}
      y={71.568}
      width={43.249}
      height={27.932}
      rx={1.5}
      fill="#fff"
      stroke="#DADADA"
    />
    <path
      stroke="#DADADA"
      d="M35.053 78.754h42.711M42.948 81.5v15.274M51.458 81.5v15.274M59.967 81.5v15.274M68.476 81.5v15.274M39.129 85.5h33.037M39.129 92h33.037"
    />
    <mask id="a" fill="#fff">
      <path d="M48.978 62.379c4.338 4.77 11.346 5.667 16.676 2.483.052.07.108.138.168.204l16.127 17.738a2.664 2.664 0 0 0 3.942-3.584L69.764 61.481a2.718 2.718 0 0 0-.187-.186c3.676-5.003 3.448-12.065-.89-16.836-4.948-5.443-13.371-5.844-18.814-.895-5.443 4.948-5.843 13.372-.895 18.815Zm16.127-2.062A9.323 9.323 0 1 1 52.56 46.52a9.323 9.323 0 0 1 12.544 13.797Z" />
    </mask>
    <path
      d="M48.978 62.379c4.338 4.77 11.346 5.667 16.676 2.483.052.07.108.138.168.204l16.127 17.738a2.664 2.664 0 0 0 3.942-3.584L69.764 61.481a2.718 2.718 0 0 0-.187-.186c3.676-5.003 3.448-12.065-.89-16.836-4.948-5.443-13.371-5.844-18.814-.895-5.443 4.948-5.843 13.372-.895 18.815Zm16.127-2.062A9.323 9.323 0 1 1 52.56 46.52a9.323 9.323 0 0 1 12.544 13.797Z"
      fill="#fff"
    />
    <path
      d="m65.654 64.862.802-.597-.54-.725-.775.463.513.859Zm-16.676-2.483-.74.672.74-.672Zm16.844 2.687-.74.672.74-.672Zm16.127 17.738.74-.672-.74.672Zm3.764.18.672.74-.672-.74Zm.178-3.764-.74.673.74-.673ZM69.764 61.481l-.74.673.74-.673Zm-.187-.186-.806-.592-.535.728.67.606.67-.742Zm-.89-16.836-.74.673.74-.673Zm-18.814-.895-.673-.74.673.74Zm2.061 16.127-.74.672.74-.672Zm13.17.626.673.74-.672-.74ZM52.562 46.52l-.673-.74.673.74Zm13.17.627-.74.673.74-.673Zm-.59 16.856c-4.93 2.946-11.412 2.115-15.423-2.297l-1.48 1.345c4.664 5.13 12.199 6.093 17.929 2.67l-1.026-1.718Zm1.42.39a1.721 1.721 0 0 1-.105-.129l-1.604 1.195c.071.096.148.19.23.28l1.48-1.346ZM82.69 82.132l-16.127-17.74-1.48 1.346L81.21 83.477l1.48-1.345Zm2.35.111a1.664 1.664 0 0 1-2.35-.111l-1.48 1.345a3.664 3.664 0 0 0 5.176.246l-1.345-1.48Zm.113-2.35c.618.68.568 1.732-.112 2.35l1.345 1.48a3.664 3.664 0 0 0 .246-5.175l-1.48 1.345ZM69.024 62.154l16.128 17.739 1.48-1.345-16.128-17.74-1.48 1.346Zm-.118-.117c.04.037.08.076.118.117l1.48-1.345a3.703 3.703 0 0 0-.257-.256l-1.34 1.484Zm-.958-16.905c4.011 4.412 4.223 10.944.823 15.57l1.612 1.185c3.952-5.38 3.709-12.97-.955-18.1l-1.48 1.345Zm-17.402-.828c5.034-4.577 12.825-4.206 17.402.828l1.48-1.346c-5.32-5.851-14.376-6.282-20.228-.962l1.346 1.48Zm-.828 17.402c-4.577-5.034-4.206-12.825.828-17.402l-1.346-1.48c-5.851 5.32-6.282 14.376-.962 20.227l1.48-1.345Zm1.476-1.343c3.836 4.219 10.365 4.53 14.583.694l-1.345-1.48a8.323 8.323 0 0 1-11.758-.559l-1.48 1.345Zm.694-14.582c-4.218 3.835-4.529 10.364-.694 14.582l1.48-1.345a8.323 8.323 0 0 1 .56-11.758l-1.346-1.48Zm14.583.693c-3.835-4.218-10.364-4.529-14.583-.693l1.346 1.48a8.323 8.323 0 0 1 11.757.559l1.48-1.346Zm-.694 14.583c4.219-3.835 4.53-10.364.694-14.583l-1.48 1.346a8.323 8.323 0 0 1-.559 11.757l1.345 1.48Z"
      fill="#DADADA"
      mask="url(#a)"
    />
    <circle cx={71.476} cy={71.068} r={3.5} fill="#ACB1FA" />
    <circle cx={55.647} cy={23.336} r={3.5} fill="#FB0" />
  </svg>
);