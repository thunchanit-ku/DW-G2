'use client';

import Lottie from 'lottie-react';

// Example animation - you can replace this with any Lottie animation JSON
const animationData = {
  "v": "5.7.4",
  "fr": 60,
  "ip": 0,
  "op": 180,
  "w": 300,
  "h": 300,
  "nm": "Loading",
  "ddd": 0,
  "assets": [],
  "layers": [
    {
      "ddd": 0,
      "ind": 1,
      "ty": 4,
      "nm": "Circle",
      "sr": 1,
      "ks": {
        "o": {"a": 0, "k": 100},
        "r": {"a": 1, "k": [{"t": 0, "s": [0], "e": [360]}, {"t": 180}]},
        "p": {"a": 0, "k": [150, 150, 0]},
        "a": {"a": 0, "k": [0, 0, 0]},
        "s": {"a": 0, "k": [100, 100, 100]}
      },
      "ao": 0,
      "shapes": [
        {
          "ty": "gr",
          "it": [
            {
              "ty": "el",
              "s": {"a": 0, "k": [100, 100]},
              "p": {"a": 0, "k": [0, 0]}
            },
            {
              "ty": "st",
              "c": {"a": 0, "k": [0.09, 0.47, 1, 1]},
              "o": {"a": 0, "k": 100},
              "w": {"a": 0, "k": 10}
            },
            {
              "ty": "tr",
              "p": {"a": 0, "k": [0, 0]},
              "a": {"a": 0, "k": [0, 0]},
              "s": {"a": 0, "k": [100, 100]},
              "r": {"a": 0, "k": 0},
              "o": {"a": 0, "k": 100}
            }
          ]
        }
      ]
    }
  ]
};

export default function LottieAnimation() {
  return (
    <div className="flex justify-center">
      <div style={{ width: 150, height: 150 }}>
        <Lottie 
          animationData={animationData} 
          loop={true}
        />
      </div>
    </div>
  );
}

