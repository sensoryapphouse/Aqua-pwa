/*
Change sound effects

Options:
Button 1. Change colours.  Randomise colours alternating with hue generated one.
Button 2. How many groups (add to 100)
Button 3. Speed
Button 4. Attract or repel and maybe size
5. Gravity, none, to bottom or to sides one of the sets
6. Makeonedim and makeonebright in one of the sets
7. size of droplets one of the sets

*/

window.onload = () => {
    'use strict';

    //    if ('serviceWorker' in navigator) {
    //        navigator.serviceWorker
    //            .register('./sw.js');
    //    }
    camStart();

}

/*

Copyright (c) 2020 by dissimulate (https://codepen.io/dissimulate/pen/hszvg)
Modified by Sensory App House.

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.


Copyright (c) 2013 dissimulate at codepen

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
*/

function camStart() {
    var MOUSE_INFLUENCE = 3,
        GRAVITY_X = 0,
        GRAVITY_Y = 0, // Action 2 toggle from 0 to 0.1
        MOUSE_REPEL = false, // Action 3 toggle
        //     GROUPS = [10, 10, 10, 10, 10, 10, 10, 10, 10, 10], // good with size 70
        // GROUPS = [20, 20, 20, 20, 20], 
        //GROUPS = [25, 25, 25, 25],
        // GROUPS = [33, 33, 33],
        GROUPS = [50, 50],

        GROUP_COLOURS = ['rgba(97,160,232'];

    var splash = document.querySelector('splash');
    var crosshairs = document.querySelector('crosshairs');
    crosshairs.hidden = true;
    var button = document.querySelector('button');
    var button1 = document.querySelector('button1');
    var button2 = document.querySelector('button2');
    var button3 = document.querySelector('button3');
    var buttonl = document.querySelector('buttonl');
    var buttonr = document.querySelector('buttonr');
    var canvas;
    var randomSaturation = true;
    var makeOneDim = true;
    var makeOneBright = true;
    var keyState1 = 0;
    var keyState2 = 0;
    var keyState3 = 0;
    var keyState4 = 0;
    var keyStatel = 0;
    var groupCount = 0;
    var speed = 20;
    var mode = 0;
    var tmr;

    window.requestAnimFrame =
        window.requestAnimationFrame ||
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame ||
        window.oRequestAnimationFrame ||
        window.msRequestAnimationFrame ||
        function (callback) {
            window.setTimeout(callback, 300);
        };
    //    var tmr = window.setTimeout(function () {
    //        if (document.body.requestFullscreen) {
    //            document.body.requestFullscreen();
    //        } else if (document.body.msRequestFullscreen) {
    //            document.body.msRequestFullscreen();
    //        } else if (document.body.mozRequestFullScreen) {
    //            document.body.mozRequestFullScreen();
    //        } else if (document.body.webkitRequestFullscreen) {
    //            document.body.webkitRequestFullscreen();
    //        }
    //        splash.hidden = true;
    //    }, 5000); // hide Splash screen after 2.5 seconds
    splash.onclick = function (e) {
        clearTimeout(tmr);
        if (document.body.requestFullscreen) {
            document.body.requestFullscreen();
        } else if (document.body.msRequestFullscreen) {
            document.body.msRequestFullscreen();
        } else if (document.body.mozRequestFullScreen) {
            document.body.mozRequestFullScreen();
        } else if (document.body.webkitRequestFullscreen) {
            document.body.webkitRequestFullscreen();
        }
        splash.hidden = true;
    }

    button.onmousedown = function (e) {
        Action(1);
    }
    button1.onmousedown = function (e) {
        Action(2);
    }
    button2.onmousedown = function (e) {
        Action(3);
    }
    button3.onmousedown = function (e) {
        Action(4);
    }

    buttonl.onmousedown = function (e) {
        Action(5);
    }
    buttonr.onmousedown = function (e) {
        Action(6);
    }

    function randomClick() {
        mouse.x = Math.random() * 700 + 50;
        mouse.y = Math.random() * 300 + 50;
        mouse.down = true;
        setTimeout(function () {
            mouse.down = false;
        }, 3000);
    }

    function MonitorKeyDown(e) { // stop autorepeat of keys with KeyState1-4 flags
        if (!e) e = window.event;
        if (e.keyCode == 32 || e.keyCode == 49) {
            if (keyState1 == 0)
                Action(1);
            keyState1 = 1;
        } else if (e.keyCode == 50) {
            if (keyState2 == 0)
                Action(3);
            keyState2 = 1;
        } else if (e.keyCode == 51 || e.keyCode == 13) {
            if (keyState3 == 0)
                Action(2);
            keyState3 = 1;
        } else if (e.keyCode == 52) {
            if (keyState4 == 0)
                Action(4);
            keyState4 = 1;
        } else if (e.keyCode == 53) {
            toggleButtons();
        } else if (e.keyCode == 189) { // +
            if (keyStatel == 0)
                Action(5);
        } else if (e.keyCode == 187) { // -
            if (keyStater == 0)
                Action(6);
        }
        return false;
    }

    function MonitorKeyUp(e) {
        if (!e) e = window.event;
        if (e.keyCode == 32 || e.keyCode == 49) {
            keyState1 = 0;
        } else if (e.keyCode == 50) {
            keyState2 = 0;
        } else if (e.keyCode == 51 || e.keyCode == 13) {
            keyState3 = 0;
        } else if (e.keyCode == 52) {
            keyState4 = 0;
            return false;
        }
    }
    document.onkeydown = MonitorKeyDown;
    document.onkeyup = MonitorKeyUp;

    var player;
    var player1;
    var player2;

    function PlaySound(i) {
        switch (i) {
            case 1:
                if (player == undefined) {
                    player = document.getElementById('audio');
                    player.loop = false;
                }
                player.load();
                player.play();
                break;
            case 2:
                if (player1 == undefined) {
                    player1 = document.getElementById('audio1');
                }
                player1.load();
                player1.play();
                break;
            case 3:
                if (player2 == undefined) {
                    player2 = document.getElementById('audio2');
                }
                player2.load();
                player2.play();
                break;
        }
    }

    function toggleButtons() {
        button.hidden = !button.hidden;
        button1.hidden = !button1.hidden;
        button2.hidden = !button2.hidden;
        button3.hidden = !button3.hidden;
        buttonl.hidden = !buttonl.hidden;
        buttonr.hidden = !buttonr.hidden;
    }

    function setMode() {
        if (mode < 0)
            mode = 5;
        if (mode > 5)
            mode = 0;
    }

    function Action(i) {
        switch (i) {
            case 1: // button 1: change colours
                var tmp = Math.random() * 255;
                if (tmp < 64 || tmp > 192)
                    tmp = Math.random() * 255;
                GROUP_COLOURS = ['rgba(' + tmp + ', ' + (255 - tmp) + ', ' + (Math.random() * 255)];

                setTimeout(function () {
                    fluid.init('webgl-canvas', 800, 366)
                }, 100);
                PlaySound(2);
                speed = 20;
                MOUSE_REPEL = false;
                makeOneBright = true;
                makeOneDim = true;
                randomClick();
                break;
            case 2: // button 2:  number of groups
                makeOneBright = false;
                makeOneDim = false;
                groupCount++;
                if (groupCount > 6)
                    groupCount = 0;
                switch (groupCount) {
                    case 0:
                        GROUPS = [50, 50];
                        break;
                    case 1:
                        GROUPS = [30, 30, 30];
                        break;
                    case 2:
                        GROUPS = [20, 20, 20, 20]
                        break;
                    case 3:
                        GROUPS = [20, 20, 20, 20, 20]
                        break;
                    case 4:
                        GROUPS = [15, 15, 15, 15, 15, 15];
                    case 5:
                        GROUPS = [12, 12, 12, 12, 12, 12, 12];
                    default:
                        GROUPS = [10, 10, 10, 10, 10, 10, 10, 10, 10];
                        break;
                }
                GROUP_COLOURS = ['rgba(97,160,232'];
                setTimeout(function () {
                    fluid.init('webgl-canvas', 800, 366)
                }, 100);
                PlaySound(1);
                speed = 20;
                MOUSE_REPEL = false;
                randomClick();
                break;
            case 3: // button 3: velocity diffusion .2, 2, 4
                MOUSE_REPEL = !MOUSE_REPEL;
                PlaySound(1);
                randomClick();
                break;
            case 4: // button 4: speed
                switch (speed) {
                    case 10:
                        speed = 70;
                        break;
                    case 20:
                        speed = 10;
                        break;
                    case 40:
                        speed = 20;
                        break;
                    case 70:
                        speed = 40;
                        break;
                    default:
                        speed = 40;
                }
                PlaySound(1);
                randomClick();
                break;
            case 5: // left 
                mode--;
                setMode();
                randomClick();
                break;
            case 6: // right
                mode++;
                setMode();
                randomClick();
                break;
        }
    }

    function getMousePos(canvas, evt) {
        var rect = canvas.getBoundingClientRect(), // abs. size of element
            scaleX = canvas.width / rect.width, // relationship bitmap vs. element for X
            scaleY = canvas.height / rect.height; // relationship bitmap vs. element for Y

        return {
            x: (evt.clientX - rect.left) * scaleX, // scale mouse coordinates after they have
            y: (evt.clientY - rect.top) * scaleY // been adjusted to be relative to element
        }
    }


    var mouse;
    var radius = 70; // PB 30, 50, 70, 100 
    var fluid = function () {
        var ctx, width, height, num_x, num_y, particles, grid, meta_ctx, threshold = 220,
            play = false,
            spacing = 45, // PB 25 with mouse influence 1, 45 with mouse influence 2, 45 with mouse influence 5

            limit = radius * 0.66,
            textures, num_particles;

        mouse = {
            down: false,
            x: 0,
            y: 0
        };

        var process_image = function () {
            var imageData = meta_ctx.getImageData(0, 0, width, height),
                pix = imageData.data;

            for (var i = 0, n = pix.length; i < n; i += 4) {
                (pix[i + 3] < threshold) && (pix[i + 3] /= 6);
            }

            ctx.putImageData(imageData, 0, 0);
        };

        var run = function () {
            //var time = new Date().getTime();
            meta_ctx.clearRect(0, 0, width, height);

            for (var i = 0, l = num_x * num_y; i < l; i++) grid[i].length = 0;

            var i = num_particles;
            while (i--) particles[i].first_process();
            i = num_particles;
            while (i--) particles[i].second_process();

            process_image();

            if (mouse.down) {

                // ctx.canvas.style.cursor = 'none';
                /*
                                ctx.fillStyle = 'rgba(97, 160, 232, 0.05)';
                                ctx.beginPath();
                                ctx.arc(
                                    mouse.x,
                                    mouse.y,
                                    radius * MOUSE_INFLUENCE,
                                    0.,
                                    Math.PI * 2
                                );
                                ctx.closePath();
                                ctx.fill();

                                ctx.fillStyle = 'rgba(97, 160, 232, 0.1)';
                                ctx.beginPath();
                                ctx.arc(
                                    mouse.x,
                                    mouse.y,
                                    (radius * MOUSE_INFLUENCE) / 3,
                                    0.,
                                    Math.PI * 2
                                );
                                ctx.closePath();
                                ctx.fill(); */
            } else ctx.canvas.style.cursor = 'default';

            //console.log(new Date().getTime() - time);
            var sp = speed;
            if (GROUPS[0] < 30)
                sp *= 1.5;
            if (play) {
                setTimeout(function () { // PB set speed here
                    requestAnimFrame(run);
                }, sp);

            }
        };

        var Particle = function (type, x, y) {
            this.type = type;
            this.x = x;
            this.y = y;
            this.px = x;
            this.py = y;
            this.vx = 0;
            this.vy = 0;
        };

        Particle.prototype.first_process = function () {

            var g = grid[Math.round(this.y / spacing) * num_x + Math.round(this.x / spacing)];

            if (g) g.close[g.length++] = this;

            this.vx = this.x - this.px;
            this.vy = this.y - this.py;

            if (mouse.down) {
                var dist_x = this.x - mouse.x;
                var dist_y = this.y - mouse.y;
                var dist = Math.sqrt(dist_x * dist_x + dist_y * dist_y);
                if (dist < radius * MOUSE_INFLUENCE) {
                    var cos = .05 * dist_x / dist; // PB change
                    var sin = .05 * dist_y / dist; // PB change
                    this.vx += (MOUSE_REPEL) ? cos : -cos;
                    this.vy += (MOUSE_REPEL) ? sin : -sin;
                }
            }

            GRAVITY_Y = 0;
            if (mode == 1)
                GRAVITY_Y = .005;
            else if (mode == 3) {
                if (this.x < 400)
                    this.vx -= .01;
                else
                    this.vx += .01;
            } else if (mode == 4) {
                radius = 25;
            } else if (mode == 2) {
                radius = 50;
            } else if (mode == 5) {
                radius = 100;
            } else {
                radius = 70;
            }
            //this.vx += GRAVITY_X;
            this.vy += GRAVITY_Y;
            this.px = this.x;
            this.py = this.y;
            this.x += this.vx;
            this.y += this.vy;
        };

        Particle.prototype.second_process = function () {

            var force = 0,
                force_b = 0,
                cell_x = Math.round(this.x / spacing),
                cell_y = Math.round(this.y / spacing),
                close = [];

            for (var x_off = -1; x_off < 2; x_off++) {
                for (var y_off = -1; y_off < 2; y_off++) {
                    var cell = grid[(cell_y + y_off) * num_x + (cell_x + x_off)];
                    if (cell && cell.length) {
                        for (var a = 0, l = cell.length; a < l; a++) {
                            var particle = cell.close[a];
                            if (particle != this) {
                                var dfx = particle.x - this.x;
                                var dfy = particle.y - this.y;
                                var distance = Math.sqrt(dfx * dfx + dfy * dfy);
                                if (distance < spacing) {
                                    var m = 1 - (distance / spacing);
                                    force += Math.pow(m, 2);
                                    force_b += Math.pow(m, 3) / 2;
                                    particle.m = m;
                                    particle.dfx = (dfx / distance) * m;
                                    particle.dfy = (dfy / distance) * m;
                                    close.push(particle);
                                }
                            }
                        }
                    }
                }
            }

            force = (force - 3) * 0.5;

            for (var i = 0, l = close.length; i < l; i++) {

                var neighbor = close[i];

                var press = force + force_b * neighbor.m;
                if (this.type != neighbor.type) press *= 0.35;

                var dx = neighbor.dfx * press * 0.5;
                var dy = neighbor.dfy * press * 0.5;

                neighbor.x += dx;
                neighbor.y += dy;
                this.x -= dx;
                this.y -= dy;
            }

            if (this.x < limit) this.x = limit;
            else if (this.x > width - limit) this.x = width - limit;

            if (this.y < limit) this.y = limit;
            else if (this.y > height - limit) this.y = height - limit;

            this.draw();
        };

        Particle.prototype.draw = function () {

            var size = radius * 2;

            meta_ctx.drawImage(
                textures[this.type],
                this.x - radius,
                this.y - radius,
                size,
                size);
        };

        return {

            init: function (canvas, w, h) {
                particles = [];
                grid = [];
                close = [];
                textures = [];

                canvas = document.getElementById(canvas);
                ctx = canvas.getContext('2d');
                canvas.height = h || window.innerHeight;
                canvas.width = w || window.innerWidth;
                width = canvas.width;
                height = canvas.height;

                var meta_canvas = document.createElement("canvas");
                meta_canvas.width = width;
                meta_canvas.height = height;
                meta_ctx = meta_canvas.getContext("2d");

                randomSaturation = !randomSaturation;
                for (var i = 0; i < GROUPS.length; i++) {

                    var colour;

                    if (i == 1 && makeOneDim)
                        colour = 'hsla(' + Math.round(Math.random() * 360) + ', 80%, 20%';
                    else if (i == 2 && makeOneBright)
                        colour = 'hsla(' + Math.round(Math.random() * 360) + ', 80%, 80%';
                    else {
                        if (randomSaturation) colour = 'hsla(' + Math.round(Math.random() * 360) + ', ' + Math.round(Math.random() * 100) +
                            '%, 60%';
                        else
                            colour = 'hsla(' + Math.round(Math.random() * 360) + ', 80%, 60%';
                        //                        if (GROUP_COLOURS[i]) {
                        //                            colour = GROUP_COLOURS[i];
                        //                        }

                    }
                    //                    else {
                    //                        colour =
                    //                            'hsla(' + Math.round(Math.random() * 360) + ', 80%, 60%';
                    //                    }

                    textures[i] = document.createElement("canvas");
                    textures[i].width = radius * 2;
                    textures[i].height = radius * 2;
                    var nctx = textures[i].getContext("2d");

                    var grad = nctx.createRadialGradient(
                        radius,
                        radius,
                        1,
                        radius,
                        radius,
                        radius
                    );

                    grad.addColorStop(0, colour + ',1)');
                    grad.addColorStop(1, colour + ',0)');
                    nctx.fillStyle = grad;
                    nctx.beginPath();
                    nctx.arc(radius, radius, radius, 0, Math.PI * 2, true);
                    nctx.closePath();
                    nctx.fill();
                }

                canvas.onmousedown = function (e) {
                    mouse = getMousePos(canvas, e);
                    console.log("Mouse down", mouse.x, mouse.y);
                    mouse.down = true;
                    return false;
                };

                canvas.onmouseup = function (e) {
                    mouse.down = false;
                    return false;
                };

                canvas.onmousemove = function (e) {
                    //                    if (mouse.down) {
                    //                        mouse = getMousePos(canvas, e);
                    //                        mouse.down = true;
                    //                    }
                    mouse = getMousePos(canvas, e);
                    mouse.down = true;
                    try {
                        clearTimeout(tmr);
                    } catch (e) {};
                    tmr = setTimeout(function () {
                        mouse.down = false;
                    }, 3000);
                    //                    var rect = canvas.getBoundingClientRect();
                    //                    mouse.x = e.offsetXe.clientX; // - rect.left;
                    //                    mouse.y = e.clientY; // - rect.top;
                    return false;
                };

                canvas.ontouchstart = function (e) {
                    e
                    mouse = getMousePos(canvas, e.touches[0]);
                    console.log("Mouse down", mouse.x, mouse.y);
                    mouse.down = true;
                    return false;
                };

                canvas.ontouchend = function (e) {
                    mouse.down = false;
                    return false;
                };

                canvas.ontouchmove = function (e) {
                    //                    if (mouse.down) {
                    //                        mouse = getMousePos(canvas, e);
                    //                        mouse.down = true;
                    //                    }
                    mouse = getMousePos(canvas, e.touches[0]);
                    mouse.down = true;
                    try {
                        clearTimeout(tmr);
                    } catch (e) {};
                    tmr = setTimeout(function () {
                        mouse.down = false;
                    }, 3000);
                    //                    var rect = canvas.getBoundingClientRect();
                    //                    mouse.x = e.offsetXe.clientX; // - rect.left;
                    //                    mouse.y = e.clientY; // - rect.top;
                    return false;
                };



                num_x = Math.round(width / spacing) + 1;
                num_y = Math.round(height / spacing) + 1;

                for (var i = 0; i < num_x * num_y; i++) {
                    grid[i] = {
                        length: 0,
                        close: []
                    }
                }

                for (var i = 0; i < GROUPS.length; i++) {
                    for (var k = 0; k < GROUPS[i]; k++) {
                        particles.push(
                            new Particle(
                                i,
                                radius + Math.random() * (width - radius * 2),
                                radius + Math.random() * (height - radius * 2)
                            )
                        );
                    }
                }

                num_particles = particles.length

                play = true;
                run();
            },

            stop: function () {
                play = false;
            }

        };

    }();

    fluid.init('webgl-canvas', 800, 376);

    //    document.getElementById('reset').onmousedown = function () { // put on oneof the buttons
    //        fluid.stop();
    //        setTimeout(function () {
    //            fluid.init('canvas', 800, 366)
    //        }, 100);
    //    }
    var mouseX;
    var mouseY;
    var msTimer;

    function MoveMouse(xm, ym) {
        crosshairs.hidden = false;
        try {
            mouseX = crosshairs.offsetLeft + (crosshairs.offsetWidth) / 2;
            mouseY = crosshairs.offsetTop + (crosshairs.offsetHeight) / 2;
            //            console.log('Moving: ', xm, ym);
            mouseX += xm;
            mouseY += ym;
            if (mouseX < 10)
                mouseX = 10;
            if (mouseY < 10)
                mouseY = 10;
            if (mouseX >= window.innerWidth - 10)
                mouseX = window.innerWidth - 10;
            if (mouseY >= window.innerHeight - 10)
                mouseY = window.innerHeight - 10;
            console.log('MoveTo: ', mouseX, mouseY);
            crosshairs.style.left = mouseX - crosshairs.offsetWidth / 2 + "px";
            crosshairs.style.top = mouseY - crosshairs.offsetHeight / 2 + "px";
            //            mouseX /= canvas.width;
            mouse.x = 800 * mouseX / window.innerWidth;
            mouse.y = 400 * mouseY / window.innerHeight;
            //           console.log("XBox", mouse.x, mouse.y);
            mouse.down = true;
            try {
                clearTimeout(msTimer);
            } catch (e) {};
            msTimer = setTimeout(function () {
                mouse.down = false;
            }, 1000);
        } catch {}
    }

    function JoystickMoveTo(jy, jx) {
        if (splash.hidden) {
            crosshairs.hidden = false;
            if (Math.abs(jx) < .1 && Math.abs(jy) < .1) {
                try {
                    if (gpad.getButton(14).value > 0) // dpad left
                        MoveMouse(-7, 0);
                    if (gpad.getButton(12).value > 0) // dup
                        MoveMouse(0, -5);
                    if (gpad.getButton(13).value > 0) // ddown
                        MoveMouse(0, 5);
                    if (gpad.getButton(15).value > 0) // dright
                        MoveMouse(7, 0);
                } catch {}
                return;
            }
            if (Math.abs(jx) < .1)
                jx = 0;
            if (Math.abs(jy) < .1)
                jy = 0;
            if (jx == 0 && jy == 0)
                return;
            MoveMouse(jx * 20, jy * 20);
        }
    }

    var currentButton = 0;

    function showPressedButton(index) {
        //      console.log("Pressed: ", index);
        if (!splash.hidden) { // splash screen
            splash.hidden = true;
        } else {
            crosshairs.hidden = false;
            switch (index) {
                case 0: // A
                case 8:
                case 9:
                    Action(1);
                    break;
                case 1: // B - 
                    Action(2);
                    break;
                case 2: // X
                    Action(3);
                    break;
                case 3: // Y
                    Action(4);
                    break;
                case 4: // LT
                case 6: //
                    Action(5);
                    break;
                case 5: // LT
                case 7: //
                    Action(6);
                    break;
                case 10: // XBox
                    break;
                case 12: // dpad handled by timer elsewhere
                case 13:
                case 14:
                case 15:
                    break;
                default:
            }
        }
    }

    function removePressedButton(index) {
        //        console.log("Releasd: ", index);
    }

    function moveJoystick(values, isLeft) {
        if (splash.hidden)
            JoystickMoveTo(values[1], values[0]);
    }

    var gpad;

    function getAxes() {
        //       console.log('Axis', gpad.getAxis(0), gpad.getAxis(1), gpad.getButton(14).value);

        if (splash.hidden) {
            JoystickMoveTo(gpad.getAxis(1), gpad.getAxis(0));
            JoystickMoveTo(gpad.getAxis(3), gpad.getAxis(2));
        }
        setTimeout(function () {
            getAxes();
        }, 50);
    }

    gamepads.addEventListener('connect', e => {
        //        crosshairs.hidden = false;
        console.log('Gamepad connected:');
        console.log(e.gamepad);
        gpad = e.gamepad;
        e.gamepad.addEventListener('buttonpress', e => showPressedButton(e.index));
        e.gamepad.addEventListener('buttonrelease', e => removePressedButton(e.index));
        //       e.gamepad.addEventListener('joystickmove', e => moveJoystick(e.values, true),
        //            StandardMapping.Axis.JOYSTICK_LEFT);
        //        e.gamepad.addEventListener('joystickmove', e => moveJoystick(e.values, false),
        //            StandardMapping.Axis.JOYSTICK_RIGHT);
        setTimeout(function () {
            getAxes();
        }, 50);
    });

    gamepads.addEventListener('disconnect', e => {
        console.log('Gamepad disconnected:');
        console.log(e.gamepad);
    });

    gamepads.start();
}


