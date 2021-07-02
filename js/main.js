$(function () {
    let animationTime = 300;
    let fadeOutTime = 300;
    let inBetween = 0.4;
    let downOnly = true;
    let showBlankSectionBetween = false;
    let showBlankBetween = false;
    let showPer = 30;
    let showIndex = 3;
    let sensitivity = 20;

    let init = true;
    let showPopup = true;
    let doneAnimation = false;

    let sectionArray = {};
    let sectionIndexCounter = 1;
    for (let i = 1; i <= 12; i++) {
        sectionArray[i] = [];
        $('.section-' + i).each(function () {
            sectionArray[i].push(sectionIndexCounter);
            sectionIndexCounter++;
        });
    }
    let tempUp = false;

    $('.review-link-group').click(function (event) {
        event.preventDefault();
        let rel = $(this).attr('rel');
        $('.section-12').animate({opacity: 0}, animationTime, function () {
            doneAnimation = true;
            tempUp = true;
            $.fn.fullpage.moveTo(sectionArray[rel][0]);
        })
    });
    $('.catalog').click(function (event) {
        event.preventDefault();
        $('.fp-section.active').animate({opacity: 0}, animationTime, function () {
            doneAnimation = true;
            // downOnly = false;
            showPopup = false;
            $.fn.fullpage.moveTo(sectionIndexCounter - 1);
            $('.catalog').fadeOut();
        })
    });

    $('.popup-info-box .close').click(function (event) {
        event.preventDefault();
        $(this).parents('.popup-info-box').fadeOut(500);
        showPopup = false;
    });
    $('.subscription-box .close').click(function (event) {
        event.preventDefault();
        $(this).parents('.subscription-box').fadeOut(500);
    });
    if (showBlankSectionBetween) {
        $('.section').after('<div class="section"></div>');
    }
    $('#fullpage').fullpage({
        scrollOverflow: true,
        scrollSpeed: animationTime,
        setAllowScrolling: true,
        touchSensitivity: sensitivity,
        afterRender: function () {
            // onLoad
            if (init) {
                $('body').fadeIn(animationTime, function () {
                    activeScroll();
                });
                init = false;

                let maxSlideIndex = $('.section').length;
                $('.progress-bar').attr('aria-valuemin', 1);
                $('.progress-bar').attr('aria-valuemax', maxSlideIndex);
            }
        },
        afterLoad: function (anchorLink, index) {
            let maxSlideIndex = $('.section').length;
            if (showBlankSectionBetween) {
                index = Math.ceil(index / 2);
                Math.floor(maxSlideIndex / 2);
            }
            $('.progress-bar').attr('aria-valuenow', index);
            if (maxSlideIndex > 1) {
                $('.progress-bar').css('width', Math.round(((index - 1) / (maxSlideIndex - 1)) * 100) + '%');
            }

            if (index == maxSlideIndex) {
                $('.catalog').fadeOut();
            }
            if (false) {
                if (Math.round(((index - 1) / (maxSlideIndex - 1)) * 100) >= showPer && index != maxSlideIndex) {
                    $('.catalog').fadeIn();
                } else if (Math.round(((index - 1) / (maxSlideIndex - 1)) * 100) < showPer && !downOnly) {
                    $('.catalog').fadeIn();
                }
            } else {
                if (index >= showIndex && index != maxSlideIndex) {
                    $('.catalog').fadeIn();
                } else if (index < 3 && !downOnly) {
                    $('.catalog').fadeIn();
                }
            }

            $('.fp-section.active .disappear').animate({opacity: 1}, animationTime);
            $('.fp-section.active .disappear-step-by-step').animate({opacity: 1}, animationTime);
            $('.fp-section.active').animate({opacity: 1}, animationTime);

            if (sectionArray[1].includes(index)) {
                $('.logo').stop().fadeIn(animationTime);
            }

            // Section End
            // if (index == maxSlideIndex) {
            //     downOnly = false;
            // }

            setTimeout(function () {
                activeScroll();

            }, animationTime);
            doneAnimation = false;
        },
        onLeave: function (index, nextIndex, direction) {
            if (tempUp){
                tempUp = false;
                return true;
            }
            if (downOnly && direction == 'up') {
                if (!doneAnimation) {
                    $.fn.fullpage.moveTo(index + 1);
                }
                return false;
            }
            if (showBlankSectionBetween) {
                if (nextIndex % 2 == 0 && direction == 'up') {
                    $.fn.fullpage.moveTo(nextIndex - 1);
                    return false;
                }
                index = Math.ceil(index / 2);
                nextIndex = index + 1;
            }

            let currentSection = 0;
            let nextSection = 0;

            if (showPopup && sectionArray[1].includes(index) && !sectionArray[1].includes(nextIndex)) {
                $('.popup-info-box').fadeIn(500);
                return false;
            }

            disableScroll();

            $.each(sectionArray, function (arrayIndex, arrayValue) {
                if (arrayValue.includes(index)) {
                    currentSection = arrayIndex;
                }
                if (arrayValue.includes(nextIndex)) {
                    nextSection = arrayIndex;
                }
            })

            if (sectionArray[1].includes(nextIndex) && sectionArray[1].includes(index)) {
                $('#fullpage').addClass('bg-1');
            } else {
                $('#fullpage').removeClass('bg-1');
            }
            // if ((sectionArray[1].includes(nextIndex)) && currentSection == nextSection) {
            //     $('#fullpage').addClass('bg-' + currentSection);
            // }

            if (sectionArray[1].includes(index) && !sectionArray[1].includes(nextIndex)) {
                $('.logo').stop().fadeOut(animationTime);
            }

            if ($('.fp-section.active .disappear-step-by-step').length > 0 && direction == 'down') {
                if (!doneAnimation) {
                    disappearOneByOne($('.fp-section.active .disappear-step-by-step'));

                    function disappearOneByOne (elements) {
                        let i = 0;
                        let count = elements.length;
                        $(elements).each(function (index, element) {
                            i++;
                            setTimeout(function () {
                                $(element).animate({opacity: 0}, fadeOutTime);
                            }, (count - i + 1) * fadeOutTime * inBetween);
                        })
                        setTimeout(function () {
                            if (showBlankBetween) {
                                $('.fp-section.active').animate({opacity: 0}, animationTime, function () {
                                    doneAnimation = true;
                                    activeScroll();
                                });
                            } else {
                                $('.fp-section.active').animate({opacity: 0}, animationTime, function () {
                                    doneAnimation = true;
                                    // activeScroll();
                                    $.fn.fullpage.moveTo(nextIndex);
                                });
                            }
                        }, (i + 1) * fadeOutTime * inBetween);
                    }
                }
                return doneAnimation;
            } else if ($('.fp-section.active .disappear, .fp-section.active.disappear').length > 0 && (direction == 'down' || (direction == 'up' && downOnly))) {
                if (!doneAnimation) {
                    $('.fp-section.active .disappear, .fp-section.active.disappear').animate({opacity: 0}, fadeOutTime, function () {
                        if (showBlankBetween && !sectionArray[1].includes(nextIndex)) {
                            $('.fp-section.active').animate({opacity: 0}, animationTime, function () {
                                doneAnimation = true;
                                activeScroll();
                            });
                        } else {
                            $('.fp-section.active').animate({opacity: 0}, animationTime, function () {
                                doneAnimation = true;
                                // activeScroll();
                                $.fn.fullpage.moveTo(nextIndex);
                            });
                        }
                    });
                }
                return doneAnimation;
            } else if (showBlankBetween) {
                if (!doneAnimation) {
                    $('.fp-section.active').animate({opacity: 0}, animationTime, function () {
                        doneAnimation = true;
                        activeScroll();
                    });
                }
                return doneAnimation;
            }
        }
    })

    disableScroll();
    $.fn.fullpage.reBuild();
    $(window).on('load', function () {
        $.fn.fullpage.reBuild();
    })

    function disableScroll () {
        $.fn.fullpage.setAllowScrolling(false, 'all');
        $.fn.fullpage.setKeyboardScrolling(false, 'all');
    }

    function activeScroll () {
        $.fn.fullpage.setAllowScrolling(true, 'down');
        $.fn.fullpage.setKeyboardScrolling(true, 'down');
    }
})