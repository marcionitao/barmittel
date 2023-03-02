const random_color = () => {
  let n = (Math.random() * 0xffffff * 1000000).toString(16)
  return '#' + n.slice(0, 6)
}
//
export default random_color
