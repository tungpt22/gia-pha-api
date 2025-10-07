import { Injectable } from '@nestjs/common';
import { CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import {Role} from "../user/user.entity";
import {JwtService} from "@nestjs/jwt";

@Injectable()
export class RolesGuard implements CanActivate {
    constructor(private reflector: Reflector) {}

    canActivate(context: ExecutionContext): boolean {
        const requiredRoles = this.reflector.get<Role[]>('roles', context.getHandler());

        if (!requiredRoles) {
            return true; // No roles required, allow access
        }

        const request = context.switchToHttp().getRequest();
        const user = request.user;

        // Check if user has one of the required roles
        if (!user || !requiredRoles.includes(user.role)) {
            throw new ForbiddenException('You do not have the required role');
        }

        return true;
    }
}