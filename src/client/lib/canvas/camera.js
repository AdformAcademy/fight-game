var Rectangle = require('./rectangle');

var AXIS = {
    NONE: 'none', 
    HORIZONTAL: 'horizontal', 
    VERTICAL: 'vertical', 
    BOTH: 'both'
};

var Camera = function (params) {
    this.xView = params.xView || 0;
    this.yView = params.yView || 0;
    this.xDeadZone = 0;
    this.yDeadZone = 0;
    this.xPadding = 0;
    this.wView = params.canvasWidth;
    this.hView = params.canvasHeight;          
    this.axis = params.axis || AXIS.BOTH;  
    this.followed = null;
    this.following = false;
    this.viewportRect = new Rectangle(this.xView, this.yView, this.wView, this.hView);             
    this.worldRect = params.worldRect;
}

Camera.prototype.follow = function (gameObject, xDeadZone, yDeadZone, xPadding) {
    var self = this;   
    this.followed = gameObject; 
    this.yDeadZone = yDeadZone;
    this.xPadding = xPadding;
    this.xDeadZone = function () {
        return xDeadZone + self.xPadding;
    };
};                 

Camera.prototype.setPadding = function (xPadding) {
    this.xPadding = xPadding;
};

Camera.prototype.getPadding = function () {
    return this.xPadding;
};

Camera.prototype.isFollowing = function () {
    return this.following;
};

Camera.prototype.update = function () {
    if(this.followed !== null) {
        this.following = true;
        var xDeadZone = this.xDeadZone();  
        if(this.axis == AXIS.HORIZONTAL || this.axis == AXIS.BOTH) {
            if(this.followed.getX() + this.xPadding - this.xView + xDeadZone >= this.wView) {
                this.xView = this.followed.getX() - (this.wView - xDeadZone);
            } else if (this.followed.getX() + this.xPadding - xDeadZone < this.xView) {
                this.xView = this.followed.getX() + (this.xPadding * 2) - xDeadZone;
            }
        }
        if(this.axis == AXIS.VERTICAL || this.axis == AXIS.BOTH) {
            if (this.followed.getZ() - this.yView + this.yDeadZone > this.hView) {
                this.yView = this.followed.getZ() - (this.hView - this.yDeadZone);
            } else if (this.followed.getZ() - this.yDeadZone < this.yView) {
                this.yView = this.followed.getZ() - this.yDeadZone;
            }
        }
    }
    this.viewportRect.set(this.xView, this.yView);
    if(!this.viewportRect.within(this.worldRect)) {
        if(this.viewportRect.left < this.worldRect.left) {
            this.xView = this.worldRect.left;
        } 
        if(this.viewportRect.top < this.worldRect.top) {
            this.yView = this.worldRect.top;
        } 
        if(this.viewportRect.right > this.worldRect.right) {
            this.xView = this.worldRect.right - this.wView;
        }  
        if(this.viewportRect.bottom > this.worldRect.bottom) {
            this.yView = this.worldRect.bottom - this.hView;
        }
        this.following = false;
    }
};

Camera.prototype.leftCollision = function (player, playerWidth) {
    return this.xView <= player.getX() + playerWidth * 5;
};

Camera.prototype.rightCollision = function (player, playerWidth) {
    return this.xView + this.wView >= player.getX() + playerWidth * 5;
};

module.exports = Camera;