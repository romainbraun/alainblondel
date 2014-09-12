/**
 * CanvasRenderingContext2D.renderText extension
 */
if (CanvasRenderingContext2D && !CanvasRenderingContext2D.renderText) {
    // @param  letterSpacing  {float}  CSS letter-spacing property
    CanvasRenderingContext2D.prototype.renderText = function (text, x, y, letterSpacing) {
        if (!text || typeof text !== 'string' || text.length === 0) {
            return;
        }
        
        if (typeof letterSpacing === 'undefined') {
            letterSpacing = 0;
        }
        
        // letterSpacing of 0 means normal letter-spacing
        
        var characters = String.prototype.split.call(text, ''),
            index = 0,
            current,
            currentPosition = x,
            align = 1;
        
        if (this.textAlign === 'right') {
            characters = characters.reverse();
            align = -1;
        } else if (this.textAlign === 'center') {
            var totalWidth = 0;
            for (var i = 0; i < characters.length; i++) {
                totalWidth += (this.measureText(characters[i]).width + letterSpacing);
            }
            currentPosition = x - (totalWidth / 2);
        }
        
        while (index < text.length) {
            current = characters[index++];
            this.fillText(current, currentPosition, y);
            currentPosition += (align * (this.measureText(current).width + letterSpacing));
        }
    }
}