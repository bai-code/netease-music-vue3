<script>
export default function (domRef, status) {
  document.onclick = (e) => {
    // console.log(domRef)
    if (status.value) return
    const flag = domRef.value.contains(e.target)
    if (!flag) {
      console.log(flag)
      status.value = false
      return false
    }
  }
}
</script>
