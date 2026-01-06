const heading = document.getElementById('myHeading');
if (!(heading instanceof HTMLHeadingElement)) {
    throw new Error("Missing heading");
}
heading.style.color = 'red'