function camStart2() {
    // Simulation section
    const canvas = document.getElementById('webgl-canvas');



    canvas.addEventListener('mousedown', e => {

    });

    canvas.addEventListener('mousemove', e => {
        let pointer = pointers[0];
        //if (!pointer.down) return;
        let posX = scaleByPixelRatio(e.offsetX);
        let posY = scaleByPixelRatio(e.offsetY);

        crosshairs.style.left = e.offsetX - crosshairs.offsetWidth / 2 + "px";
        crosshairs.style.top = e.offsetY - crosshairs.offsetHeight / 2 + "px";
    });

    window.addEventListener('mouseup', () => {});

    canvas.addEventListener('touchstart', e => {
        e.preventDefault();
        const touches = e.targetTouches;
        while (touches.length >= pointers.length)
            pointers.push(new pointerPrototype());
        for (let i = 0; i < touches.length; i++) {
            let posX = scaleByPixelRatio(touches[i].pageX);
            let posY = scaleByPixelRatio(touches[i].pageY);
        }
    });

    canvas.addEventListener('touchmove', e => {
        e.preventDefault();
        const touches = e.targetTouches;
        for (let i = 0; i < touches.length; i++) {
            let pointer = pointers[i + 1];
            if (!pointer.down) continue;
            let posX = scaleByPixelRatio(touches[i].pageX);
            let posY = scaleByPixelRatio(touches[i].pageY);
        }
        resetSplats();
    }, false);

    window.addEventListener('touchend', e => {
        const touches = e.changedTouches;
        for (let i = 0; i < touches.length; i++) {
            let pointer = pointers.find(p => p.id == touches[i].identifier);
            if (pointer == null) continue;
            updatePointerUpData(pointer);
        }
    });

    var mouseX;
    var mouseY;

    function MoveMouse(xm, ym) {
        crosshairs.hidden = false;
        try {
            mouseX = crosshairs.offsetLeft + (crosshairs.offsetWidth) / 2;
            mouseY = crosshairs.offsetTop + (crosshairs.offsetHeight) / 2;
            console.log('Moving: ', xm, ym);
            mouseX += xm;
            mouseY += ym;
            if (mouseX < 10)
                mouseX = 10;
            if (mouseY < 10)
                mouseY = 10;
            if (mouseX >= window.innerWidth - 10)
                mouseX = window.innerWidth - 10;
            if (mouseY >= window.innerHeight - 10)
                mouseY = window.innerHeight - 10;
            console.log('MoveTo: ', mouseX, mouseY);
            crosshairs.style.left = mouseX - crosshairs.offsetWidth / 2 + "px";
            crosshairs.style.top = mouseY - crosshairs.offsetHeight / 2 + "px";
            //            mouseX /= canvas.width;
            //            mouseY /= canvas.height;
            let pointer = pointers[0];
            let posX = scaleByPixelRatio(mouseX);
            let posY = scaleByPixelRatio(mouseY);
            updatePointerMoveData(pointer, posX, posY);
            resetSplats();
        } catch {}
    }

    function JoystickMoveTo(jy, jx) {
        if (splash.hidden) {
            crosshairs.hidden = false;
            if (Math.abs(jx) < .1 && Math.abs(jy) < .1) {
                try {
                    if (gpad.getButton(14).value > 0) // dpad left
                        MoveMouse(-7, 0);
                    if (gpad.getButton(12).value > 0) // dup
                        MoveMouse(0, -5);
                    if (gpad.getButton(13).value > 0) // ddown
                        MoveMouse(0, 5);
                    if (gpad.getButton(15).value > 0) // dright
                        MoveMouse(7, 0);
                } catch {}
                return;
            }
            if (Math.abs(jx) < .1)
                jx = 0;
            if (Math.abs(jy) < .1)
                jy = 0;
            if (jx == 0 && jy == 0)
                return;
            MoveMouse(jx * 20, jy * 20);
        }
    }

    var currentButton = 0;

    function showPressedButton(index) {
        if (!splash.hidden) { // splash screen
            splash.hidden = true;
        } else {
            crosshairs.hidden = false;
            switch (index) {
                case 0: // A
                case 8:
                case 9:
                    Action(1);
                    break;
                case 1: // B - 
                    Action(2);
                    break;
                case 2: // X
                    Action(3);
                    break;
                case 3: // Y
                    Action(4);
                    break;
                case 4: // LT
                    Action(5);
                    break;

                case 10: // XBox
                    break;
                case 12: // dpad handled by timer elsewhere
                case 13:
                case 14:
                case 15:
                    break;
                default:
            }
        }
    }

    function removePressedButton(index) {
        console.log("Releasd: ", index);
    }

    function moveJoystick(values, isLeft) {
        if (splash.hidden)
            JoystickMoveTo(values[1], values[0]);
    }

    var gpad;

    function getAxes() {
        //       console.log('Axis', gpad.getAxis(0), gpad.getAxis(1), gpad.getButton(14).value);

        if (splash.hidden) {
            JoystickMoveTo(gpad.getAxis(1), gpad.getAxis(0));
            JoystickMoveTo(gpad.getAxis(3), gpad.getAxis(2));
        }
        setTimeout(function () {
            getAxes();
        }, 50);
    }

    gamepads.addEventListener('connect', e => {
        //        crosshairs.hidden = false;
        console.log('Gamepad connected:');
        console.log(e.gamepad);
        gpad = e.gamepad;
        e.gamepad.addEventListener('buttonpress', e => showPressedButton(e.index));
        e.gamepad.addEventListener('buttonrelease', e => removePressedButton(e.index));
        //       e.gamepad.addEventListener('joystickmove', e => moveJoystick(e.values, true),
        //            StandardMapping.Axis.JOYSTICK_LEFT);
        //        e.gamepad.addEventListener('joystickmove', e => moveJoystick(e.values, false),
        //            StandardMapping.Axis.JOYSTICK_RIGHT);
        setTimeout(function () {
            getAxes();
        }, 50);
    });

    gamepads.addEventListener('disconnect', e => {
        console.log('Gamepad disconnected:');
        console.log(e.gamepad);
    });

    gamepads.start();
}
