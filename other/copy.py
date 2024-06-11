def torus_2q(r, t1, t2):
    '''
    Plots a two qubit state with 3 params specified. 
    t1 is the angle of the 1st qubit on the bloch circle.
    t2 is the angle of the 2nd qubit on the bloch circle.
    r is the radius of both qubits on the bloch circle. 
    the sign of r specifies wether the state is on the inside of the torus (-1) or outside (1)
    
    Reference for displaying 2d artists in 3d:
    https://stackoverflow.com/questions/18228966/how-can-matplotlib-2d-patches-be-transformed-to-3d-with-arbitrary-normals
    '''
    t2 = -t2 + np.pi/2
    k = np.sqrt(.5**2-r**2)
    fig = plt.figure(figsize=(8,8))
    
    # plot configurations
    ax = fig.add_subplot(111, projection='3d')
    ax.set_xlabel('x axis')
    ax.set_ylabel('y axis')
    ax.set_zlabel('z axis')
    a = 1 # the radius of the cross section
    b = 2 # the radius of the donut hole
    ax.set_xlim(-(a+b),a+b)
    ax.set_ylim(-(a+b),a+b)
    ax.set_zlim(-(a+b),a+b)
    from matplotlib.colors import LightSource
    ls = LightSource(azdeg=315, altdeg=45)
    n = 100 # number of points to show the torus 
    u = np.linspace(0,2*np.pi,n)
    v = np.linspace(0,2*np.pi,n)
    u,v = np.meshgrid(u,v)
    X, Y, Z = (b + a*np.cos(u)) * np.cos(v), (b + a*np.cos(u)) * np.sin(v), a * np.sin(u)
    OX, OY, OZ = (b + (a+0.5)*np.cos(u)) * np.cos(v), (b + (a+0.5)*np.cos(u)) * np.sin(v), (a+0.5)*np.sin(u)
    IX, IY, IZ = (b + (a-0.5)*np.cos(u)) * np.cos(v), (b + (a-0.5)*np.cos(u)) * np.sin(v), (a-0.5)*np.sin(u)
    # plot the torus grids
    # ax.plot_surface(X, Y, Z, alpha=0.2, rstride=12, cstride=12, color='w', edgecolors='black', linewidth=0.5)
    # plot the torus 
    ax.plot_surface(X, Y, Z, alpha=0.3, cmap = cm.Wistia) # ocean, prism, cool, Wistia
    ax.plot_wireframe(OX, OY, OZ, alpha=0.1) # ocean, prism, cool, Wistia
    ax.plot_surface(IX, IY, IZ, alpha=1, cmap = cm.gray) # ocean, prism, cool, Wistia
    
    # show torus knot for max mixed states
    if abs(r) <= 0.001:
        print("k", k)
        nv = np.linspace(0, 2*np.pi,n)
        offset = np.full(n, t2-t1+np.pi/2) 
        nu = nv + offset 
        print(nv[0], nu[0])
        print(nv[0], nu[0])
        PX = (b + (a+k)*np.cos(nu)) * np.cos(nv)
        PY = (b + (a+k)*np.cos(nu)) * np.sin(nv)
        PZ = (a+k)*np.sin(nu)
        ax.scatter(PX, PY, PZ, marker='o')
    
    # the circular grid lines for marking the bases up up/ down down states
    top_ring = Circle( (0,0), b , facecolor = 'black', alpha = 0.7, fill=False, linewidth = 3)
    ax.add_patch(top_ring)
    pathpatch_2d_to_3d(top_ring, z = a)
    
    side_ring = Circle( (b,0), a , facecolor = 'black', alpha = 0.7, fill=False, linewidth = 3)
    ax.add_patch(side_ring)
    pathpatch_2d_to_3d(side_ring, z = 0, normal = [0,1,0])
    # zero_deg_line =  art3d.Line3D(xs=[0,b], ys=[0,0], zs=[0,0], linewidth = 3)
    block_circle_zaxis = art3d.Line3D( linewidth = 3, xs=[b*np.cos(t1),b*np.cos(t1)], ys=[b*np.sin(t1),b*np.sin(t1)], zs=[0,a])
    
    shapes3D = [block_circle_zaxis]
    for s in shapes3D:
        ax.add_artist(s)
    
    # Draw a circle on the x=0 'wall'
    norm = np.array([-np.sin(t1), np.cos(t1) ,0]) # the norm of the cross section
    x,y = b*np.cos(t1), b*np.sin(t1)
    cross_sect = Circle( (x, y), a+k, facecolor = 'blue', alpha = 0.3)
    cross_sect_boundary = Circle( (x, y), a, edgecolor = 'blue', alpha = 1, fill = False,  linewidth=1, linestyle = '-')
    small_cross_sect_boundary = Circle( (x, y), a-0.5, edgecolor = 'w', alpha = 1, fill = False,  linewidth=2, linestyle = '-')
    large_cross_sect_boundary = Circle( (x, y), a+0.5, edgecolor = 'g', alpha = 1, fill = False,  linewidth=1, linestyle = '-')
    
    
    state_arrow = Arrow(x=x+a*np.cos(t2), dx=k*np.cos(t2), y=y+a*np.sin(t2), dy=k*np.sin(t2), width = 0.3, alpha = 1, color = 'r')     
    shapes2D = [ cross_sect_boundary, cross_sect, small_cross_sect_boundary, large_cross_sect_boundary, state_arrow]
    
    if abs(r) >= 0.001:
        state_arrow2 = Arrow(x=x+a*np.cos(-t2), dx=k*np.cos(-t2), y=y+a*np.sin(-t2), dy=k*np.sin(-t2), width = 0.3, alpha = 1, color = 'r') 
        shapes2D.append(state_arrow2)
    
    for s in shapes2D:
        ax.add_patch(s)
        pathpatch_2d_to_3d(s, z = 0, normal = [np.sin(t1), -np.cos(t1),0])
    plt.show()