import random, math

def squares(size, rows):
    '''generate random pattern of squares in json format'''
    pattern = []
    cols = 50
    ys = [y * size for y in range(rows)]
    xs = [x * size for x in range(cols)]
    for y in ys:
        for i, x in enumerate(xs):
            if i * 2 <= cols:
                odds = math.pow(cols - (i * 2), 2)
                if odds > 0:
                    if random.randint(0, math.pow(cols, 2)) <= odds:
                        pattern.append({
                            'type': 'rect',
                            'width': size,
                            'height': size,
                            'x': x,
                            'y': y,
                            'fill': 'white',
                            'stroke-width': 0
                        })
    return pattern
