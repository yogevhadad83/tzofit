class Common {

    getRandomColor() {
        let letters = '012345'.split('');
        let color = '#';
        color += letters[Math.round(Math.random() * 5)];
        letters = '0123456789ABCDEF'.split('');
        for (let i = 0; i < 5; i++) {
            color += letters[Math.round(Math.random() * 15)];
        }
        return color;
    }

    createParagraph(text, margin, color) {
        return "<p style='color:" + color + "; margin-left:" + margin + "px;'>" + text + "</p>";
    }
}

export default new Common();