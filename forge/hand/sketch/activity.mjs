// forge/hand/sketch/activity.mjs — marker pulse trace with crossed peaks over a pencil construction line, a wobbly baseline and a few shadow hatches, so it carries the same ink density as its sibling icons instead of one thin zigzag.
export default function render() {
  return [
    ['path', {d:"M9.7 5.2Q10 4.2 10.4 2.9M13.9 15.2Q14.2 16.3 14.5 17.6M2.9 11.1Q4.5 11 6.4 11.1M17.6 11.1Q19.5 11 21.2 11.1",'stroke-width':0.5,'stroke-opacity':0.5,class:"wm-k"}],
    ['path', {d:"M6.4 23Q7 22.4 7.7 21.7M9.2 23Q9.8 22.4 10.5 21.7M12 23Q12.6 22.4 13.3 21.7M14.8 23Q15.4 22.4 16.1 21.7",'stroke-width':0.8,'stroke-opacity':0.5,class:"wm-deco"}],
    ['path', {d:"M2.4 10.9Q4.2 10.75 6.6 10.8M6.2 10.9Q8 7.2 9.9 3.3M9.6 3.6Q11.9 9.8 14.3 16.6M14 16.2Q15.9 13.4 17.6 10.7M17.3 10.9Q19.6 10.8 21.6 10.9",class:"wm-k"}],
    ['path', {d:"M3.8 20.6Q8 20.4 12.4 20.6Q16.2 20.7 20.4 20.5",class:"wm-deco"}],
  ]
}
