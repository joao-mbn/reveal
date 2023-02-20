import * as React from 'react';
import { SVGProps } from 'react';

export const PinchRight = (props: SVGProps<SVGSVGElement>) => (
  <svg
    viewBox="0 0 100 93"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    width={100}
    {...props}
  >
    <rect
      x={0.5}
      y={0.5}
      width={99}
      height={64}
      rx={4.5}
      stroke="#000"
      fill="#333"
    />
    <path
      opacity={0.235}
      d="M65.352 18.41a9 9 0 1 1-17.133-5.517 9 9 0 0 1 17.133 5.517Z"
      stroke="#fff"
    />
    <path
      d="M61.544 17.184a5 5 0 1 1-9.518-3.065 5 5 0 0 1 9.518 3.065Z"
      stroke="#fff"
    />
    <path
      opacity={0.235}
      d="M40.313 43.966a9 9 0 1 1-17.133-5.518 9 9 0 0 1 17.133 5.518Z"
      stroke="#fff"
    />
    <path
      d="M36.505 42.74a5 5 0 1 1-9.518-3.066 5 5 0 0 1 9.518 3.066Z"
      stroke="#fff"
    />
    <g filter="url(#a)">
      <mask
        id="b"
        maskUnits="userSpaceOnUse"
        x={20.373}
        y={9.489}
        width={70.034}
        height={79.714}
        fill="#000"
      >
        <path fill="#fff" d="M20.373 9.489h70.034v79.714H20.373z" />
        <path d="m43.111 52.52-2.09-5.755c-1.045-3.807-5.06-6.366-8.968-5.722l.911-.15c-.97.16-1.712 1.098-1.655 2.094l.696 12.138c.11 1.925 1.02 4.889 2.028 6.555 0 0 6.715 9.83 5.877 12.435l-1.062 3.297 13.598 4.38 5.589-5.705 1.21 7.894 3.4 1.094 1.061-3.297c.839-2.605 8.051-9.337 8.051-9.337 1.458-1.29 3.647-3.686 4.247-5.55l4.418-13.717c.916-3.057-1.37-6.51-4.555-7.535-1.594-.513-3.28.302-3.77 1.821l-.354 1.099c.978-3.037-.81-6.33-3.996-7.355-1.593-.513-3.28.301-3.77 1.82l-.353 1.1c.978-3.038-.811-6.33-3.996-7.356-1.594-.513-3.966.082-4.455 1.6l-.354 1.1c.157-.489.383-.844.381-1.184l5.657-17.565c.498-1.953-.985-4.073-2.863-4.678-1.89-.609-3.33.607-3.935 2.484l-5.474 16.998-5.474 16.998Z" />
      </mask>
      <path
        d="m43.111 52.52-2.09-5.755c-1.045-3.807-5.06-6.366-8.968-5.722l.911-.15c-.97.16-1.712 1.098-1.655 2.094l.696 12.138c.11 1.925 1.02 4.889 2.028 6.555 0 0 6.715 9.83 5.877 12.435l-1.062 3.297 13.598 4.38 5.589-5.705 1.21 7.894 3.4 1.094 1.061-3.297c.839-2.605 8.051-9.337 8.051-9.337 1.458-1.29 3.647-3.686 4.247-5.55l4.418-13.717c.916-3.057-1.37-6.51-4.555-7.535-1.594-.513-3.28.302-3.77 1.821l-.354 1.099c.978-3.037-.81-6.33-3.996-7.355-1.593-.513-3.28.301-3.77 1.82l-.353 1.1c.978-3.038-.811-6.33-3.996-7.356-1.594-.513-3.966.082-4.455 1.6l-.354 1.1c.157-.489.383-.844.381-1.184l5.657-17.565c.498-1.953-.985-4.073-2.863-4.678-1.89-.609-3.33.607-3.935 2.484l-5.474 16.998-5.474 16.998Z"
        fill="#fff"
      />
      <path
        d="m43.111 52.52-.94.342a1 1 0 0 0 1.892-.035l-.952-.306Zm-2.09-5.755-.964.265c.007.026.015.051.024.076l.94-.341Zm-9.13-6.709a1 1 0 1 0 .325 1.974l-.325-1.974Zm1.236 1.824a1 1 0 1 0-.326-1.974l.326 1.974Zm-1.818 1.107-.998.058.998-.058Zm.696 12.138.998-.057-.998.057Zm2.028 6.555-.855.518.03.046.825-.564Zm4.815 15.732-.952-.306a1 1 0 0 0 .645 1.258l.307-.952Zm13.598 4.38-.307.951a1 1 0 0 0 1.021-.252l-.714-.7Zm5.589-5.705.988-.152a1 1 0 0 0-1.703-.548l.715.7Zm1.21 7.894-.989.151a1 1 0 0 0 .682.8l.307-.951Zm3.4 1.094-.307.952a1 1 0 0 0 1.258-.645l-.952-.307Zm1.061-3.297-.952-.307.952.307Zm8.051-9.337-.663-.748a.818.818 0 0 0-.02.017l.683.732Zm8.665-19.267.952.306.005-.019-.957-.287Zm-9.63-4.922a1 1 0 0 0 1.903.613l-1.904-.613Zm-6.815-5.227-.951-.307.951.307Zm-1.305.792a1 1 0 1 0 1.904.613l-1.904-.613Zm-8.805-4.656a1 1 0 0 0 1.904.613l-1.904-.613Zm1.333-.877-.952-.307c-.032.101-.048.206-.048.312l1-.005Zm5.657-17.565.952.307.017-.06-.97-.247Zm-6.798-2.194-.952-.306.952.306Zm-5.474 16.998-.952-.306.952.306ZM44.051 52.18l-2.09-5.755-1.88.682 2.09 5.756 1.88-.683ZM41.986 46.5c-1.182-4.304-5.685-7.17-10.095-6.444l.325 1.974c3.407-.562 6.932 1.69 7.841 5l1.929-.53Zm-9.77-4.47.91-.15-.325-1.974-.91.15.325 1.974Zm.585-2.124c-1.485.245-2.576 1.642-2.49 3.139l1.996-.115c-.028-.497.365-.976.82-1.05l-.326-1.974Zm-2.49 3.139.695 12.138 1.997-.115-.696-12.138-1.997.115Zm.695 12.138c.12 2.085 1.078 5.207 2.172 7.015l1.71-1.035c-.922-1.526-1.784-4.332-1.885-6.095l-1.997.115Zm3.027 6.497-.825.564v.002l.004.004.013.02.054.08c.048.071.119.176.208.311a78.77 78.77 0 0 1 2.928 4.752c.779 1.376 1.514 2.803 2 4.03.245.613.415 1.149.502 1.585.092.462.067.698.04.78l1.904.613c.184-.569.132-1.21.018-1.784-.12-.6-.337-1.26-.604-1.933-.537-1.35-1.323-2.868-2.119-4.275a80.58 80.58 0 0 0-3.003-4.875 55.904 55.904 0 0 0-.288-.43l-.004-.006-.002-.001-.826.563Zm4.925 12.128-1.062 3.298 1.904.613 1.062-3.298-1.904-.613Zm-.417 4.556 13.598 4.379.613-1.904-13.598-4.379-.613 1.904Zm14.619 4.127 5.589-5.704-1.428-1.4-5.59 5.704 1.429 1.4Zm3.886-6.253 1.21 7.894 1.977-.303-1.21-7.894-1.977.303Zm1.892 8.695 3.4 1.094.613-1.903-3.4-1.095-.613 1.904Zm4.658.449 1.062-3.297-1.904-.614-1.062 3.298 1.904.613Zm1.062-3.297c.147-.458.644-1.24 1.442-2.242.769-.965 1.727-2.027 2.671-3.021a96.08 96.08 0 0 1 3.65-3.632l.014-.013.003-.004h.001l-.682-.731-.683-.731-.001.001a.243.243 0 0 0-.004.004l-.017.015-.062.059-.234.221c-.201.192-.49.468-.837.807a97.945 97.945 0 0 0-2.598 2.626c-.963 1.014-1.965 2.124-2.785 3.153-.79.993-1.51 2.03-1.782 2.874l1.904.614Zm7.762-8.895a23.444 23.444 0 0 0 2.56-2.68c.826-1.02 1.618-2.202 1.976-3.313l-1.903-.613c-.243.753-.846 1.702-1.628 2.668a21.449 21.449 0 0 1-2.33 2.44l1.325 1.498Zm4.536-5.993 4.418-13.717-1.904-.613-4.417 13.717 1.903.613ZM81.38 53.46c.558-1.858.126-3.781-.848-5.345-.973-1.562-2.528-2.84-4.358-3.429l-.613 1.904c1.355.436 2.536 1.398 3.273 2.582.737 1.184.99 2.515.63 3.714l1.916.574Zm-5.206-8.774c-2.076-.668-4.356.38-5.028 2.467l1.904.612c.306-.95 1.4-1.533 2.511-1.175l.613-1.904Zm-5.028 2.467-.354 1.098 1.904.613.354-1.099-1.904-.612Zm1.55 1.711c1.16-3.605-.974-7.432-4.641-8.613l-.614 1.904c2.703.87 4.146 3.627 3.351 6.096l1.904.613Zm-4.641-8.613c-2.076-.669-4.356.379-5.028 2.466l1.903.613c.307-.951 1.4-1.533 2.511-1.175l.614-1.904Zm-5.028 2.466-.354 1.099 1.904.613.353-1.099-1.903-.613Zm1.55 1.712c1.16-3.605-.974-7.432-4.642-8.614l-.613 1.904c2.703.87 4.146 3.628 3.35 6.097l1.905.613Zm-4.642-8.614c-1.017-.327-2.224-.293-3.254.038-1.013.326-2.076 1.02-2.459 2.208l1.904.613c.106-.33.474-.694 1.167-.916.677-.218 1.453-.224 2.03-.039l.612-1.904Zm-5.713 2.246-.354 1.099 1.904.613.354-1.099-1.904-.613Zm1.55 1.712c.066-.205.13-.335.229-.587.08-.203.202-.531.2-.908l-2 .01c0-.037.01-.018-.061.164-.052.133-.18.424-.272.708l1.904.613Zm.381-1.184 5.657-17.564-1.904-.613-5.657 17.564 1.904.613Zm5.674-17.624c.331-1.3-.009-2.6-.667-3.63-.657-1.028-1.678-1.867-2.858-2.247l-.613 1.904c.697.225 1.356.748 1.785 1.42.429.67.581 1.406.415 2.06l1.938.493ZM58.3 15.09c-1.232-.397-2.389-.205-3.324.438-.901.621-1.52 1.606-1.87 2.692l1.904.613c.255-.792.658-1.353 1.1-1.657.41-.282.918-.394 1.577-.182l.613-1.904Zm-5.194 3.13-5.474 16.998 1.904.613 5.474-16.998-1.904-.613Zm-5.474 16.998L42.16 52.214l1.903.613 5.474-16.997-1.904-.613Z"
        fill="#000"
        mask="url(#b)"
      />
    </g>
    <g filter="url(#c)">
      <path
        d="M34.447 10.449h7v7l-2.793-2.793-7 7 2.793 2.793h-7v-7l2.793 2.793 7-7-2.793-2.793Z"
        fill="#fff"
      />
    </g>
    <defs>
      <filter
        id="a"
        x={17.592}
        y={7.489}
        width={75.815}
        height={85.034}
        filterUnits="userSpaceOnUse"
      >
        <feFlood result="BackgroundImageFix" />
        <feColorMatrix
          in="SourceAlpha"
          values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
        />
        <feOffset dy={1} />
        <feGaussianBlur stdDeviation={1.5} />
        <feColorMatrix values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.2 0" />
        <feBlend in2="BackgroundImageFix" result="effect1_dropShadow" />
        <feBlend in="SourceGraphic" in2="effect1_dropShadow" result="shape" />
      </filter>
      <filter
        id="c"
        x={24.447}
        y={8.449}
        width={20}
        height={20}
        filterUnits="userSpaceOnUse"
      >
        <feFlood result="BackgroundImageFix" />
        <feColorMatrix
          in="SourceAlpha"
          values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
        />
        <feOffset dy={1} />
        <feGaussianBlur stdDeviation={1.5} />
        <feColorMatrix values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0" />
        <feBlend in2="BackgroundImageFix" result="effect1_dropShadow" />
        <feBlend in="SourceGraphic" in2="effect1_dropShadow" result="shape" />
      </filter>
    </defs>
  </svg>
);
