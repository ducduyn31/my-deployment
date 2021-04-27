<script>
    (function() {

        window.addEventListener("load", function() {
            var canvas = document.getElementById("canvas");
            var canvas_bg = document.getElementById("canvas_bg");
            var ctx = canvas.getContext('2d');
            var ctx_bg = canvas_bg.getContext('2d');

            var canvas1 = document.createElement('canvas');
            canvas1.width = canvas.width;
            canvas1.height = canvas.height;
            var ctx1 = canvas1.getContext('2d');
            var canvas2 = document.createElement('canvas');
            canvas2.width = canvas.width;
            canvas2.height = canvas.height;
            var ctx2 = canvas2.getContext('2d');
            //
            var op = null;
            var op_dg = null;
            points = [
                [200, 200],
                [392, 200],
                [392, 344],
                [200, 344]
            ];
            points_bg = [
                [200, 200],
                [1160, 200],
                [1160, 740],
                [200, 740]
            ];

            var img_bg = new Image();
            img_bg.src = 'http://10.199.1.14:10000/other/image.jpg';
            img_bg.onload = function() {
                op_dg = new html5jp.perspective(ctx1, img_bg);
                op_dg.draw(points_bg);
                // prepare_lines(ctx2, points_bg);
                draw_canvas(ctx_bg, ctx1, ctx2);
            };

            var img = new Image();
            img.src = 'http://10.199.1.14:10000/other/capture.jpg';
            img.onload = function() {
                op = new html5jp.perspective(ctx1, img);
                op.draw(points);
                prepare_lines(ctx2, points);
                draw_canvas(ctx, ctx1, ctx2);
            };

            var drag = null;
            canvas.addEventListener("mousedown", function(event) {
                event.preventDefault();
                var p = get_mouse_position(event);
                for (var i = 0; i < 4; i++) {
                    var x = points[i][0];
                    var y = points[i][1];
                    if (p.x < x + 10 && p.x > x - 10 && p.y < y + 10 && p.y > y - 10) {
                        drag = i;
                        break;
                    }
                }
            }, false);
            canvas.addEventListener("mousemove", function(event) {
                event.preventDefault();
                if (drag == null) {
                    return;
                }
                var p = get_mouse_position(event);
                var old_x = points[drag][0];
                var old_y = points[drag][1];
                computeSize(drag, p.x - old_x, p.y - old_y);
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                ctx1.clearRect(0, 0, canvas.width, canvas.height);
                op.draw(points);
                prepare_lines(ctx2, points);
                draw_canvas(ctx, ctx1, ctx2);
                get_points();
            }, false);
            canvas.addEventListener("mouseup", function(event) {
                event.preventDefault();
                if (drag == null) {
                    return;
                }
                var p = get_mouse_position(event);
                points[drag][0] = p.x;
                points[drag][1] = p.y;
                prepare_lines(ctx2, points);
                draw_canvas(ctx, ctx1, ctx2);
                drag = null;
            }, false);
            canvas.addEventListener("mouseout", function(event) {
                event.preventDefault();
                drag = null;
            }, false);
            canvas.addEventListener("mouseenter", function(event) {
                event.preventDefault();
                drag = null;
            }, false);
        }, false);

        function prepare_lines(ctx, p) {
            ctx.save();
            ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
            ctx.fillStyle = "red";
            for (var i = 0; i < 4; i++) {
                ctx.beginPath();
                ctx.arc(p[i][0], p[i][1], 5, 0, Math.PI * 2, true);
                ctx.fill();
            }
            ctx.restore();
        }

        function draw_canvas(ctx, ctx1, ctx2) {
            ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
            ctx.drawImage(ctx1.canvas, 0, 0);
            ctx.drawImage(ctx2.canvas, 0, 0);
        }

        function get_mouse_position(event) {
            var rect = event.target.getBoundingClientRect();
            return {
                x: event.clientX - rect.left,
                y: event.clientY - rect.top
            };
        }

        function computeSize(index, px, py) {
            switch (index) {
                case 0:
                    points[0][0] += px;
                    points[0][1] += py;
                    points[1][1] += py;
                    points[3][0] += px;
                    break;
                case 1:
                    points[1][0] += px;
                    points[1][1] += py;
                    points[0][1] += py;
                    points[2][0] += px;
                    break;
                case 2:
                    points[2][0] += px;
                    points[2][1] += py;
                    points[3][1] += py;
                    points[1][0] += px;
                    break;
                case 3:
                    points[3][0] += px;
                    points[3][1] += py;
                    points[2][1] += py;
                    points[0][0] += px;
                    break;
            }
        }

        function get_points() {
            var textareaDom = document.getElementById("textarea_show");
            var old_x = 1920;
            var old_y = 1080;
            var drag_x = 384;
            var drag_y = 288;
            var new_drag_x = points[1][0] - points[0][0];
            var new_drag_y = points[3][1] - points[0][1];
            var ratio_x = new_drag_x * 2 / 384;
            var ratio_y = new_drag_y * 2 / 288;
            var transform_x = (points[0][0] - 200) * 2 / 1920;
            var transform_y = (points[0][1] - 200) * 2 / 1080;
            var log_str = '第一步：'

            log_str += `x轴方向拉伸${ratio_x.toFixed(2)}倍，y轴方向拉伸${ratio_y.toFixed(2)}倍；\n第二步：`

            if (transform_x > 0) {
                log_str += `x轴方向，向右平移${(transform_x*100).toFixed(2)}%，`
            } else {
                log_str += `x轴方向，向左平移${-(transform_x*100).toFixed(2)}%，`
            }
            if (transform_y > 0) {
                log_str += `y轴方向，向下平移${(transform_y*100).toFixed(2)}%。`
            } else {
                log_str += `y轴方向，向上平移${-(transform_y*100).toFixed(2)}%。`
            }
            textareaDom.value = `${log_str}`
        }

    })();
</script>