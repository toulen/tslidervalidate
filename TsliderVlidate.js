function TsliderValidateFuc(obj, options){
    var $this = this;

    $this.$obj = obj;

    $this.moveX = 0;
    $this.isClick = 0;
    $this.moveXY = [];
    $this.isOpen = 0;

    $this.canvas = null;
    $this.context = null;
    $this.showImg = null;
    $this.rect = null;
    $this.okImg = null;

    $this.customOptions = options;

    $this.defaultOptions = {
        id: "",
        canvasWidth: 200,
        canvasHeight: 40,
        openKey: 1,
        sliderLeft: 10,
        sliderTop: 10,
        sliderImgWidth: 48,
        sliderImgHeight: 48,
        sliderImg: '',
        okImg: '',
        okImgWidth: 60,
        okImgHeight: 60,
        openFuc: function (){

        }
    };

    $this.init = function (){
        // 加载配置:
        if(typeof($this.customOptions) == 'object'){
            $this.defaultOptions = $.extend({}, $this.defaultOptions, $this.customOptions);
        }

        if(!$this.defaultOptions.id){

            console.log('Id Must!!!');

            return false;
        }

        $this.canvas = document.getElementById($this.defaultOptions.id);

        $this.context = $this.canvas.getContext('2d');

        $this.canvas.width = $this.defaultOptions.canvasWidth * 2;

        $this.canvas.height = $this.defaultOptions.canvasHeight * 2;

        $this.moveX = $this.defaultOptions.sliderLeft;

        $this.sliderImg = new Image();

        $this.sliderImg.src = $this.defaultOptions.sliderImg;

        $this.calMoveXy();

        $this.rect = $this.canvas.getBoundingClientRect();

        $this.$obj.on('mousedown', function (event){

            var x = (event.clientX - $this.rect.left) * 2;

            var y = (event.clientY - $this.rect.top) * 2;

            if(x >= $this.moveXY[0][0] && x <= $this.moveXY[1][0] && y >= $this.moveXY[0][1] && y <= $this.moveXY[2][1]) {

                $this.isClick = 1;
            }
        });


        $this.$obj.on('mouseup', function (){
            $this.isClick = 0;
        });

        $this.$obj.on('mouseout', function (){
            $this.isClick = 0;
        });

        $this.$obj.on('mousemove', function (event){

            var x = event.clientX - $this.rect.left;

            var y = event.clientY - $this.rect.top;

            if($this.isClick != 1){
                return false;
            }

            $this.moveX = (x * 2 - ($this.defaultOptions.sliderImgWidth / 2));

            if($this.moveX < $this.defaultOptions.sliderLeft){
                $this.moveX = $this.defaultOptions.sliderLeft;
            }else if($this.moveX > $this.canvas.width - $this.defaultOptions.sliderLeft - $this.defaultOptions.sliderImgWidth){
                $this.moveX = $this.canvas.width - $this.defaultOptions.sliderLeft - $this.defaultOptions.sliderImgWidth;

            }

            $this.calMoveXy();
        });


        $this.okImg = new Image();

        $this.okImg.src = $this.defaultOptions.okImg;

        $this.draw();
    };

    $this.draw = function (){

        $this.context.clearRect(0,0, $this.canvas.width, $this.canvas.height);

        if($this.isOpen == 0) {

            $this.drawLine();

            $this.drawMove();
        }else{

            $this.context.drawImage($this.okImg, ($this.canvas.width - $this.defaultOptions.okImgWidth) / 2, ($this.canvas.height - $this.defaultOptions.okImgHeight) / 2, $this.defaultOptions.okImgWidth, $this.defaultOptions.okImgHeight);
        }
        window.requestAnimationFrame($this.draw);
    };

    $this.calMoveXy = function (){

        $this.moveXY = [
            [$this.moveX, $this.defaultOptions.sliderTop],
            [$this.moveX + $this.defaultOptions.sliderImgWidth, $this.defaultOptions.sliderTop],
            [$this.moveX + $this.defaultOptions.sliderImgWidth, $this.defaultOptions.sliderTop + $this.defaultOptions.sliderImgHeight],
            [$this.moveX, $this.defaultOptions.sliderTop + $this.defaultOptions.sliderImgHeight]
        ];
    };

    $this.drawLine = function () {
        $this.context.beginPath();
        $this.context.moveTo($this.defaultOptions.sliderLeft, $this.defaultOptions.sliderTop);
        $this.context.lineTo($this.canvas.width - $this.defaultOptions.sliderLeft, $this.defaultOptions.sliderTop);
        $this.context.lineTo($this.canvas.width - $this.defaultOptions.sliderLeft, $this.canvas.height - $this.defaultOptions.sliderTop);
        $this.context.lineTo($this.defaultOptions.sliderLeft, $this.canvas.height - $this.defaultOptions.sliderTop);
        $this.context.lineTo($this.defaultOptions.sliderLeft, $this.defaultOptions.sliderTop);
//    context.lineWidth = 5;
        $this.context.fillStyle = '#ddd';
        $this.context.fill();
    };

    $this.drawMove = function (){

        $this.context.drawImage($this.sliderImg, $this.moveX, ($this.canvas.height - $this.defaultOptions.sliderImgHeight) / 2, $this.defaultOptions.sliderImgWidth, $this.defaultOptions.sliderImgHeight);

        if($this.moveXY[0][0] >= ($this.canvas.width - $this.defaultOptions.sliderLeft - $this.defaultOptions.sliderImgWidth) * $this.defaultOptions.openKey){
            $this.isOpen = 1;

            $this.defaultOptions.openFuc();
        }
    }
}

$.fn.TsliderValidate = function (options){
    var TsliderValidate = new TsliderValidateFuc(this, options);

    TsliderValidate.init();
};