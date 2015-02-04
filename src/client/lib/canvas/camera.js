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
    this.wView = params.canvasWidth;
    this.hView = params.canvasHeight;          
    this.axis = params.axis || AXIS.BOTH;  
    this.followed = null;
    this.following = false;
    this.viewportRect = new Rectangle(this.xView, this.yView, this.wView, this.hView);             
    this.worldRect = params.worldRect;
}

Camera.prototype.follow = function (gameObject, xDeadZone, yDeadZone) {       
    this.followed = gameObject; 
    this.xDeadZone = xDeadZone;
    this.yDeadZone = yDeadZone;
};                 

Camera.prototype.isFollowing = function () {
    return this.following;
};

Camera.prototype.update = function () {
    if(this.followed !== null) {
        this.following = true;    
        if(this.axis == AXIS.HORIZONTAL || this.axis == AXIS.BOTH) {
            if(this.followed.getX() + 160 - this.xView  + this.xDeadZone >= this.wView) {
                this.xView = this.followed.getX() - (this.wView - this.xDeadZone);
            } else if (this.followed.getX() + 160 - this.xDeadZone < this.xView) {
                this.xView = this.followed.getX() + 320 - this.xDeadZone;
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

module.exports = Camera;