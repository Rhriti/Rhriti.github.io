function expand(box) {
    const content = box.querySelector('.content');
    if (content.style.height === '0px') {
        content.style.height = content.scrollHeight + 'px';
    } else {
        content.style.height = '0px';
    }
}